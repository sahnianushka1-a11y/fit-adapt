import { useState } from 'react';
import {
  User,
  Target,
  Activity,
  Clock,
  Package,
  MessageSquare,
  LogOut,
  Trash2,
  ChevronRight,
  Crown,
  Zap,
  Flame,
  Pencil,
  Check,
  X,
  Dumbbell,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, SectionHeader, ProgressBar, Badge } from '@/components/ui';
import { levelInfo } from '@/lib/storage';
import type { Tab } from '@/types';

export function Profile({ onNavigate, onLogout }: { onNavigate: (t: Tab) => void; onLogout: () => void }) {
  const { profile, onboarding, progress, logout, resetProgress, setProfile } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(profile?.name ?? '');

  if (!profile || !onboarding) return null;

  const { current, progress: levelProgress, xpInLevel, xpForNext } = levelInfo(progress.xp);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleReset = () => {
    resetProgress();
    setConfirmReset(false);
  };

  const saveName = () => {
    if (nameDraft.trim() && profile) {
      setProfile({ ...profile, name: nameDraft.trim() });
    }
    setEditingName(false);
  };

  const profileItems = [
    { icon: <Target className="h-4 w-4" />, label: 'Goal', value: onboarding.goal },
    { icon: <Activity className="h-4 w-4" />, label: 'Level', value: onboarding.level },
    { icon: <Clock className="h-4 w-4" />, label: 'Workout time', value: `${onboarding.workoutTime} · ${onboarding.workoutDuration} min` },
    { icon: <Package className="h-4 w-4" />, label: 'Equipment', value: onboarding.equipment.join(', ') || 'None' },
    { icon: <MessageSquare className="h-4 w-4" />, label: 'Coach', value: `${onboarding.coachPersonality} · ${onboarding.coachLanguage}` },
  ];

  const bodyStats = [
    { label: 'Age', value: onboarding.age || '—' },
    { label: 'Height', value: onboarding.height ? `${onboarding.height} cm` : '—' },
    { label: 'Weight', value: onboarding.weight ? `${onboarding.weight} kg` : '—' },
  ];

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <Card className="relative overflow-hidden p-6 animate-fade-up">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-lime-400 to-cyan-500 text-ink-950 shadow-glow">
            <span className="font-display text-3xl font-bold">{profile.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  className="rounded-lg border border-white/10 bg-ink-850 px-3 py-1.5 text-xl font-display font-bold text-white outline-none focus:border-lime-400/50"
                  autoFocus
                />
                <button onClick={saveName} className="rounded-lg bg-lime-400/15 p-2 text-lime-300">
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => setEditingName(false)} className="rounded-lg bg-white/5 p-2 text-white/50">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-white truncate">{profile.name}</h1>
                <button onClick={() => { setNameDraft(profile.name); setEditingName(true); }} className="text-white/30 hover:text-white/60">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            )}
            <p className="text-sm text-white/40 truncate">{profile.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge className="bg-lime-400/15 text-lime-300"><Crown className="h-3 w-3" /> {current}</Badge>
              <Badge className="bg-violet-500/15 text-violet-300"><Zap className="h-3 w-3" /> {progress.xp} XP</Badge>
              <Badge className="bg-white/5 text-white/60"><Flame className="h-3 w-3" /> {progress.streak} day streak</Badge>
            </div>
          </div>
        </div>
        <div className="relative mt-5">
          <div className="flex items-center justify-between mb-1.5 text-xs text-white/40">
            <span>{xpInLevel} XP</span>
            <span>{xpForNext - xpInLevel} to next level</span>
          </div>
          <ProgressBar value={levelProgress} />
        </div>
      </Card>

      {/* Body stats */}
      <div className="grid grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: '0.05s' }}>
        {bodyStats.map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-white/40">{s.label}</p>
            <p className="mt-1 font-display text-lg font-bold text-white">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Fitness profile */}
      <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <SectionHeader title="Fitness profile" subtitle="From your onboarding" />
        <Card className="divide-y divide-white/5">
          {profileItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-lime-300">
                {item.icon}
              </div>
              <span className="text-sm text-white/50 flex-1">{item.label}</span>
              <span className="text-sm font-medium text-white text-right">{item.value}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Limitations */}
      {(onboarding.limitations || onboarding.avoidMovements) && (
        <Card className="p-5 animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-medium text-white/70">Movement notes</h3>
          </div>
          {onboarding.avoidMovements && (
            <p className="text-sm text-white/60"><span className="text-white/40">Avoid:</span> {onboarding.avoidMovements}</p>
          )}
          {onboarding.limitations && (
            <p className="text-sm text-white/60 mt-1"><span className="text-white/40">Limitations:</span> {onboarding.limitations}</p>
          )}
        </Card>
      )}

      {/* Quick actions */}
      <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <SectionHeader title="Actions" />
        <Card className="divide-y divide-white/5">
          <ActionRow icon={<Dumbbell className="h-4 w-4" />} label="Generate a workout" onClick={() => onNavigate('workouts')} />
          <ActionRow icon={<Target className="h-4 w-4" />} label="View weekly plan" onClick={() => onNavigate('plan')} />
        </Card>
      </div>

      {/* Danger zone */}
      <Card className="p-5 animate-fade-up border-rose-500/15" style={{ animationDelay: '0.25s' }}>
        <h3 className="text-sm font-medium text-rose-300 mb-3">Danger zone</h3>
        <div className="space-y-2">
          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)} className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-sm text-white/60 hover:bg-white/10 transition-colors">
              <Trash2 className="h-4 w-4" /> Reset progress (XP, streak, badges)
            </button>
          ) : (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
              <p className="text-sm text-white/60 mb-3">This will reset your XP, streak and achievements. This cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={handleReset} className="rounded-lg bg-rose-500/20 px-4 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/30">
                  Yes, reset
                </button>
                <button onClick={() => setConfirmReset(false)} className="rounded-lg bg-white/5 px-4 py-2 text-sm text-white/60">
                  Cancel
                </button>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-sm text-white/60 hover:bg-white/10 transition-colors">
            <LogOut className="h-4 w-4" /> Log out & start fresh
          </button>
        </div>
      </Card>

      <p className="text-center text-xs text-white/20">FITADAPT · MVP · Built for Gen-Z fitness</p>
    </div>
  );
}

function ActionRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-white/5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-lime-300">
        {icon}
      </div>
      <span className="text-sm text-white flex-1">{label}</span>
      <ChevronRight className="h-4 w-4 text-white/30" />
    </button>
  );
}
