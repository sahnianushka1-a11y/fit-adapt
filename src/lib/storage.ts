import type {
  AppState,
  Progress,
  Achievement,
  Level,
  DayPlan,
} from '@/types';

const PROFILE_KEY = 'fitadapt:profile';
const ONBOARDING_KEY = 'fitadapt:onboarding';
const PROGRESS_KEY = 'fitadapt:progress';
const CHECKIN_KEY = 'fitadapt:checkin';

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-step', title: 'First Step', description: 'Complete your first workout', icon: 'Footprints', unlocked: false },
  { id: 'streak-3', title: 'Warming Up', description: 'Reach a 3-day streak', icon: 'Flame', unlocked: false },
  { id: 'streak-7', title: 'Consistent Human', description: 'Reach a 7-day streak', icon: 'CalendarCheck', unlocked: false },
  { id: 'workouts-5', title: 'Getting Real', description: 'Complete 5 workouts', icon: 'Dumbbell', unlocked: false },
  { id: 'workouts-15', title: 'Main Character', description: 'Complete 15 workouts', icon: 'Crown', unlocked: false },
  { id: 'workouts-30', title: 'Beast Mode', description: 'Complete 30 workouts', icon: 'Trophy', unlocked: false },
  { id: 'xp-500', title: 'Leveling Up', description: 'Earn 500 XP', icon: 'Zap', unlocked: false },
  { id: 'early-bird', title: 'Early Bird', description: 'Workout before 8 AM', icon: 'Sunrise', unlocked: false },
];

export function defaultProgress(): Progress {
  return {
    xp: 0,
    streak: 0,
    lastWorkoutDate: null,
    lastRestDayDate: null,
    completedWorkouts: [],
    achievements: DEFAULT_ACHIEVEMENTS,
    weeklyCheckIns: [],
  };
}

export function loadProfile(): AppState['profile'] {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: AppState['profile']) {
  if (p) localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  else localStorage.removeItem(PROFILE_KEY);
}

export function loadOnboarding(): AppState['onboarding'] {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveOnboarding(o: AppState['onboarding']) {
  if (o) localStorage.setItem(ONBOARDING_KEY, JSON.stringify(o));
  else localStorage.removeItem(ONBOARDING_KEY);
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Progress;
    return {
      ...defaultProgress(),
      ...parsed,
      achievements: parsed.achievements?.length ? parsed.achievements : DEFAULT_ACHIEVEMENTS,
    };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(p: Progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

export function loadTodayCheckIn(): boolean {
  try {
    return localStorage.getItem(CHECKIN_KEY) === todayISO();
  } catch {
    return false;
  }
}

export function saveTodayCheckIn() {
  localStorage.setItem(CHECKIN_KEY, todayISO());
}

export function resetAll() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(ONBOARDING_KEY);
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(CHECKIN_KEY);
}

export function levelForXp(xp: number): Level {
  if (xp >= 1500) return 'Beast Mode';
  if (xp >= 700) return 'Main Character';
  if (xp >= 200) return 'Consistent Human';
  return 'Rookie';
}

export function levelInfo(xp: number) {
  const levels: { name: Level; min: number; max: number }[] = [
    { name: 'Rookie', min: 0, max: 200 },
    { name: 'Consistent Human', min: 200, max: 700 },
    { name: 'Main Character', min: 700, max: 1500 },
    { name: 'Beast Mode', min: 1500, max: 3000 },
  ];
  const current = levels.find((l) => xp >= l.min && xp < l.max) ?? levels[levels.length - 1];
  const next = levels.find((l) => l.min === current.max);
  const progress = next
    ? ((xp - current.min) / (current.max - current.min)) * 100
    : 100;
  return { current: current.name, next: next?.name, progress: Math.min(100, Math.max(0, progress)), xpInLevel: xp - current.min, xpForNext: current.max - current.min };
}

export function getStartOfWeek(): Date {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

export function weeklyPlanFromOnboarding(
  workoutDuration: number,
  goal: string
): DayPlan[] {
  const start = getStartOfWeek();
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const restDays = [0, 3]; // Sunday, Wednesday
  const workoutTitles = [
    'Upper Body Push',
    'Lower Body Power',
    'Core & Mobility Flow',
    'Full Body HIIT',
  ];
  let workoutIdx = 0;
  return labels.map((label, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateISO = d.toISOString().slice(0, 10);
    const isRest = restDays.includes(i);
    const today = todayISO();
    return {
      date: dateISO,
      type: isRest ? 'rest' : 'workout',
      label,
      workoutTitle: isRest ? 'Rest & Recover' : workoutTitles[workoutIdx++ % workoutTitles.length],
      completed: dateISO < today && !isRest ? Math.random() > 0.5 : false,
    };
  });
}

export function nextWorkoutDay(plan: DayPlan[]): DayPlan | null {
  const today = todayISO();
  return plan.find((p) => p.date >= today && p.type === 'workout' && !p.completed) ?? null;
}

export function completedThisWeek(workouts: { date: string }[]): number {
  const start = getStartOfWeek().toISOString().slice(0, 10);
  return workouts.filter((w) => w.date >= start).length;
}
