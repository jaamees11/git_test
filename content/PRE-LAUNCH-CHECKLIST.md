# Pre-Launch Checklist — for when you're home

One page. Do it in order. ~30–45 min total.

---

## Phase 1 — Beehiiv side (~15 min)

- [ ] **Publication name** set to `AI Pulse`
- [ ] **Tagline** set: `Your daily signal in the AI noise.`
- [ ] **Description** set (see `content/README.md` → copy from the "Profile
      details" section I sent earlier, or use `SAMPLE-ISSUE.md` for voice)
- [ ] **Logo** uploaded (square, 512×512). Easiest: Canva newsletter-logo
      template, wordmark "AI Pulse" in Inter Bold, accent `#0B5FFF`
- [ ] **Accent color** set to `#0B5FFF` in Beehiiv branding
- [ ] **Welcome automation** set up — paste the 3 emails from
      `content/WELCOME-SERIES.md` → activate
- [ ] **Subscribe page** copy set:
  - Headline: `The 5 AI things that matter today. In 2 minutes.`
  - Subhead: `Curated every morning from the labs, Product Hunt, GitHub,
    and arXiv — so you don't have to scroll for it.`
  - Button: `Subscribe — it's free →`
- [ ] **Copy your subscribe URL** (Grow → Subscribe Forms → Hosted link)
      — you'll need it in Phase 2

## Phase 2 — API keys + GitHub (~10 min)

- [ ] Beehiiv → Settings → Integrations → API → **Create API key** named
      `github-actions` with Posts: Write → **copy the key immediately**
- [ ] Copy your **Publication ID** from the same page (`pub_...`)
- [ ] Open repo on GitHub → **Settings → Secrets and variables → Actions**
      → **Secrets tab**
  - [ ] New secret: `BEEHIIV_API_KEY` = (the key you just copied)
  - [ ] New secret: `BEEHIIV_PUBLICATION_ID` = (the `pub_...` ID)
- [ ] Same page → **Variables tab**
  - [ ] New variable: `SUBSCRIBE_URL` = your Beehiiv subscribe URL
  - [ ] New variable: `SITE_URL` = `https://jaamees11.github.io/git_test`
        (or skip if you don't want the archive yet)
  - [ ] New variable: `TWITTER_HANDLE` = your X handle (no `@`) — skip
        if you don't have one yet

## Phase 3 — First test (~5 min)

- [ ] Open Claude Code in this repo
- [ ] Say: **"Do a smoke test of the AI Pulse pipeline"**
- [ ] I'll run `python -m pipeline.run --dry-run` and show you the preview
- [ ] If you like the quality → say: **"Now do it for real"** and I'll
      run without dry-run → draft appears in Beehiiv within ~2 min
- [ ] In Beehiiv → Posts → Drafts → open the draft → **Send test to
      yourself** first (button at the top) → verify inbox render
- [ ] Once happy, hit **Send** for real (or schedule for tomorrow morning)

## Phase 4 — First 5 subscribers (same day, ~5 min)

- [ ] **Subscribe yourself** with your main personal email
- [ ] Text 4 friends the subscribe link directly — one per day if you want
      to pace it. First 5 subs are psychologically the hardest; after that
      it compounds.

## Phase 5 — Once rolling (first week)

- [ ] Post the lead magnet (`content/LEAD-MAGNET.md`) as a gated Beehiiv
      post — this becomes your social-share-to-signup converter
- [ ] Post a "launching AI Pulse" thread on X + LinkedIn (I can draft the
      post when you're ready)
- [ ] Enable **Beehiiv Boosts** (Grow → Boosts) — other newsletters pay
      you to cross-promote; free money, revenue-positive from day 1
- [ ] Tell me to ship the next issue (weekly cadence is fine to start) and
      I'll use Mode 1 (Claude-in-session) to write it

---

## Things NOT on the checklist (do later)

- ❌ **Paid tier** — wait until ~500 free subs, ~2–4 weeks
- ❌ **Custom domain** — Beehiiv's default URL works fine to start
- ❌ **Logo redesign** — Canva wordmark is fine for first 1000 subs
- ❌ **Gemini/Groq API keys** — optional (only for the automated cron
      backstop; not needed for the Claude-in-session flow you're using)
- ❌ **More scraper sources** — 17 RSS feeds + HN + GH + PH is already
      more than enough; adding more just adds dedupe work

---

## When something goes wrong

- **Workflow failed in GitHub Actions:** open the run, check the log.
  Most common issues:
  - `401 Unauthorized` → wrong `BEEHIIV_API_KEY`
  - `404 Not Found` → wrong `BEEHIIV_PUBLICATION_ID`
  - `422` → Beehiiv rejected content; re-run or check title/subtitle length
- **Draft came out dry/boring:** you were in Mode 2 (automated) and no
  Gemini/Groq keys were set, so it used the extractive fallback. Either add
  those keys or switch to Mode 1 (ask me to write it).
- **Scrapers returned nothing:** check the Actions log under "Fetching…"
  lines. Individual sources can fail silently (e.g. Product Hunt HTML
  changes). RSS + HN are the most reliable and will usually carry an issue
  on their own.
