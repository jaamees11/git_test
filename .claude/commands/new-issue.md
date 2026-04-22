Ship today's AI Pulse issue using the Claude-in-the-loop flow from CLAUDE.md.

Steps, in order:

1. Run `python -m pipeline.run --collect-only` to scrape and rank.
2. Read `.cache/draft-issue-latest.json`.
3. Choose ~8-10 of the strongest items (the rest you'll set `rewritten_blurb` to "" so they're skipped). Prefer a mix of ~3 Fresh Tools + ~5 Signal-Not-Noise items.
4. Write each chosen item's `rewritten_blurb` yourself following the voice guide in `CLAUDE.md`:
   - ≤ 280 chars
   - Sharp, no hype, no hedging
   - Lead with who/what/number
   - Preserve model names, benchmarks, prices
5. Use parallel `Edit` calls to fill in `rewritten_blurb` fields.
6. Run `python -m pipeline.run --from-json .cache/draft-issue-latest.json`.
7. If the output includes `site/` archive updates, commit them.
8. Tell the user:
   - "Draft is in Beehiiv — check your dashboard"
   - The three `.cache/share-*.md` file paths for X/LinkedIn/Reddit
   - A one-line summary of the issue's subject line

Do NOT send the issue. Beehiiv publisher creates a DRAFT only. The user hits Send from the Beehiiv UI.
