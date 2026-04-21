# Boost Exchange & Cross-Promo Outreach

> Beehiiv Boosts let other newsletters pay you to cross-promote (up to
> $3–5 per subscriber). But the *free* version — direct trades with other
> creators — is actually faster to set up and more effective for the first
> 1–5k subs.
>
> The idea: you promote their newsletter in your email, they promote yours
> in theirs. Each of you gets ~3–8% of the other's active readers.
>
> Below are templates for both.

---

## Free cross-promo swaps (do these first, start week 2 post-launch)

### Who to reach out to

Target newsletters with **similar size to yours** (±50%). Don't ask big
newsletters to promote you for free — they won't. But a 500-sub AI writer
and a 600-sub AI writer trading audiences is fair and works.

Where to find them:
- **Beehiiv Directory** (Grow → Boosts → Browse) — filter by AI / tech
- **Twitter/LinkedIn** — search "AI newsletter" and see who has 500–5k subs
- **SparkLoop recommendations** — shows newsletters open to trades
- **Reddit r/newsletters** — active community for trade requests

### Outreach DM template (Twitter/LinkedIn)

```
Hey {{name}} —

Big fan of {{newsletter_name}}. Your piece on {{specific_recent_issue}} was a genuinely rare take — most AI newsletters are just hype recaps.

I run AI Pulse (~{{your_sub_count}} subs, daily, same no-hype angle). 

Would you be open to a swap? I'd give you a featured slot in an upcoming Thursday issue + your subscribe link pinned. You do the same for me whenever timing works.

Zero pressure if it's not the right fit. Just thought the audiences would actually like each other.

— {{your_name}}
```

### Outreach email template (after you find their contact)

```
Subject: {{newsletter_name}} × AI Pulse — swap idea

Hey {{name}},

I've been reading {{newsletter_name}} for {{time_period}} and your take on {{recent_issue_topic}} was the sharpest thing I read that week.

I run AI Pulse — a daily 2-min AI digest with the same "no hype, no hedging" angle. We're at ~{{your_sub_count}} subs with a {{open_rate}}% open rate, tilted toward builders/PMs.

Proposing a simple cross-promo:
- I dedicate a featured slot in my Thursday issue to {{newsletter_name}}, with a tight 2-sentence endorsement in my voice.
- You do the same for AI Pulse whenever it works for you — no deadline.

No money exchanged, just audience trade.

Happy to send you a sample of how I'd format the endorsement before committing.

{{subscribe_url}}

— {{your_name}}
```

### What a good swap endorsement looks like

Inside your own newsletter, when promoting theirs:

```
---

**Worth subscribing to:** {{Newsletter Name}} by {{Creator Name}}

If you like AI Pulse's "just the signal" approach, {{Newsletter Name}} is cut from the same cloth — {{specific_angle_of_theirs}}. 

Their most recent issue on {{topic}} was the one I saved and re-read.

[Subscribe →]({{their_subscribe_url}})

---
```

Rules for the endorsement:
- Keep it to 3 sentences, max
- Specific, not generic — mention a recent issue or angle
- Use your own voice, not theirs — readers know the difference
- One swap per issue; never stack multiple swaps

---

## Beehiiv Boosts (paid — turn on around 2k subs)

Once you hit ~2k subs, Boosts becomes a real revenue+growth engine. Here's
the setup:

### Setting up Boosts on your end (you accept boosts FROM others)

1. Beehiiv → **Grow → Boosts**
2. Toggle **"I'm available to boost other newsletters"** on
3. Set **Price per qualified sub**: start at **$2.00** (middle of market)
4. Set **Max spend/mo**: $500 for the first month, adjust as needed
5. **Categories**: AI, Tech, Productivity, Business
6. **Minimum quality score**: 75 (Beehiiv's spam/engagement filter — keep
   this high)

What happens: other newsletters pay you to promote them in your "Who to
subscribe to next" block, which Beehiiv auto-inserts after your content.
You earn $2 per verified sub (someone who actually opens the confirmation
email). Fully passive.

### Sending boosts (you pay to be promoted IN other newsletters)

1. Beehiiv → **Grow → Boosts → Send Boosts**
2. Browse available newsletters
3. Filter: AI/tech, 10k+ subs, 40%+ open rate, $3 or less per sub
4. Send boost offers: start with $3/sub (competitive)
5. Budget: $300–500/mo for the first 3 months → expect 100–160 new subs

**CAC math:** At $3 per sub, a paid sub converting at 5% earns you back in
~7 months at $9/mo. That's good CAC for newsletter-land — break-even at
month 7, pure profit after. Don't overthink it.

### Best practices for Boosts

- **Only accept boosts that match your audience quality.** Crypto spam
  newsletters will offer $5/sub — refuse. Your unsub rate spikes.
- **Pause boosts 1 week before a paid-tier launch** — you want the
  existing audience warm, not diluted with brand-new curious clicks.
- **Track UTMs religiously** (code already adds them via
  `pipeline/publisher/affiliates.py`).

---

## Cold outreach template for newsletter creators you genuinely admire

This one's for when you want to build a genuine relationship, not just
swap subs. Goes out 3–6 months into running AI Pulse.

```
Subject: Quick question from one AI newsletter operator to another

Hey {{name}},

I run AI Pulse — a small daily digest (~{{sub_count}} subs) with a similar no-hype angle to {{their_newsletter}}. Not asking for a promo, just a genuine question:

What's the single tactic that most moved the needle for you between {{starting_sub_count}} and {{current_sub_count}}?

I've been iterating on (a) lead magnets, (b) Reddit resource posts, (c) LinkedIn commentary, and I'm not sure what to double down on. Curious what worked for you.

Happy to share my own numbers / what's worked / what's flopped if useful — builder-to-builder.

— {{your_name}}
{{your_newsletter}}: {{subscribe_url}}
```

Most creators will reply to this. ~10% will end up becoming collaborators,
cross-promoters, or friends in the space.

---

## Building a permanent "recommended by" section

Once you've done 3–5 swaps and found newsletters you'd genuinely recommend
to your readers forever, add a permanent "Recommended reading" section at
the bottom of every issue.

Format (goes into `config/style.yaml` under a new section):

```yaml
recommended_reading:
  - name: "Import AI"
    url: "https://importai.substack.com?ref=aipulse"
    blurb: "Jack Clark's weekly policy/tech crossover. Deeper than us."
  - name: "Latent Space"
    url: "https://latent.space?ref=aipulse"
    blurb: "swyx's podcast + posts. Best engineer-pragmatist angle."
```

Then in `pipeline/publisher/renderer.py`, I can add a small renderer block
for this. (Not coded yet — flagged for later.)

---

## Tracking which channel works

Every outbound link from AI Pulse should have UTMs so you can see what
converts. This is now handled automatically — see `pipeline/publisher/
affiliates.py` once the UTM patch lands (coming in this commit).

Typical UTM pattern:
- `utm_source=beehiiv`
- `utm_medium=newsletter`
- `utm_campaign=daily-issue-2026-04-21`

Plus hand-set tags for campaigns:
- Launch X thread: `utm_source=x&utm_medium=social&utm_campaign=launch-thread`
- Reddit posts: `utm_source=reddit&utm_medium=social&utm_campaign=r-sideproject`
- LinkedIn: `utm_source=linkedin&utm_medium=social&utm_campaign=launch-post`

Beehiiv shows these in **Analytics → Referrals → UTM Sources**.

---

## Outreach cadence

| Week | What to do |
|---|---|
| 1-2 post-launch | Nothing. Focus on your own launch + first issues. |
| 3-4 | 5 DMs to similar-sized AI newsletter creators. |
| 5-6 | First 2 swaps executed. Measure results. |
| 7-8 | 5 more DMs (slightly bigger creators now). |
| 9+ | Weekly: 2-3 outreach DMs, 1 swap executed. |
| 2k+ subs | Enable Beehiiv Boosts, both accepting + sending. |

Target state at 6 months: 2-3 active swap partners, Boost revenue of $200-500/mo
or equivalent in growth, and a network of ~15 creators you can text for advice.
