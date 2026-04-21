# Prompt Pack #1 — Inbox Triage

> First-ever Prompt Pack. Ships on a Friday to subscribers. Once you flip on
> the paid tier, gate this in Beehiiv (Post → Audience → Paid only).
>
> Voice: sharp, skimmable, no hype. Each prompt is paste-ready into Claude,
> ChatGPT, or Gemini.

---

**Subject:** prompt pack: 5 prompts that tame your inbox

**Subtitle:** Paste, substitute the `{{placeholder}}`, thank me later.

---

*Your weekly 5 paste-ready prompts. This week: clawing back the 90 minutes/day most of us lose in email.*

---

## 1. The 30-message thread summariser

```
You are my chief of staff. Here is a long email thread:

{{thread}}

Produce:
1. A 5-bullet summary (who said what, what was decided, what's open).
2. The one question I should answer to move this forward.
3. A draft 2-sentence reply, in my voice (direct, warm, no fluff).
```

**Why this works:** forcing one open question cuts the 80% of threads that only *feel* urgent.

---

## 2. The polite decline

```
You write decline emails that preserve the relationship.

Someone pitched me {{what_they_pitched}}. I'm declining because {{real_reason_blunt}}.

Draft a 3-line reply that:
- Thanks them specifically (reference one thing they wrote).
- Says no clearly, no hedging.
- Leaves the door open if it's the right person/bad timing, OR closes it cleanly if it isn't.

Return only the email body — no subject, no signature.
```

**Why this works:** separating the *real reason* (blunt) from the *sent reason* (polite) is how most people learn to write these without sounding robotic.

---

## 3. The action-item extractor

```
You are an assistant that never misses a task.

I'm pasting the last week of my email {{thread_dump}}.

Extract every action item that's mine — not anyone else's. For each, output:

| Action | Deadline (if any) | Who's waiting | Thread link |
|---|---|---|---|

Rules:
- Include implicit asks ("let me know when you get a chance").
- Flag anything overdue with 🔴 in the Action column.
- Skip newsletters, promos, and anything clearly automated.
```

**Why this works:** the explicit table format forces the model to commit to a structured answer instead of waffling with paragraphs.

---

## 4. The angry-reply translator

```
I'm angry. Here's what I actually want to write: {{angry_draft}}

Keep the content and the directness. Strip:
- Sarcasm
- Anything that'd read as personal attack
- Words I'll regret in 48 hours (find them and tell me which ones)

Give me:
1. A cleaned-up version (same points, professional tone).
2. A one-sentence note on what softened and why.
```

**Why this works:** makes the model a co-reviewer, not a softener. You keep the edge; you lose the regret.

---

## 5. The inbox triage categoriser

```
You categorise email into 4 buckets: URGENT, REPLY (not urgent), FYI, ARCHIVE.

Here's an inbox dump: {{dump}}

Rules:
- URGENT = money, clients, or people I've already ghosted
- REPLY = someone explicitly asked a question requiring me
- FYI = I should know but no action needed
- ARCHIVE = transactional, promos, CCs I don't own

For each message, output: [BUCKET] — <sender> — <one-line summary> — <suggested action or "none">

At the end, give me a count of each bucket.
```

**Why this works:** defining the bucket rules in plain language (not examples) makes the model's output predictable across very different inbox shapes.

---

## How to save these

Beehiiv will keep this post in your archive forever. Subscribers can star / save it; later we'll build a proper searchable archive so every Prompt Pack is one click away.

**Reply with a job you want next week's pack built around** — I read every one and the next 5 themes are picked from replies.

— AI Pulse

---

## Notes for future Prompt Packs (internal)

Theme rotation is in `config/prompt_pack.yaml`. This one slots under
`Inbox triage`. Future weeks:
- Week 2: Meeting alchemy (transcripts → decisions, recaps, agendas)
- Week 3: Deep research (compare 3 competitors, 10-source synthesis)
- Week 4: Writing on rails (tighten drafts, 10 hook variations)
- Week 5: Code review co-pilot (diff explainer, risky-line finder)

Each follows the same format: 5 prompts, placeholder variables, "why this
works" one-liner.
