import re

import httpx
from bs4 import BeautifulSoup

from ..models import Item
from ..utils import USER_AGENT, get_logger, load_yaml, truncate

log = get_logger(__name__)

BASE = "https://github.com/trending"


def _parse_trending_page(html: str, language: str | None = None) -> list[Item]:
    soup = BeautifulSoup(html, "lxml")
    items: list[Item] = []
    for article in soup.select("article.Box-row"):
        h2 = article.select_one("h2 a")
        if not h2:
            continue
        repo_path = h2.get("href", "").strip().lstrip("/")
        if not repo_path:
            continue
        title = repo_path
        url = f"https://github.com/{repo_path}"
        desc_el = article.select_one("p")
        desc = desc_el.get_text(" ", strip=True) if desc_el else ""
        stars_today_el = article.select_one("span.d-inline-block.float-sm-right")
        stars_today = 0
        if stars_today_el:
            m = re.search(r"([\d,]+)", stars_today_el.get_text())
            if m:
                stars_today = int(m.group(1).replace(",", ""))
        items.append(
            Item(
                title=title,
                url=url,
                source=f"GitHub Trending{f' ({language})' if language else ''}",
                category="tool",
                raw_blurb=truncate(desc, 400),
                score=float(stars_today),
                extra={"stars_today": stars_today, "language": language},
            )
        )
    return items


def fetch() -> list[Item]:
    cfg = load_yaml("feeds.yaml").get("github_trending", {})
    langs = cfg.get("languages", [None])
    since = cfg.get("since", "daily")
    min_stars = int(cfg.get("min_stars_today", 50))

    all_items: list[Item] = []
    with httpx.Client(
        timeout=20.0,
        headers={"User-Agent": USER_AGENT, "Accept": "text/html"},
        follow_redirects=True,
    ) as client:
        for lang in langs:
            url = BASE if not lang else f"{BASE}/{lang}"
            params = {"since": since}
            log.info("Fetching GitHub trending: %s", url)
            try:
                r = client.get(url, params=params)
                r.raise_for_status()
                parsed = _parse_trending_page(r.text, language=lang)
            except Exception as e:
                log.warning("GH trending failed for %s: %s", lang, e)
                continue
            for it in parsed:
                if it.score >= min_stars:
                    all_items.append(it)

    log.info("GitHub trending items: %d", len(all_items))
    return all_items


if __name__ == "__main__":
    for it in fetch()[:5]:
        print(it.score, "|", it.title, "|", it.raw_blurb[:80])
