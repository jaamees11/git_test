"""Tests for Claude-in-the-loop modes (collect-only + from-json)."""
import json
from pathlib import Path

import pipeline.run as run_module
from pipeline.models import Item


def _fake_items():
    return [
        Item(title="A1", url="https://a.com/1", source="Anthropic News",
             category="lab", raw_blurb="Anthropic ships X."),
        Item(title="B1", url="https://b.com/2", source="Hacker News",
             category="tool", raw_blurb="HN discusses Y."),
    ]


def test_collect_only_writes_draft_json(tmp_path, monkeypatch):
    monkeypatch.setattr(run_module, "CACHE_DIR", tmp_path)
    monkeypatch.setattr(run_module, "collect", _fake_items)

    rc = run_module.main(collect_only=True)
    assert rc == 0

    latest = tmp_path / "draft-issue-latest.json"
    assert latest.exists()
    data = json.loads(latest.read_text())
    assert "items" in data
    assert all(it["rewritten_blurb"] == "" for it in data["items"])
    assert all("raw_blurb" in it for it in data["items"])


def test_from_json_errors_on_empty_blurbs(tmp_path, monkeypatch):
    monkeypatch.setattr(run_module, "CACHE_DIR", tmp_path)

    path = tmp_path / "draft.json"
    path.write_text(json.dumps({
        "items": [
            {"title": "T", "url": "https://a.com", "source": "S",
             "category": "news", "raw_blurb": "r", "rewritten_blurb": ""},
        ],
    }))

    rc = run_module.main(from_json=str(path), dry_run=True)
    assert rc == 1  # refuses to publish empty blurbs


def test_from_json_happy_path_dry_run(tmp_path, monkeypatch):
    monkeypatch.setattr(run_module, "CACHE_DIR", tmp_path)
    # Avoid writing to the real site/ directory.
    import pipeline.site.render as site
    monkeypatch.setattr(site, "SITE_DIR", tmp_path / "site")
    monkeypatch.setattr(site, "ISSUES_DIR", tmp_path / "site" / "issues")

    path = tmp_path / "draft.json"
    path.write_text(json.dumps({
        "items": [
            {"title": "Anthropic ships Claude 4", "url": "https://anthropic.com/x",
             "source": "Anthropic News", "category": "lab",
             "raw_blurb": "raw", "rewritten_blurb": "34% SWE-bench, $3/M tokens."},
            {"title": "Cool repo", "url": "https://github.com/foo/bar",
             "source": "GitHub Trending", "category": "tool",
             "raw_blurb": "raw", "rewritten_blurb": "2300 stars today."},
        ],
    }))

    rc = run_module.main(from_json=str(path), dry_run=True)
    assert rc == 0

    # Preview HTML + JSON were written
    html = list(tmp_path.glob("issue-*.html"))
    meta = list(tmp_path.glob("issue-*.json"))
    assert html and meta

    # Share snippets were written
    assert list(tmp_path.glob("share-x-*.md"))
    assert list(tmp_path.glob("share-linkedin-*.md"))
    assert list(tmp_path.glob("share-reddit-*.md"))


def test_items_from_json_parses_minimal_fields(tmp_path):
    path = tmp_path / "d.json"
    path.write_text(json.dumps({
        "items": [
            {"title": "T", "url": "https://a.com", "rewritten_blurb": "b"},
        ],
    }))
    items = run_module._items_from_json(path)
    assert len(items) == 1
    assert items[0].title == "T"
    assert items[0].rewritten_blurb == "b"
    assert items[0].category == "news"  # default
