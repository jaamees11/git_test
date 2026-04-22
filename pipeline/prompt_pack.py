"""
Weekly Prompt Pack generator. Picks a rotating theme, asks the LLM to produce
5 paste-ready prompts, renders to HTML, and creates a Beehiiv draft.

If no LLM key is available, falls back to rendering the raw use-case list as
prompts — degraded but still ships.
"""
import argparse
import datetime as dt
import json
import re
from pathlib import Path

from .publisher.beehiiv_client import create_draft
from .rewriter.llm_clients import llm_rewrite
from .utils import CACHE_DIR, get_logger, load_yaml, now_utc

log = get_logger(__name__)


def _pick_theme(themes: list[dict]) -> dict:
    iso_week = dt.date.today().isocalendar().week
    return themes[iso_week % len(themes)]


def _markdown_to_html(md: str) -> str:
    parts: list[str] = []
    in_code = False
    code_buf: list[str] = []
    for line in md.splitlines():
        if line.strip().startswith("```"):
            if in_code:
                escaped = "\n".join(code_buf).replace("<", "&lt;").replace(">", "&gt;")
                parts.append(
                    f'<pre style="background:#f6f6f6; padding:12px; border-radius:6px; '
                    f'overflow-x:auto; font-size:13px; line-height:1.4;">{escaped}</pre>'
                )
                code_buf = []
                in_code = False
            else:
                in_code = True
            continue
        if in_code:
            code_buf.append(line)
            continue
        if line.startswith("## "):
            parts.append(
                f'<h2 style="font-size:18px; margin:24px 0 8px 0;">{line[3:].strip()}</h2>'
            )
        elif line.startswith("# "):
            parts.append(f'<h1 style="font-size:22px;">{line[2:].strip()}</h1>')
        elif line.strip():
            text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", line)
            parts.append(f'<p style="margin:0 0 12px 0;">{text}</p>')
    return "\n".join(parts)


def _fallback_body(theme: dict) -> str:
    out = [f"# {theme['name']}", ""]
    for i, uc in enumerate(theme.get("use_cases", []), 1):
        out.append(f"## {i}. {uc.capitalize()}")
        out.append("```")
        out.append(f"You are an expert assistant helping with: {uc}.")
        out.append("Input: {{input}}")
        out.append("Output: a numbered list of clear, actionable steps.")
        out.append("```")
        out.append(f"Why this works: focused scope and explicit format reduce drift.")
        out.append("")
    return "\n".join(out)


def generate_pack(theme: dict, prompt_template: str) -> str:
    use_cases_text = "\n".join(f"  - {u}" for u in theme.get("use_cases", []))
    prompt = prompt_template.format(
        theme=theme["name"],
        audience=theme.get("audience", "general"),
        use_cases=use_cases_text,
    )
    body = llm_rewrite(prompt, max_chars=4000)
    if not body or len(body) < 200:
        log.warning("LLM gave short/empty pack; using fallback")
        return _fallback_body(theme)
    return body


def main(dry_run: bool = False) -> int:
    cfg = load_yaml("prompt_pack.yaml")
    nl = cfg.get("newsletter", {})
    theme = _pick_theme(cfg.get("themes", []))
    log.info("Prompt pack theme: %s", theme["name"])

    md_body = generate_pack(theme, cfg["generation"]["prompt_template"])

    intro = (
        f'<p style="color:#8a8a8a; margin:0 0 18px 0;">{nl.get("tagline", "")}</p>'
        f'<p style="margin:0 0 18px 0;">This week\'s theme: <strong>{theme["name"]}</strong> — '
        f'for {theme.get("audience", "everyone")}.</p>'
    )
    body_html = intro + _markdown_to_html(md_body)
    if nl.get("footer"):
        body_html += (
            f'<hr style="border:none; border-top:1px solid #eee; margin:24px 0;">'
            f'<p style="color:#8a8a8a; font-size:13px;">{nl["footer"]}</p>'
        )

    title = f"Prompt Pack: {theme['name']}"
    subtitle = nl.get("tagline", "")[:140]

    stamp = now_utc().strftime("%Y%m%d")
    Path(CACHE_DIR / f"prompt-pack-{stamp}.html").write_text(body_html, encoding="utf-8")
    Path(CACHE_DIR / f"prompt-pack-{stamp}.json").write_text(
        json.dumps({"title": title, "theme": theme["name"], "body_md": md_body}, indent=2),
        encoding="utf-8",
    )

    if dry_run:
        log.info("Dry run — pack written to .cache/, not published.")
        return 0

    result = create_draft(title, subtitle, body_html)
    if result is None:
        return 2
    log.info("=== Prompt Pack draft created in Beehiiv. ===")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    raise SystemExit(main(dry_run=args.dry_run))
