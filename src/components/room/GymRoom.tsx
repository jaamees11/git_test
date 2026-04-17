'use client'

import { Avatar } from '@/components/avatar/Avatar'
import type { PersonalBest } from '@/types'

interface GymRoomProps {
  roomStage: 1 | 2 | 3 | 4
  avatarStage: 1 | 2 | 3 | 4
  pbs: Pick<PersonalBest, 'liftName' | 'value' | 'unit'>[]
  checkedInToday?: boolean
}

// Isometric helper: converts iso grid (ix, iy) to SVG screen (x, y)
// BC (back corner) at (300, 80), tile half-w 55, tile half-h 28
const iso = (ix: number, iy: number) => ({
  x: 300 + (ix - iy) * 55,
  y: 80 + (ix + iy) * 28,
})

export function GymRoom({ roomStage, avatarStage, pbs, checkedInToday = false }: GymRoomProps) {
  const avatarPos = iso(2, 2.5) // center of floor

  return (
    <div className="relative w-full room-container">
      <svg viewBox="0 0 600 380" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ceilingLight" cx="50%" cy="15%" r="55%">
            <stop offset="0%" stopColor="#FFE87A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFE87A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="floorGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#6B4A2A" />
            <stop offset="100%" stopColor="#8B6344" />
          </linearGradient>
          <linearGradient id="wallLeftGrad" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#EFDCB0" />
            <stop offset="100%" stopColor="#F5E6C8" />
          </linearGradient>
          <linearGradient id="wallRightGrad" x1="100%" y1="0%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#DFC892" />
            <stop offset="100%" stopColor="#E8D4A4" />
          </linearGradient>
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
            <feOffset dx="0" dy="1" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ceiling */}
        <polygon points="300,0 520,92 300,184 80,92" fill="#EDE0B8" />

        {/* Walls */}
        {/* Right-side-of-screen wall (room's "left wall") */}
        <polygon
          points="300,80 520,192 520,92 300,0"
          fill="url(#wallLeftGrad)"
        />
        {/* Left-side-of-screen wall (room's "right wall") */}
        <polygon
          points="300,80 80,192 80,92 300,0"
          fill="url(#wallRightGrad)"
        />

        {/* Wall corner line */}
        <line x1="300" y1="0" x2="300" y2="80" stroke="#C8A870" strokeWidth="1.5" opacity="0.6" />

        {/* Floor */}
        <polygon points="300,80 520,192 300,304 80,192" fill="url(#floorGrad)" />

        {/* Floor wood planks (subtle lines going from back to front-right) */}
        <g opacity="0.25" stroke="#5A3A1E" strokeWidth="0.8">
          <line x1="245" y1="108" x2="465" y2="220" />
          <line x1="190" y1="136" x2="410" y2="248" />
          <line x1="135" y1="164" x2="355" y2="276" />
        </g>
        {/* Floor planks going from back to front-left */}
        <g opacity="0.25" stroke="#5A3A1E" strokeWidth="0.8">
          <line x1="355" y1="108" x2="135" y2="220" />
          <line x1="410" y1="136" x2="190" y2="248" />
          <line x1="465" y1="164" x2="245" y2="276" />
        </g>

        {/* Wall-floor edges */}
        <line x1="80" y1="192" x2="300" y2="80" stroke="#6B4A2A" strokeWidth="1" opacity="0.5" />
        <line x1="520" y1="192" x2="300" y2="80" stroke="#6B4A2A" strokeWidth="1" opacity="0.5" />

        {/* Soft ambient light glow (center) */}
        <ellipse cx="300" cy="160" rx="240" ry="140" fill="url(#ceilingLight)" />

        {/* ================== DECOR LAYER (back-first, depth-sorted) ================== */}

        {/* Ceiling light fixture (stage 2+) */}
        {roomStage >= 2 && (
          <g>
            <ellipse cx="300" cy="8" rx="35" ry="8" fill="#FFB800" opacity="0.3" />
            <ellipse cx="300" cy="6" rx="22" ry="5" fill="#FFE87A" />
            <ellipse cx="300" cy="5" rx="14" ry="3" fill="#FFF8D0" />
          </g>
        )}

        {/* Wall posters (stage 3+) */}
        {roomStage >= 3 && (
          <>
            {/* Motivational poster on right-of-screen wall */}
            <g transform="translate(420, 60)">
              <polygon points="-22,-18 22,-22 24,18 -20,22" fill="#1A1A2A" stroke="#FFD60A" strokeWidth="1" />
              <polygon points="-19,-15 19,-19 21,15 -17,19" fill="#F72585" />
              <text x="2" y="-1" textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontSize="4.5" fill="#fff" fontWeight="bold">NO</text>
              <text x="2" y="8" textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontSize="4.5" fill="#fff" fontWeight="bold">DAYS</text>
              <text x="2" y="17" textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontSize="4.5" fill="#FFD60A" fontWeight="bold">OFF</text>
            </g>
          </>
        )}

        {/* Mirror on right-of-screen wall (stage 3+) */}
        {roomStage >= 3 && (
          <g transform="translate(478, 65)">
            <polygon points="-18,-30 18,-35 20,30 -16,35" fill="#2A2A3A" />
            <polygon points="-15,-27 15,-32 17,27 -13,31" fill="#B8E0F0" opacity="0.7" />
            <polygon points="-15,-27 5,-30 -10,30 -13,31" fill="#ffffff" opacity="0.25" />
          </g>
        )}

        {/* WHITEBOARD on left-side-of-screen wall */}
        <WhiteboardOnWall pbs={pbs} />

        {/* Framed wall art on left-of-screen wall (stage 2+) */}
        {roomStage >= 2 && (
          <g transform="translate(192, 60)">
            <polygon points="-17,-14 17,-18 19,14 -15,18" fill="#3A2A1A" />
            <polygon points="-14,-12 14,-16 16,12 -12,15" fill="#4CC9F0" />
            <circle cx="2" cy="-2" r="5" fill="#FFD60A" opacity="0.8" />
            <polygon points="-12,10 -4,-2 4,6 12,-4 14,10" fill="#06D6A0" opacity="0.7" />
          </g>
        )}

        {/* BACK-WALL PLANT (back corner, stage 3+) */}
        {roomStage >= 3 && (
          <g transform="translate(300, 85)" filter="url(#softShadow)">
            <ellipse cx="0" cy="2" rx="12" ry="4" fill="#3A2A1A" />
            <rect x="-10" y="-2" width="20" height="12" rx="2" fill="#8B4513" />
            <rect x="-10" y="-2" width="20" height="3" fill="#A0551A" />
            <ellipse cx="-5" cy="-10" rx="8" ry="12" fill="#2D7A3E" />
            <ellipse cx="5" cy="-12" rx="8" ry="12" fill="#357A46" />
            <ellipse cx="0" cy="-18" rx="7" ry="10" fill="#4A9058" />
          </g>
        )}

        {/* TROPHIES on floor (stage 3+) */}
        {roomStage >= 3 && (
          <g transform="translate(400, 220)" filter="url(#softShadow)">
            <Trophy size={1} />
          </g>
        )}
        {roomStage >= 4 && (
          <>
            <g transform="translate(380, 235)" filter="url(#softShadow)">
              <Trophy size={0.85} color="#C0C0C0" />
            </g>
            <g transform="translate(420, 235)" filter="url(#softShadow)">
              <Trophy size={0.85} color="#CD7F32" />
            </g>
          </>
        )}

        {/* FLOOR MAT under avatar (stage 2+) */}
        {roomStage >= 2 && (
          <g>
            <polygon
              points="230,232 350,232 330,258 210,258"
              fill="#1F3A5A"
              opacity="0.85"
            />
            <polygon
              points="234,234 346,234 328,254 214,254"
              fill="none"
              stroke="#4CC9F0"
              strokeWidth="0.8"
              opacity="0.6"
            />
          </g>
        )}

        {/* BENCH (center) - always present */}
        <g transform="translate(280, 212)" filter="url(#softShadow)">
          <Bench upgraded={roomStage >= 2} />
        </g>

        {/* DUMBBELLS (left floor) */}
        <g transform="translate(118, 208)" filter="url(#softShadow)">
          <DumbbellShelf upgraded={roomStage >= 2} />
        </g>

        {/* BARBELL RACK (right floor, stage 2+) */}
        {roomStage >= 2 && (
          <g transform="translate(460, 178)" filter="url(#softShadow)">
            <BarbellRack premium={roomStage >= 4} />
          </g>
        )}

        {/* AVATAR */}
        <g transform={`translate(${avatarPos.x}, ${avatarPos.y + 28})`}>
          <Avatar stage={avatarStage} />
        </g>

        {/* CHECK-IN GLOW indicator */}
        {checkedInToday && (
          <g transform={`translate(${avatarPos.x}, ${avatarPos.y - 10})`}>
            <circle r="14" fill="#06D6A0" opacity="0.3">
              <animate attributeName="r" values="12;18;12" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.6s" repeatCount="indefinite" />
            </circle>
            <text x="0" y="-55" textAnchor="middle" fontSize="16">✅</text>
          </g>
        )}

        {/* SPARKLES for elite stage */}
        {roomStage >= 4 && (
          <g>
            {[
              { x: 200, y: 140 },
              { x: 400, y: 120 },
              { x: 170, y: 100 },
              { x: 440, y: 150 },
            ].map((p, i) => (
              <g key={i} transform={`translate(${p.x}, ${p.y})`}>
                <circle r="1.5" fill="#FFD60A">
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur={`${2 + i * 0.3}s`}
                    repeatCount="indefinite"
                    begin={`${i * 0.4}s`}
                  />
                </circle>
              </g>
            ))}
          </g>
        )}

        {/* ROOM STAGE BADGE (bottom-left of SVG) */}
        <g transform="translate(24, 344)">
          <rect x="0" y="0" width="96" height="22" rx="11" fill="rgba(10,10,20,0.75)" />
          <text x="48" y="14" textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontSize="6" fill="#4CC9F0">
            ROOM · STAGE {roomStage}
          </text>
        </g>
      </svg>
    </div>
  )
}

/* ============================ SUB-COMPONENTS ============================ */

function Trophy({ size = 1, color = '#FFD60A' }: { size?: number; color?: string }) {
  const darker = color === '#FFD60A' ? '#E5C200' : color === '#C0C0C0' ? '#909090' : '#A0601E'
  return (
    <g transform={`scale(${size})`}>
      <path d="M-9,-22 Q-13,-10 -9,0 L9,0 Q13,-10 9,-22 Z" fill={color} />
      <path d="M-9,-18 Q-16,-12 -9,-6" stroke={darker} strokeWidth="2.5" fill="none" />
      <path d="M9,-18 Q16,-12 9,-6" stroke={darker} strokeWidth="2.5" fill="none" />
      <path d="M-9,-22 L9,-22 L7,-18 L-7,-18 Z" fill={darker} />
      <rect x="-3" y="0" width="6" height="7" fill={darker} />
      <rect x="-8" y="7" width="16" height="4" rx="1" fill={darker} />
      <circle cx="0" cy="-12" r="1" fill="#fff" opacity="0.6" />
    </g>
  )
}

function Bench({ upgraded }: { upgraded: boolean }) {
  const topColor = upgraded ? '#B84545' : '#8B3A2A'
  const topLight = upgraded ? '#D85555' : '#A04030'
  const frontColor = upgraded ? '#8B3028' : '#6B2A1A'
  return (
    <g>
      {/* Cushion side (visible edge) */}
      <rect x="-38" y="-10" width="76" height="16" rx="4" fill={topColor} />
      {/* Cushion top highlight */}
      <rect x="-36" y="-12" width="72" height="5" rx="2" fill={topLight} />
      {/* Front face */}
      <rect x="-38" y="4" width="76" height="8" rx="1" fill={frontColor} />
      {/* Legs */}
      <rect x="-32" y="12" width="5" height="14" rx="1" fill="#4A1800" />
      <rect x="27" y="12" width="5" height="14" rx="1" fill="#4A1800" />
      {/* Cross bar */}
      <rect x="-30" y="20" width="60" height="3" rx="1" fill="#3A1400" />
      {/* Weights on floor if upgraded */}
      {upgraded && (
        <>
          <ellipse cx="-44" cy="24" rx="8" ry="4" fill="#333" />
          <ellipse cx="44" cy="24" rx="8" ry="4" fill="#333" />
          <rect x="-44" y="21" width="4" height="4" fill="#555" />
          <rect x="40" y="21" width="4" height="4" fill="#555" />
        </>
      )}
    </g>
  )
}

function DumbbellShelf({ upgraded }: { upgraded: boolean }) {
  return (
    <g>
      {/* Rack base */}
      <rect x="-28" y="0" width="56" height="5" rx="2" fill="#3A3A4A" />
      <rect x="-28" y="5" width="56" height="3" fill="#2A2A3A" />
      {/* Shelf stand */}
      <rect x="-24" y="-8" width="48" height="4" rx="1" fill="#444" />
      {/* Dumbbell 1 (small) */}
      <g transform="translate(-14, -14)">
        <rect x="-10" y="-2" width="20" height="4" rx="1" fill="#888" />
        <ellipse cx="-9" cy="0" rx="4" ry="5" fill="#777" stroke="#999" strokeWidth="0.5" />
        <ellipse cx="9" cy="0" rx="4" ry="5" fill="#777" stroke="#999" strokeWidth="0.5" />
      </g>
      {/* Dumbbell 2 (medium) */}
      <g transform="translate(14, -15)">
        <rect x="-12" y="-2" width="24" height="4" rx="1" fill="#888" />
        <ellipse cx="-11" cy="0" rx="5" ry="6" fill="#666" stroke="#888" strokeWidth="0.5" />
        <ellipse cx="11" cy="0" rx="5" ry="6" fill="#666" stroke="#888" strokeWidth="0.5" />
      </g>
      {/* Extra dumbbell at upgraded */}
      {upgraded && (
        <g transform="translate(0, -30)">
          <rect x="-14" y="-2" width="28" height="4" rx="1" fill="#aaa" />
          <ellipse cx="-13" cy="0" rx="6" ry="7" fill="#555" stroke="#777" strokeWidth="0.5" />
          <ellipse cx="13" cy="0" rx="6" ry="7" fill="#555" stroke="#777" strokeWidth="0.5" />
        </g>
      )}
    </g>
  )
}

function BarbellRack({ premium }: { premium: boolean }) {
  const postColor = premium ? '#222' : '#555'
  const plateColor = premium ? '#E63946' : '#666'
  return (
    <g>
      {/* Back legs base */}
      <rect x="-30" y="42" width="60" height="5" rx="2" fill="#3A3A4A" />
      {/* Uprights */}
      <rect x="-28" y="-10" width="5" height="55" rx="1" fill={postColor} />
      <rect x="23" y="-10" width="5" height="55" rx="1" fill={postColor} />
      {/* Cross-pieces for hooks */}
      <rect x="-26" y="-4" width="4" height="2" fill={postColor} />
      <rect x="22" y="-4" width="4" height="2" fill={postColor} />
      <rect x="-26" y="8" width="4" height="2" fill={postColor} />
      <rect x="22" y="8" width="4" height="2" fill={postColor} />
      {/* Barbell on rack */}
      <rect x="-45" y="-4" width="90" height="4" rx="1" fill="#C8C8D0" />
      {/* Plates */}
      <ellipse cx="-43" cy="-2" rx="9" ry="12" fill={plateColor} stroke="#222" strokeWidth="1" />
      <ellipse cx="43" cy="-2" rx="9" ry="12" fill={plateColor} stroke="#222" strokeWidth="1" />
      <ellipse cx="-43" cy="-2" rx="3" ry="4" fill="#1a1a1a" />
      <ellipse cx="43" cy="-2" rx="3" ry="4" fill="#1a1a1a" />
      {/* Base floor plate */}
      <ellipse cx="0" cy="48" rx="32" ry="5" fill="#2A2A3A" opacity="0.5" />
    </g>
  )
}

function WhiteboardOnWall({ pbs }: { pbs: Pick<PersonalBest, 'liftName' | 'value' | 'unit'>[] }) {
  const shown = pbs.slice(0, 5)
  return (
    <g transform="translate(132, 130)">
      {/* Frame */}
      <polygon
        points="-54,-40 54,-44 56,40 -52,44"
        fill="#2B3A2B"
      />
      {/* Board surface */}
      <polygon
        points="-50,-36 50,-40 52,36 -48,40"
        fill="#EBF5E0"
      />
      {/* Subtle light on board */}
      <polygon
        points="-50,-36 -10,-38 -25,38 -48,40"
        fill="#ffffff"
        opacity="0.25"
      />
      {/* Title */}
      <text
        x="1"
        y="-25"
        textAnchor="middle"
        fontFamily="'Press Start 2P', monospace"
        fontSize="6"
        fill="#1A2A1A"
      >
        MY PBs
      </text>
      <line x1="-42" y1="-19" x2="44" y2="-21" stroke="#1A2A1A" strokeWidth="0.6" opacity="0.5" />

      {/* PB entries */}
      {shown.length === 0 ? (
        <text
          x="1"
          y="5"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="5.5"
          fill="#6a6a4a"
          fontStyle="italic"
        >
          Log your first PB...
        </text>
      ) : (
        shown.map((pb, i) => {
          const y = -10 + i * 10
          const nameTrunc = pb.liftName.length > 12 ? pb.liftName.slice(0, 11) + '…' : pb.liftName
          return (
            <g key={pb.liftName}>
              <text
                x="-44"
                y={y}
                fontFamily="monospace"
                fontSize="5.5"
                fill="#1A2A1A"
                fontWeight="bold"
              >
                {nameTrunc}
              </text>
              <text
                x="48"
                y={y}
                textAnchor="end"
                fontFamily="monospace"
                fontSize="5.5"
                fill="#B8320A"
                fontWeight="bold"
              >
                {pb.value}{pb.unit}
              </text>
            </g>
          )
        })
      )}

      {/* Marker */}
      <rect x="38" y="36" width="12" height="3" rx="1" fill="#E63946" transform="rotate(8 44 37)" />
    </g>
  )
}
