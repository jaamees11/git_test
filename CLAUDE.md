# Playbook for Claude Code sessions

This file tells any Claude Code session how to ship an AI Pulse issue when the
user says something like **"new issue"**, **"weekly AI Pulse"**, **"ship the
newsletter"**, or **"write the Prompt Pack"**.

Follow these steps exactly. You have the Pro/Max subscription; use your own
writing ability — do NOT call Gemini/Groq/Anthropic APIs from Python.

---

## Flow A — Daily/Weekly AI Pulse issue

When the user asks for a new issue:

1. **Collect the raw data** — run:
   ```
   python -m pipeline.run --collect-only
   ```
   This scrapes, ranks, dedupes, and writes `.cache/draft-issue-latest.json`.

2. **Read** `.cache/draft-issue-latest.json`. It contains ~30 items, each with
   `title`, `url`, `source`, `category`, `raw_blurb`, and an empty
   `rewritten_blurb` field.

3. **Rewrite each blurb yourself** in 1-2 tight sentences:
   - Max 280 chars
   - Sharp, skimmable, no hype ("revolutionary", "game-changing" → cut)
   - Lead with the concrete thing (who, what, number)
   - Preserve specifics: model names, benchmarks, prices, dates
   - If `raw_blurb` is thin, infer from the title and source — it's fine

   Use the `Edit` tool (one `replace_all`=false edit per item, or multiple
   parallel edits) to fill in each `rewritten_blurb`. If some items aren't
   worth including, set their `rewritten_blurb` to empty — the publisher
   only ships items with content, and you can trim the total to ~10 items.

4. **Publish** — run:
   ```
   python -m pipeline.run --from-json .cache/draft-issue-latest.json
   ```
   This:
   - Builds the HTML email
   - Injects affiliate links
   - Generates the subject line
   - Updates the static archive
   - Writes share snippets to `.cache/share-*.md`
   - Creates a draft in Beehiiv

5. **Commit the archive update** and push. The user's next step is to open
   Beehiiv, review the draft, and hit Send.

6. **Tell the user**:
   - The Beehiiv draft URL (or just say "check your Beehiiv dashboard")
   - The 3 share-snippet paths so they can paste to X/LinkedIn/Reddit

---

## Flow B — Weekly Prompt Pack (paid tier)

When the user asks for a new Prompt Pack (runs Fridays in automated mode):

1. Look at `config/prompt_pack.yaml` to see this week's theme (rotates by ISO
   week).

2. **Write 5 paste-ready prompts yourself** for the theme. For each prompt:
   - Open with a clear role and goal in one line
   - Include 1-2 `{{placeholder}}` variables
   - State the desired output format explicitly
   - Follow with a one-sentence "Why this works" line

3. Write the content to `.cache/prompt-pack-YYYYMMDD.md` in this format:
   ```markdown
   ## 1. <title>
   ```
   <the prompt>
   ```
   Why this works: <one sentence>

   ## 2. ...
   ```

4. Run `python -m pipeline.prompt_pack --from-md .cache/prompt-pack-YYYYMMDD.md`
   (if this mode exists; otherwise just edit the fallback body and run the
   normal dry-run, review, copy-paste into Beehiiv).

---

## Tone guide (memorise)

- Voice: **sharp, skimmable, lightly witty**. No hype, no hedging. Short
  sentences.
- Audience: builders, PMs, and curious pros.
- Write like you're texting a smart friend who hates fluff.
- Good: *"Anthropic shipped Claude 4 Sonnet — 34% on SWE-bench, $3/1M tokens."*
- Bad: *"Anthropic has announced the revolutionary new Claude 4 Sonnet, which
  promises to transform how developers engage with AI assistants."*

---

## Safety rules

- **Never** auto-send — the pipeline creates drafts only. The user hits Send.
- **Never** commit secrets. The `BEEHIIV_API_KEY` etc. live in GitHub Secrets.
- **Never** post to social platforms directly — write share snippets and let
  the user paste.
- **Always** preserve source attribution (link + source name) in every item.
- **Always** verify the draft JSON has content before running `--from-json`
  (the publisher will error if blurbs are empty, but double-check first).
