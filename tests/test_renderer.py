from pipeline.models import Item
from pipeline.publisher.renderer import build_issue


def test_build_issue_groups_by_section():
    items = [
        Item(title="Anthropic ships X", url="https://anthropic.com/x", source="Anthropic News",
             category="lab", raw_blurb="x", rewritten_blurb="x"),
        Item(title="Cool repo", url="https://github.com/foo/bar", source="GitHub Trending (python)",
             category="tool", raw_blurb="y", rewritten_blurb="y"),
    ]
    issue = build_issue(items)
    assert "AI Pulse" in issue["title"]
    assert "🚀 Fresh Tools" in issue["body_content"]
    assert "📰 Signal, Not Noise" in issue["body_content"]
    assert "anthropic.com/x" in issue["body_content"]
    assert "github.com/foo/bar" in issue["body_content"]


def test_build_issue_escapes_html_in_titles():
    items = [
        Item(title="Tool <script>alert(1)</script>", url="https://example.com",
             source="Hacker News", category="tool", rewritten_blurb="ok"),
    ]
    issue = build_issue(items)
    assert "<script>" not in issue["body_content"]
    assert "&lt;script&gt;" in issue["body_content"]
