# 🏋️ Gym World — Level Up Your Training

A habit-tracker-meets-progression-game for gym-goers. Log your workouts daily,
watch your avatar evolve, level up your gym room, and log PBs that appear
live on the whiteboard in your room.

**The emotional hook:** "I trained today, so my character and world improve."

---

## ✨ What's inside

- **Daily check-in loop** – one workout per day, streak tracking, XP rewards
- **Avatar progression** – 4 evolving stages (Newbie → Trainee → Athlete → Elite)
  rendered as custom SVG art
- **Room progression** – 4 upgrade stages with new furniture, lighting,
  trophies, and decorations unlocking over time
- **PB whiteboard** – your Personal Bests appear live inside the gym room SVG
- **Activity calendar** – 30-day at-a-glance consistency view
- **Reward overlays** – level-up / streak / stage-unlock celebration moments
- **Habbo-inspired isometric visual** – hand-crafted SVG (no external art assets)

---

## 🛠 Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling (custom game-themed design tokens)
- **Prisma** + **SQLite** (zero-setup local DB)
- **Custom JWT auth** via `jose` (httpOnly cookies, middleware-protected routes)
- **bcryptjs** for password hashing
- **Framer Motion** for animations
- **date-fns** for date handling

Why SQLite? Zero-config local dev. Swap `DATABASE_URL` + provider in
`prisma/schema.prisma` for Postgres when you're ready.

---

## 🚀 Run it locally

Requires **Node.js 18+**.

```bash
# 1. Install dependencies
npm install

# 2. Create the local SQLite DB
npm run db:push

# 3. (Optional) Generate the Prisma client explicitly
npm run db:generate

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Sign up → land in your room → press "I COMPLETED MY WORKOUT" → watch the magic.

### Available scripts

| Script               | Purpose                                  |
|----------------------|------------------------------------------|
| `npm run dev`        | Start dev server                         |
| `npm run build`      | Production build                         |
| `npm run start`      | Start built app                          |
| `npm run db:push`    | Create/sync SQLite schema                |
| `npm run db:studio`  | Open Prisma Studio to browse data        |
| `npm run db:generate`| Regenerate Prisma client                 |

---

## 📁 Project structure

```
gym-world/
├── prisma/
│   └── schema.prisma            # User, Progress, CheckIn, PB, ActivityLog
├── src/
│   ├── config/
│   │   └── progression.ts       # 🎛 ALL thresholds live here — tweak freely
│   ├── types/
│   │   └── index.ts             # Shared TypeScript interfaces
│   ├── lib/
│   │   ├── auth.ts              # JWT create/verify + cookie helpers
│   │   ├── prisma.ts            # Prisma singleton
│   │   ├── progression.ts       # XP, levels, stages, streak math
│   │   └── utils.ts             # Date + class-name helpers
│   ├── middleware.ts            # Protects /dashboard /pbs /profile
│   ├── app/
│   │   ├── globals.css          # Game theme, animations, custom utilities
│   │   ├── layout.tsx           # Root layout + Google Fonts
│   │   ├── page.tsx             # Landing page (with room preview)
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (app)/
│   │   │   ├── layout.tsx       # Authenticated shell + nav
│   │   │   ├── dashboard/       # Main room screen (server + client split)
│   │   │   ├── pbs/             # PB management
│   │   │   └── profile/         # Account + progression reference
│   │   └── api/
│   │       ├── auth/{signup,login,logout,me}/route.ts
│   │       ├── checkin/route.ts # The core game loop endpoint
│   │       ├── pbs/route.ts
│   │       ├── pbs/[id]/route.ts
│   │       └── progress/route.ts
│   └── components/
│       ├── room/
│       │   └── GymRoom.tsx      # Isometric SVG room (4 stages of decor)
│       ├── avatar/
│       │   └── Avatar.tsx       # SVG character (4 evolving stages)
│       ├── game/
│       │   ├── CheckInButton.tsx
│       │   ├── XPBar.tsx
│       │   ├── StreakPanel.tsx
│       │   ├── PBWhiteboard.tsx
│       │   ├── ActivityFeed.tsx
│       │   ├── ActivityCalendar.tsx
│       │   └── RewardOverlay.tsx
│       └── ui/
│           ├── Button.tsx
│           ├── GameCard.tsx
│           ├── Modal.tsx
│           └── LogoutButton.tsx
├── tailwind.config.ts           # Custom colors, fonts, animations
├── next.config.js
├── tsconfig.json
└── .env.local                   # DATABASE_URL + JWT_SECRET
```

---

## 🎮 Game loop

```
User checks in (once per day)
        ↓
    +20 XP base
        ↓
  Streak incremented (or reset if day was missed)
        ↓
  If streak hits 7/14/21/30/…  →  +10 bonus XP
        ↓
  XP total → level (bucketed by thresholds)
  Workouts total → avatar stage + room stage
        ↓
  Reward overlay fires (level-up / unlock / streak milestone)
        ↓
  UI updates: XP bar, streak display, avatar + room redraw,
              whiteboard PBs, activity feed, calendar
```

All thresholds are in **`src/config/progression.ts`**. Change one line — change
the entire game balance. No logic changes required.

---

## 🎨 Visual system

- **Color palette:** dark space/game background, warm cream & amber walls,
  wood-brown floor, gold/pink/cyan accents
- **Typography:** `Press Start 2P` (labels), `Orbitron` (stats), `Inter` (body)
- **Room:** built entirely as inline SVG — walls, floor, lighting, furniture,
  avatar. Each of the 4 room stages conditionally renders additional
  decorations (mat, barbell rack, mirror, trophies, plant, sparkles)
- **Avatar:** 4 completely redrawn SVG characters, with a golden aura + sparkle
  animation at the elite stage

---

## 🔮 Suggested next features

The architecture is ready for:

1. **Leaderboards** — add a `FriendConnection` model, rank by XP / streak
2. **Quests / Challenges** — weekly goals backed by a new `Quest` model,
   surfaced in `ActivityLog`
3. **Body-weight logging** — add `BodyMeasurement { weight, bodyFat, date }`
4. **Macros / Nutrition** — add `MealLog` + reuse the daily check-in pattern
5. **Wearable integration** — expose `/api/checkin` to OAuth'd clients
6. **Room customization** — let users spend XP on furniture skins
7. **Social feed** — show friends' activity in the right sidebar
8. **More avatar customization** — hair, skin, outfit slots

The schema is designed so additions don't require migrating existing tables.

---

## 🔑 Environment variables

`.env.local`:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-this-to-a-long-random-string-min-32-chars"
```

For production: use a strong secret, switch to Postgres/Neon/Supabase,
and set `NODE_ENV=production`.

---

## 📝 License

MIT — build whatever you want on top of it.
