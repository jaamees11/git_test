from datetime import datetime

from ..models import Item
from ..utils import load_yaml


def _group_by_section(items: list[Item], sections: list[dict]) -> dict[str, list[Item]]:
    grouped: dict[str, list[Item]] = {s["key"]: [] for s in sections}
    for it in items:
        placed = False
        for s in sections:
            sources = s.get("sources", [])
            hit = False
            if "rss_feeds" in sources and it.category in ("lab", "research", "news", "commentary", "newsletter"):
                hit = True
            if "product_hunt" in sources and it.source == "Product Hunt":
                hit = True
            if "github_trending" in sources and it.source.startswith("GitHub Trending"):
                hit = True
            if "hackernews" in sources and it.source == "Hacker News":
                hit = True
            if hit:
                grouped[s["key"]].append(it)
                placed = True
                break
        if not placed:
            grouped[sections[-1]["key"]].append(it)
    return grouped


def _render_item_html(it: Item) -> str:
    safe_title = it.title.replace("<", "&lt;").replace(">", "&gt;")
    blurb = it.rewritten_blurb or it.raw_blurb or ""
    blurb_html = blurb.replace("<", "&lt;").replace(">", "&gt;")
    meta = f'<span style="color:#8a8a8a; font-size:12px;"> — {it.source}</span>'
    return (
        f'<p style="margin:0 0 14px 0;">'
        f'<a href="{it.url}" style="color:#0b5fff; font-weight:600; text-decoration:none;">{safe_title}</a>'
        f'{meta}<br>'
        f'<span style="color:#333;">{blurb_html}</span>'
        f'</p>'
    )


def build_issue(items: list[Item]) -> dict:
    style = load_yaml("style.yaml").get("newsletter", {})
    sections = style.get("sections", [])
    max_per = int(style.get("max_items_per_section", 5))

    grouped = _group_by_section(items, sections)
    date_str = datetime.utcnow().strftime("%a %b %d")
    title = f"{style.get('name', 'AI Pulse')} — {date_str}"

    html_parts: list[str] = []
    html_parts.append(
        f'<p style="color:#8a8a8a; margin:0 0 18px 0;">{style.get("tagline", "")}</p>'
    )

    subtitle_bits: list[str] = []
    for s in sections:
        chosen = grouped.get(s["key"], [])[:max_per]
        if not chosen:
            continue
        subtitle_bits.append(s["title"])
        html_parts.append(
            f'<h2 style="font-size:18px; margin:22px 0 4px 0;">{s["title"]}</h2>'
        )
        if s.get("subtitle"):
            html_parts.append(
                f'<p style="color:#8a8a8a; margin:0 0 12px 0; font-size:13px;">{s["subtitle"]}</p>'
            )
        for it in chosen:
            html_parts.append(_render_item_html(it))

    if style.get("paid_tier_teaser"):
        html_parts.append(
            f'<hr style="border:none; border-top:1px solid #eee; margin:24px 0;">'
            f'<p style="color:#333; font-size:14px;">{style["paid_tier_teaser"]}</p>'
        )
    if style.get("footer"):
        html_parts.append(
            f'<p style="color:#8a8a8a; font-size:12px; margin-top:24px;">{style["footer"]}</p>'
        )

    body_html = "\n".join(html_parts)
    subtitle = " · ".join(subtitle_bits) if subtitle_bits else style.get("tagline", "")

    return {
        "title": title,
        "subtitle": subtitle[:140],
        "body_content": body_html,
        "sections": grouped,
    }
