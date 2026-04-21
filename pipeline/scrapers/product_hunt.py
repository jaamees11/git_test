"""
Product Hunt scraper — uses the public daily leaderboard page.
No API key required. If PH changes layout, we fall back to returning nothing
(the pipeline still runs with GH trending + HN + RSS).
"""
from datetime import datetime, timezone

import httpx
from bs4 import BeautifulSoup

from ..models import Item
from ..utils import USER_AGENT, get_logger, truncate

log = get_logger(__name__)

LEADERBOARD = "https://www.producthunt.com/"


def fetch() -> list[Item]:
    log.info("Fetching Product Hunt leaderboard")
    try:
        with httpx.Client(
            timeout=20.0,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "text/html,application/xhtml+xml",
                "Accept-Language": "en-US,en;q=0.9",
            },
            follow_redirects=True,
        ) as client:
            r = client.get(LEADERBOARD)
            r.raise_for_status()
            html = r.text
    except Exception as e:
        log.warning("PH fetch failed: %s", e)
        return []

    soup = BeautifulSoup(html, "lxml")
    items: list[Item] = []
    seen = set()

    for a in soup.select('a[href^="/products/"], a[href^="/posts/"]'):
        href = a.get("href", "").strip()
        if not href or href in seen:
            continue
        title = a.get_text(" ", strip=True)
        if not title or len(title) > 140:
            continue
        parent = a.find_parent()
        blurb = ""
        if parent:
            sib = parent.find_next("p")
            if sib:
                blurb = sib.get_text(" ", strip=True)
        seen.add(href)
        items.append(
            Item(
                title=title,
                url=f"https://www.producthunt.com{href}",
                source="Product Hunt",
                category="tool",
                published=datetime.now(tz=timezone.utc),
                raw_blurb=truncate(blurb, 280),
            )
        )
        if len(items) >= 20:
            break

    log.info("Product Hunt items: %d", len(items))
    return items


if __name__ == "__main__":
    for it in fetch()[:5]:
        print(it.title, "|", it.raw_blurb[:80])
