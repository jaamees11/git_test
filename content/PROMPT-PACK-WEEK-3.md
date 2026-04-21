# Prompt Pack #3 — Deep Research

> Ships Friday of week 3. For founders, analysts, students — anyone who
> has to go from "I need to understand X" to "I know enough to act" fast.

---

**Subject:** prompt pack: 5 prompts for better, faster research

**Subtitle:** Turn 10 sources into a brief. Find your own blind spots. Stop spiraling.

---

*Week 3 Prompt Pack. These are the prompts I use before every hard decision — building a company, buying software, interviewing a new hire.*

---

## 1. The 3-competitor compare

```
You produce rigorous competitive comparisons. You do not editorialize.

Compare these competitors on the criteria below:
Competitors: {{competitor_1}}, {{competitor_2}}, {{competitor_3}}
Criteria: {{criterion_1}}, {{criterion_2}}, {{criterion_3}}

For each criterion, produce:

| Criterion | {{comp_1}} | {{comp_2}} | {{comp_3}} |
|---|---|---|---|

Rules:
- Cite the source for every factual claim (URL or "from publicly available info, as of {{date}}")
- If data is missing for one competitor on one criterion, say "Not published" — do NOT guess
- After the table, give me one paragraph: "If I had to pick for {{use_case}}, I'd go with X because Y"

Length: table + one paragraph. No intro. No "in conclusion".
```

**Why this works:** the "Not published" escape hatch prevents hallucinated pricing/features, which is the #1 failure mode of comparison prompts.

---

## 2. The 10-source synthesizer

```
You synthesize many sources into a briefing.

Sources (each is a URL, paper, or pasted text):
{{source_1}}
{{source_2}}
...
{{source_10}}

Topic of interest: {{what_im_trying_to_understand}}

Produce a brief with:

**Consensus (90%+ of sources agree):**
- bullet 1
- bullet 2
- bullet 3

**Active debate (sources disagree):**
- Point of disagreement — who says what, why

**Outliers / weak evidence:**
- Claims in only 1-2 sources; flag for "do not rely on without verification"

**Citations:**
Every claim above maps to [source N] inline.

Length: under 500 words. Use plain English, not academic voice.
```

**Why this works:** separating consensus from debate from outliers stops the model from presenting a contested claim as settled fact.

---

## 3. The counter-argument generator

```
You are a sharp, respectful critic. Your job is to argue AGAINST my hypothesis.

My hypothesis: {{your_current_belief}}
Context: {{why_i_believe_this}}

Produce:

**3 strongest counter-arguments:**
For each:
1. The argument (1-2 sentences)
2. What evidence would support this counter (what would I see in the world if the counter is right?)
3. What evidence would kill this counter (what would convince you to drop this argument?)

**1 lazy counter-argument I'd dismiss:**
<one weak counter-argument so I can feel better about my hypothesis>

Tone: rigorous but not hostile. You're helping me pressure-test, not win an argument.
```

**Why this works:** the "what would kill this counter" requirement forces the model to be falsifiable rather than generically skeptical. The "lazy counter" at the end is a little humor that keeps the output from feeling like an attack.

---

## 4. The jargon translator

```
You turn jargon-heavy content into plain bullets.

Source: {{paper_or_article_text}}
Audience: someone smart but not a specialist in {{field}}

Produce:

**What it says (5 bullets, ≤ 15 words each):**
- ...
- ...

**What it means for a non-specialist (2 bullets):**
- ...
- ...

**What to ignore (optional):**
- List any sections that look important but are actually boilerplate / method detail that doesn't change the takeaway

Rules:
- Translate every technical term on first use, inline
- Use concrete examples, not abstract "this framework provides..."
- If the source is genuinely unclear, say so — don't paper over it
```

**Why this works:** the "what to ignore" step is where the real compression happens. Most summarization prompts try to honor everything in the source; this one explicitly permits cutting.

---

## 5. The research plan builder

```
You build research plans before I start digging, so I don't spiral.

I need to understand: {{topic_or_decision}}
Deadline: {{time_available}}
My current knowledge level: {{beginner | some experience | expert-adjacent}}

Produce:

**Goal of this research (one sentence):**
What specific question are we answering? What decision does it inform?

**Definition of "enough":**
When can I stop researching? What would I know that would let me confidently decide/act?

**Sources to check (in priority order):**
1. <source> — why it matters, how long to read
2. ...
(Include a mix of primary sources, expert commentary, skeptics, and lived experience. Budget < deadline.)

**Questions to answer:**
3-5 specific questions I should be able to answer when done.

**Traps to avoid:**
- Tangents that feel productive but don't move the goal
- Reading ONE more source when I already have enough

Rules:
- Total estimated time should be under {{time_available}}
- Flag any sources that cost money unless I said I'd pay
```

**Why this works:** the "definition of enough" is the single most useful output here — it turns "research" from an infinite scroll into a bounded task.

---

## Next week

Week 4: **Writing on Rails** — 5 prompts for tightening drafts, generating 10 hook variations, and auditing your own hype-language habits.

— AI Pulse
