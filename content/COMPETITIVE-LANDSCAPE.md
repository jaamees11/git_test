# Competitive Landscape & Revenue Benchmarks

> Snapshot of the AI-newsletter market as of late-2025/early-2026. Numbers
> are best public estimates (self-reported, newsletter database trackers,
> acquisition reporting) — treat as ±20%. Update quarterly.

---

## Tier 1 — Giants (100k–750k subs)

| Newsletter | Subs (est.) | Format | Monetization | Notes |
|---|---|---|---|---|
| The Rundown AI (Rowan Cheung) | ~750k | Daily, free | Sponsors ($40k+/issue) | Most aggressive growth |
| Superhuman / The Neuron | ~500k | Daily, free | Sponsors | Acquired ~2024 |
| TLDR AI | ~300k | Daily, free | Sponsors | TLDR network spinoff |
| One Useful Thing (Ethan Mollick) | ~200k | Weekly, free | None direct | Academic authority angle |
| Ben's Bites | ~170k | Daily, free + Pro | Sponsors + $10/mo Pro | ~$500k+ ARR, own platform |

## Tier 2 — Strong (20k–100k subs)

| Newsletter | Subs | Monetization | Angle |
|---|---|---|---|
| Mindstream | ~100k | Sponsors | UK-based |
| Import AI (Jack Clark) | ~80k | Free | Technical/policy, OpenAI alum |
| AI Breakfast | ~50k | Sponsors | Quality curation |
| Latent Space (swyx) | ~50k | $20/mo paid + podcast | Developers |
| AI Supremacy (M. Spencer) | ~50k+ | $8/mo paid (very active) | Substack, high paid conversion |
| Chain of Thought | ~30k | Sponsors | General AI |
| Interconnects (Nathan Lambert) | ~30k | $10/mo paid | RL/post-training, very technical |

## Tier 3 — Niche / profession-specific (5k–30k subs)

Money density per sub is highest here — small lists, high willingness to pay.

| Category | Approx subs | Monetization |
|---|---|---|
| AI for Lawyers (various) | ~10k | $20+/mo paid |
| AI Tool Report | ~30k | Sponsors |
| Every.to bundle (Chain of Thought) | bundled | $20/mo bundle |
| "AI for [PMs / Marketers / Realtors / ...]" | 2–15k each | $10–30/mo |

---

## Pricing conventions

| Tier | Price | Who |
|---|---|---|
| Free, sponsor-funded | $0 | ~80% of top-100 AI newsletters |
| Low paid | $5–8/mo | AI Supremacy |
| Standard paid | $9–15/mo | Ben's Bites Pro, Latent Space |
| Premium / niche | $15–30/mo | Profession-specific |
| Bundle | $15–25/mo | Every.to, Substack bundles |

Annual discount convention: **20–30% off** (e.g. $79/yr for a $9/mo tier).

---

## Revenue mix & benchmarks

### Sponsor CPMs in AI category (cost per 1000 sends)
- Top newsletters: **$30–50**
- Mid-tier (20–80k): **$15–25**
- Sub-20k: **$5–15**

Higher than most categories — AI advertisers have budget. A mid-tier 50k
daily newsletter selling 2 sponsors/wk fully booked at $25 CPM grosses
roughly: `50k × 2 × 4.3 × $25 / 1000 ≈ $10,750/mo` from ads alone.

### Paid-tier conversion benchmarks
- Free list quality: **3–7%** typical
- Substack-native well-targeted: **6–10%** (e.g. AI Supremacy)
- Niche profession newsletters: **10–15%**
- Dormant/cold lists: **<1%**

---

## Typical revenue at each stage

Generalist daily AI newsletter:

| Stage | Subs | Sponsor rev / mo | Paid rev / mo | Total / mo |
|---|---|---|---|---|
| Early | 1k | $0–200 | $0 (free only) | ~$100 |
| Traction | 10k | $2–4k | $0–500 | ~$3k |
| Strong | 50k | $12–25k | $2–5k | ~$20k |
| Major | 150k | $50k+ | $10–20k | ~$70k |
| Giant | 500k+ | $150k+ | $25k+ | $175k+ |

Niche / profession-specific (same stages):

| Stage | Subs | Sponsor rev / mo | Paid rev / mo | Total / mo |
|---|---|---|---|---|
| Early | 500 | $0 | $100–300 | ~$200 |
| Traction | 3k | $500–1.5k | $1.5–3k | ~$3k |
| Strong | 10k | $3–6k | $8–15k | ~$15k |
| Peak | 25k | $10k+ | $25k+ | ~$40k |

Niche caps lower but revenue per sub can be 5–10× generalist.

---

## Implications for AI Pulse strategy

### What we should not do
- Compete head-on with The Rundown / Ben's Bites / TLDR — they have 2-year
  head starts and full-time teams. Chasing breadth loses.

### What we should do
- **Own the sharp/no-hype angle.** Most AI newsletters are breathlessly
  bullish. Being the dry, pragmatic read earns retention that hype doesn't.
  (The voice is already baked into `config/style.yaml`.)
- **Daily cadence, 2-min read, 5 items.** Aligns with Tier 1 formats that
  win attention.
- **Freemium paid tier** at $9/mo. Flip on at ~500–1k subs.
- **Sponsor-ready design** from day one — means ad-slot placeholder at the
  right spot in the template (currently: the paid-tier teaser slot in
  `config/style.yaml` can be repurposed as a sponsor slot once you have
  ad demand).

### Realistic 18-month trajectory
Not a prediction — a plausibility sketch. Depends entirely on growth tactics
(Boosts, lead magnet, social distribution).

| Month | Subs | Revenue |
|---|---|---|
| 3 | 500–1k | $0 |
| 6 | 2–5k | $200–500 |
| 12 | 10–20k | $3–6k/mo |
| 18 | 30–60k | $10–20k/mo |

### Niche fork (optional backup)
If generalist plateaus, re-point the pipeline at a specific vertical:

- "AI for Accountants" — CPAs have real budget, $20–30/mo paid sticks
- "AI for PMs" — B2B SaaS audience, pricing power
- "AI for Real Estate" — huge TAM, underserved

Same pipeline, just edit:
- `config/feeds.yaml` → swap in vertical-specific sources
- `config/style.yaml` → target reader + sections
- `config/prompt_pack.yaml` → themes for that profession

Keep this option for month 9+ if growth disappoints.

---

## Differentiation checklist

What we genuinely do better than most AI newsletters:

- [x] No-hype voice (baked into `style.yaml` + `CLAUDE.md`)
- [x] Source attribution on every item (trust signal)
- [x] Signal-not-noise curation, not "every release"
- [x] Zero per-token cost — we can afford to keep it free forever
- [x] Static archive with SEO (each issue compounds over time)
- [ ] Weekly Prompt Pack (shipping Friday) — most free newsletters don't
      have a paid hook this concrete
- [ ] Profession-vertical guides (quarterly, paid tier)

The unchecked boxes are live on the roadmap in `content/PRE-LAUNCH-CHECKLIST.md`.

---

## Sources & caveats

- Subscriber counts: reported in newsletter creator interviews, SparkLoop
  / Beehiiv public stats, acquisition news (~2023–2025 range).
- Revenue figures: creator reports, Beehiiv revenue screenshots,
  industry reporting. Mid-tier newsletters rarely publish; estimates
  triangulated from known CPMs + send volumes.
- **This is a snapshot.** The Rundown was 50k in Jan 2023 and 750k by
  mid-2025. Things move fast. Re-check these numbers before any major
  strategic decisions.
