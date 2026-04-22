Ship this week's AI Pulse Prompt Pack (paid-tier content, ships Fridays).

Steps:

1. Check `config/prompt_pack.yaml` for this week's theme (rotates by ISO week).
2. Check if a pre-written pack already exists in `content/PROMPT-PACK-WEEK-N.md` that matches the theme. If yes — use that content directly.
3. If no pre-written pack exists, generate 5 paste-ready prompts for the theme following the format in `CLAUDE.md` Flow B:
   - Open with a role + goal in one line
   - 1-2 `{{placeholder}}` variables each
   - Explicit output format
   - One-sentence "why this works" per prompt
4. Write the content to `.cache/prompt-pack-YYYYMMDD.md` in the standard format (see existing files in `content/PROMPT-PACK-WEEK-N.md`).
5. Run `python -m pipeline.prompt_pack --dry-run` first to render the HTML preview.
6. Show the user the preview path. Ask if they want to publish.
7. If yes, run `python -m pipeline.prompt_pack` (no dry-run) to create the Beehiiv draft.
8. Tell the user:
   - "Prompt Pack draft is in Beehiiv"
   - Reminder to gate as paid-only in Beehiiv UI if they've flipped on paid tier.

Do NOT send. Draft only.
