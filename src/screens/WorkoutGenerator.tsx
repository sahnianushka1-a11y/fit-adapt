import { useState } from 'react';
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  WifiOff,
  Clock,
  Flame,
  Dumbbell,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  ListChecks,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, SectionHeader, EmptyState, ProgressBar } from '@/components/ui';
import { generateWorkout, paramsFromOnboarding, type GenerateParams } from '@/lib/api';
import type { GeneratedWorkout, Tab } from '@/types';

export function WorkoutGenerator({ onNavigate, onWorkoutReady }: {
  onNavigate: (t: Tab) => void;
  onWorkoutReady: (w: GeneratedWorkout) => void;
}) {
  const { onboarding, progress } = useApp();
  const [energy, setEnergy] = useState('moderate');
  const [soreness, setSoreness] = useState('none');
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  if (!onboarding) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setOffline(false);
    setWorkout(null);

    const params: GenerateParams = paramsFromOnboarding(onboarding, energy, soreness);
    const res = await generateWorkout(params);

    setLoading(false);
    if (res.data) {
      setWorkout(res.data);
    } else {
      setError(res.error ?? 'Something went wrong.');
      setOffline(!!res.offline);
    }
  };

  const energyOptions = [
    { v: 'low', label: 'Low', emoji: '😵' },
    { v: 'moderate', label: 'Moderate', emoji: '😐' },
    { v: 'high', label: 'High', emoji: '🔥' },
  ];
  const sorenessOptions = [
    { v: 'none', label: 'None' },
    { v: 'light', label: 'Light' },
    { v: 'moderate', label: 'Moderate' },
    { v: 'heavy', label: 'Heavy' },
  ];

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="font-display text-3xl font-bold text-white">AI Workout Generator</h1>
        <p className="mt-1.5 text-sm text-white/50">
          Powered by your coach backend · tuned to today's energy and soreness
        </p>
      </div>

      {/* Current profile summary */}
      <Card className="p-5 animate-fade-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Goal', value: onboarding.goal },
            { label: 'Level', value: onboarding.level },
            { label: 'Duration', value: `${onboarding.workoutDuration} min` },
            { label: 'Equipment', value: onboarding.equipment.join(', ') || 'None' },
            ...(onboarding.limitations && onboarding.limitations !== 'Prefer not to say' ? [{ label: 'Limits', value: onboarding.limitations }] : []),
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-white/40">{item.label}</p>
              <p className="text-sm text-white/80">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Energy + soreness selectors */}
      <div className="grid gap-4 lg:grid-cols-2 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-medium text-white/70">Energy level today</h3>
          <div className="grid grid-cols-3 gap-2">
            {energyOptions.map((opt) => (
              <button
                key={opt.v}
                onClick={() => setEnergy(opt.v)}
                className={`flex flex-col items-center gap-1 rounded-xl border py-3 transition-all active:scale-95 ${
                  energy === opt.v
                    ? 'border-lime-400/50 bg-lime-400/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className={`text-xs ${energy === opt.v ? 'text-lime-300' : 'text-white/60'}`}>{opt.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-medium text-white/70">Soreness level</h3>
          <div className="grid grid-cols-4 gap-2">
            {sorenessOptions.map((opt) => (
              <button
                key={opt.v}
                onClick={() => setSoreness(opt.v)}
                className={`rounded-xl border py-3 text-xs font-medium transition-all active:scale-95 ${
                  soreness === opt.v
                    ? 'border-violet-500/50 bg-violet-500/10 text-violet-300'
                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Generate button */}
      <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
        <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full text-base">
          {loading ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Generating your workout…</>
          ) : workout ? (
            <><RotateCcw className="h-5 w-5" /> Regenerate workout</>
          ) : (
            <><Sparkles className="h-5 w-5" /> Generate my workout</>
          )}
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <Card className="p-6 animate-fade-in">
          <div className="space-y-3">
            <div className="skeleton h-6 w-2/3 rounded-lg" />
            <div className="skeleton h-4 w-1/3 rounded-lg" />
            <div className="skeleton h-20 w-full rounded-xl" />
            <div className="skeleton h-20 w-full rounded-xl" />
          </div>
          <p className="mt-4 text-center text-sm text-white/40">Your AI coach is building a personalised plan…</p>
        </Card>
      )}

      {/* Error state */}
      {error && !loading && (
        <Card className="p-6 animate-scale-in border-rose-500/20">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-300">
              {offline ? <WifiOff className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-semibold text-white">{offline ? 'Backend unavailable' : 'Could not generate workout'}</h3>
              <p className="mt-1 text-sm text-white/50">{error}</p>
              {offline && (
                <div className="mt-3 rounded-xl border border-white/5 bg-white/5 p-3 text-xs text-white/50">
                  <p className="font-medium text-white/70">To connect your backend:</p>
                  <ol className="mt-1.5 list-decimal pl-4 space-y-0.5">
                    <li>Run your Node.js + Express + Gemini server on port 8787</li>
                    <li>Ensure <code className="text-lime-300">POST /api/workout</code> is available</li>
                    <li>Set <code className="text-lime-300">VITE_API_URL</code> if the URL differs</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Workout result */}
      {workout && !loading && (
        <WorkoutCard workout={workout} onStart={() => { onWorkoutReady(workout); onNavigate('workouts'); }} />
      )}

      {/* Empty state */}
      {!workout && !loading && !error && (
        <EmptyState
          icon={<Dumbbell className="h-8 w-8" />}
          title="No workout yet"
          description="Set your energy and soreness, then hit generate. Your AI coach will build a plan tuned to today."
        />
      )}
    </div>
  );
}

function WorkoutCard({ workout, onStart }: { workout: GeneratedWorkout; onStart: () => void }) {
  return (
    <div className="space-y-4 animate-scale-in">
      <Card className="relative overflow-hidden p-6">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-lime-400/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="chip bg-lime-400/15 text-lime-300"><Sparkles className="h-3 w-3" /> AI-generated</span>
            <span className="chip bg-white/5 text-white/50"><Clock className="h-3 w-3" /> {workout.estimatedMinutes} min</span>
            <span className="chip bg-violet-500/15 text-violet-300"><Flame className="h-3 w-3" /> {workout.intensity}</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">{workout.title}</h2>

          <div className="mt-4 rounded-2xl border border-lime-400/15 bg-lime-400/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-lime-300 mb-1">Why this workout</p>
            <p className="text-sm text-white/70">{workout.whySelected}</p>
          </div>
        </div>
      </Card>

      {/* Exercise list */}
      <Card className="p-5">
        <SectionHeader title="Exercises" subtitle={`${workout.exercises.length} moves`} />
        <div className="space-y-3">
          {workout.exercises.map((ex, i) => (
            <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-lime-400/10 text-xs font-bold text-lime-300">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{ex.name}</h4>
                    <p className="text-sm text-white/50 mt-0.5">{ex.instructions}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="chip bg-white/5 text-white/60">{ex.sets} sets × {ex.reps}</span>
                      {ex.duration && <span className="chip bg-white/5 text-white/60"><Clock className="h-3 w-3" /> {ex.duration}s</span>}
                      <span className="chip bg-violet-500/10 text-violet-300">{ex.restSeconds}s rest</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Safety note */}
      {workout.safetyNote && (
        <Card className="border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-amber-300">Safety note</p>
              <p className="text-sm text-white/70 mt-0.5">{workout.safetyNote}</p>
            </div>
          </div>
        </Card>
      )}

      <button onClick={onStart} className="btn-primary w-full text-base">
        <ListChecks className="h-5 w-5" /> Start workout player
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
