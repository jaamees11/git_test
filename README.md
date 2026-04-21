# AI Pulse

A **freemium AI newsletter** that scrapes the day's biggest AI launches and
news, rewrites blurbs, and drops a **draft** into Beehiiv for one-click send.

Two modes — you pick per issue:

| Mode | Who writes blurbs | Cost | Best for |
|---|---|---|---|
| **Claude-in-session** (recommended) | Claude Pro/Max (you prompt me in Claude Code) | $0 | Weekly high-quality issues |
| **Fully automated** | Gemini/Groq free tier via GitHub Actions cron | $0 | Daily autopilot when you're away |

Both can coexist. Run the manual flow when you want Claude-quality copy; let
the cron handle backfill days.

- **Scrape sources**: RSS (Anthropic, OpenAI, DeepMind, HF, arXiv, TC, Verge…),
  Hacker News, GitHub Trending, Product Hunt
- **Monetization**: Beehiiv paid tiers + Boosts + affiliate links
- **Free SEO traffic**: every issue auto-publishes to a GitHub Pages archive

---

## One-time setup (~20 minutes)

### 1. Create a Beehiiv publication
1. Sign up at <https://www.beehiiv.com>.
2. Create a publication (name it whatever — e.g. "AI Pulse").
3. Go to **Settings → Integrations → API** and click **Create API Key**.
   - Copy the key. You'll paste it into GitHub Secrets below.
4. Find your **Publication ID**: Settings → Integrations → API shows it, or grab
   it from the URL when editing a post (`pub_...`).
5. (Later, when you're ready to charge) Settings → Paid Subscriptions → connect
   Stripe. Set a tier like $9/mo. Don't enable it on day one — build list first.

### 2. Get a free Gemini API key (primary rewriter)
1. Go to <https://aistudio.google.com/apikey>.
2. Click **Create API key** → pick any Google Cloud project (or the default).
3. Copy the key. Free tier = 1,500 requests/day, which is plenty.

### 3. Get a free Groq API key (backup rewriter)
1. Go to <https://console.groq.com/keys>.
2. Sign in → **Create API Key** → copy it.
3. Free tier = generous daily limits on Llama 3.3 70B.

### 4. Add secrets to this GitHub repo
Go to **Settings → Secrets and variables → Actions → New repository secret**
and add these four:

| Name | Value |
|---|---|
| `BEEHIIV_API_KEY` | from step 1 |
| `BEEHIIV_PUBLICATION_ID` | from step 1 (looks like `pub_xxxxxxxx-xxxx-...`) |
| `GEMINI_API_KEY` | from step 2 |
| `GROQ_API_KEY` | from step 3 |

### 5. Turn on the workflow
1. Go to the **Actions** tab in this repo.
2. Enable workflows if prompted.
3. Find **AI Pulse — build & publish draft** → **Run workflow** (manual) to
   smoke-test it. First run should produce a draft in your Beehiiv dashboard.
4. After that, the cron runs every day at 06:30 UTC. Change the schedule in
   `.github/workflows/publish.yml` if you want a different time.

---

## Mode 1 — Claude-in-session (recommended for weekly issues)

This is how you use your existing Claude Pro/Max subscription to ship issues
without paying for any LLM APIs. The full playbook is in
[`CLAUDE.md`](./CLAUDE.md) — any Claude Code session reads it automatically.

**Your workflow (~10 min/week):**
1. Open Claude Code in this repo.
2. Say: *"Ship this week's AI Pulse issue"*.
3. Claude will:
   - Run `python -m pipeline.run --collect-only` (scrape + rank + dedupe)
   - Read the draft JSON (~30 items)
   - Rewrite each blurb in this conversation (sharp, skimmable, no hype)
   - Run `python -m pipeline.run --from-json .cache/draft-issue-latest.json`
   - Update the static archive, generate share snippets, create a Beehiiv draft
   - Commit & push the archive update
4. Open Beehiiv → review → hit **Send**.
5. Paste the 3 share snippets (X/LinkedIn/Reddit) from `.cache/share-*.md`.

## Mode 2 — Fully automated cron (backstop)

GitHub Actions runs at 06:30 UTC daily, uses Gemini/Groq free tier to rewrite,
and creates a Beehiiv draft. You get a notification, open Beehiiv, hit Send.

Useful when you're away or don't want to write that day. Requires the `GEMINI_API_KEY`
and `GROQ_API_KEY` secrets (both free). Without them, it falls back to extractive
summarization — still ships, slightly drier copy.

**Want true zero-touch?** Beehiiv supports scheduled auto-send from drafts; you
can also change `"status": "draft"` to `"status": "confirmed"` in
`pipeline/publisher/beehiiv_client.py` once you trust the output.

---

## Run it locally

```bash
pip install -r requirements.txt

# Collect-only: scrape + rank + write draft JSON you (or Claude) can edit
python -m pipeline.run --collect-only
# → writes .cache/draft-issue-latest.json

# Publish from an edited draft (skip scraping + rewriting)
python -m pipeline.run --from-json .cache/draft-issue-latest.json --dry-run

# Fully automated dry run (uses free-tier LLMs or extractive fallback)
python -m pipeline.run --dry-run

# Full automated run — requires Beehiiv env vars
export BEEHIIV_API_KEY=...
export BEEHIIV_PUBLICATION_ID=...
python -m pipeline.run
```

Output previews end up in `.cache/issue-YYYYMMDD-HHMM.html` and `.json`.

---

## Tuning the newsletter

Everything you'll want to change is in `config/`:

- **`config/feeds.yaml`** — RSS sources, keyword boost/block lists, HN/PH/GH
  thresholds. Add/remove feeds here.
- **`config/style.yaml`** — newsletter name, tagline, voice, sections, paid
  teaser, and the LLM rewrite prompt. Change "AI Pulse" to your brand.

No code changes needed for tuning.

---

## Project structure

```
.
├── .github/workflows/
│   ├── publish.yml                 # daily news digest + Pages deploy (06:30 UTC)
│   ├── prompt_pack.yml             # weekly paid Prompt Pack (Fri 14:00 UTC)
│   └── test.yml                    # CI: pytest on every push
├── config/
│   ├── feeds.yaml                  # sources + keyword rules
│   ├── style.yaml                  # branding + rewrite prompt
│   ├── affiliates.yaml             # affiliate program codes
│   └── prompt_pack.yaml            # paid-tier theme rotation + prompt
├── pipeline/
│   ├── run.py                      # daily orchestrator
│   ├── prompt_pack.py              # weekly Prompt Pack generator
│   ├── models.py                   # Item dataclass
│   ├── utils.py                    # logging, yaml, helpers
│   ├── scrapers/
│   │   ├── rss_feeds.py
│   │   ├── hackernews.py           # HN Algolia
│   │   ├── github_trending.py      # HTML scrape (no API)
│   │   ├── product_hunt.py         # HTML scrape (no API)
│   │   └── ranker.py               # dedupe + score
│   ├── rewriter/
│   │   ├── llm_clients.py          # Gemini → Groq → None
│   │   ├── extractive.py           # zero-API fallback
│   │   └── rewrite.py              # orchestrates rewriting
│   ├── publisher/
│   │   ├── renderer.py             # sections → HTML email
│   │   ├── subject.py              # data-driven subject lines
│   │   ├── affiliates.py           # auto-injects ?ref= codes
│   │   └── beehiiv_client.py       # creates draft post
│   ├── site/
│   │   └── render.py               # static archive → GitHub Pages
│   └── social/
│       └── snippets.py             # X/LinkedIn/Reddit share text
├── CLAUDE.md                       # session playbook for Claude Code
├── tests/                          # pytest suite (36 tests)
├── requirements.txt
└── README.md
```

---

## Public archive site (free SEO traffic engine)

Each daily issue is also rendered as a static page and published to GitHub
Pages. Over time this becomes a long-tail traffic source — Google indexes every
issue, each page has a subscribe CTA, RSS, and JSON-LD structured data.

**One-time setup (5 min):**

1. Repo → **Settings → Pages** → set Source to **GitHub Actions**.
2. Repo → **Settings → Secrets and variables → Actions → Variables tab** → add
   these **repository variables** (not secrets):
   - `SITE_URL` = `https://<your-username>.github.io/git_test` (or your custom
     domain)
   - `SUBSCRIBE_URL` = your Beehiiv subscribe page URL
     (e.g. `https://aipulse.beehiiv.com/subscribe`)
   - `TWITTER_HANDLE` = your X handle without the @ (optional)
3. Run the daily workflow once. After it finishes, the deploy-pages job
   publishes the archive to your `SITE_URL`.

The archive carries forward across runs (the previous build is restored before
the new issue is added). After 30 days you'll have ~30 indexed pages of
high-intent content.

## Share snippets (paste-and-post growth)

Every daily run also writes three Markdown files to `.cache/`:

```
.cache/share-x-YYYYMMDD-HHMM.md          # X/Twitter (≤270 chars)
.cache/share-linkedin-YYYYMMDD-HHMM.md   # LinkedIn (3-5 bullets + CTA)
.cache/share-reddit-YYYYMMDD-HHMM.md     # Reddit title + body + suggested subs
```

These are uploaded as a workflow artifact each day. Open the run, download the
artifact, and paste each one into the relevant platform. Takes about 2 min/day
and is the fastest way to grow from 0 → 500 subs.

(Why not auto-post? X charges $100/mo for the basic API; manual posting is more
reliable for the first few hundred subs anyway. We can switch to automated
posting later via the LinkedIn/Reddit free APIs once you've validated.)

## Affiliate links (passive revenue layer)

Open `config/affiliates.yaml` and add a row each time you sign up for an
affiliate program (Perplexity, ElevenLabs, Notion, Beehiiv-meta, etc.). The
publisher auto-appends your tracking param to any outbound link whose host
matches. No code changes needed — examples are commented in the file.

## Weekly Prompt Pack (paid-tier content)

`pipeline/prompt_pack.py` runs every Friday via
`.github/workflows/prompt_pack.yml`. It rotates through 5 themes (Inbox triage,
Meeting alchemy, Deep research, Writing on rails, Code review co-pilot) and
generates 5 paste-ready prompts per issue using the same free-tier LLM stack.

Once you flip on the Beehiiv paid tier, mark this post as paid-only in the
Beehiiv UI (or set the post audience via API). Subscribers who don't pay see
a teaser; payers see the full pack.

## Roadmap (cheap wins, in order)

1. **Growth**: enable Beehiiv Boosts (paid cross-promo, revenue-positive).
2. **Affiliates**: fill in `config/affiliates.yaml` with your codes — instant
   passive revenue from existing newsletter clicks.
3. **Searchable archive**: Beehiiv has this built-in — gate it to paid tier.
4. **Flip on paid tier** once you hit ~500 subs. At 3–5% conversion that's
   $135–225/mo; grows linearly from there.

---

## Costs

| Phase | Subs | Monthly cost |
|---|---|---|
| Launch | 0–2,500 | **$0** |
| Growth | 2,500–10k | $39 (Beehiiv Scale) |
| Scale | 10k+ | $79+ (Beehiiv Max) |

Break-even on Beehiiv Scale: ~5 paid subs. Easy target.

---

## Troubleshooting

- **Draft didn't appear in Beehiiv**: check the Actions run logs. 401 = bad key;
  404 = wrong publication ID; 422 = Beehiiv rejected content (often fixable by
  shortening or re-running).
- **Blurbs look dry**: you're probably hitting the extractive fallback. Verify
  `GEMINI_API_KEY` is set in Secrets and hasn't hit the daily quota.
- **Scrape returns nothing**: sites change HTML. Run `python -m pipeline.scrapers.product_hunt`
  to debug individually. RSS + HN are the most stable sources.
