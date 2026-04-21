from pipeline.models import Item
from pipeline.publisher.affiliates import (
    _inject,
    _inject_utms,
    apply_to_items,
    build_utms,
)


PROGRAMS = [
    {"host": "perplexity.ai", "param": "referrer", "code": "ABC123"},
    {"host": "elevenlabs.io", "param": "from", "code": "XYZ"},
]


def test_injects_param_for_known_host():
    out = _inject("https://perplexity.ai/pro", PROGRAMS)
    assert "referrer=ABC123" in out


def test_handles_www_prefix():
    out = _inject("https://www.elevenlabs.io/pricing?utm=x", PROGRAMS)
    assert "from=XYZ" in out
    assert "utm=x" in out


def test_idempotent_when_param_already_present():
    url = "https://perplexity.ai/pro?referrer=OTHER"
    out = _inject(url, PROGRAMS)
    assert out == url


def test_leaves_unknown_hosts_alone():
    url = "https://random-blog.com/post"
    assert _inject(url, PROGRAMS) == url


def test_skips_non_http_schemes():
    assert _inject("mailto:foo@bar.com", PROGRAMS) == "mailto:foo@bar.com"


def test_apply_to_items_no_programs_is_noop():
    items = [Item(title="t", url="https://perplexity.ai/x", source="s", category="tool")]
    apply_to_items(items, utms={})
    assert items[0].url.startswith("https://perplexity.ai/x")


# ---- UTM tracking ----------------------------------------------------------

def test_build_utms_defaults():
    utms = build_utms()
    assert utms["utm_source"] == "newsletter"
    assert utms["utm_medium"] == "email"
    assert utms["utm_campaign"].startswith("ai-pulse-")


def test_inject_utms_adds_all_three():
    utms = {"utm_source": "newsletter", "utm_medium": "email", "utm_campaign": "test"}
    out = _inject_utms("https://example.com/foo", utms)
    assert "utm_source=newsletter" in out
    assert "utm_medium=email" in out
    assert "utm_campaign=test" in out


def test_inject_utms_preserves_existing_query():
    utms = {"utm_source": "newsletter", "utm_campaign": "test"}
    out = _inject_utms("https://example.com/foo?a=1", utms)
    assert "a=1" in out
    assert "utm_source=newsletter" in out


def test_inject_utms_never_overwrites_existing_utm():
    utms = {"utm_source": "newsletter", "utm_campaign": "new"}
    out = _inject_utms("https://example.com?utm_source=other", utms)
    assert "utm_source=other" in out
    assert "utm_source=newsletter" not in out
    assert "utm_campaign=new" in out  # only the absent one gets added


def test_inject_utms_skips_non_http():
    utms = {"utm_source": "newsletter"}
    assert _inject_utms("mailto:x@y.com", utms) == "mailto:x@y.com"


def test_apply_to_items_adds_utms_by_default(monkeypatch):
    # Force config load to return an empty programs list but UTM enabled
    from pipeline.publisher import affiliates as aff

    monkeypatch.setattr(aff, "_load_config", lambda: {"utm": {"enabled": True}, "programs": []})

    items = [
        Item(title="a", url="https://example.com/a", source="s", category="tool"),
        Item(title="b", url="https://other.com/b", source="s", category="news"),
    ]
    apply_to_items(items)
    assert "utm_source=newsletter" in items[0].url
    assert "utm_source=newsletter" in items[1].url


def test_apply_to_items_affiliate_then_utm(monkeypatch):
    from pipeline.publisher import affiliates as aff

    monkeypatch.setattr(
        aff,
        "_load_config",
        lambda: {
            "utm": {"enabled": True},
            "programs": [{"host": "perplexity.ai", "param": "referrer", "code": "ABC"}],
        },
    )
    items = [Item(title="a", url="https://perplexity.ai/pro", source="s", category="tool")]
    apply_to_items(items, utms={"utm_source": "newsletter"})
    # Both affiliate code and UTM should be present.
    assert "referrer=ABC" in items[0].url
    assert "utm_source=newsletter" in items[0].url


def test_apply_to_items_utm_disabled(monkeypatch):
    from pipeline.publisher import affiliates as aff

    monkeypatch.setattr(aff, "_load_config", lambda: {"utm": {"enabled": False}, "programs": []})
    items = [Item(title="a", url="https://example.com/a", source="s", category="tool")]
    apply_to_items(items)
    assert "utm_" not in items[0].url
