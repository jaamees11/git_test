import json
from datetime import datetime, timezone
from pathlib import Path

import pipeline.site.render as site
from pipeline.site.render import (
    render_feed,
    render_index,
    render_issue_page,
    render_sitemap,
    write_static_site,
)


def test_render_issue_page_has_seo_metadata():
    html = render_issue_page(
        issue_title="Test Issue",
        issue_subtitle="Cool things",
        body_html="<p>hi</p>",
        slug="2026-01-01-test",
        published=datetime(2026, 1, 1, tzinfo=timezone.utc),
        site_name="AI Pulse",
        site_url="https://example.com",
        subscribe_url="https://sub.example.com",
        twitter_handle="ai_pulse",
    )
    assert '<title>Test Issue</title>' in html
    assert 'rel="canonical"' in html
    assert 'application/ld+json' in html
    assert 'twitter:card' in html
    assert 'sub.example.com' in html


def test_render_index_lists_issues():
    issues = [
        {"slug": "2026-01-02-foo", "title": "Foo", "subtitle": "s",
         "published": "2026-01-02T00:00:00+00:00", "display_date": "Fri Jan 02, 2026"},
        {"slug": "2026-01-01-bar", "title": "Bar", "subtitle": "s",
         "published": "2026-01-01T00:00:00+00:00", "display_date": "Thu Jan 01, 2026"},
    ]
    out = render_index(
        issues=issues, site_name="AI Pulse", site_tagline="t",
        site_url="https://example.com", subscribe_url=None, twitter_handle=None,
    )
    assert "/issues/2026-01-02-foo.html" in out
    assert "/issues/2026-01-01-bar.html" in out


def test_feed_and_sitemap_well_formed():
    issues = [
        {"slug": "s1", "title": "T1", "subtitle": "x",
         "published": "2026-01-01T00:00:00+00:00",
         "rfc822": "Thu, 01 Jan 2026 00:00:00 +0000",
         "display_date": "Thu Jan 01, 2026"},
    ]
    feed = render_feed(issues=issues, site_name="AI Pulse",
                       site_tagline="t", site_url="https://example.com")
    assert "<?xml" in feed and "<channel>" in feed and "/issues/s1.html" in feed
    sm = render_sitemap(issues=issues, site_url="https://example.com")
    assert "<urlset" in sm and "/issues/s1.html" in sm


def test_write_static_site_creates_files_and_manifest(tmp_path, monkeypatch):
    monkeypatch.setattr(site, "SITE_DIR", tmp_path / "site")
    monkeypatch.setattr(site, "ISSUES_DIR", tmp_path / "site" / "issues")

    info = write_static_site(
        issue_title="Hello",
        issue_subtitle="world",
        body_html="<p>body</p>",
        site_name="AI Pulse",
        site_tagline="tag",
        site_url="https://example.com",
        subscribe_url="https://sub",
        twitter_handle="x",
        published=datetime(2026, 1, 1, tzinfo=timezone.utc),
    )

    site_dir = Path(tmp_path / "site")
    assert (site_dir / "index.html").exists()
    assert (site_dir / "feed.xml").exists()
    assert (site_dir / "sitemap.xml").exists()
    assert (site_dir / "style.css").exists()
    assert (site_dir / "robots.txt").exists()
    assert (site_dir / ".nojekyll").exists()
    assert Path(info["path"]).exists()

    manifest = json.loads((site_dir / "manifest.json").read_text())
    assert len(manifest["issues"]) == 1
    assert manifest["issues"][0]["slug"].startswith("2026-01-01-")


def test_write_static_site_appends_subsequent_issues(tmp_path, monkeypatch):
    monkeypatch.setattr(site, "SITE_DIR", tmp_path / "site")
    monkeypatch.setattr(site, "ISSUES_DIR", tmp_path / "site" / "issues")

    write_static_site(
        issue_title="Day 1", issue_subtitle="s", body_html="<p>1</p>",
        site_name="AI Pulse", site_tagline="t", site_url="https://x",
        subscribe_url=None, twitter_handle=None,
        published=datetime(2026, 1, 1, tzinfo=timezone.utc),
    )
    write_static_site(
        issue_title="Day 2", issue_subtitle="s", body_html="<p>2</p>",
        site_name="AI Pulse", site_tagline="t", site_url="https://x",
        subscribe_url=None, twitter_handle=None,
        published=datetime(2026, 1, 2, tzinfo=timezone.utc),
    )
    manifest = json.loads((tmp_path / "site" / "manifest.json").read_text())
    assert len(manifest["issues"]) == 2
    # Newest first.
    assert manifest["issues"][0]["title"] == "Day 2"
