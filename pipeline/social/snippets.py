"""
Generate paste-ready share posts for X/Twitter, LinkedIn, and Reddit.

Writes one Markdown file per platform under .cache/, ready for you to copy
into the platform's compose box. Free, no API keys required.

Each platform has slightly different conventions:
  - X:        ≤ 270 chars, hook + link + 2-3 hashtags
  - LinkedIn: longer-form, 3-bullet hook, soft CTA
  - Reddit:   neutral title (no clickbait or self-promo gets removed),
              top comment optional, suitable for /r/artificial, /r/MachineLearning,
              /r/LocalLLaMA, /r/SideProject
"""
from __future__ import annotations

from pathlib import Path

from ..models import Item

X_MAX = 270  # safe under 280 for any link expansion


def _top(items: list[Item], n: int) -> list[Item]:
    return sorted(items, key=lambda i: i.score, reverse=True)[:n]


def _truncate(s: str, n: int) -> str:
    s = (s or "").strip()
    if len(s) <= n:
        return s
    return s[: n - 1].rstrip() + "…"


def x_post(items: list[Item], issue_url: str | None) -> str:
    if not items:
        return ""
    top1 = _top(items, 1)[0]
    rest = _top(items, 4)[1:4]
    bullets = "".join(f"\n• {_truncate(r.title, 90)}" for r in rest)
    link = f"\n\n{issue_url}" if issue_url else ""
    tags = "\n\n#AI #LLM"
    head = f"Today in AI:\n\n→ {_truncate(top1.title, 110)}"
    body = head + bullets + link + tags
    if len(body) <= X_MAX:
        return body
    body = head + link + tags
    if len(body) <= X_MAX:
        return body
    return _truncate(head, X_MAX - len(link) - len(tags)) + link + tags


def linkedin_post(items: list[Item], issue_url: str | None,
                  publication_name: str = "AI Pulse") -> str:
    if not items:
        return ""
    top = _top(items, 5)
    bullets = "\n".join(f"→ {_truncate(it.title, 140)}" for it in top)
    link = f"\n\nFull issue (free): {issue_url}" if issue_url else ""
    return (
        f"5 things from AI today that are actually worth your attention:\n\n"
        f"{bullets}\n\n"
        f"I run {publication_name} — a 2-minute daily read that filters the AI noise."
        f"{link}\n\n"
        f"#ArtificialIntelligence #MachineLearning #Productivity"
    )


def reddit_post(items: list[Item]) -> dict:
    """Returns {title, body, suggested_subs}."""
    if not items:
        return {"title": "", "body": "", "suggested_subs": []}
    top = _top(items, 8)
    title = _truncate(top[0].title, 280)
    bullet_lines = []
    for it in top:
        bullet_lines.append(f"- [{_truncate(it.title, 120)}]({it.url}) — {it.source}")
    body = (
        "Daily roundup of AI launches and releases I noticed today. "
        "Sharing in case useful — happy to discuss any of these.\n\n"
        + "\n".join(bullet_lines)
    )
    return {
        "title": title,
        "body": body,
        "suggested_subs": [
            "r/artificial",
            "r/LocalLLaMA",
            "r/MachineLearning (only if a major paper)",
            "r/SideProject (if showcasing tools)",
        ],
    }


def write_all(items: list[Item], cache_dir: Path, *,
              issue_url: str | None = None,
              publication_name: str = "AI Pulse",
              stamp: str | None = None) -> dict:
    cache_dir.mkdir(exist_ok=True)
    suffix = f"-{stamp}" if stamp else ""

    x_text = x_post(items, issue_url)
    li_text = linkedin_post(items, issue_url, publication_name)
    rd = reddit_post(items)

    paths = {}
    paths["x"] = cache_dir / f"share-x{suffix}.md"
    paths["x"].write_text(
        f"# X / Twitter post (paste this)\n\n```\n{x_text}\n```\n\n"
        f"_Length: {len(x_text)} chars_\n",
        encoding="utf-8",
    )
    paths["linkedin"] = cache_dir / f"share-linkedin{suffix}.md"
    paths["linkedin"].write_text(
        f"# LinkedIn post (paste this)\n\n```\n{li_text}\n```\n", encoding="utf-8",
    )
    paths["reddit"] = cache_dir / f"share-reddit{suffix}.md"
    subs_md = "\n".join(f"- {s}" for s in rd["suggested_subs"])
    paths["reddit"].write_text(
        f"# Reddit post (paste this)\n\n"
        f"**Suggested subreddits:**\n{subs_md}\n\n"
        f"**Title:**\n```\n{rd['title']}\n```\n\n"
        f"**Body:**\n```\n{rd['body']}\n```\n",
        encoding="utf-8",
    )
    return {k: str(v) for k, v in paths.items()}
