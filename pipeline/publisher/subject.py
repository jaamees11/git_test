"""
Subject line generator. Picks the highest-scoring item and turns its title into
3 candidate subjects, then deterministically picks the best one (or returns all
3 for A/B if Beehiiv supports it on your plan).

Heuristics tuned for newsletter open rates:
  - 30-55 chars sweet spot
  - lead with a number, name, or tension word
  - lowercase often outperforms title case in inbox
  - no clickbait fluff
"""
import re
from datetime import datetime, timezone

from ..models import Item

_TENSION_WORDS = (
    "ships", "lands", "drops", "leaks", "beats", "kills",
    "breaks", "open-sources", "raises", "buys",
)
_TITLE_CRUFT = re.compile(
    r"\b(announcing|introducing|announces|introduces|today|now|new|just)\b\s*",
    re.IGNORECASE,
)


def _normalize(t: str) -> str:
    t = _TITLE_CRUFT.sub("", t).strip()
    t = re.sub(r"\s+", " ", t)
    return t


def _has_number(s: str) -> bool:
    return bool(re.search(r"\d", s))


def _len_score(s: str) -> float:
    n = len(s)
    if 30 <= n <= 55:
        return 2.0
    if 20 <= n < 30 or 55 < n <= 70:
        return 1.0
    return 0.0


def _candidate_score(s: str) -> float:
    score = _len_score(s)
    if _has_number(s):
        score += 1.5
    if any(w in s.lower() for w in _TENSION_WORDS):
        score += 1.0
    if s == s.lower():
        score += 0.5
    if s.endswith(("?", "—", "→")):
        score += 0.3
    if any(w in s.lower() for w in ("breaking", "huge", "insane", "you won't believe")):
        score -= 5.0
    return score


def candidates(items: list[Item], publication_name: str = "AI Pulse") -> list[str]:
    if not items:
        date_str = datetime.now(tz=timezone.utc).strftime("%a %b %d")
        return [f"{publication_name} — {date_str}"]

    top = max(items, key=lambda i: i.score)
    headline = _normalize(top.title)

    cands = [
        headline.lower(),
        f"{headline} — and 4 more",
        f"today: {headline.lower()}",
    ]
    cands = [c for c in cands if 15 <= len(c) <= 90]
    if not cands:
        cands = [headline[:80]]
    return sorted(cands, key=_candidate_score, reverse=True)


def best(items: list[Item], publication_name: str = "AI Pulse") -> str:
    return candidates(items, publication_name)[0]
