// Master progression config — change thresholds here without touching game logic

export const PROGRESSION_CONFIG = {
  xp: {
    dailyCheckIn: 20,
    streakMilestoneBonus: 10,   // awarded every 7-day streak milestone
    pbUpdate: 15,               // awarded when a PB is set or improved
    pbFirst: 5,                 // extra XP for logging a lift for the first time
  },

  levels: [
    { level: 1, label: 'Beginner',    minXP: 0,    maxXP: 99   },
    { level: 2, label: 'Trainee',     minXP: 100,  maxXP: 249  },
    { level: 3, label: 'Athlete',     minXP: 250,  maxXP: 499  },
    { level: 4, label: 'Advanced',    minXP: 500,  maxXP: 899  },
    { level: 5, label: 'Elite',       minXP: 900,  maxXP: 1399 },
    { level: 6, label: 'Champion',    minXP: 1400, maxXP: 1999 },
    { level: 7, label: 'Legend',      minXP: 2000, maxXP: 2999 },
    { level: 8, label: 'Mythic',      minXP: 3000, maxXP: Infinity },
  ],

  // Avatar visual stage gates (based on totalWorkouts)
  avatarStages: [
    { stage: 1, label: 'Newbie',    minWorkouts: 0  },
    { stage: 2, label: 'Trainee',   minWorkouts: 7  },
    { stage: 3, label: 'Athlete',   minWorkouts: 21 },
    { stage: 4, label: 'Elite',     minWorkouts: 50 },
  ],

  // Room visual stage gates (based on totalWorkouts)
  roomStages: [
    { stage: 1, label: 'Basic Gym',     minWorkouts: 0  },
    { stage: 2, label: 'Upgraded Gym',  minWorkouts: 10 },
    { stage: 3, label: 'Advanced Gym',  minWorkouts: 30 },
    { stage: 4, label: 'Elite Gym',     minWorkouts: 75 },
  ],

  // Streak milestone thresholds that earn bonus XP
  streakMilestones: [7, 14, 21, 30, 60, 90, 180, 365],
} as const

export type LevelConfig = typeof PROGRESSION_CONFIG.levels[number]
export type AvatarStageConfig = typeof PROGRESSION_CONFIG.avatarStages[number]
export type RoomStageConfig = typeof PROGRESSION_CONFIG.roomStages[number]

// Common lifts for the PB tracker
export const DEFAULT_LIFTS = [
  'Bench Press',
  'Squat',
  'Deadlift',
  'Overhead Press',
  'Pull-ups',
  'Barbell Row',
  'Incline Bench',
  'Romanian Deadlift',
] as const
