from pipeline.models import Item
from pipeline.publisher.subject import best, candidates


def test_returns_default_when_no_items():
    s = best([], publication_name="Test Pub")
    assert "Test Pub" in s


def test_picks_top_scored_item_for_subject():
    items = [
        Item(title="boring update", url="https://a", source="s", category="news", score=1),
        Item(title="Anthropic ships Claude 4 with 30% gains", url="https://b", source="s", category="lab", score=99),
    ]
    s = best(items)
    assert "claude" in s.lower() or "anthropic" in s.lower()


def test_strips_announcing_cruft():
    items = [
        Item(title="Announcing Gemini 3.0 today with new features", url="https://x",
             source="s", category="lab", score=10),
    ]
    cands = candidates(items)
    assert all("announcing" not in c.lower() for c in cands)


def test_subject_length_reasonable():
    items = [
        Item(title="OpenAI ships o5 model with 40% SWE-bench", url="https://x",
             source="s", category="lab", score=10),
    ]
    s = best(items)
    assert 15 <= len(s) <= 90
