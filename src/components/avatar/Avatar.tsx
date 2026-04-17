'use client'

interface AvatarProps {
  stage: 1 | 2 | 3 | 4
  size?: number
}

/**
 * CSS/SVG-rendered avatar that evolves across 4 stages.
 * The avatar is drawn centered at (0, 0), with feet at y = 5 and head up.
 */
export function Avatar({ stage, size = 1 }: AvatarProps) {
  return (
    <g transform={`scale(${size})`}>
      {/* Floor shadow */}
      <ellipse cx="0" cy="6" rx={16 + stage * 2} ry={4} fill="#000" opacity="0.35" />

      {stage === 1 && <AvatarStage1 />}
      {stage === 2 && <AvatarStage2 />}
      {stage === 3 && <AvatarStage3 />}
      {stage === 4 && <AvatarStage4 />}
    </g>
  )
}

/* ---------- STAGE 1: Newbie ---------- */
function AvatarStage1() {
  return (
    <g>
      {/* Legs */}
      <rect x="-6" y="-12" width="5" height="18" rx="1.5" fill="#3A3A4A" />
      <rect x="1" y="-12" width="5" height="18" rx="1.5" fill="#3A3A4A" />
      {/* Shoes */}
      <ellipse cx="-3.5" cy="6.5" rx="4.5" ry="2" fill="#1A1A2A" />
      <ellipse cx="3.5" cy="6.5" rx="4.5" ry="2" fill="#1A1A2A" />
      {/* Torso (basic t-shirt) */}
      <rect x="-9" y="-32" width="18" height="22" rx="3" fill="#8A8AA0" />
      {/* Arms */}
      <rect x="-13" y="-30" width="5" height="16" rx="2" fill="#FDBCB4" />
      <rect x="8" y="-30" width="5" height="16" rx="2" fill="#FDBCB4" />
      {/* Neck */}
      <rect x="-3" y="-36" width="6" height="5" fill="#FDBCB4" />
      {/* Head */}
      <circle cx="0" cy="-42" r="8" fill="#FDBCB4" />
      {/* Hair (simple cap) */}
      <path d="M-8,-44 Q0,-52 8,-44 L8,-40 Q0,-44 -8,-40 Z" fill="#4A3728" />
      {/* Eyes */}
      <circle cx="-3" cy="-42" r="0.9" fill="#1A1A1A" />
      <circle cx="3" cy="-42" r="0.9" fill="#1A1A1A" />
      {/* Mouth */}
      <path d="M-2,-38 Q0,-37 2,-38" stroke="#1A1A1A" strokeWidth="0.8" fill="none" />
    </g>
  )
}

/* ---------- STAGE 2: Trainee ---------- */
function AvatarStage2() {
  return (
    <g>
      {/* Legs (gym shorts) */}
      <rect x="-7" y="-14" width="6" height="14" rx="1.5" fill="#1A1A2A" />
      <rect x="1" y="-14" width="6" height="14" rx="1.5" fill="#1A1A2A" />
      {/* Lower legs (skin) */}
      <rect x="-6" y="-2" width="4" height="7" fill="#FDBCB4" />
      <rect x="2" y="-2" width="4" height="7" fill="#FDBCB4" />
      {/* Shoes */}
      <ellipse cx="-4" cy="6" rx="5" ry="2.2" fill="#4CC9F0" />
      <ellipse cx="4" cy="6" rx="5" ry="2.2" fill="#4CC9F0" />
      <ellipse cx="-4" cy="5" rx="4" ry="1" fill="#fff" />
      <ellipse cx="4" cy="5" rx="4" ry="1" fill="#fff" />
      {/* Torso (tank top / tee) */}
      <path d="M-11,-34 L11,-34 L12,-14 L-12,-14 Z" fill="#4CC9F0" />
      <rect x="-11" y="-34" width="22" height="4" fill="#3AB9E0" />
      {/* Arms (slightly more defined) */}
      <rect x="-15" y="-32" width="5.5" height="15" rx="2" fill="#FDBCB4" />
      <rect x="9.5" y="-32" width="5.5" height="15" rx="2" fill="#FDBCB4" />
      {/* Muscle hint on arms */}
      <ellipse cx="-12" cy="-26" rx="2.5" ry="3.5" fill="#E8A89F" opacity="0.5" />
      <ellipse cx="12" cy="-26" rx="2.5" ry="3.5" fill="#E8A89F" opacity="0.5" />
      {/* Neck */}
      <rect x="-3" y="-38" width="6" height="5" fill="#FDBCB4" />
      {/* Head */}
      <circle cx="0" cy="-44" r="9" fill="#FDBCB4" />
      {/* Hair */}
      <path d="M-9,-46 Q0,-55 9,-46 L9,-42 Q5,-47 0,-46 Q-5,-47 -9,-42 Z" fill="#4A3728" />
      {/* Eyes (confident) */}
      <circle cx="-3" cy="-44" r="1" fill="#1A1A1A" />
      <circle cx="3" cy="-44" r="1" fill="#1A1A1A" />
      {/* Smile */}
      <path d="M-2.5,-40 Q0,-38 2.5,-40" stroke="#1A1A1A" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </g>
  )
}

/* ---------- STAGE 3: Athlete ---------- */
function AvatarStage3() {
  return (
    <g>
      {/* Legs */}
      <rect x="-8" y="-14" width="7" height="14" rx="2" fill="#1A1A2A" />
      <rect x="1" y="-14" width="7" height="14" rx="2" fill="#1A1A2A" />
      {/* Calves (skin with definition) */}
      <path d="M-7,-2 Q-6,1 -7,5 L-3,5 Q-3,1 -3,-2 Z" fill="#FDBCB4" />
      <path d="M3,-2 Q3,1 3,5 L7,5 Q6,1 7,-2 Z" fill="#FDBCB4" />
      {/* Shoes (premium) */}
      <ellipse cx="-4.5" cy="6" rx="6" ry="2.5" fill="#F72585" />
      <ellipse cx="4.5" cy="6" rx="6" ry="2.5" fill="#F72585" />
      <rect x="-10" y="4" width="11" height="1" fill="#fff" />
      <rect x="-1" y="4" width="11" height="1" fill="#fff" />
      {/* Torso (athletic tank) */}
      <path d="M-13,-36 L13,-36 L15,-14 L-15,-14 Z" fill="#F72585" />
      {/* Ab definition */}
      <line x1="0" y1="-28" x2="0" y2="-16" stroke="#C71D6A" strokeWidth="0.8" opacity="0.6" />
      <line x1="-4" y1="-24" x2="4" y2="-24" stroke="#C71D6A" strokeWidth="0.6" opacity="0.4" />
      <line x1="-4" y1="-20" x2="4" y2="-20" stroke="#C71D6A" strokeWidth="0.6" opacity="0.4" />
      {/* Tank straps */}
      <rect x="-11" y="-38" width="4" height="4" fill="#D41D6A" />
      <rect x="7" y="-38" width="4" height="4" fill="#D41D6A" />
      {/* Muscular arms */}
      <path d="M-13,-34 Q-20,-28 -18,-20 Q-17,-14 -14,-12" stroke="#FDBCB4" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M13,-34 Q20,-28 18,-20 Q17,-14 14,-12" stroke="#FDBCB4" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Bicep highlights */}
      <ellipse cx="-16" cy="-24" rx="2.5" ry="4" fill="#E8A89F" opacity="0.6" />
      <ellipse cx="16" cy="-24" rx="2.5" ry="4" fill="#E8A89F" opacity="0.6" />
      {/* Neck */}
      <rect x="-4" y="-40" width="8" height="6" fill="#FDBCB4" />
      {/* Head */}
      <circle cx="0" cy="-46" r="10" fill="#FDBCB4" />
      {/* Hair (spiky athletic) */}
      <path d="M-10,-48 Q-8,-56 -4,-54 Q0,-58 4,-54 Q8,-56 10,-48 L10,-44 Q5,-48 0,-46 Q-5,-48 -10,-44 Z" fill="#2A1810" />
      {/* Headband */}
      <rect x="-10" y="-46" width="20" height="2.5" fill="#4CC9F0" />
      {/* Eyes (sharp) */}
      <circle cx="-3.5" cy="-45" r="1.1" fill="#1A1A1A" />
      <circle cx="3.5" cy="-45" r="1.1" fill="#1A1A1A" />
      {/* Confident smirk */}
      <path d="M-3,-41 Q1,-38 3,-41" stroke="#1A1A1A" strokeWidth="0.9" fill="none" strokeLinecap="round" />
    </g>
  )
}

/* ---------- STAGE 4: Elite ---------- */
function AvatarStage4() {
  return (
    <g>
      {/* Golden glow aura */}
      <ellipse cx="0" cy="-30" rx="24" ry="36" fill="#FFD60A" opacity="0.15">
        <animate attributeName="opacity" values="0.1;0.25;0.1" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* Legs (gold shorts) */}
      <rect x="-9" y="-14" width="8" height="14" rx="2" fill="#1A1A2A" />
      <rect x="1" y="-14" width="8" height="14" rx="2" fill="#1A1A2A" />
      <rect x="-9" y="-14" width="8" height="2" fill="#FFD60A" />
      <rect x="1" y="-14" width="8" height="2" fill="#FFD60A" />
      {/* Calves (big) */}
      <path d="M-8,-2 Q-7,2 -8,5 L-2,5 Q-2,1 -2,-2 Z" fill="#FDBCB4" />
      <path d="M2,-2 Q2,1 2,5 L8,5 Q7,2 8,-2 Z" fill="#FDBCB4" />
      {/* Shoes (gold premium) */}
      <ellipse cx="-5" cy="6" rx="7" ry="3" fill="#FFD60A" />
      <ellipse cx="5" cy="6" rx="7" ry="3" fill="#FFD60A" />
      <ellipse cx="-5" cy="5" rx="5.5" ry="1.2" fill="#fff" />
      <ellipse cx="5" cy="5" rx="5.5" ry="1.2" fill="#fff" />
      {/* Torso (champion vest) */}
      <path d="M-16,-38 L16,-38 L18,-14 L-18,-14 Z" fill="#FFD60A" />
      {/* Ab definition (intense) */}
      <line x1="0" y1="-32" x2="0" y2="-16" stroke="#C8A500" strokeWidth="1" opacity="0.7" />
      <line x1="-5" y1="-28" x2="5" y2="-28" stroke="#C8A500" strokeWidth="0.8" opacity="0.5" />
      <line x1="-5" y1="-24" x2="5" y2="-24" stroke="#C8A500" strokeWidth="0.8" opacity="0.5" />
      <line x1="-5" y1="-20" x2="5" y2="-20" stroke="#C8A500" strokeWidth="0.8" opacity="0.5" />
      {/* Crown/star on chest */}
      <text x="0" y="-23" textAnchor="middle" fontSize="8">⭐</text>
      {/* Tank straps */}
      <rect x="-14" y="-40" width="5" height="5" fill="#D4B000" />
      <rect x="9" y="-40" width="5" height="5" fill="#D4B000" />
      {/* MASSIVE arms */}
      <path d="M-16,-36 Q-26,-28 -24,-18 Q-22,-12 -18,-10" stroke="#FDBCB4" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M16,-36 Q26,-28 24,-18 Q22,-12 18,-10" stroke="#FDBCB4" strokeWidth="11" strokeLinecap="round" fill="none" />
      {/* Bicep peaks */}
      <ellipse cx="-20" cy="-24" rx="3.5" ry="5" fill="#E8A89F" opacity="0.7" />
      <ellipse cx="20" cy="-24" rx="3.5" ry="5" fill="#E8A89F" opacity="0.7" />
      {/* Wristbands */}
      <rect x="-22" y="-12" width="6" height="3" rx="1" fill="#FFD60A" />
      <rect x="16" y="-12" width="6" height="3" rx="1" fill="#FFD60A" />
      {/* Neck */}
      <rect x="-5" y="-42" width="10" height="6" fill="#FDBCB4" />
      {/* Head */}
      <circle cx="0" cy="-48" r="11" fill="#FDBCB4" />
      {/* Hair */}
      <path d="M-11,-50 Q-8,-60 -3,-57 Q0,-62 3,-57 Q8,-60 11,-50 L11,-46 Q5,-50 0,-48 Q-5,-50 -11,-46 Z" fill="#1A0A00" />
      {/* Golden headband */}
      <rect x="-11" y="-48" width="22" height="3" fill="#FFD60A" />
      <circle cx="0" cy="-46.5" r="1.5" fill="#E63946" />
      {/* Eyes (legendary gaze) */}
      <circle cx="-4" cy="-47" r="1.2" fill="#1A1A1A" />
      <circle cx="4" cy="-47" r="1.2" fill="#1A1A1A" />
      <circle cx="-3.5" cy="-47.5" r="0.3" fill="#fff" />
      <circle cx="4.5" cy="-47.5" r="0.3" fill="#fff" />
      {/* Smirk */}
      <path d="M-3,-42 Q1,-39 4,-42" stroke="#1A1A1A" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Sparkle particles */}
      <circle cx="-20" cy="-55" r="1" fill="#FFD60A">
        <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="22" cy="-50" r="1" fill="#FFD60A">
        <animate attributeName="opacity" values="0;1;0" dur="2.3s" repeatCount="indefinite" begin="0.4s" />
      </circle>
      <circle cx="-18" cy="-30" r="0.8" fill="#FFD60A">
        <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" begin="0.8s" />
      </circle>
    </g>
  )
}
