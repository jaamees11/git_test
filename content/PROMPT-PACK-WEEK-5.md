# Prompt Pack #5 — Code Review Co-pilot

> Ships Friday of week 5. For developers (and the occasional code-adjacent
> PM) — prompts that make reading code, reviewing PRs, and shipping safer
> diffs dramatically faster.

---

**Subject:** prompt pack: 5 prompts that make you a sharper code reviewer

**Subtitle:** Explain the diff. Find the risky lines. Write the missing tests. Ship a cleaner changelog.

---

*Week 5 Prompt Pack. For devs — or anyone who reviews PRs and wishes the process were less mechanical and more useful.*

---

## 1. The context-loaded diff explainer

```
You explain code diffs to someone who is competent but has not seen this codebase before.

Here is the diff:
```
{{diff}}
```

Context about the codebase (if known):
{{codebase_context}}

Produce:

**1. What this diff does (1-2 sentences):**
The actual behavior change, stated simply. Not "refactors X" — the user-visible or system-visible change.

**2. Why (1-2 sentences):**
The motivation, inferred from the diff. If it's unclear, say so — don't fabricate a reason.

**3. What changed, mechanically (5-10 bullets):**
File-by-file. Keep it scannable.

**4. What to look for in review:**
The 3 places a reviewer should linger. For each: the specific line, and what question to ask about it.

Rules:
- Use the file and line numbers from the diff
- If the diff seems incomplete (referenced functions not shown, imports not shown), flag it
- Do NOT produce a generic "code review checklist"
```

**Why this works:** the "3 places to linger" section transforms a reviewer from a rubber-stamp into someone adding real value. This is the prompt to use before every PR you review.

---

## 2. The risky-line finder

```
You are a careful engineer looking for latent bugs, footguns, and maintenance traps in this code.

Code:
```
{{code}}
```

Produce:

**Top 3 risks:**
For each risk:
1. The file + line numbers
2. What goes wrong (specific scenario: concurrent access, input X, deployment after Y days, etc.)
3. How likely it is (low/med/high) and why
4. The minimal fix

**1 non-risk I almost flagged but decided against:**
Show your reasoning — helps the author calibrate your signal.

Rules:
- Concrete scenarios only. No "this could fail if something changes."
- If the code is genuinely low-risk, say so — do NOT invent problems to fill the output.
- If the risk requires context you don't have ("I don't know what `userRepo.save` does concurrently"), ask.
```

**Why this works:** the "1 non-risk" at the end is the trust-builder. Without it, the prompt is a generator of fake concerns. With it, you know when the output is credible.

---

## 3. The missing-tests generator

```
You identify tests that are missing from this code, prioritizing by value (not coverage).

Code:
```
{{code}}
```

Existing tests (if any):
```
{{existing_tests}}
```

Produce 3-5 test cases. For each:

**Test name:** descriptive, reads like a sentence ("adds multiple items without duplicating")
**What it covers:** the specific behavior being asserted
**Why it matters:** the failure mode this would catch in production
**Snippet:** 10-20 lines of code, in the test framework the existing tests use (or pytest if none)

Rules:
- Value-order, not coverage-order. First: tests that would catch bugs that make it to production.
- Include at least 1 edge case the existing tests miss.
- Include at most 1 "happy path" test. If the existing tests already cover happy path, include zero.
- If the code is genuinely well-tested, say so — don't pad.
```

**Why this works:** "value-order not coverage-order" saves you from the model's default behavior of generating 12 tests that hit the same code paths.

---

## 4. The clean changelog entry

```
You write changelog entries humans actually read.

I shipped this code (commit range or diff):
```
{{commits_or_diff}}
```

Produce a changelog entry in this format:

### [{{date}}] {{one_line_summary}}

**What's new:** (2-3 bullets about user-visible changes. Skip if there are none.)
**What's fixed:** (1-line bug fixes with just enough context. Skip if there are none.)
**What's changed internally:** (1-line refactors worth noting — things that affect plugin authors or power users. Skip otherwise.)
**Breaking changes:** (prefixed with ⚠️, with migration steps. If none, omit the section entirely.)

Rules:
- Write for the user, not the author. "Fixed a bug where the search bar didn't update" not "Refactored SearchBar.tsx."
- Cut internal-only changes unless they affect extensibility.
- If there are no user-visible changes, say so: "Internal improvements only; no user-facing changes."
- No emoji spam. One ⚠️ per breaking change, that's it.
```

**Why this works:** the "write for the user, not the author" instruction is the one most prompts miss. This gets you changelogs that pay back the reader's attention.

---

## 5. The "explain this function to me in 30 seconds" prompt

```
You explain a function to a reviewer who has 30 seconds and is about to read the rest of the file.

Function:
```
{{function_code}}
```

Related functions / imports from the same file, if available:
```
{{context}}
```

Produce:

**One-sentence purpose:**
Starting with a verb. "Returns the..." or "Updates the..." etc.

**Inputs:**
Each parameter, plus the type and the realistic range of values.

**Outputs:**
Return value or side effects.

**Edge cases handled:**
Any branches in the function that protect against specific scenarios.

**Edge cases NOT handled:**
What would break this function. (This is usually the most useful part.)

**Smell check:**
One sentence. Is this function doing too much? Too little? About right?

Rules:
- Skip generic "this function is well-structured" padding.
- If the function is genuinely confusing (weird parameter orders, hidden state), say so.
- Keep the whole output under 200 words.
```

**Why this works:** the "edge cases NOT handled" section is where 80% of the review value lives. Most reviewers don't think about this until they're debugging. Prompt forces it up front.

---

## Theme rotation closes

That's five weeks of prompt packs, covering the five highest-leverage
knowledge-work contexts:

1. Inbox triage
2. Meeting alchemy
3. Deep research
4. Writing on rails
5. Code review co-pilot

Starting next week, the rotation loops. I'll refresh each pack every
quarter as models change and the best prompts evolve.

**Reply with a job you want covered in a future pack** — I pick from
reader requests first.

— AI Pulse
