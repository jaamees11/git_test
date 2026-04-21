from pipeline.rewriter.extractive import rewrite


def test_keeps_numbers_and_strips_fluff():
    out = rewrite(
        title="Claude 3.5 Sonnet launches",
        source="Anthropic",
        content=(
            "Anthropic announced Claude 3.5 Sonnet today, claiming a 27 percent gain on SWE-bench. "
            "The revolutionary model is basically available now for all users, "
            "priced at $3 per million input tokens."
        ),
    )
    assert "$3" in out
    assert "revolutionary" not in out.lower()
    assert "basically" not in out.lower()


def test_returns_empty_for_empty_input():
    assert rewrite("title", "src", "") == ""


def test_truncates_to_max_chars():
    long = "A long sentence with no numbers. " * 30
    out = rewrite("t", "s", long, max_chars=100)
    assert len(out) <= 100


def test_picks_sentence_with_release_signal():
    content = (
        "Some unrelated chatter about the industry. "
        "Mistral released Mixtral-8x22B with 65 percent on MMLU."
    )
    out = rewrite("Mixtral", "Mistral", content)
    assert "Mixtral" in out and "65" in out
