# Prompt Pack #2 — Meeting Alchemy

> Ships Friday of week 2. For PMs, consultants, leads, and anyone who
> spends 10+ hrs/week in meetings.

---

**Subject:** prompt pack: 5 prompts that turn meetings into output

**Subtitle:** For the 10+ hrs/week you already lose to meetings — let's at least extract something from them.

---

*Week 2 Prompt Pack. Last week we cleaned up inboxes. This week we make meetings actually useful.*

---

## 1. The executive recap

```
You write one-page recaps for busy executives.

Here is a meeting transcript:
{{transcript}}

Context: the audience is {{audience_role}} who wasn't in the meeting. They have 90 seconds.

Produce:
- **TL;DR** (2 sentences max — what happened and why it matters)
- **3 decisions made** (bullet list with owner, if stated)
- **3 things still open** (bullet list with who's deciding)
- **1 thing to watch** (risk, concern, or unknown that came up)

No preamble. No "this meeting covered..." filler. Start with the TL;DR line.
```

**Why this works:** forcing a strict structure prevents the model from over-summarizing. Executives want signal-per-second, not a tidy narrative.

---

## 2. The decision/action extractor

```
You extract decisions and action items from messy meeting notes. You do not invent anything.

Notes:
{{notes}}

Produce two tables:

**Decisions made:**
| Decision | Context (1 line) | Decided by (if named) |
|---|---|---|

**Action items:**
| Action | Owner | Due date (if named, else "TBD") | Dependency (if any) |
|---|---|---|---|

Rules:
- If the notes imply an action but never say "X will do Y", mark Owner as "TBD — infer from context"
- If nothing qualifies for a table, say "No {decisions|actions} found in these notes" — do NOT pad.
```

**Why this works:** the explicit "do not invent" instruction plus the separate "TBD — infer" category keeps the model honest instead of hallucinating owners.

---

## 3. The follow-up email generator

```
You draft follow-up emails after meetings. One per attendee, each personalized to them.

Meeting context:
{{meeting_topic}}

Attendees:
{{attendees_and_roles}}

Key takeaways and action items:
{{key_points}}

For each attendee, produce:

**To: {{name}} ({{role}})**
**Subject:** <specific, < 50 chars, not "Meeting follow-up">
**Body:** 
- One line acknowledging their specific input (reference something they said)
- 2-3 bullet recap of what's relevant to them specifically (not the whole meeting)
- Their specific next step with a specific deadline
- One sentence signoff

Keep total body under 120 words. No "Thanks for the great meeting!" intros.
```

**Why this works:** the "reference something they said" forcing function stops the model from producing five identical emails with the name swapped.

---

## 4. The agenda architect

```
You build agendas that actually make meetings productive.

Meeting goal: {{one_sentence_goal}}
Length: {{duration_minutes}} min
Attendees: {{attendees_and_roles}}
Context (last meeting notes, relevant doc, or background):
{{context_dump}}

Produce an agenda with:

1. **Desired outcome** — one specific decision or deliverable we walk out with
2. **Pre-read** — 1-2 specific things attendees should have done before (if any)
3. **Structure** — time blocks, each with:
   - Who leads
   - Goal of that block (decide / inform / align)
   - Explicit 5-min time limit per block
4. **End section** — 5 min reserved for "who does what by when"

Rules:
- Never budget more time than "Length"
- Never plan purely-informational blocks > 5 min (that's a doc, not a meeting)
- If the goal is vague ("align on strategy"), challenge it: propose a sharper version
```

**Why this works:** the "5 min limit per block" constraint forces the model to stop padding with hand-wavy segments. And the "challenge vague goals" permission is where most of the real value lives.

---

## 5. The risk scanner

```
You are a cynical risk-hunting advisor. Your job is to find what the meeting glossed over.

Transcript or notes:
{{content}}

Produce:

**Risks the room didn't address:**
1. <specific risk> — why it matters, which decision would need revisiting if it materializes
2. ...
3. ...

**Assumptions baked in that weren't called out:**
- <assumption>: true if {{condition}}, false if {{condition}}

**Key question nobody asked:**
<one question>

Tone: dry, not alarmist. If the meeting genuinely handled everything well, say so and move on — do not invent risks to fill space.
```

**Why this works:** the "tell me if everything was actually fine" permission is rare in these prompts and stops the model from inventing drama.

---

## Next week

Week 3: **Deep Research** — 5 prompts for turning 10 sources into a brief, finding counter-arguments to your own hypothesis, and building research plans that don't spiral.

Reply with a problem you want me to build prompts for — the most upvoted reader request each week gets its own pack.

— AI Pulse
