import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AppState,
  UserProfile,
  OnboardingData,
  Progress,
  CompletedWorkout,
} from '@/types';
import {
  loadProfile,
  saveProfile,
  loadOnboarding,
  saveOnboarding,
  loadProgress,
  saveProgress,
  defaultProgress,
  todayISO,
  daysBetween,
} from '@/lib/storage';

interface AppContextValue {
  profile: UserProfile | null;
  onboarding: OnboardingData | null;
  progress: Progress;
  isOnboarded: boolean;
  setProfile: (p: UserProfile) => void;
  setOnboarding: (o: OnboardingData) => void;
  recordWorkout: (workout: Omit<CompletedWorkout, 'id' | 'xpEarned'>) => number;
  recordRestDay: () => void;
  recordCheckIn: () => void;
  resetProgress: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const XP_PER_WORKOUT = 50;
const XP_PER_CHECKIN = 10;

function recomputeStreak(progress: Progress): Progress {
  const today = todayISO();
  if (!progress.lastWorkoutDate && !progress.lastRestDayDate) {
    return { ...progress, streak: 0 };
  }
  const lastActive = progress.lastWorkoutDate ?? progress.lastRestDayDate!;
  const gap = daysBetween(lastActive, today);
  if (gap <= 1) return progress;
  return { ...progress, streak: 0 };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(() => loadProfile());
  const [onboarding, setOnboardingState] = useState<OnboardingData | null>(() => loadOnboarding());
  const [progress, setProgress] = useState<Progress>(() => {
    const p = loadProgress();
    return recomputeStreak(p);
  });

  useEffect(() => { saveProfile(profile); }, [profile]);
  useEffect(() => { saveOnboarding(onboarding); }, [onboarding]);
  useEffect(() => { saveProgress(progress); }, [progress]);

  const value = useMemo<AppContextValue>(() => ({
    profile,
    onboarding,
    progress,
    isOnboarded: !!profile && !!onboarding,
    setProfile: (p) => setProfileState(p),
    setOnboarding: (o) => setOnboardingState(o),
    recordWorkout: (workout) => {
      const xp = XP_PER_WORKOUT;
      setProgress((prev) => {
        const today = todayISO();
        const wasYesterday = prev.lastWorkoutDate && daysBetween(prev.lastWorkoutDate, today) === 1;
        const newStreak = wasYesterday ? prev.streak + 1 : (prev.lastWorkoutDate === today ? prev.streak : 1);
        const completed: CompletedWorkout = {
          ...workout,
          id: crypto.randomUUID(),
          xpEarned: xp,
        };
        const newProgress: Progress = {
          ...prev,
          xp: prev.xp + xp,
          streak: Math.max(prev.streak, newStreak),
          lastWorkoutDate: today,
          completedWorkouts: [...prev.completedWorkouts, completed],
        };
        return unlockAchievements(newProgress, today, workout.date);
      });
      return xp;
    },
    recordRestDay: () => {
      setProgress((prev) => {
        const today = todayISO();
        if (prev.lastRestDayDate === today) return prev;
        const wasYesterday = prev.lastRestDayDate && daysBetween(prev.lastRestDayDate, today) === 1;
        const newStreak = wasYesterday ? prev.streak + 1 : prev.streak;
        return { ...prev, streak: Math.max(prev.streak, newStreak), lastRestDayDate: today };
      });
    },
    recordCheckIn: () => {
      setProgress((prev) => {
        const today = todayISO();
        if (prev.weeklyCheckIns.includes(today)) return prev;
        return {
          ...prev,
          xp: prev.xp + XP_PER_CHECKIN,
          weeklyCheckIns: [...prev.weeklyCheckIns, today],
        };
      });
    },
    resetProgress: () => setProgress(defaultProgress()),
    logout: () => {
      setProfileState(null);
      setOnboardingState(null);
      setProgress(defaultProgress());
    },
  }), [profile, onboarding, progress]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

function unlockAchievements(progress: Progress, today: string, workoutDate: string): Progress {
  const ach = [...progress.achievements];
  const count = progress.completedWorkouts.length;
  const unlock = (id: string) => {
    const idx = ach.findIndex((a) => a.id === id);
    if (idx >= 0 && !ach[idx].unlocked) {
      ach[idx] = { ...ach[idx], unlocked: true, unlockedAt: today };
    }
  };
  if (count >= 1) unlock('first-step');
  if (progress.streak >= 3) unlock('streak-3');
  if (progress.streak >= 7) unlock('streak-7');
  if (count >= 5) unlock('workouts-5');
  if (count >= 15) unlock('workouts-15');
  if (count >= 30) unlock('workouts-30');
  if (progress.xp >= 500) unlock('xp-500');
  const d = new Date(workoutDate + 'T07:00:00');
  const hour = new Date().getHours();
  if (hour < 8) unlock('early-bird');
  return { ...progress, achievements: ach };
}
