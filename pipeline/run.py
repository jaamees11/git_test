"""
Main orchestrator. Run locally with:
    python -m pipeline.run --dry-run
or via GitHub Actions (see .github/workflows/publish.yml).
"""
import argparse
import json
from pathlib import Path

from .models import Item
from .publisher.beehiiv_client import create_draft
from .publisher.renderer import build_issue
from .rewriter.rewrite import rewrite_all
from .scrapers import github_trending, hackernews, product_hunt, rss_feeds
from .scrapers.ranker import dedupe, score
from .utils import CACHE_DIR, get_logger, load_yaml, now_utc

log = get_logger(__name__)


def collect() -> list[Item]:
    items: list[Item] = []
    for name, fn in [
        ("rss_feeds", rss_feeds.fetch),
        ("hackernews", hackernews.fetch),
        ("github_trending", github_trending.fetch),
        ("product_hunt", product_hunt.fetch),
    ]:
        try:
            got = fn()
            log.info("%s returned %d items", name, len(got))
            items.extend(got)
        except Exception as e:
            log.warning("%s failed: %s", name, e)
    return items


def _cap_total(items: list[Item]) -> list[Item]:
    style = load_yaml("style.yaml").get("newsletter", {})
    sections = style.get("sections", [])
    max_per = int(style.get("max_items_per_section", 5))
    total_needed = max_per * max(len(sections), 1)
    return items[: max(total_needed * 3, 30)]


def main(dry_run: bool = False, output_path: str | None = None) -> int:
    log.info("=== AI Pulse pipeline start ===")
    raw = collect()
    if not raw:
        log.error("No items scraped. Aborting.")
        return 1

    scored = score(raw)
    deduped = dedupe(scored)
    capped = _cap_total(deduped)
    log.info("After rank/dedupe/cap: %d items", len(capped))

    rewritten = rewrite_all(capped)
    issue = build_issue(rewritten)

    stamp = now_utc().strftime("%Y%m%d-%H%M")
    preview_path = Path(output_path) if output_path else CACHE_DIR / f"issue-{stamp}.html"
    preview_path.write_text(issue["body_content"], encoding="utf-8")
    log.info("Preview written: %s", preview_path)

    data_path = CACHE_DIR / f"issue-{stamp}.json"
    data_path.write_text(
        json.dumps(
            {
                "title": issue["title"],
                "subtitle": issue["subtitle"],
                "item_count": sum(len(v) for v in issue["sections"].values()),
                "items": [it.to_dict() for sect in issue["sections"].values() for it in sect],
            },
            indent=2,
            default=str,
        ),
        encoding="utf-8",
    )

    if dry_run:
        log.info("Dry run — skipping Beehiiv publish.")
        return 0

    result = create_draft(issue["title"], issue["subtitle"], issue["body_content"])
    if result is None:
        log.warning("Beehiiv draft not created (missing creds or API error).")
        return 2
    log.info("=== Done. Draft in Beehiiv: review & send. ===")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Skip Beehiiv publish")
    parser.add_argument("--output", help="Preview HTML output path")
    args = parser.parse_args()
    raise SystemExit(main(dry_run=args.dry_run, output_path=args.output))
