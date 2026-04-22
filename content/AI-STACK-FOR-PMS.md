# AI Stack for Product Managers

> The first "AI Stack for [role]" deep-dive. Ships as a paid-tier bonus
> issue in month 2 (or sooner if the list is asking for it). Roughly 1500
> words, reader time ~6 minutes.
>
> This format is the paid tier's biggest retention hook: most newsletters
> don't do role-specific deep dives. If this one lands, plan one per
> quarter: PMs, then founders, then marketers, then devs.

---

**Subject:** the AI stack for PMs (what actually works, not what's hot)

**Subtitle:** The 6 tools I'd pay for. The 3 I'd skip. What to try first.

---

*Paid subscribers get quarterly "AI Stack for [role]" deep-dives. This is the first one. Next up: Founders (Q2), Marketers (Q3), Devs (Q4).*

---

You're a PM. You ship features, not hype. Most "AI for PMs" content is written by marketers who've never owned a roadmap.

Here's the actual stack — the 6 tools I'd recommend to a PM starting fresh today, in priority order, with honest pricing and the PM-specific use cases each one earns its slot on.

Total monthly cost of the stack: **$54**.

---

## 1. Claude (Anthropic) — $20/mo Pro

**PM use case:** Your writing partner and thinking partner. Not your assistant.

Where Claude actually changes your week:

- **PRDs in 30 min instead of 3 hours.** Paste a Slack thread, a Loom transcript, a rough outline — get back a structured PRD you'd have written yourself after 3 rewrites. Claude's structure instinct is the best of any model for PM work.
- **Customer feedback → themes.** Paste 20 support tickets or 15 user interview transcripts. Ask for themes with quotes as evidence. You'll find patterns that you'd have missed and spent a week "doing research" to find.
- **Pre-meeting briefs.** Paste the last 3 meetings' notes + the upcoming meeting's goal. Get a 1-page brief with the open questions, previous decisions, and the 2–3 things you should say. Makes you look like you prepared for 2 hours in 10 minutes.

**Skip if:** You only write in Google Docs and never copy-paste. Claude's power comes from pasted context; without that, ChatGPT's ecosystem (GPTs, integrations) can be better.

**Free alternative:** Claude free tier gets you maybe 10 messages before rate-limiting. Enough to try — not enough to replace the Pro version.

---

## 2. Granola — $14/mo

**PM use case:** Automatic meeting notes that don't suck.

Granola listens via laptop audio, transcribes, and generates structured notes *in your voice* (you train it with your first few notes). For PMs who live in Zoom/Meet/Teams all day, this is the single highest-ROI tool on the list.

What makes it better than Otter, Fireflies, Fathom for PM work specifically:

- **It understands product context.** After a week of use, it knows what your product is, who your team is, and what a user story vs a bug vs a one-off complaint looks like.
- **The notes are structured for action, not for recall.** Decisions, action items, parking lot — not a linear transcript you have to skim.
- **Private by default.** No bots joining the call; no "Granola is transcribing this meeting" notification to awkwardly explain to your CEO.

**Skip if:** Your company bans third-party transcription tools (increasingly common at larger shops). Also skip if you're mostly in async-only roles — the ROI collapses if you're in < 5 hrs/week of calls.

**Alternative:** Fathom (free tier; Zoom/Meet only). Nearly as good for solo PMs.

---

## 3. Perplexity — $20/mo Pro (or $0 on the free tier if you're cheap)

**PM use case:** Replaces 80% of your research Google-ing.

The specific PM moments Perplexity wins:

- **Competitive landscaping.** "Who are the top 5 competitors to [X] and what's each one's positioning?" — gets you a citation-backed answer in 30 seconds. Refine with "and their pricing" or "and their most-complained-about features."
- **Industry benchmarks.** "What's the typical conversion rate from free-to-paid for B2B SaaS at $10/mo?" — you get actual data with sources, not someone's Medium post.
- **Technical understanding.** PMs who are "not technical enough" can bootstrap to "technical enough" fast. "Explain webhooks in a way that helps me scope an API integration" gets you an answer an engineer won't roll their eyes at.

The Pro version's value over the free tier: you get access to GPT-4 / Claude-backed deep-research mode, which is noticeably better for multi-step research questions.

**Skip if:** You already pay for ChatGPT Pro or Claude Pro AND you use their web search aggressively. You're doing the same job twice.

**Free alternative:** Perplexity free. Limited queries per day; plenty for light use.

---

## 4. Notion AI — $10/mo add-on (if you already use Notion)

**PM use case:** Inline AI inside the doc you're already writing. Not a separate tool.

Notion AI is worse than Claude at almost everything, *except*: it's already inside your PRDs, roadmaps, meeting notes, and specs. That friction saving matters daily.

What PMs actually use it for:

- **"Summarize this page"** on a long discussion doc — one click.
- **"Turn these bullet notes into a paragraph"** for the exec summary.
- **"Find action items in this page"** — extracts them to a database you can assign.
- **"Translate this to [language]"** — if you have an international team.

**Skip if:** You're not on Notion. Don't switch just for the AI; the AI's mediocrity isn't worth the migration cost.

**Alternative:** If you're on Linear, Atlassian, or Coda — those have their own AI layers. Pick the one inside the doc tool you actually use.

---

## 5. Cursor — $20/mo (or your eng team can comp you)

**PM use case:** Prototyping. Reading code. Writing small scripts for data work.

Most PMs aren't expected to code. But the *posture* of occasionally shipping a working prototype or reading a PR thoughtfully radically changes how you're perceived internally. Cursor is the fastest way to do both.

What a PM actually does with Cursor:

- **Build a prototype of the feature you're pitching.** 2 hours of Cursor gets you a working v0 that makes stakeholder meetings 10x more concrete. "Here's what I mean" beats "imagine if..."
- **Read a PR before standup.** Ask Cursor "what does this diff do, and what's risky about it?" — you'll ask better questions and stop being the person engineers route around.
- **Quick data scripts.** "Read this CSV of user data, group by plan tier, show me churn by month." One query, answer in seconds. Much better than filing a ticket to the analytics team.

**Skip if:** You're strictly managing up, managing stakeholders, or in a role where "the PM codes" triggers eye-rolls. Check your culture first. At some companies, this is a superpower; at others, it's a liability.

**Free alternative:** Claude Code (uses your Claude Pro subscription — free if you have Pro already). Less of a visual IDE, more terminal-native. Same end result for most PM tasks.

---

## 6. ElevenLabs — $5/mo Hobby tier

**PM use case:** Voice memos and async updates that your team actually watches.

This is the stealth MVP tool on the list. Most PMs ignore it.

Here's what it unlocks:

- **Weekly async updates in your voice.** Record a 2-minute voice memo on your phone walking through the week's priorities. Run through ElevenLabs to clean audio (no ums, no car noise). Post in Slack. 3x higher watch-rate than your written Monday update.
- **Fast user research debriefs.** You just did a 30-min user call. Record a 90-second voice debrief while it's fresh. Team listens on 1.5x in the gym. Retention is massively better than reading a bullet-point Slack post.
- **Podcast episodes as a side-thing.** Record once, clean up with ElevenLabs, ship. Great personal brand play for PMs who want to be known in their industry.

**Skip if:** You genuinely hate your own voice. (Then pay someone on Fiverr $15 to re-read your scripts in their voice. That's also a thing.)

---

## What to try first

Don't buy all 6 tomorrow. Here's the ramp:

**Week 1:** Claude Pro ($20/mo). Learn to paste context aggressively. Write one PRD with it; write one exec email with it; do one user-research synthesis with it. If this doesn't save you 3 hours in week 1, cancel.

**Week 2:** Granola (free trial for 7 days). Put it on every meeting. Compare your post-meeting note quality to last week's. If it's obviously better, keep it.

**Week 3:** Perplexity free tier first. Use it for 3 days instead of Google. Upgrade to Pro only if you run out of queries.

**Weeks 4+:** Add Cursor or Notion AI based on your actual workflow. Skip ElevenLabs until you're genuinely making async updates weekly.

Total if you stop here: **$34/mo** (Claude + Granola + Perplexity Pro).

Most PMs I know settle on this exact stack after experimenting for a month.

---

## The 3 tools I'd skip (despite the hype)

**1. ChatGPT Team ($25/user/mo)** — The team-collaboration features are real but under-used by PM teams specifically. You're better off with individual Claude/ChatGPT Pro subs and a shared prompt library in Notion.

**2. Jasper / Copy.ai / any "AI writer"** — These are for marketers writing blog posts at scale. PM writing is high-stakes, low-volume, and voice-sensitive. Claude is strictly better.

**3. "AI product management" SaaS tools** (Aha! AI, Roadmunk AI, Productboard AI, etc.) — These bolt AI onto PM tools you already pay for. The AI layer is thin. If your company already has the base tool, the AI add-on is probably fine; don't switch tools just for the AI.

---

## What's next

Q2 deep-dive: **AI Stack for Founders.** The 7 tools I'd recommend to someone building a company alone, with honest costs and the founder-specific moments each one earns its slot on.

If you want me to cover a specific role or use case next, reply to this email. Paid subs get priority on the queue.

— AI Pulse

---

## About this series

AI Stack deep-dives ship every 3 months to paid subscribers. Each one is
role-specific (PMs, Founders, Marketers, Devs, Analysts) and is updated
yearly. This format is intentionally the opposite of generic "top 10 AI
tools" lists — role-specific, honest about tradeoffs, priced to fit real
budgets.

Your regular daily AI Pulse issue keeps coming in parallel.
