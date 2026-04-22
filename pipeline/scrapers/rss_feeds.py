from datetime import datetime, timezone

import feedparser

from ..models import Item
from ..utils import clean_html, get_logger, hours_since, load_yaml, truncate

log = get_logger(__name__)

LOOKBACK_HOURS = 36


def _parse_date(entry) -> datetime | None:
    for key in ("published_parsed", "updated_parsed"):
        val = entry.get(key)
        if val:
            return datetime(*val[:6], tzinfo=timezone.utc)
    return None


def fetch() -> list[Item]:
    cfg = load_yaml("feeds.yaml")
    items: list[Item] = []
    for feed in cfg.get("rss_feeds", []):
        name = feed["name"]
        url = feed["url"]
        category = feed.get("category", "news")
        log.info("Fetching RSS: %s", name)
        try:
            parsed = feedparser.parse(url, request_headers={"User-Agent": "AIPulseBot/1.0"})
        except Exception as e:
            log.warning("Failed to parse %s: %s", name, e)
            continue
        if parsed.bozo and not parsed.entries:
            log.warning("Feed unreadable: %s", name)
            continue
        for entry in parsed.entries[:20]:
            published = _parse_date(entry)
            if published and hours_since(published) > LOOKBACK_HOURS:
                continue
            title = clean_html(entry.get("title", "")).strip()
            link = entry.get("link", "").strip()
            if not title or not link:
                continue
            summary = clean_html(entry.get("summary", "") or entry.get("description", ""))
            items.append(
                Item(
                    title=title,
                    url=link,
                    source=name,
                    category=category,
                    published=published,
                    raw_blurb=truncate(summary, 600),
                )
            )
    log.info("RSS total items: %d", len(items))
    return items


if __name__ == "__main__":
    for it in fetch()[:5]:
        print(it.source, "|", it.title)
