import { useMemo, useState } from 'react';
import {
  Flame,
  Zap,
  TrendingUp,
  CalendarCheck,
  Battery,
  Play,
  Dumbbell,
  Coffee,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, StatCard, ProgressBar, SectionHeader } from '@/components/ui';
import { levelInfo, weeklyPlanFromOnboarding, todayISO, completedThisWeek } from '@/lib/storage';
import { greeting, fitnessLore, randomCoachLine } from '@/lib/coach';
import type { Tab } from '@/types';

export function Dashboard({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const { profile, onboarding, progress, recordCheckIn } = useApp();
  const [energy, setEnergy] = useState<number | null>(null);

  const plan = useMemo(
    () => (onboarding ? weeklyPlanFromOnboarding(onboarding.workoutDuration, onboarding.goal) : []),
    [onboarding]
  );
  const todayPlan = plan.find((p) => p.date === todayISO());
  const weekCount = completedThisWeek(progress.completedWorkouts);
  const { current, progress: levelProgress, xpInLevel, xpForNext } = levelInfo(progress.xp);
  const lore = useMemo(() => fitnessLore(progress, profile?.name ?? ''), [progress, profile?.name]);
  const coachMsg = useMemo(
    () => randomCoachLine(onboarding?.coachPersonality ?? 'Supportive bestie'),
    [onboarding?.coachPersonality]
  );

  if (!profile || !onboarding) return null;

  const checkIn = (e: number) => {
    setEnergy(e);
    recordCheckIn();
  };

  return (
    <div className="space-y-6">
      {/* Hero greeting */}
      <div className="animate-fade-up">
        <p className="text-sm text-white/50">{greeting(profile.name)}</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-white text-balance lg:text-4xl">
          Ready to stop negotiating with your alarm?
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 animate-fade-up" style={{ animationDelay: '0.05s' }}>
        <StatCard icon={<Flame className="h-5 w-5" />} label="Streak" value={`${progress.streak}`} sub={progress.streak === 1 ? 'day' : 'days'} accent="lime" />
        <StatCard icon={<Zap className="h-5 w-5" />} label="XP" value={progress.xp} sub={`${xpForNext - xpInLevel} to next level`} accent="violet" />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Level" value={current} accent="cyan" />
        <StatCard icon={<CalendarCheck className="h-5 w-5" />} label="This week" value={`${weekCount}/5`} sub="workouts" accent="lime" />
      </div>

      {/* Level progress bar */}
      <Card className="p-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-lime-300" />
            <span className="text-sm font-medium text-white">Level progress</span>
          </div>
          <span className="text-xs text-white/40">{xpInLevel} / {xpForNext} XP</span>
        </div>
        <ProgressBar value={levelProgress} />
      </Card>

      {/* Energy check-in + today's workout */}
      <div className="grid gap-4 lg:grid-cols-2 animate-fade-up" style={{ animationDelay: '0.15s' }}>
        {/* Energy check-in */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Battery className="h-5 w-5 text-cyan-400" />
            <h3 className="font-display font-semibold text-white">Today's energy check-in</h3>
          </div>
          {energy !== null ? (
            <div className="animate-scale-in">
              <div className={`rounded-2xl p-4 ${energy >= 3 ? 'bg-lime-400/10 border border-lime-400/20' : 'bg-violet-500/10 border border-violet-500/20'}`}>
                <p className="text-sm text-white">
                  {energy <= 1 ? "Low energy day. We'll keep it gentle and still move." :
                   energy === 2 ? "Mid energy. A moderate session is on the menu." :
                   "High energy. Let's make it count."}
                </p>
                <p className="mt-1 text-xs text-lime-300">+10 XP for checking in</p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-white/50 mb-3">How are you feeling right now?</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { v: 1, label: 'Drained', emoji: '😵' },
                  { v: 2, label: 'Meh', emoji: '😐' },
                  { v: 3, label: 'Good', emoji: '🙂' },
                  { v: 4, label: 'Fired up', emoji: '🔥' },
                ].map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() => checkIn(opt.v)}
                    className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/5 py-3 transition-all hover:bg-white/10 hover:border-lime-400/30 active:scale-95"
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <span className="text-[10px] text-white/60">{opt.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Today's workout */}
        <Card className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="h-5 w-5 text-lime-300" />
            <h3 className="font-display font-semibold text-white">Today's recommendation</h3>
          </div>
          {todayPlan ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className={`chip ${todayPlan.type === 'rest' ? 'bg-violet-500/15 text-violet-300' : 'bg-lime-400/15 text-lime-300'}`}>
                  {todayPlan.type === 'rest' ? <Coffee className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  {todayPlan.type === 'rest' ? 'Rest day' : 'Workout'}
                </span>
                <span className="text-xs text-white/40">{onboarding.workoutDuration} min</span>
              </div>
              <p className="font-display text-lg font-semibold text-white">{todayPlan.workoutTitle}</p>
              <p className="text-sm text-white/50 mt-1 flex-1">
                {todayPlan.type === 'rest'
                  ? "Recovery is where the gains happen. Stretch, hydrate, sleep well."
                  : `Tuned for ${onboarding.goal.toLowerCase()} · ${onboarding.level.toLowerCase()} level`}
              </p>
              <button
                onClick={() => onNavigate(todayPlan.type === 'rest' ? 'plan' : 'workouts')}
                className="btn-primary mt-4 w-full"
              >
                {todayPlan.type === 'rest' ? 'View weekly plan' : 'Generate workout'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <p className="text-sm text-white/50">No plan for today. Head to My Plan to set one up.</p>
          )}
        </Card>
      </div>

      {/* Weekly calendar */}
      <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <SectionHeader title="This week" subtitle="Your adaptive weekly plan" />
        <Card className="p-5">
          <div className="grid grid-cols-7 gap-2">
            {plan.map((day) => {
              const isToday = day.date === todayISO();
              return (
                <div
                  key={day.date}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-2.5 transition-all ${
                    isToday ? 'border-lime-400/40 bg-lime-400/5' : 'border-white/5 bg-white/[0.02]'
                  }`}
                >
                  <span className="text-[10px] font-medium uppercase text-white/40">{day.label}</span>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                    day.completed ? 'bg-lime-400 text-ink-950' :
                    day.type === 'rest' ? 'bg-violet-500/15 text-violet-300' :
                    isToday ? 'bg-white/10 text-white ring-2 ring-lime-400/40' :
                    'bg-white/5 text-white/40'
                  }`}>
                    {day.completed ? '✓' : day.type === 'rest' ? ' Rest' : new Date(day.date).getDate()}
                  </div>
                  <span className="text-[9px] text-white/30 text-center leading-tight">
                    {day.type === 'rest' ? 'Rest' : day.workoutTitle?.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Coach message */}
      <Card className="relative overflow-hidden p-6 animate-fade-up" style={{ animationDelay: '0.25s' }}>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-600/15 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-violet-300">Your coach says</span>
          </div>
          <p className="font-display text-xl font-semibold text-white text-balance">{coachMsg}</p>
        </div>
      </Card>

      {/* Fitness lore */}
      <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <SectionHeader title="Your fitness lore" subtitle="Dynamic observations from your activity" />
        <Card className="p-5">
          <ul className="space-y-3">
            {lore.map((line, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-400" />
                {line}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
