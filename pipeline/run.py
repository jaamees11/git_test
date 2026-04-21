"""
Main orchestrator. Run locally with:
    python -m pipeline.run --dry-run
or via GitHub Actions (see .github/workflows/publish.yml).
"""
import argparse
import json
import os
from pathlib import Path

from .models import Item
from .publisher import affiliates, subject
from .publisher.beehiiv_client import create_draft
from .publisher.renderer import build_issue
from .rewriter.rewrite import rewrite_all
from .scrapers import github_trending, hackernews, product_hunt, rss_feeds
from .scrapers.ranker import dedupe, score
from .site.render import write_static_site
from .social.snippets import write_all as write_share_snippets
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
    affiliates.apply_to_items(rewritten)

    pub_name = (load_yaml("style.yaml").get("newsletter") or {}).get("name", "AI Pulse")
    subject_line = subject.best(rewritten, publication_name=pub_name)
    log.info("Subject: %s", subject_line)

    issue = build_issue(rewritten)
    issue["title"] = subject_line

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

    style_cfg = load_yaml("style.yaml").get("newsletter") or {}
    site_url = (os.getenv("SITE_URL") or style_cfg.get("site_url") or "").strip()
    subscribe_url = (os.getenv("SUBSCRIBE_URL") or style_cfg.get("subscribe_url") or "").strip()
    twitter_handle = (os.getenv("TWITTER_HANDLE") or style_cfg.get("twitter_handle") or "").strip()

    issue_url: str | None = None
    if site_url:
        site_info = write_static_site(
            issue_title=issue["title"],
            issue_subtitle=issue["subtitle"],
            body_html=issue["body_content"],
            site_name=pub_name,
            site_tagline=style_cfg.get("tagline", ""),
            site_url=site_url,
            subscribe_url=subscribe_url or None,
            twitter_handle=twitter_handle or None,
            published=now_utc(),
        )
        issue_url = site_info["url"]
        log.info("Static site updated: %s", issue_url)
    else:
        log.info("SITE_URL not set — skipping static archive (set it in env or style.yaml)")

    write_share_snippets(
        rewritten,
        cache_dir=CACHE_DIR,
        issue_url=issue_url,
        publication_name=pub_name,
        stamp=stamp,
    )
    log.info("Share snippets written to .cache/share-*-%s.md", stamp)

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
