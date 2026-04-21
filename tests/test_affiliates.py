from pipeline.models import Item
from pipeline.publisher.affiliates import _inject


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
    from pipeline.publisher.affiliates import apply_to_items
    items = [Item(title="t", url="https://perplexity.ai/x", source="s", category="tool")]
    apply_to_items(items)
    # programs file may have no entries; should leave URL untouched
    assert items[0].url.startswith("https://perplexity.ai/x")
