"""
Static-site renderer for the public archive.

Output layout (under ./site/):
    index.html              -- list of all issues, newest first
    issues/YYYY-MM-DD.html  -- one page per issue
    feed.xml                -- RSS feed of all issues
    sitemap.xml             -- for search engines
    robots.txt
    style.css

Deployed to GitHub Pages on each successful daily run.

Each issue page is SEO-friendly:
  - <title>, meta description, canonical URL
  - JSON-LD Article schema
  - Subscribe CTA above and below the fold
  - Open Graph + Twitter Card meta tags
"""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
SITE_DIR = REPO_ROOT / "site"
ISSUES_DIR = SITE_DIR / "issues"


_BASE_CSS = """
:root { --fg:#1a1a1a; --muted:#7a7a7a; --bg:#fafafa; --card:#fff; --link:#0b5fff; }
* { box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
       margin: 0; padding: 0; background: var(--bg); color: var(--fg); line-height: 1.55; }
.container { max-width: 720px; margin: 0 auto; padding: 32px 20px; }
header { text-align: center; padding-bottom: 16px; border-bottom: 1px solid #eee; margin-bottom: 24px; }
h1 { margin: 0 0 6px 0; font-size: 28px; }
header p { color: var(--muted); margin: 0; }
.cta { background: var(--card); border: 1px solid #eee; border-radius: 8px;
       padding: 16px 20px; margin: 24px 0; display: flex; align-items: center;
       justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.cta a { background: var(--link); color: #fff; padding: 10px 16px; border-radius: 6px;
         text-decoration: none; font-weight: 600; white-space: nowrap; }
article { background: var(--card); border: 1px solid #eee; border-radius: 10px;
          padding: 20px 24px; margin-bottom: 16px; }
article h2 { margin: 0 0 4px 0; font-size: 20px; }
article h2 a { color: var(--fg); text-decoration: none; }
article time { color: var(--muted); font-size: 13px; }
article p { margin: 8px 0 0 0; color: #444; }
.issue-body h2 { font-size: 18px; margin: 24px 0 4px 0; }
.issue-body p { margin: 0 0 14px 0; }
footer { color: var(--muted); font-size: 13px; text-align: center; padding: 32px 0 16px; }
a { color: var(--link); }
"""


def _slug(s: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "-", (s or "").lower()).strip("-")
    return s[:80] or "untitled"


def _esc(s: str) -> str:
    return (s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _cta_html(subscribe_url: str | None, label: str = "Subscribe — free") -> str:
    if not subscribe_url:
        return ""
    return (
        f'<div class="cta">'
        f'<span><strong>Get tomorrow\'s issue in your inbox.</strong> Free, no spam.</span>'
        f'<a href="{_esc(subscribe_url)}">{_esc(label)} →</a>'
        f'</div>'
    )


def _wrap_page(title: str, description: str, body_html: str, *, canonical: str | None,
               site_name: str, twitter_handle: str | None) -> str:
    head_meta = []
    if canonical:
        head_meta.append(f'<link rel="canonical" href="{_esc(canonical)}">')
        head_meta.append(f'<meta property="og:url" content="{_esc(canonical)}">')
    head_meta.append(f'<meta property="og:type" content="article">')
    head_meta.append(f'<meta property="og:title" content="{_esc(title)}">')
    head_meta.append(f'<meta property="og:description" content="{_esc(description)}">')
    head_meta.append(f'<meta property="og:site_name" content="{_esc(site_name)}">')
    head_meta.append(f'<meta name="twitter:card" content="summary_large_image">')
    head_meta.append(f'<meta name="twitter:title" content="{_esc(title)}">')
    head_meta.append(f'<meta name="twitter:description" content="{_esc(description)}">')
    if twitter_handle:
        head_meta.append(f'<meta name="twitter:site" content="@{_esc(twitter_handle.lstrip("@"))}">')

    return (
        '<!doctype html>\n'
        f'<html lang="en"><head><meta charset="utf-8">'
        f'<meta name="viewport" content="width=device-width,initial-scale=1">'
        f'<title>{_esc(title)}</title>'
        f'<meta name="description" content="{_esc(description)}">'
        + "".join(head_meta)
        + '<link rel="stylesheet" href="/style.css">'
        f'<link rel="alternate" type="application/rss+xml" title="{_esc(site_name)} RSS" href="/feed.xml">'
        '</head><body><div class="container">'
        + body_html
        + '<footer>Built with ❤️ on autopilot. <a href="/feed.xml">RSS</a></footer>'
        '</div></body></html>'
    )


def _article_jsonld(title: str, description: str, url: str, published: str,
                    site_name: str) -> str:
    data = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "url": url,
        "datePublished": published,
        "publisher": {"@type": "Organization", "name": site_name},
    }
    return f'<script type="application/ld+json">{json.dumps(data)}</script>'


def render_issue_page(*, issue_title: str, issue_subtitle: str, body_html: str,
                       slug: str, published: datetime, site_name: str, site_url: str,
                       subscribe_url: str | None, twitter_handle: str | None) -> str:
    canonical = f"{site_url.rstrip('/')}/issues/{slug}.html"
    desc = (issue_subtitle or issue_title)[:200]
    page_body = (
        f'<header><h1>{_esc(issue_title)}</h1><p>{_esc(issue_subtitle)}</p></header>'
        f'<p><a href="/">← All issues</a></p>'
        + _cta_html(subscribe_url)
        + f'<div class="issue-body">{body_html}</div>'
        + _cta_html(subscribe_url, "Subscribe to get the next one")
        + _article_jsonld(issue_title, desc, canonical, published.isoformat(), site_name)
    )
    return _wrap_page(
        issue_title, desc, page_body,
        canonical=canonical, site_name=site_name, twitter_handle=twitter_handle,
    )


def render_index(*, issues: list[dict], site_name: str, site_tagline: str,
                  site_url: str, subscribe_url: str | None,
                  twitter_handle: str | None) -> str:
    cards = []
    for it in issues:
        cards.append(
            f'<article>'
            f'<h2><a href="/issues/{_esc(it["slug"])}.html">{_esc(it["title"])}</a></h2>'
            f'<time datetime="{_esc(it["published"])}">{_esc(it["display_date"])}</time>'
            f'<p>{_esc(it.get("subtitle", ""))}</p>'
            f'</article>'
        )

    page_body = (
        f'<header><h1>{_esc(site_name)}</h1><p>{_esc(site_tagline)}</p></header>'
        + _cta_html(subscribe_url)
        + ("".join(cards) if cards else "<p>No issues yet — check back tomorrow.</p>")
    )
    return _wrap_page(
        site_name, site_tagline, page_body,
        canonical=site_url, site_name=site_name, twitter_handle=twitter_handle,
    )


def render_feed(*, issues: list[dict], site_name: str, site_tagline: str,
                 site_url: str) -> str:
    items_xml = []
    for it in issues:
        link = f"{site_url.rstrip('/')}/issues/{it['slug']}.html"
        items_xml.append(
            f"<item>"
            f"<title>{_esc(it['title'])}</title>"
            f"<link>{_esc(link)}</link>"
            f"<guid isPermaLink='true'>{_esc(link)}</guid>"
            f"<pubDate>{_esc(it.get('rfc822', it['published']))}</pubDate>"
            f"<description>{_esc(it.get('subtitle', ''))}</description>"
            f"</item>"
        )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<rss version="2.0"><channel>'
        f'<title>{_esc(site_name)}</title>'
        f'<link>{_esc(site_url)}</link>'
        f'<description>{_esc(site_tagline)}</description>'
        + "".join(items_xml) +
        '</channel></rss>'
    )


def render_sitemap(*, issues: list[dict], site_url: str) -> str:
    base = site_url.rstrip("/")
    urls = [f"<url><loc>{base}/</loc></url>"]
    for it in issues:
        urls.append(
            f"<url><loc>{base}/issues/{_esc(it['slug'])}.html</loc>"
            f"<lastmod>{_esc(it['published'][:10])}</lastmod></url>"
        )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        + "".join(urls) +
        '</urlset>'
    )


def write_static_site(*, issue_title: str, issue_subtitle: str, body_html: str,
                      site_name: str, site_tagline: str, site_url: str,
                      subscribe_url: str | None, twitter_handle: str | None,
                      published: datetime | None = None) -> dict:
    """Add the new issue to the archive and rewrite index/feed/sitemap.

    Existing issues are preserved (they're just static HTML files in site/issues/).
    Returns metadata about the new issue.
    """
    SITE_DIR.mkdir(exist_ok=True)
    ISSUES_DIR.mkdir(exist_ok=True)
    (SITE_DIR / "style.css").write_text(_BASE_CSS, encoding="utf-8")
    (SITE_DIR / "robots.txt").write_text(
        f"User-agent: *\nAllow: /\nSitemap: {site_url.rstrip('/')}/sitemap.xml\n",
        encoding="utf-8",
    )
    (SITE_DIR / ".nojekyll").write_text("", encoding="utf-8")

    pub = published or datetime.now(tz=timezone.utc)
    date_str = pub.strftime("%Y-%m-%d")
    display = pub.strftime("%a %b %d, %Y")
    rfc822 = pub.strftime("%a, %d %b %Y %H:%M:%S +0000")
    slug = f"{date_str}-{_slug(issue_title)}"

    # Write the new issue.
    page = render_issue_page(
        issue_title=issue_title, issue_subtitle=issue_subtitle,
        body_html=body_html, slug=slug, published=pub,
        site_name=site_name, site_url=site_url,
        subscribe_url=subscribe_url, twitter_handle=twitter_handle,
    )
    issue_path = ISSUES_DIR / f"{slug}.html"
    issue_path.write_text(page, encoding="utf-8")

    # Maintain a manifest so we can rebuild index/feed without re-parsing HTML.
    manifest_path = SITE_DIR / "manifest.json"
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    else:
        manifest = {"issues": []}
    # Replace any same-day duplicate, then prepend.
    manifest["issues"] = [m for m in manifest["issues"] if m["slug"] != slug]
    manifest["issues"].insert(0, {
        "slug": slug,
        "title": issue_title,
        "subtitle": issue_subtitle,
        "published": pub.isoformat(),
        "rfc822": rfc822,
        "display_date": display,
    })
    # Cap manifest at 365 entries to keep index manageable.
    manifest["issues"] = manifest["issues"][:365]
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    issues = manifest["issues"]
    (SITE_DIR / "index.html").write_text(
        render_index(
            issues=issues, site_name=site_name, site_tagline=site_tagline,
            site_url=site_url, subscribe_url=subscribe_url, twitter_handle=twitter_handle,
        ),
        encoding="utf-8",
    )
    (SITE_DIR / "feed.xml").write_text(
        render_feed(issues=issues, site_name=site_name,
                    site_tagline=site_tagline, site_url=site_url),
        encoding="utf-8",
    )
    (SITE_DIR / "sitemap.xml").write_text(
        render_sitemap(issues=issues, site_url=site_url), encoding="utf-8",
    )
    return {"slug": slug, "path": str(issue_path), "url": f"{site_url.rstrip('/')}/issues/{slug}.html"}
