import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-game-bg overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-game-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-game-pink/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-game-purple/5 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏋️</span>
          <span className="font-pixel text-game-accent text-xs tracking-wide">GYM WORLD</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-game-accent text-game-bg text-sm font-bold px-5 py-2.5 rounded-game hover:bg-game-accent/90 transition-all hover:shadow-[0_0_20px_rgba(76,201,240,0.4)]"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-game-panel border border-game-border rounded-full px-4 py-2 mb-8">
          <span className="text-game-gold text-sm">🔥</span>
          <span className="text-white/70 text-xs">Train daily. Watch your world evolve.</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-orbitron font-black mb-6 leading-tight">
          <span className="text-white">Your Gym.</span>
          <br />
          <span className="bg-gradient-to-r from-game-accent via-game-pink to-game-gold bg-clip-text text-transparent">
            Your World.
          </span>
        </h1>

        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Log your workouts. Watch your avatar grow stronger.
          Level up your gym room. <strong className="text-white">The more you train, the more your world evolves.</strong>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-gradient-to-r from-game-pink to-game-purple text-white font-bold text-lg px-8 py-4 rounded-game hover:opacity-90 transition-all hover:shadow-[0_0_30px_rgba(247,37,133,0.4)] hover:scale-105"
          >
            🚀 Start Your Journey
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto border border-game-border text-white/80 hover:text-white hover:border-game-accent transition-all text-lg px-8 py-4 rounded-game"
          >
            Already training? Log In
          </Link>
        </div>

        {/* Preview Room */}
        <div className="relative mx-auto max-w-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-game-bg via-transparent to-transparent z-10 pointer-events-none" />
          <div className="game-panel p-2 rounded-2xl overflow-hidden">
            <LandingRoomPreview />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-pixel text-game-accent text-xs text-center mb-12 tracking-widest">
          THE LOOP
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '💪',
              title: 'Daily Check-In',
              desc: 'Confirm your workout each day. Earn XP, grow your streak, and watch your avatar evolve in real time.',
              color: 'from-game-accent/20 to-transparent',
            },
            {
              icon: '🏆',
              title: 'Log Personal Bests',
              desc: 'Record your PRs for every lift. They appear live on the whiteboard in your gym room.',
              color: 'from-game-gold/20 to-transparent',
            },
            {
              icon: '🌟',
              title: 'Level Up Your World',
              desc: 'Consistency unlocks new avatar stages, room upgrades, trophies, and gym equipment.',
              color: 'from-game-pink/20 to-transparent',
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`game-panel p-6 rounded-game-lg bg-gradient-to-b ${f.color}`}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-orbitron font-bold text-white mb-2">{f.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Progression Preview */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-pixel text-game-gold text-xs text-center mb-12 tracking-widest">
          PROGRESSION
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { stage: '1', label: 'Beginner', workouts: '0 workouts', color: '#4cc9f0' },
            { stage: '2', label: 'Trainee', workouts: '7 workouts', color: '#06d6a0' },
            { stage: '3', label: 'Athlete', workouts: '21 workouts', color: '#f72585' },
            { stage: '4', label: 'Elite', workouts: '50 workouts', color: '#ffd60a' },
          ].map((s, i) => (
            <div
              key={s.stage}
              className="game-panel p-4 rounded-game text-center group hover:border-game-border-bright transition-all"
              style={{ '--stage-color': s.color } as React.CSSProperties}
            >
              <div
                className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl"
                style={{ background: `${s.color}20`, border: `2px solid ${s.color}40` }}
              >
                {['🌱', '💪', '⚡', '👑'][i]}
              </div>
              <div className="font-pixel text-xs mb-1" style={{ color: s.color }}>
                STAGE {s.stage}
              </div>
              <div className="font-orbitron font-bold text-white text-sm mb-1">{s.label}</div>
              <div className="text-white/40 text-xs">{s.workouts}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof / stats */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="game-panel p-10 rounded-2xl">
          <p className="font-pixel text-xs text-white/40 mb-6 tracking-widest">START TODAY</p>
          <h2 className="font-orbitron font-black text-3xl md:text-4xl text-white mb-4">
            The gym is only half the battle.
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Gym World makes consistency addictive. Your avatar depends on you.
            Don&apos;t break the streak.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-game-accent text-game-bg font-bold text-lg px-10 py-4 rounded-game hover:opacity-90 transition-all hover:shadow-[0_0_30px_rgba(76,201,240,0.4)] hover:scale-105"
          >
            Create Your Gym — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-white/30 text-xs">
        <span className="font-pixel">GYM WORLD</span> — Built for people who actually show up.
      </footer>
    </div>
  )
}

function LandingRoomPreview() {
  return (
    <div className="relative bg-gradient-to-b from-[#1a1a3a] to-[#0a0a18] rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 600 340" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="lightGlowLP" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#FFE87A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFE87A" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="floorGradLP" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6B4A2A" />
              <stop offset="100%" stopColor="#8B6344" />
            </linearGradient>
          </defs>
          {/* Walls */}
          <polygon points="300,30 510,130 510,240 300,140" fill="#F5E6C8" />
          <polygon points="300,30 90,130 90,240 300,140" fill="#E8D4A4" />
          {/* Floor */}
          <polygon points="300,140 510,240 300,320 90,240" fill="url(#floorGradLP)" />
          {/* Ceiling */}
          <polygon points="300,30 510,130 300,230 90,130" fill="#F0E8C8" />
          {/* Light glow */}
          <ellipse cx="300" cy="170" rx="200" ry="120" fill="url(#lightGlowLP)" />
          {/* Wall lines */}
          <line x1="300" y1="30" x2="300" y2="140" stroke="#D4B870" strokeWidth="1.5" />
          <line x1="90" y1="240" x2="300" y2="320" stroke="#6B4A2A" strokeWidth="1.5" />
          <line x1="510" y1="240" x2="300" y2="320" stroke="#6B4A2A" strokeWidth="1.5" />

          {/* Whiteboard on left wall */}
          <rect x="104" y="138" width="72" height="54" rx="3" fill="#2B3A2B" />
          <rect x="108" y="141" width="64" height="48" fill="#C8EBC0" rx="1" />
          <text x="112" y="153" fontFamily="monospace" fontSize="5.5" fill="#1A2A1A" fontWeight="bold">PBs</text>
          <line x1="111" y1="156" x2="170" y2="156" stroke="#333" strokeWidth="0.5" />
          <text x="112" y="165" fontFamily="monospace" fontSize="5" fill="#1A2A1A">Bench 100kg</text>
          <text x="112" y="174" fontFamily="monospace" fontSize="5" fill="#1A2A1A">Squat 140kg</text>
          <text x="112" y="183" fontFamily="monospace" fontSize="5" fill="#1A2A1A">DL 180kg</text>

          {/* Bench */}
          <rect x="258" y="221" width="84" height="14" rx="4" fill="#8B3A2A" />
          <rect x="265" y="215" width="70" height="8" rx="2" fill="#A04030" />
          <rect x="263" y="235" width="8" height="12" fill="#6B2A1A" />
          <rect x="329" y="235" width="8" height="12" fill="#6B2A1A" />
          <rect x="270" y="235" width="60" height="4" rx="1" fill="#7B3020" />

          {/* Dumbbells (right side) */}
          <g transform="translate(418, 222)">
            <rect x="-25" y="-6" width="50" height="8" rx="1" fill="#555" />
            <rect x="-30" y="-9" width="10" height="14" rx="2" fill="#888" />
            <rect x="20" y="-9" width="10" height="14" rx="2" fill="#888" />
            <rect x="-20" y="-5" width="5" height="6" fill="#aaa" />
            <rect x="15" y="-5" width="5" height="6" fill="#aaa" />
          </g>

          {/* Barbell rack (right wall) */}
          <rect x="426" y="178" width="62" height="50" rx="3" fill="#444" />
          <rect x="430" y="183" width="54" height="5" rx="1" fill="#555" />
          <rect x="437" y="175" width="5" height="40" rx="1" fill="#666" />
          <rect x="475" y="175" width="5" height="40" rx="1" fill="#666" />
          <rect x="430" y="202" width="60" height="4" rx="1" fill="#888" />
          <circle cx="432" cy="204" r="7" fill="#777" stroke="#999" strokeWidth="1" />
          <circle cx="487" cy="204" r="7" fill="#777" stroke="#999" strokeWidth="1" />

          {/* Avatar (Stage 4 preview — champion) */}
          <g transform="translate(300, 250)">
            <ellipse cx="0" cy="2" rx="20" ry="6" fill="#FFD60A" opacity="0.3" />
            <circle cx="0" cy="-55" r="11" fill="#FDBCB4" />
            <ellipse cx="0" cy="-64" rx="11" ry="5" fill="#4A3728" />
            <polygon points="-13,-48 13,-48 15,-22 -15,-22" fill="#FFD60A" />
            <path d="M-13,-44 Q-28,-28 -24,-12" stroke="#FDBCB4" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M13,-44 Q28,-28 24,-12" stroke="#FDBCB4" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M-8,-22 L-10,2" stroke="#2B1810" strokeWidth="8" strokeLinecap="round" />
            <path d="M8,-22 L10,2" stroke="#2B1810" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="-10" cy="5" rx="10" ry="4" fill="#FFD60A" />
            <ellipse cx="10" cy="5" rx="10" ry="4" fill="#FFD60A" />
          </g>

          {/* Trophy */}
          <g transform="translate(168, 238)">
            <path d="M-8,-18 L8,-18 L6,0 L-6,0 Z" fill="#FFD60A" />
            <rect x="-3" y="0" width="6" height="6" fill="#E5C200" />
            <rect x="-8" y="6" width="16" height="3" rx="1" fill="#E5C200" />
          </g>

          {/* Level indicator */}
          <rect x="242" y="285" width="116" height="20" rx="4" fill="rgba(0,0,0,0.4)" />
          <text x="300" y="299" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#FFD60A" fontWeight="bold">⭐ LEVEL 5 — ELITE</text>
        </svg>
      </div>
    </div>
  )
}
