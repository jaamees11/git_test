# Reddit Launch Strategy

> Reddit is the single highest-leverage free-traffic channel for a new
> newsletter — but it's also the easiest place to get banned forever if
> you do it wrong. This playbook keeps you safe.
>
> Rule 1: **Reddit is not a billboard.** It's a community. You give value
> first, for a week, before posting anything about the newsletter.
>
> Rule 2: **Never link to your subscribe page in a post body.** Always
> link to the public archive or a specific archived issue. This reads as
> "sharing useful content," not self-promo.

---

## Phase 1 — Build reputation (days 1–7, BEFORE posting about AI Pulse)

Post 3 helpful comments per day across the subs below. Not replies to
your own questions — genuine contributions to other people's threads.
Share knowledge, answer questions, add value.

Goal: 100+ karma in each sub you plan to post in. Reddit's spam filters
auto-delete posts from accounts with no karma in a sub.

Subs to build rep in (in order of value for AI Pulse):

| Sub | Size | Why it matters | Self-promo rules |
|---|---|---|---|
| r/artificial | 1M+ | Biggest, general AI | 10% rule strictly enforced |
| r/LocalLLaMA | 500k+ | Open-source AI, very engaged | No self-promo for newsletters |
| r/MachineLearning | 3M+ | Research-heavy | Only papers/tools allowed |
| r/SideProject | 250k+ | Indie creators | Self-promo allowed (label it) |
| r/Entrepreneur | 3M+ | Broad, good for growth stories | Self-promo Saturdays |
| r/ChatGPT | 10M+ | Mass market | Very strict moderation |
| r/OpenAI | 2M+ | General user | Less strict than r/ChatGPT |
| r/Anthropic | ~50k | Claude community | Low volume, engaged |
| r/singularity | 3M+ | Speculation / news | Lenient on content |
| r/productivity | 3M+ | Tangential but AI-aware | Share personal results only |

---

## Phase 2 — The first real post (day 8+)

Don't launch with "I built a newsletter!" Launch with **a single valuable
resource** that happens to link back to you.

### Best first post: share the Lead Magnet

Post the "AI Tools Master List 2026" (from `content/LEAD-MAGNET.md`) to
the most relevant sub. Phrased as a community resource, not an ad.

**Subreddit:** r/SideProject (most forgiving for first post)

**Title options (pick one, A/B test others later):**
```
I maintain a list of 50 AI tools organized by job-to-be-done. Sharing because I keep getting DM'd for it.
```
```
The AI tools I actually use (as someone who ships). Organized by category, ~50 tools, updated monthly.
```
```
Free: The AI Tools Master List — 50 tools categorized by what they're actually best for. No affiliate links.
```

**Body:**
```
I got tired of people asking "which AI tool should I use for [X]" and having to reconstruct the answer each time. So I maintain a running list.

It's organized by what you're actually trying to do — coding, writing, research, design, agents, etc. — rather than "top 10 AI tools" which is useless.

Format: tool name, what it's best at, pricing tier.

Link: {{archive_url}}/master-list

If you've got a tool you'd add (especially open-source ones), drop it in the comments and I'll consider adding it to the next revision.

Not selling anything. No affiliate links. If you find it useful, there's a newsletter version that updates monthly, but you don't need to sign up to read the doc.
```

This works because:
- **Title is genuinely helpful**, not clickbait
- **First line acknowledges a real pain** (decision fatigue on tools)
- **Disclosure line** ("Not selling anything...") preempts moderator flags
- **Soft mention of newsletter** at the end, clearly labeled as optional

---

## Phase 3 — The weekly rhythm (after first post)

Once you've posted a helpful resource and it landed well, you can post a
daily-digest highlight once per week per sub, max.

### Template: "best thing I learned this week" post

**Title:**
```
5 AI things that actually shipped this week (no hype)
```

**Body:**
```
I curate a daily AI digest for myself and a few hundred others. Figured I'd share this week's best items in case useful:

1. **Mistral Large 3 open-sourced** — 140B MoE, Apache-2.0 on HF, matches GPT-4.1 on MMLU. ~25% cheaper to self-host than Llama 3.3 70B.

2. **Anthropic ships Claude Opus 4.7** — 1M-token context, 15% jump on long-context eval. $15/$75 in/out.

3. **[GitHub repo] awesome-agent-frameworks** — benchmarked comparison of 28 agent frameworks (AutoGen, CrewAI, LangGraph, etc.) by latency, cost, code size. Useful if you're picking a stack.

4. **[arXiv paper] "RAG is dead, long live long-context retrieval"** — Stanford paper arguing that at 1M+ context + caching, RAG adds latency for marginal quality gains.

5. **Perplexity launches Spaces** — shared team research context, persistent threads. $40/user/mo on Pro.

Full archive / subscribe if you want the daily version: {{archive_url}}

What did I miss this week?
```

This works because:
- **Specific items with real details** (model names, prices, numbers)
- **The "what did I miss" ending** invites engagement → more comments → more reach
- **Archive link, not subscribe link** — lets redditors decide

---

## Phase 4 — What to post in each specific sub

### r/artificial (most valuable, strictest)

- ✅ Weekly digest posts (Phase 3 template)
- ✅ Commentary on a single major release ("Thoughts on Claude Opus 4.7?")
- ❌ Never "I made a newsletter"
- ❌ Never direct subscribe link in body
- **Cadence:** 1 post / 2 weeks max, always with new content

### r/LocalLLaMA (dev-heavy, engaged)

- ✅ Share actual benchmark tables / prompt results
- ✅ Open-source tool spotlights
- ✅ "I automated X with local models" write-ups
- ❌ Anything promoting paid SaaS
- **Cadence:** 1 post / week if you're legitimately doing local-model stuff

### r/SideProject (most forgiving)

- ✅ Build-in-public updates ("Week 3: 500 subs, here's what I learned")
- ✅ Lead magnet shares
- ✅ Revenue updates once you're making money
- ✅ Post-mortems (failures are gold here)
- **Cadence:** 1 post / week, very OK to be promotional if formatted right

### r/Entrepreneur (broad, wary of spam)

- ✅ "I built this in a weekend" retros
- ✅ Revenue / traction milestones (50 subs, 500 subs, first sponsor)
- ✅ Only post Saturdays (self-promo Saturday is their rule — check pinned)
- **Cadence:** 1 post / month, quality over quantity

### r/ChatGPT + r/OpenAI (mass audience, very strict)

- ✅ Useful prompts (from your Prompt Packs)
- ✅ "I tested X prompt 50 times, here are the results"
- ❌ Newsletter mentions get nuked
- **Cadence:** only contribute via comments, don't post

---

## The nuclear rules

Things that'll get you banned from Reddit:

1. **Posting the same content in multiple subs same day.** The anti-spam
   filter sees this. Cross-post only sparingly (< 3 subs), 24h apart.
2. **Linking to your subscribe page from a post body.**
3. **Creating alt accounts to upvote your own posts.** Immediate permaban.
4. **Replying to a comment with a subscribe link.**
5. **Posting more than 10% of your activity as self-promo.** Even if each
   post is fine, the pattern gets you banned. Aim for 1:9 self-promo to
   community contribution.

---

## What to do when a post gets deleted

Every newsletter creator gets posts nuked. Don't argue with mods. Two
responses:

1. **DM the mod politely**, once: "Hey, saw my post got removed. I'm happy
   to reformat if there's something specific that flagged. Thanks for keeping
   the sub clean."
2. **Don't re-post for at least 30 days** in that sub. Try a different
   sub instead.

---

## Outcome expectations

A good Reddit post for a new newsletter drives ~20–100 subs per post.
A *great* one (rare) drives 500+. Over the first 90 days, expect Reddit
to contribute ~300–800 subs if you execute this playbook.

Small numbers, but these are high-intent signups — readers who came from
Reddit tend to open at 70%+ for the first month (vs ~50% for LinkedIn/X).

---

## Checklist

Before posting anywhere:
- [ ] Account is 30+ days old (Reddit filters newer accounts)
- [ ] You have 100+ karma in the sub (from the phase 1 comments)
- [ ] Title has a specific number, not vague
- [ ] Body leads with value, not the newsletter
- [ ] Link is to archive, not subscribe page
- [ ] Disclosure line present ("I run a newsletter that..." near end)
- [ ] Not cross-posted to more than 2 other subs
- [ ] Posted Tue-Thu, 8-10 AM ET or 6-8 PM ET
