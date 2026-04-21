from pipeline.models import Item
from pipeline.social.snippets import linkedin_post, reddit_post, x_post, X_MAX


def _items(n=5):
    return [
        Item(
            title=f"Story {i} about model release",
            url=f"https://example.com/{i}",
            source="Source",
            category="lab",
            score=10 - i,
            rewritten_blurb="blurb",
        )
        for i in range(n)
    ]


def test_x_post_within_char_limit():
    out = x_post(_items(5), "https://example.com/issues/today.html")
    assert 0 < len(out) <= X_MAX
    assert "→" in out


def test_x_post_handles_empty():
    assert x_post([], "https://x") == ""


def test_linkedin_includes_pub_name_and_link():
    out = linkedin_post(_items(5), "https://example.com/i", publication_name="My Pub")
    assert "My Pub" in out
    assert "https://example.com/i" in out
    assert out.count("→") >= 5


def test_reddit_post_returns_components():
    rd = reddit_post(_items(8))
    assert rd["title"]
    assert "[Story 0" in rd["body"]
    assert any("LocalLLaMA" in s for s in rd["suggested_subs"])
