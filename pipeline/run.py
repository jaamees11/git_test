"""
Main orchestrator. Three modes:

    # Fully automated (GitHub Actions cron uses Gemini/Groq free tier)
    python -m pipeline.run

    # Dry run — scrape + rewrite + write preview, skip Beehiiv publish
    python -m pipeline.run --dry-run

    # Claude-in-the-loop mode: scrape only, write draft JSON for editing
    python -m pipeline.run --collect-only
    # (you then edit .cache/draft-issue.json filling in `rewritten_blurb` fields)

    # Publish a Claude-edited draft back to Beehiiv + archive + share snippets
    python -m pipeline.run --from-json .cache/draft-issue.json
"""
import argparse
import json
import os
from datetime import datetime
from pathlib import Path

from .models import Item
from .publisher import affiliates, subject
from .publisher.beehiiv_client import create_draft
from .publisher.renderer import build_issue
from .scrapers.ranker import dedupe, score
from .site.render import write_static_site
from .social.snippets import write_all as write_share_snippets
from .utils import CACHE_DIR, get_logger, load_yaml, now_utc

log = get_logger(__name__)


def collect() -> list[Item]:
    # Lazy import so the module can be used for publish-only flows
    # (and tested) without the feedparser/lxml dep chain.
    from .scrapers import github_trending, hackernews, product_hunt, rss_feeds

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


def _items_from_json(path: Path) -> list[Item]:
    data = json.loads(path.read_text(encoding="utf-8"))
    items_data = data.get("items", data if isinstance(data, list) else [])
    out: list[Item] = []
    for d in items_data:
        pub = d.get("published")
        if isinstance(pub, str):
            try:
                pub = datetime.fromisoformat(pub)
            except ValueError:
                pub = None
        out.append(
            Item(
                title=d["title"],
                url=d["url"],
                source=d.get("source", ""),
                category=d.get("category", "news"),
                published=pub,
                raw_blurb=d.get("raw_blurb", ""),
                rewritten_blurb=d.get("rewritten_blurb", ""),
                score=float(d.get("score", 0)),
                extra=d.get("extra", {}) or {},
            )
        )
    return out


def _write_draft_json(items: list[Item], stamp: str) -> Path:
    """Write a Claude-editable draft JSON.

    Claude (or a human) fills in `rewritten_blurb` per item, then
    `pipeline.run --from-json` publishes it.
    """
    path = CACHE_DIR / f"draft-issue-{stamp}.json"
    latest = CACHE_DIR / "draft-issue-latest.json"
    payload = {
        "_instructions": (
            "Edit the 'rewritten_blurb' field of each item. Keep it <= 280 chars, "
            "sharp, skimmable, no hype. Preserve numbers and names. Then run: "
            "python -m pipeline.run --from-json <this file>"
        ),
        "generated_at": now_utc().isoformat(),
        "items": [it.to_dict() for it in items],
    }
    data = json.dumps(payload, indent=2, default=str)
    path.write_text(data, encoding="utf-8")
    latest.write_text(data, encoding="utf-8")
    return path


def _publish(rewritten: list[Item], stamp: str, dry_run: bool, output_path: str | None) -> int:
    affiliates.apply_to_items(rewritten)

    style_cfg = load_yaml("style.yaml").get("newsletter") or {}
    pub_name = style_cfg.get("name", "AI Pulse")
    subject_line = subject.best(rewritten, publication_name=pub_name)
    log.info("Subject: %s", subject_line)

    issue = build_issue(rewritten)
    issue["title"] = subject_line

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


def main(
    dry_run: bool = False,
    output_path: str | None = None,
    collect_only: bool = False,
    from_json: str | None = None,
) -> int:
    log.info("=== AI Pulse pipeline start ===")
    stamp = now_utc().strftime("%Y%m%d-%H%M")

    if from_json:
        path = Path(from_json)
        if not path.exists():
            log.error("JSON file not found: %s", path)
            return 1
        items = _items_from_json(path)
        missing = [i for i in items if not i.rewritten_blurb.strip()]
        if missing:
            log.error(
                "%d/%d items have empty rewritten_blurb — edit the draft first.",
                len(missing), len(items),
            )
            return 1
        log.info("Loaded %d pre-written items from %s", len(items), path)
        return _publish(items, stamp, dry_run, output_path)

    raw = collect()
    if not raw:
        log.error("No items scraped. Aborting.")
        return 1

    scored = score(raw)
    deduped = dedupe(scored)
    capped = _cap_total(deduped)
    log.info("After rank/dedupe/cap: %d items", len(capped))

    if collect_only:
        path = _write_draft_json(capped, stamp)
        log.info("=== Draft written: %s ===", path)
        log.info("Edit `rewritten_blurb` for each item, then run:")
        log.info("  python -m pipeline.run --from-json %s", path)
        return 0

    from .rewriter.rewrite import rewrite_all
    rewritten = rewrite_all(capped)
    return _publish(rewritten, stamp, dry_run, output_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Skip Beehiiv publish")
    parser.add_argument("--output", help="Preview HTML output path")
    parser.add_argument(
        "--collect-only", action="store_true",
        help="Scrape + rank only; write draft JSON for Claude-in-session editing",
    )
    parser.add_argument(
        "--from-json", metavar="PATH",
        help="Load items + rewritten_blurb from JSON and publish (skip scraping)",
    )
    args = parser.parse_args()
    raise SystemExit(main(
        dry_run=args.dry_run,
        output_path=args.output,
        collect_only=args.collect_only,
        from_json=args.from_json,
    ))
