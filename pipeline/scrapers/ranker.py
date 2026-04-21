"""
Dedupe + rank. No ML — just heuristics that keep cost at $0 and are easy to tune.
"""
import re
from urllib.parse import urlparse

from ..models import Item
from ..utils import load_yaml


def _norm_url(url: str) -> str:
    try:
        p = urlparse(url)
        host = (p.netloc or "").lower().replace("www.", "")
        path = p.path.rstrip("/")
        return f"{host}{path}"
    except Exception:
        return url


def _norm_title(t: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", (t or "").lower()).strip()


def dedupe(items: list[Item]) -> list[Item]:
    seen_urls: set[str] = set()
    seen_titles: set[str] = set()
    out: list[Item] = []
    for it in sorted(items, key=lambda x: x.score, reverse=True):
        u = _norm_url(it.url)
        t = _norm_title(it.title)
        if u in seen_urls or t in seen_titles:
            continue
        seen_urls.add(u)
        seen_titles.add(t)
        out.append(it)
    return out


def score(items: list[Item]) -> list[Item]:
    cfg = load_yaml("feeds.yaml")
    boost = [k.lower() for k in cfg.get("keywords_boost", [])]
    block = [k.lower() for k in cfg.get("keywords_filter_out", [])]

    kept: list[Item] = []
    for it in items:
        text = f"{it.title} {it.raw_blurb}".lower()
        if any(b in text for b in block):
            continue
        s = it.score
        s += 2 * sum(1 for k in boost if k in text)
        if it.source.startswith("GitHub Trending"):
            s += 1.0
        if it.category == "lab":
            s += 5.0
        if it.category == "research":
            s += 2.0
        it.score = s
        kept.append(it)
    return kept
