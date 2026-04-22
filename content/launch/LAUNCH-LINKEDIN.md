# Launch Post — LinkedIn

> Post this the same day as the X thread, or 24 hours after (so you can
> engage with replies on both without splitting focus).
>
> **Why different from X:** LinkedIn favors longer posts with clear
> structure (line breaks matter), stories over tech, and outcomes over
> features. It also has almost no algorithmic punishment for links in the
> body (unlike X where links kill reach).
>
> Best time: **Tue/Wed 7:30–9 AM local**, when professionals check LinkedIn.
>
> Swap `{{subscribe_url}}` with your Beehiiv link.

---

## Main launch post

```
I got tired of spending 30 min/day scrolling AI Twitter to find the 5 things that actually shipped.

So I built a newsletter that does it for me.

It's called AI Pulse. Here's what happens every morning:

🔹 Python scrapers pull from Product Hunt, GitHub trending, Hacker News, arXiv, and every major AI lab's blog
🔹 A ranker scores ~200 items on signal vs noise
🔹 Dedupe collapses duplicate stories across sources
🔹 Rewriter turns each item into a 2-sentence blurb (no hype, no hedging)
🔹 Beehiiv sends a ~2-minute digest to my inbox

Total cost: $0/mo until 2,500 subscribers. GitHub Actions + free-tier LLMs.

Built it in a weekend and it's been running daily for the past {{N}} weeks.

What's different from the other 50+ AI newsletters out there?

Most AI newsletters are breathlessly bullish about every release. "Revolutionary." "Game-changing." "10x productivity."

AI Pulse is the opposite. It's the dry, pragmatic read — for builders, PMs, and curious pros who want the 2-min skim that tells them:
- What shipped
- What the actual numbers are
- What they can use today

Here's a real blurb from last week:

"Anthropic shipped Claude Opus 4.7 — 1M-token context, ~15% jump on long-context eval. Available in API and Claude Code today. $15/$75 per 1M tokens."

Not "Anthropic has announced the revolutionary new Claude 4.7 that promises to transform how developers engage with AI."

If you want the 2-min daily version of what actually matters in AI, it's free:
{{subscribe_url}}

(First 100 subs get the welcome series with my 3-tool AI stack that saved me ~5 hrs last week.)

---

One ask: if you've found yourself doom-scrolling AI news trying to figure out what's real, I'd love to hear what you'd want covered. Reply in the comments and I'll build it into upcoming issues.
```

---

## Variant — the "building in public" angle

Use this variant if the main post doesn't get traction, or if you want a second post a week later:

```
I spent a weekend building an AI newsletter pipeline that runs for $0/mo.

Here's exactly what's in it — in case you want to build your own, or you're curious how indie newsletters actually work:

**The stack**
→ Python + feedparser + httpx for scraping
→ BeautifulSoup for HTML sources (GitHub, Product Hunt)
→ GitHub Actions cron for scheduling (free)
→ Gemini 2.5 Flash free tier for rewriting (or Claude-in-the-loop)
→ Beehiiv for email + payments
→ GitHub Pages for a static archive (free SEO layer)

**The growth engine**
→ Free tier forever (low-friction signup)
→ Auto-generated share snippets for X/LinkedIn/Reddit every day
→ Gated lead magnet ("The AI Tools Master List 2026") for social traffic
→ Weekly Prompt Pack as a paid-tier hook
→ Beehiiv Boosts for cross-promo

**The economics**
→ $0/mo until 2,500 subs
→ Break-even at ~5 paid subs once paid tier flips on
→ Realistic 18-month: 30-60k subs, $10-20k/mo mixed revenue

Sounds like a lot. It's ~800 lines of Python + a config file.

I'll share the code eventually (still iterating), but the main insight isn't the code — it's this:

**You don't need a content team to run a newsletter. You need good curation, a sharp voice, and infrastructure that does 90% of the work on autopilot.**

If you want to see the output (not the code yet): {{subscribe_url}}

What would you add? What's missing?
```

---

## Variant — the "lessons learned" angle (post 2–3 weeks after launch)

```
2 weeks of running an AI newsletter. Some honest numbers:

→ 172 subs
→ 61% open rate
→ 4 unsubs (kindly)
→ 1 sponsor DM (declined, too early)
→ ~2 hours total writing time all week (automation handles the rest)

Things that worked:
• Publishing on LinkedIn + X same day, different angle
• A gated "AI Tools Master List" PDF that converts 4x vs "just subscribe"
• Replying to every single reader email (12 so far, all gold)
• Writing in a dry voice when every competitor is hype-drunk

Things that didn't work:
• Reddit posts in /r/artificial — flagged as self-promo within an hour
• Trying to "go viral" (nobody cares about small newsletter launches; just ship)
• Spending time on the logo (used Canva; it's fine)

What I'd do different:
• Start the welcome series from day one (not week 2)
• Set UTMs on every link from the first post
• Interview 5 readers in the first month, not try to guess

Next 2 weeks: flipping on paid tier at $9/mo once I hit 500. Then affiliate links. Then I stop touching it for a month and see what the automation alone does.

If you've run a newsletter from zero, I'd love to hear what the first 500 subs looked like for you — especially the mix of sources.

If you want to read the (free) thing: {{subscribe_url}}
```

---

## LinkedIn-specific tactics

1. **Line breaks matter.** LinkedIn condenses multi-paragraph posts into
   one wall of text if there are no breaks. Use double line breaks between
   thoughts. The formatting above already does this.

2. **The first 2 lines are everything.** They're what shows above the
   "...see more" fold. The hook "I got tired of spending 30 min/day..."
   is specifically crafted for this fold.

3. **Emoji bullets convert.** 🔹 🚀 → get ~30% more engagement than plain
   dashes on LinkedIn based on creator-reported data. Don't overdo (3-5 per
   post max).

4. **Links in the body are FINE on LinkedIn** (unlike X). Don't put them
   in the first comment just because "that's what X growth guys say."

5. **Reply to every comment in the first 60 min.** LinkedIn weights early
   engagement heavily.

6. **Mentions (@) work well.** If you reference a specific tool or company,
   tag them — can get you on their radar for potential sharing.

7. **Repost your own content 30 days later** — LinkedIn's algo treats a
   repost almost like a new post (X does not).

## What NOT to post

- "I'm so excited to announce..." — instant skip
- Long humblebrags about the journey
- "Agree? 👇" at the end — feels desperate
- Anything that starts with "Breaking:" unless it's actually breaking

## Photos / media

Adding an image boosts LinkedIn reach ~50% over plain text. Easiest move:
- Screenshot the SAMPLE-ISSUE.html rendered in your browser
- Crop to a nice 1200×627 aspect ratio
- Post it with the launch text

If you don't want to bother, plain text works fine.
