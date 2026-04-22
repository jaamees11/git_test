"""
Zero-API fallback rewriter. Picks the most informative sentence from the blurb
and tightens it. Not as crisp as LLM output, but always free + always available.
"""
import re

from ..utils import truncate

_SENT_SPLIT = re.compile(r"(?<=[.!?])\s+(?=[A-Z0-9])")
_FLUFF = re.compile(
    r"\b(revolutionary|game[- ]?changing|cutting[- ]?edge|state[- ]?of[- ]?the[- ]?art|"
    r"next[- ]?generation|world[- ]?class|best[- ]?in[- ]?class|groundbreaking)\b",
    flags=re.IGNORECASE,
)
_FILLER = re.compile(
    r"\b(basically|actually|literally|really|very|just|simply|quite)\b",
    flags=re.IGNORECASE,
)


def _score_sentence(s: str) -> float:
    score = 0.0
    if re.search(r"\b\d", s):
        score += 2
    if re.search(r"\$\d|\d+%|\d+x|\dB\b|\dM\b|\dk\b", s):
        score += 2
    if re.search(r"\b(launch|release|announce|ship|open[- ]?source|raise|benchmark)\b", s, re.I):
        score += 1.5
    length = len(s)
    if 60 <= length <= 220:
        score += 1
    elif length > 260:
        score -= 1
    return score


def rewrite(title: str, source: str, content: str, max_chars: int = 280) -> str:
    text = (content or "").strip()
    if not text:
        return ""

    text = _FLUFF.sub("", text)
    text = _FILLER.sub("", text)
    text = re.sub(r"\s+", " ", text).strip()

    sentences = [s.strip() for s in _SENT_SPLIT.split(text) if s.strip()]
    if not sentences:
        return truncate(text, max_chars)

    sentences.sort(key=_score_sentence, reverse=True)
    best = sentences[0]

    title_low = title.lower()
    if best.lower().startswith(title_low[:30]):
        best = best[len(title) :].lstrip(" -:—")

    return truncate(best, max_chars)
