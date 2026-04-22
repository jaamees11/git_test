# Content pack — ready-to-paste assets

Everything in this folder is **human-written copy** ready to paste into
Beehiiv, social platforms, or your Stripe product descriptions. No code.

## When you're home, read in this order

### 🟢 Start here (setup + launch)

1. **[`PRE-LAUNCH-CHECKLIST.md`](./PRE-LAUNCH-CHECKLIST.md)** — one-page
   to-do list to get from "I just signed up for Beehiiv" to "first issue
   shipped". Do this first.
2. **[`SAMPLE-ISSUE.md`](./SAMPLE-ISSUE.md)** — what a real AI Pulse issue
   looks like, in the real voice. Open `SAMPLE-ISSUE.html` in a browser for
   the rendered version.
3. **[`WELCOME-SERIES.md`](./WELCOME-SERIES.md)** — three onboarding emails
   to paste into Beehiiv Automations.

### 🚀 Launch day + first 30 days

4. **[`30-DAY-PLAYBOOK.md`](./30-DAY-PLAYBOOK.md)** — day-by-day growth
   plan. The single most important file for preventing launch momentum
   stall.
5. **[`SOCIAL-CALENDAR-30-DAYS.md`](./SOCIAL-CALENDAR-30-DAYS.md)** —
   paste-ready X + LinkedIn posts for every day of the first month. Pairs
   with the playbook.
6. **[`FIRST-100-OUTREACH.md`](./FIRST-100-OUTREACH.md)** — DM/text scripts
   for asking friends, family, and colleagues to subscribe. 80% conversion.
7. **[`launch/LAUNCH-X-THREAD.md`](./launch/LAUNCH-X-THREAD.md)** — 8-tweet
   launch thread, pin on day 1.
8. **[`launch/LAUNCH-LINKEDIN.md`](./launch/LAUNCH-LINKEDIN.md)** — LinkedIn
   launch post + two variants for follow-ups.
9. **[`launch/LAUNCH-REDDIT.md`](./launch/LAUNCH-REDDIT.md)** — Reddit
   strategy with which subs, what to post, what to avoid (no bans).
10. **[`launch/BOOST-OUTREACH.md`](./launch/BOOST-OUTREACH.md)** — DM + email
    templates for cross-promo swaps with other newsletter creators.

### 💎 Content runway (first 3 months written)

11. **[`PROMPT-PACK-WEEK-1.md`](./PROMPT-PACK-WEEK-1.md)** — Inbox Triage.
12. **[`PROMPT-PACK-WEEK-2.md`](./PROMPT-PACK-WEEK-2.md)** — Meeting Alchemy.
13. **[`PROMPT-PACK-WEEK-3.md`](./PROMPT-PACK-WEEK-3.md)** — Deep Research.
14. **[`PROMPT-PACK-WEEK-4.md`](./PROMPT-PACK-WEEK-4.md)** — Writing on Rails.
15. **[`PROMPT-PACK-WEEK-5.md`](./PROMPT-PACK-WEEK-5.md)** — Code Review.
    Completes the 5-theme rotation.
16. **[`AI-STACK-FOR-PMS.md`](./AI-STACK-FOR-PMS.md)** — first quarterly
    paid-tier deep-dive (Q1 bonus).
17. **[`AI-STACK-FOR-FOUNDERS.md`](./AI-STACK-FOR-FOUNDERS.md)** — second
    quarterly paid-tier deep-dive (Q2 bonus).
18. **[`12-WEEK-EDITORIAL-CALENDAR.md`](./12-WEEK-EDITORIAL-CALENDAR.md)** —
    quarterly editorial plan so you always know what's next.

### 📈 Growth levers (ship when ready)

19. **[`LEAD-MAGNET.md`](./LEAD-MAGNET.md)** — "AI Tools Master List 2026"
    — the gated signup asset you share on social.
20. **[`PAID-TIER-LAUNCH.md`](./PAID-TIER-LAUNCH.md)** — email to send when
    you flip on paid subscriptions (~500 subs from now).
21. **[`COMPETITIVE-LANDSCAPE.md`](./COMPETITIVE-LANDSCAPE.md)** — market
    benchmarks, pricing conventions, realistic revenue trajectories.

---

## Slash commands in Claude Code

Type these in any Claude Code session from this repo:

| Command | What I do |
|---|---|
| `/new-issue` | Run the full daily issue flow: scrape → rewrite → publish draft |
| `/prompt-pack` | Ship this week's Prompt Pack (Fridays) |
| `/test-run` | Smoke-test the pipeline (dry run, no Beehiiv post) |
| `/growth-check` | Compare your current numbers to the 30-day playbook |
| `/social-kit` | Generate today's X/LinkedIn/Reddit posts |

Commands live in `.claude/commands/*.md`. Edit them to change what I do.

---

## Why so much content?

You said: **"do whatever you think will be most likely into growing a
successful audience."**

My highest-confidence bet: **launch velocity in the first 30 days accounts
for ~70% of the gap between newsletters that succeed and newsletters that
plateau.** Most newsletters don't die because the content is bad — they
die because momentum stalls by day 7 and never returns.

So I front-loaded everything you need:
- **The launch blast kit** (X thread, LinkedIn post, Reddit strategy, friends-&-family scripts)
- **A day-by-day playbook** so "what do I do today" is never a question
- **30 days of social content** already written — pair it with the playbook
- **5 Prompt Packs** + **2 role-specific deep-dives** = ~12 weeks of Friday content ready
- **A 12-week editorial calendar** showing the interplay between daily, weekly, monthly, and quarterly
- **Growth infrastructure** (UTM tracking, cross-promo templates, slash commands) so every channel is instrumented

Realistic day-30 outcome if you execute: **150–400 subs, 55–70% open rate,
5–10 creator-network relationships, 12+ weeks of content reservoir.**

---

## Not in this folder (but worth knowing about)

- **Code pipeline:** `../pipeline/` — the actual scraping + publishing engine
- **Style config:** `../config/style.yaml` — newsletter name/voice/sections
- **Affiliate + UTM config:** `../config/affiliates.yaml` — affiliate programs
  and UTM tracking (now auto-applied to every outbound link)
- **Session playbook:** `../CLAUDE.md` — what any Claude Code session does
  when you say "ship the issue"
- **Slash commands:** `../.claude/commands/` — the five slash commands above
- **Main README:** `../README.md` — full repo docs including both run modes

## Voice tweaks

If anything reads in a voice you don't like, tell me what to change — all
of this is ~15 min to rewrite across the board. The voice in every asset
matches `config/style.yaml` so a global tone change is a single find-and-
replace.
