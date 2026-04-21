from pipeline.models import Item
from pipeline.scrapers.ranker import dedupe, score


def _item(**kw) -> Item:
    defaults = dict(
        title="x", url="https://example.com/x", source="src", category="news", raw_blurb=""
    )
    defaults.update(kw)
    return Item(**defaults)


def test_dedupe_collapses_url_variants():
    items = [
        _item(title="A1", url="https://www.example.com/foo/"),
        _item(title="A2", url="https://example.com/foo"),
        _item(title="B", url="https://example.com/bar"),
    ]
    out = dedupe(items)
    assert len(out) == 2


def test_dedupe_collapses_title_variants():
    items = [
        _item(title="Claude 3.5 Sonnet launched", url="https://a.com/1"),
        _item(title="claude 3.5 sonnet LAUNCHED!", url="https://b.com/2"),
    ]
    out = dedupe(items)
    assert len(out) == 1


def test_score_blocks_keywords():
    items = [
        _item(title="AI casino", raw_blurb="crypto powered AI"),
        _item(title="Claude release", raw_blurb="LLM release notes"),
    ]
    out = score(items)
    assert all("casino" not in i.title.lower() for i in out)
    assert len(out) == 1


def test_score_boosts_lab_category():
    a = _item(title="A", category="news")
    b = _item(title="B", category="lab")
    out = {i.title: i.score for i in score([a, b])}
    assert out["B"] > out["A"]
