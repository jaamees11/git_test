from pipeline.publisher.beehiiv_client import _normalize_pub_id


def test_prepends_pub_prefix_to_bare_uuid():
    out = _normalize_pub_id("bbed962f-c006-4c7c-942c-5ddfa97c65ff")
    assert out == "pub_bbed962f-c006-4c7c-942c-5ddfa97c65ff"


def test_leaves_already_prefixed_ids_alone():
    raw = "pub_bbed962f-c006-4c7c-942c-5ddfa97c65ff"
    assert _normalize_pub_id(raw) == raw


def test_handles_uppercase_uuid():
    out = _normalize_pub_id("BBED962F-C006-4C7C-942C-5DDFA97C65FF")
    assert out.startswith("pub_")


def test_handles_whitespace():
    out = _normalize_pub_id("  bbed962f-c006-4c7c-942c-5ddfa97c65ff  \n")
    assert out == "pub_bbed962f-c006-4c7c-942c-5ddfa97c65ff"


def test_empty_string_stays_empty():
    assert _normalize_pub_id("") == ""
    assert _normalize_pub_id(None) == ""


def test_unknown_format_passthrough():
    # If it's neither a bare UUID nor a pub_ prefix, leave it be.
    assert _normalize_pub_id("some-other-id") == "some-other-id"
