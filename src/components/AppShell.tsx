import { Home, CalendarDays, Dumbbell, TrendingUp, User, Dumbbell as Logo } from 'lucide-react';
import type { Tab } from '@/types';
import { useApp } from '@/context/AppContext';
import { levelInfo } from '@/lib/storage';

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'plan', label: 'My Plan', icon: CalendarDays },
  { id: 'workouts', label: 'Workouts', icon: Dumbbell },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'profile', label: 'Profile', icon: User },
];

export function AppShell({
  active,
  onNavigate,
  children,
}: {
  active: Tab;
  onNavigate: (tab: Tab) => void;
  children: React.ReactNode;
}) {
  const { profile, progress } = useApp();
  const { current, progress: levelProgress } = levelInfo(progress.xp);

  return (
    <div className="relative min-h-screen bg-ink-950">
      <div className="fixed inset-0 bg-radial-glow pointer-events-none" />
      <div className="fixed -top-32 -right-32 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-60 flex-col border-r border-white/5 bg-ink-900/80 backdrop-blur-xl lg:flex">
        <div className="flex items-center gap-2.5 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-ink-950">
            <Logo className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">FITADAPT</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {tabs.map((t) => (
            <NavBtn key={t.id} tab={t} active={active === t.id} onClick={() => onNavigate(t.id)} />
          ))}
        </nav>

        <div className="px-3 pb-6">
          <div className="rounded-2xl border border-white/5 bg-ink-850/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50">{profile?.name}</span>
              <span className="text-xs font-medium text-lime-300">{current}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-lime-400 transition-all" style={{ width: `${levelProgress}%` }} />
            </div>
            <p className="mt-1.5 text-[10px] text-white/30">{progress.xp} XP</p>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-ink-900/80 px-5 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400 text-ink-950">
            <Logo className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="font-display text-base font-bold">FITADAPT</span>
        </div>
        <span className="text-xs font-medium text-lime-300">{current} · {progress.xp} XP</span>
      </header>

      {/* Content */}
      <main className="relative lg:pl-60">
        <div className="mx-auto max-w-5xl px-4 py-6 pb-28 lg:px-8 lg:py-8 lg:pb-12">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-ink-900/90 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onNavigate(t.id)}
                className="flex flex-1 flex-col items-center gap-1 py-1.5 transition-colors"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                  isActive ? 'bg-lime-400/15 text-lime-300 scale-110' : 'text-white/40'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-[10px] ${isActive ? 'text-lime-300 font-medium' : 'text-white/40'}`}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function NavBtn({
  tab,
  active,
  onClick,
}: {
  tab: { id: Tab; label: string; icon: typeof Home };
  active: boolean;
  onClick: () => void;
}) {
  const Icon = tab.icon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
        active ? 'bg-lime-400/10 text-lime-300' : 'text-white/50 hover:bg-white/5 hover:text-white/80'
      }`}
    >
      <Icon className="h-5 w-5" />
      {tab.label}
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-lime-400" />}
    </button>
  );
}
