from datetime import datetime, timezone

import httpx

from ..models import Item
from ..utils import get_logger, hours_since, load_yaml, truncate

log = get_logger(__name__)

ALGOLIA = "https://hn.algolia.com/api/v1/search"


def fetch() -> list[Item]:
    cfg = load_yaml("feeds.yaml").get("hackernews", {})
    query = cfg.get("query", "AI OR LLM")
    min_points = int(cfg.get("min_points", 100))
    lookback = int(cfg.get("lookback_hours", 36))

    params = {
        "query": query,
        "tags": "story",
        "numericFilters": f"points>={min_points}",
        "hitsPerPage": 40,
    }
    log.info("Fetching HN: query=%s points>=%d", query, min_points)
    try:
        with httpx.Client(timeout=20.0) as client:
            r = client.get(ALGOLIA, params=params)
            r.raise_for_status()
            hits = r.json().get("hits", [])
    except Exception as e:
        log.warning("HN fetch failed: %s", e)
        return []

    items: list[Item] = []
    for h in hits:
        ts = h.get("created_at_i")
        published = datetime.fromtimestamp(ts, tz=timezone.utc) if ts else None
        if published and hours_since(published) > lookback:
            continue
        title = (h.get("title") or "").strip()
        url = (h.get("url") or f"https://news.ycombinator.com/item?id={h.get('objectID')}").strip()
        if not title:
            continue
        items.append(
            Item(
                title=title,
                url=url,
                source="Hacker News",
                category="tool",
                published=published,
                raw_blurb=truncate(h.get("story_text") or "", 400),
                score=float(h.get("points") or 0),
                extra={"hn_points": h.get("points"), "hn_comments": h.get("num_comments")},
            )
        )
    log.info("HN items: %d", len(items))
    return items


if __name__ == "__main__":
    for it in fetch()[:5]:
        print(it.score, "|", it.title)
