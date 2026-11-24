import { useMemo } from 'react';
import {
  CalendarDays,
  Dumbbell,
  Coffee,
  Check,
  ChevronRight,
  Clock,
  Flame,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, SectionHeader, EmptyState, StatCard } from '@/components/ui';
import { weeklyPlanFromOnboarding, todayISO, completedThisWeek } from '@/lib/storage';
import type { Tab } from '@/types';

export function WeeklyPlan({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const { onboarding, progress } = useApp();

  const plan = useMemo(
    () => (onboarding ? weeklyPlanFromOnboarding(onboarding.workoutDuration, onboarding.goal) : []),
    [onboarding]
  );

  if (!onboarding) return null;

  const today = todayISO();
  const todayPlan = plan.find((p) => p.date === today);
  const weekCount = completedThisWeek(progress.completedWorkouts);
  const totalWorkouts = plan.filter((p) => p.type === 'workout').length;
  const completedCount = plan.filter((p) => p.completed).length;

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="font-display text-3xl font-bold text-white">My Plan</h1>
        <p className="mt-1.5 text-sm text-white/50">Your adaptive weekly schedule · built around your life</p>
      </div>

      {/* Week stats */}
      <div className="grid grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: '0.05s' }}>
        <StatCard icon={<CalendarDays className="h-5 w-5" />} label="Completed" value={`${completedCount}`} sub={`of ${totalWorkouts} workouts`} accent="lime" />
        <StatCard icon={<Flame className="h-5 w-5" />} label="Streak" value={`${progress.streak}`} sub="days" accent="violet" />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Weekly mins" value={`${weekCount * onboarding.workoutDuration}`} sub="active" accent="cyan" />
      </div>

      {/* Today's plan highlight */}
      {todayPlan && (
        <Card className="relative overflow-hidden p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-lime-400/10 blur-3xl" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-lime-300">Today</p>
              <h2 className="mt-1 font-display text-xl font-bold text-white">{todayPlan.workoutTitle}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className={`chip ${todayPlan.type === 'rest' ? 'bg-violet-500/15 text-violet-300' : 'bg-lime-400/15 text-lime-300'}`}>
                  {todayPlan.type === 'rest' ? <Coffee className="h-3 w-3" /> : <Dumbbell className="h-3 w-3" />}
                  {todayPlan.type === 'rest' ? 'Rest day' : 'Workout'}
                </span>
                {todayPlan.type === 'workout' && (
                  <span className="chip bg-white/5 text-white/60">{onboarding.workoutDuration} min · {onboarding.level}</span>
                )}
              </div>
            </div>
            {todayPlan.type === 'workout' && (
              <button onClick={() => onNavigate('workouts')} className="btn-primary shrink-0">
                Start <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Full week schedule */}
      <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
        <SectionHeader title="Weekly schedule" subtitle="Adapted to your preferred workout time" />
        <div className="space-y-3">
          {plan.map((day, i) => {
            const isToday = day.date === today;
            const isPast = day.date < today;
            return (
              <Card
                key={day.date}
                className={`p-4 transition-all ${isToday ? 'border-lime-400/30' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Day indicator */}
                  <div className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl ${
                    day.completed ? 'bg-lime-400 text-ink-950' :
                    day.type === 'rest' ? 'bg-violet-500/15 text-violet-300' :
                    isToday ? 'bg-white/10 text-white ring-2 ring-lime-400/30' :
                    isPast ? 'bg-white/5 text-white/30' : 'bg-white/5 text-white/60'
                  }`}>
                    <span className="text-[9px] font-medium uppercase">{day.label}</span>
                    <span className="text-base font-bold">{new Date(day.date).getDate()}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white truncate">{day.workoutTitle}</h3>
                      {day.completed && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime-400 text-ink-950 shrink-0">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        {day.type === 'rest' ? <Coffee className="h-3 w-3" /> : <Dumbbell className="h-3 w-3" />}
                        {day.type === 'rest' ? 'Rest & recover' : `${onboarding.workoutDuration} min · ${day.label}`}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  {day.type === 'workout' && !day.completed && day.date >= today && (
                    <button
                      onClick={() => onNavigate('workouts')}
                      className="shrink-0 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {isToday ? 'Start' : 'Preview'}
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Plan logic note */}
      <Card className="p-5 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-start gap-3">
          <CalendarDays className="h-5 w-5 shrink-0 text-cyan-400" />
          <div>
            <p className="text-sm font-medium text-white">How your plan adapts</p>
            <p className="mt-1 text-sm text-white/50">
              Workouts are scheduled around your preferred {onboarding.workoutTime} slot with {onboarding.workoutDuration}-minute sessions.
              Rest days are built in so your streak survives recovery. Your plan reshuffles as you complete workouts.
            </p>
          </div>
        </div>
      </Card>

      {progress.completedWorkouts.length === 0 && (
        <EmptyState
          icon={<CalendarDays className="h-8 w-8" />}
          title="No completed workouts yet"
          description="Finish your first session to see it reflected here and start building your streak."
          action={<button onClick={() => onNavigate('workouts')} className="btn-primary">Generate a workout</button>}
        />
      )}
    </div>
  );
}
