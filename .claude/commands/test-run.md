Smoke-test the AI Pulse pipeline end-to-end without touching Beehiiv.

Steps:

1. Run `python -m pytest tests/ -q` and report pass/fail count.
2. Run `python -m pipeline.run --dry-run` to exercise the full pipeline.
3. List the `.cache/issue-*.html` and `.cache/share-*.md` files that were produced.
4. Read the first ~30 lines of the generated issue HTML to verify rendering.
5. Tell the user:
   - How many items were scraped
   - Whether the LLM fallback chain was hit (look for "LLM" vs "extractive" in log output)
   - Whether any scrapers failed (look for warnings in the log)
   - "Everything worked" or a specific diagnosis of what broke

This does NOT publish to Beehiiv. Pure smoke test.
