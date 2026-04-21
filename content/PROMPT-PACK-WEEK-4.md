# Prompt Pack #4 — Writing on Rails

> Ships Friday of week 4. For anyone who writes anything — marketers,
> founders, bloggers, content teams, or the occasionally-published IC.

---

**Subject:** prompt pack: 5 prompts that make you write faster (and sharper)

**Subtitle:** Tighten drafts. Ten hook variations. Hype-detector. Go.

---

*Week 4 Prompt Pack. These won't write for you — that's a dead end. They will compress your writing cycle from 3 hours to 40 minutes.*

---

## 1. The 30% tighter

```
You cut bloat from writing without changing voice or meaning.

My draft:
{{draft}}

Produce a version that is ~30% shorter.

Rules:
- Keep every fact, number, and name
- Keep my sentence rhythm (short sentences stay short; long ones get trimmed, not rewritten)
- Cut: filler adverbs, hedge words ("just," "kind of," "basically"), redundant clauses, scene-setting
- Do NOT replace words with fancier synonyms

After the tighter version, tell me:
- What you cut (3-5 bullets, specific categories like "3 instances of 'just'")
- One thing you almost cut but kept, and why
```

**Why this works:** the "keep my sentence rhythm" rule is the difference between editing and rewriting. And the "almost cut but kept" forces the model to show its reasoning, so you can override it when it's wrong.

---

## 2. The 10 hooks

```
You generate hooks (opening lines) for a piece I'm writing.

The piece is about: {{topic_or_thesis}}
Target reader: {{audience}}
Platform: {{X | LinkedIn | blog | newsletter | essay}}

Produce 10 hooks, each under 25 words.

Mix these styles (2 each):
1. **Confession** — admit something embarrassing or counterintuitive
2. **Stat with context** — a number that surprises, with one line of "why"
3. **Contrarian take** — against the consensus, with a specific target
4. **Scene / moment** — a vivid 1-sentence image
5. **Direct question** — the one the reader was about to ask

For each, add a one-line note: "best if the essay is about [X]" — to help me pick.

Rules:
- No "in today's fast-paced world"
- No "imagine if you could"
- No rhetorical questions that assume my agreement
```

**Why this works:** the 5-style mix forces variety. Most "generate hooks" prompts produce 10 variations of the same style. This one produces a real A/B set.

---

## 3. The hype auditor

```
You are my hype detector. Find the words, phrases, and structures in my writing that make readers bounce.

My draft:
{{draft}}

Audit for:

**Hype words (flag every instance):**
revolutionary, game-changing, cutting-edge, next-generation, world-class, best-in-class, groundbreaking, unlock, 10x, literally, absolutely, truly, powerful, incredible, transform, elevate, seamless, robust, scalable

**Hedge words (flag every instance):**
just, really, quite, basically, kind of, sort of, somewhat, arguably, perhaps, potentially

**Hollow structures:**
- Sentences that could be deleted with zero information loss
- "This is important because..." (replace with just showing why)
- "I think..." + opinion (cut the "I think")
- Rhetorical questions used as arguments

For each finding: the sentence, the flag, and a short fix or "rewrite option."

End with: my top 3 hype/hedge tendencies across this draft, so I can fix them before writing next time.
```

**Why this works:** "top 3 tendencies" turns a one-off edit into a writing skill upgrade. You'll see your own crutches after 2-3 uses.

---

## 4. The voice locker

```
You capture my writing voice in a reusable specification.

Here are 3 samples of my writing that I think are "on voice":
Sample 1:
{{sample_1}}

Sample 2:
{{sample_2}}

Sample 3:
{{sample_3}}

Produce a voice spec with:

**Sentence length distribution:**
- Short (<10 words): {{N}}%
- Medium: {{N}}%
- Long (>25 words): {{N}}%
- Any pattern (e.g. "opens with a long sentence, cuts to a short one")

**Vocabulary register:**
- Formality (1-10)
- Technicality (1-10)
- Specific words the author uses often
- Specific words the author never uses

**Rhythm signatures:**
- Favored punctuation moves (em-dashes? semicolons? sentence fragments?)
- Openers (how does the author typically start a paragraph?)
- Transitions (how does the author move between ideas?)

**3 "DO" rules:**
1-2 sentence rules someone could follow to write more like this author.

**3 "DON'T" rules:**
1-2 sentence rules someone could follow to avoid sounding like a different author.

End with: "To write in this voice, do X and avoid Y."
```

**Why this works:** this output is gold — save it. Paste it into every other writing prompt (like #1 above) under "voice: [spec here]" and you'll get consistent output across every draft.

---

## 5. The newsletter / post outliner

```
You outline pieces that earn the reader's attention, not waste it.

I want to write about: {{topic_or_observation}}
Audience: {{who_reads_this}}
Length target: {{words}}
Format: {{newsletter | blog | essay | thread}}

Produce an outline with:

**The single takeaway (1 sentence):**
What does the reader walk away believing or doing? If you can't state this, tell me the piece isn't ready to outline.

**Structure:**
1. Hook (1-2 sentences) — how do we earn the first 5 seconds?
2. Stakes (why should the reader care?) — connect to something concrete in their week
3. Core argument / story (3-5 beats)
4. Evidence / example (specific, not generic)
5. Objection we address (what the smart reader is already thinking)
6. Action or takeaway (what changes tomorrow?)

For each beat, give me ONE example or detail to include — the specific tool, person, number, or moment.

Rules:
- No three-act filler. No "let's define X first" unless it's genuinely contested.
- If the topic is thin (no stakes, no concrete example), tell me — don't pad an outline around a weak idea.
```

**Why this works:** the explicit "if the piece isn't ready, tell me" permission means the model can kill a weak idea at outline stage instead of helping you waste 3 hours drafting something that was never going to land.

---

## Next week

Week 5: **Code Review Co-pilot** — 5 prompts for diff-explaining, finding risky lines, writing the missing tests, and generating clean changelogs.

— AI Pulse
