export type CoachPersonality =
  | 'Supportive bestie'
  | 'Savage motivator'
  | 'Calm coach'
  | 'Strict accountability partner';

export type CoachLanguage = 'English' | 'Hindi' | 'Kannada' | 'Hinglish';

export type FitnessGoal =
  | 'Build strength'
  | 'Improve stamina'
  | 'General fitness'
  | 'Improve mobility'
  | 'Weight management';

export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type Equipment =
  | 'No equipment'
  | 'Chair'
  | 'Yoga mat'
  | 'Dumbbells'
  | 'Water bottles'
  | 'Backpack'
  | 'Stairs';

export type GymReason =
  | 'Gym membership but never go'
  | 'Too expensive'
  | 'Chaotic schedule'
  | 'Gym anxiety'
  | 'Prefer home workouts'
  | 'Need accountability';

export interface UserProfile {
  name: string;
  email: string;
  createdAt: string;
}

export interface OnboardingData {
  gymReasons: GymReason[];
  goal: FitnessGoal;
  level: FitnessLevel;
  age: string;
  height: string;
  weight: string;
  wakeTime: string;
  workStart: string;
  workEnd: string;
  sleepTime: string;
  workoutTime: string;
  workoutDuration: 10 | 15 | 20 | 30 | 45;
  equipment: Equipment[];
  avoidMovements: string;
  limitations: string;
  coachLanguage: CoachLanguage;
  coachPersonality: CoachPersonality;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration?: number;
  instructions: string;
  restSeconds: number;
}

export interface GeneratedWorkout {
  title: string;
  estimatedMinutes: number;
  intensity: string;
  whySelected: string;
  exercises: Exercise[];
  safetyNote: string;
}

export interface CompletedWorkout {
  id: string;
  date: string;
  title: string;
  durationMinutes: number;
  intensity: string;
  xpEarned: number;
}

export interface DayPlan {
  date: string;
  type: 'workout' | 'rest';
  label: string;
  workoutTitle?: string;
  completed: boolean;
}

export interface HealthData {
  steps: number;
  sleepHours: number;
  heartRate: number;
  weeklyActiveMinutes: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Progress {
  xp: number;
  streak: number;
  lastWorkoutDate: string | null;
  lastRestDayDate: string | null;
  completedWorkouts: CompletedWorkout[];
  achievements: Achievement[];
  weeklyCheckIns: string[];
}

export type Level = 'Rookie' | 'Consistent Human' | 'Main Character' | 'Beast Mode';

export type Tab = 'home' | 'plan' | 'workouts' | 'progress' | 'profile';

export interface AppState {
  profile: UserProfile | null;
  onboarding: OnboardingData | null;
  progress: Progress;
}
