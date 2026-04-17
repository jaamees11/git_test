export interface User {
  id: string
  email: string
  name: string | null
  createdAt: string
}

export interface WorkoutCheckIn {
  id: string
  userId: string
  date: string
  createdAt: string
}

export interface PersonalBest {
  id: string
  userId: string
  liftName: string
  value: number
  unit: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface UserProgress {
  id: string
  userId: string
  xp: number
  level: number
  currentStreak: number
  longestStreak: number
  totalWorkouts: number
  avatarStage: number
  roomStage: number
  updatedAt: string
}

export interface ActivityLog {
  id: string
  userId: string
  type: ActivityType
  message: string
  xpGained: number | null
  createdAt: string
}

export type ActivityType =
  | 'checkin'
  | 'pb_update'
  | 'level_up'
  | 'streak_milestone'
  | 'avatar_upgrade'
  | 'room_upgrade'

export interface DashboardData {
  user: User
  progress: UserProgress
  personalBests: PersonalBest[]
  recentActivity: ActivityLog[]
  checkIns: WorkoutCheckIn[]
  checkedInToday: boolean
}

export interface CheckInResult {
  success: boolean
  xpGained: number
  bonusXP: number
  newXP: number
  newLevel: number
  oldLevel: number
  newStreak: number
  isStreakMilestone: boolean
  milestoneValue?: number
  isLevelUp: boolean
  isAvatarUpgrade: boolean
  isRoomUpgrade: boolean
  newAvatarStage: number
  newRoomStage: number
  message: string
}

export interface AuthUser {
  id: string
  email: string
  name: string | null
}
