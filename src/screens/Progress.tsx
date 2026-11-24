import { useMemo, useState } from 'react';
import {
  Flame,
  Zap,
  Trophy,
  Footprints,
  Moon,
  HeartPulse,
  Activity,
  Crown,
  CalendarCheck,
  Dumbbell,
  Sunrise,
  Lock,
  Watch,
  Apple,
  Bluetooth,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, StatCard, ProgressBar, SectionHeader, EmptyState, Badge } from '@/components/ui';
import { levelInfo, completedThisWeek } from '@/lib/storage';
import type { HealthData, Achievement } from '@/types';

const iconMap: Record<string, typeof Flame> = {
  Footprints, Flame, CalendarCheck, Dumbbell, Crown, Trophy, Zap, Sunrise,
};

const defaultHealth: HealthData = {
  steps: 6420,
  sleepHours: 7.2,
  heartRate: 72,
  weeklyActiveMinutes: 85,
};

export function Progress() {
  const { progress, onboarding } = useApp();
  const { current, next, progress: levelProgress, xpInLevel, xpForNext } = levelInfo(progress.xp);
  const [health, setHealth] = useState<HealthData>(defaultHealth);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<HealthData>(defaultHealth);
  const weekCount = completedThisWeek(progress.completedWorkouts);

  const recentWorkouts = useMemo(
    () => [...progress.completedWorkouts].reverse().slice(0, 5),
    [progress.completedWorkouts]
  );

  const unlocked = progress.achievements.filter((a) => a.unlocked);
  const locked = progress.achievements.filter((a) => !a.unlocked);

  const startEdit = () => { setDraft(health); setEditing(true); };
  const saveEdit = () => { setHealth(draft); setEditing(false); };

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="font-display text-3xl font-bold text-white">Progress</h1>
        <p className="mt-1.5 text-sm text-white/50">Your gamified fitness journey · levels, streaks, badges</p>
      </div>

      {/* Level card */}
      <Card className="relative overflow-hidden p-6 animate-fade-up" style={{ animationDelay: '0.05s' }}>
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-lime-400/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">Current level</p>
              <h2 className="font-display text-3xl font-bold gradient-text">{current}</h2>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-300">
              <Crown className="h-8 w-8" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-white/50">{xpInLevel} XP</span>
            <span className="text-white/50">{next ? `${xpForNext} XP → ${next}` : 'Max level reached'}</span>
          </div>
          <ProgressBar value={levelProgress} className="h-3" />
        </div>
      </Card>

      {/* Core stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <StatCard icon={<Flame className="h-5 w-5" />} label="Streak" value={`${progress.streak}`} sub="days" accent="lime" />
        <StatCard icon={<Zap className="h-5 w-5" />} label="Total XP" value={progress.xp} accent="violet" />
        <StatCard icon={<Trophy className="h-5 w-5" />} label="Badges" value={`${unlocked.length}`} sub={`of ${progress.achievements.length}`} accent="cyan" />
        <StatCard icon={<Dumbbell className="h-5 w-5" />} label="Workouts" value={progress.completedWorkouts.length} sub={`${weekCount} this week`} accent="lime" />
      </div>

      {/* Achievements */}
      <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
        <SectionHeader title="Achievements" subtitle="Consistency over intensity" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {progress.achievements.map((a) => (
            <AchievementBadge key={a.id} achievement={a} />
          ))}
        </div>
      </div>

      {/* Health dashboard */}
      <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <SectionHeader
          title="Health overview"
          subtitle="Demo data · manually editable"
          action={
            editing ? (
              <div className="flex gap-2">
                <button onClick={saveEdit} className="rounded-lg bg-lime-400/15 p-2 text-lime-300 hover:bg-lime-400/25">
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => setEditing(false)} className="rounded-lg bg-white/5 p-2 text-white/50 hover:bg-white/10">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button onClick={startEdit} className="btn-ghost py-2 text-xs">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
            )
          }
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <HealthCard
            icon={<Footprints className="h-5 w-5" />}
            label="Steps"
            value={editing ? draft.steps : health.steps}
            unit="today"
            accent="lime"
            editing={editing}
            onChange={(v) => setDraft({ ...draft, steps: v })}
          />
          <HealthCard
            icon={<Moon className="h-5 w-5" />}
            label="Sleep"
            value={editing ? draft.sleepHours : health.sleepHours}
            unit="hours"
            accent="violet"
            editing={editing}
            step={0.1}
            onChange={(v) => setDraft({ ...draft, sleepHours: v })}
          />
          <HealthCard
            icon={<HeartPulse className="h-5 w-5" />}
            label="Heart rate"
            value={editing ? draft.heartRate : health.heartRate}
            unit="bpm"
            accent="cyan"
            editing={editing}
            onChange={(v) => setDraft({ ...draft, heartRate: v })}
          />
          <HealthCard
            icon={<Activity className="h-5 w-5" />}
            label="Active mins"
            value={editing ? draft.weeklyActiveMinutes : health.weeklyActiveMinutes}
            unit="this week"
            accent="lime"
            editing={editing}
            onChange={(v) => setDraft({ ...draft, weeklyActiveMinutes: v })}
          />
        </div>
      </div>

      {/* Connect health data */}
      <Card className="p-5 animate-fade-up" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center gap-2 mb-3">
          <Bluetooth className="h-5 w-5 text-cyan-400" />
          <h3 className="font-display font-semibold text-white">Connect your health data</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: <Apple className="h-6 w-6" />, name: 'Apple Health', status: 'Coming soon' },
            { icon: <Watch className="h-6 w-6" />, name: 'Health Connect', status: 'Coming soon' },
            { icon: <Activity className="h-6 w-6" />, name: 'Wearable sync', status: 'Coming soon' },
          ].map((s) => (
            <div key={s.name} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/40">
                {s.icon}
              </div>
              <p className="text-sm font-medium text-white/70">{s.name}</p>
              <Badge className="mt-2 bg-white/5 text-white/40">{s.status}</Badge>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-white/30">
          Native health integrations are not yet connected. Values shown are demo data.
        </p>
      </Card>

      {/* Recent workouts */}
      <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <SectionHeader title="Recent workouts" subtitle="Your latest sessions" />
        {recentWorkouts.length > 0 ? (
          <div className="space-y-2">
            {recentWorkouts.map((w) => (
              <Card key={w.id} className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10 text-lime-300">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{w.title}</p>
                  <p className="text-xs text-white/40">{w.date} · {w.durationMinutes} min · {w.intensity}</p>
                </div>
                <span className="chip bg-violet-500/15 text-violet-300">+{w.xpEarned} XP</span>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Dumbbell className="h-8 w-8" />}
            title="No workouts yet"
            description="Complete your first workout to see it here and start earning XP."
          />
        )}
      </div>
    </div>
  );
}

function AchievementBadge({ achievement }: { achievement: Achievement }) {
  const Icon = iconMap[achievement.icon] ?? Trophy;
  if (!achievement.unlocked) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center opacity-60">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white/30">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-white/50">{achievement.title}</p>
          <p className="text-[10px] text-white/30 mt-0.5">{achievement.description}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative flex flex-col items-center gap-2 rounded-2xl border border-lime-400/20 bg-lime-400/5 p-4 text-center animate-scale-in">
      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-lime-400" />
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/15 text-lime-300">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-medium text-white">{achievement.title}</p>
        <p className="text-[10px] text-white/40 mt-0.5">{achievement.description}</p>
      </div>
    </div>
  );
}

function HealthCard({
  icon,
  label,
  value,
  unit,
  accent,
  editing,
  onChange,
  step = 1,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  accent: 'lime' | 'violet' | 'cyan';
  editing: boolean;
  onChange: (v: number) => void;
  step?: number;
}) {
  const ring = {
    lime: 'text-lime-300 bg-lime-400/10',
    violet: 'text-violet-400 bg-violet-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
  }[accent];
  return (
    <Card className="p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ring} mb-3`}>
        {icon}
      </div>
      {editing ? (
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full rounded-lg border border-white/10 bg-ink-850 px-2 py-1 text-lg font-display font-bold text-white outline-none focus:border-lime-400/50"
        />
      ) : (
        <p className="font-display text-2xl font-bold text-white">{value}</p>
      )}
      <p className="text-xs text-white/40 mt-0.5">{label} · {unit}</p>
    </Card>
  );
}
