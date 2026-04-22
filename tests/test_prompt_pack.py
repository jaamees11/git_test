from pipeline.prompt_pack import _fallback_body, _markdown_to_html, _pick_theme


THEMES = [
    {"name": "A", "audience": "x", "use_cases": ["one"]},
    {"name": "B", "audience": "y", "use_cases": ["two"]},
    {"name": "C", "audience": "z", "use_cases": ["three"]},
]


def test_pick_theme_returns_one_of_the_themes():
    pick = _pick_theme(THEMES)
    assert pick in THEMES


def test_fallback_body_includes_all_use_cases():
    theme = {"name": "T", "audience": "a", "use_cases": ["alpha task", "beta task"]}
    body = _fallback_body(theme)
    assert "alpha task" in body.lower()
    assert "beta task" in body.lower()
    assert "{{input}}" in body


def test_markdown_to_html_renders_codeblocks_and_headers():
    md = "## Title\n```\nsome code <x>\n```\nbody text"
    html = _markdown_to_html(md)
    assert "<h2" in html and "Title" in html
    assert "<pre" in html
    assert "&lt;x&gt;" in html  # html-escaped inside code
    assert "body text" in html
