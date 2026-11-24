import { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Camera,
  CameraOff,
  Check,
  Timer,
  Dumbbell,
  PartyPopper,
  RotateCcw,
  X,
  Video,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, ProgressBar, EmptyState } from '@/components/ui';
import type { GeneratedWorkout, Exercise } from '@/types';

export function WorkoutPlayer({
  workout,
  onClear,
}: {
  workout: GeneratedWorkout | null;
  onClear: () => void;
}) {
  const { recordWorkout, onboarding, profile } = useApp();
  const [phase, setPhase] = useState<'ready' | 'active' | 'paused' | 'rest' | 'done'>('ready');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [restRemaining, setRestRemaining] = useState(0);
  const [cameraOn, setCameraOn] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const exercises = workout?.exercises ?? [];
  const current = exercises[currentIdx];

  // Timer
  useEffect(() => {
    if (phase === 'active') {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else if (phase === 'rest') {
      timerRef.current = setInterval(() => {
        setRestRemaining((r) => {
          if (r <= 1) {
            setPhase('active');
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOn(true);
    } catch {
      setCameraOn(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleStart = () => {
    setPhase('active');
    setElapsed(0);
    setCurrentIdx(0);
  };

  const handleNext = () => {
    if (currentIdx < exercises.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setElapsed(0);
      setRestRemaining(current?.restSeconds ?? 30);
      setPhase('rest');
    } else {
      completeWorkout();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setElapsed(0);
      setPhase('active');
    }
  };

  const completeWorkout = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopCamera();
    const xp = recordWorkout({
      date: new Date().toISOString().slice(0, 10),
      title: workout?.title ?? 'Workout',
      durationMinutes: workout?.estimatedMinutes ?? 20,
      intensity: workout?.intensity ?? 'Moderate',
    });
    setEarnedXp(xp);
    setPhase('done');
  };

  const reset = () => {
    setPhase('ready');
    setCurrentIdx(0);
    setElapsed(0);
    setRestRemaining(0);
    setEarnedXp(0);
  };

  if (!workout) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-3xl font-bold text-white">Workout Player</h1>
        <EmptyState
          icon={<Dumbbell className="h-8 w-8" />}
          title="No workout loaded"
          description="Generate a workout first and tap 'Start workout player' to begin your session here."
        />
      </div>
    );
  }

  if (phase === 'done') {
    return <CompletionScreen workout={workout} xp={earnedXp} onReset={reset} onExit={onClear} name={profile?.name ?? ''} />;
  }

  const exerciseDuration = current?.duration ?? 40;
  const progressPct = phase === 'active' ? (elapsed / exerciseDuration) * 100 : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{workout.title}</h1>
          <p className="text-sm text-white/50">
            {phase === 'ready' ? 'Ready to begin' :
             `Exercise ${currentIdx + 1} of ${exercises.length}`}
          </p>
        </div>
        <button onClick={onClear} className="rounded-xl p-2 text-white/40 hover:bg-white/5 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Left: Exercise */}
        <div className="space-y-4">
          <Card className="relative overflow-hidden">
            {/* Animation area */}
            <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-ink-800 to-ink-850 lg:h-80">
              <ExerciseAnimation exercise={current} active={phase === 'active'} />
              {phase === 'rest' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink-950/80 backdrop-blur-sm animate-fade-in">
                  <Timer className="h-10 w-10 text-violet-400 animate-float" />
                  <p className="mt-3 font-display text-5xl font-bold text-violet-300">{restRemaining}</p>
                  <p className="text-sm text-white/50">Rest seconds remaining</p>
                </div>
              )}
            </div>

            {/* Exercise info */}
            <div className="p-5">
              {phase === 'ready' ? (
                <div className="text-center py-4">
                  <h2 className="font-display text-xl font-semibold text-white">{workout.title}</h2>
                  <p className="text-sm text-white/50 mt-1">{workout.estimatedMinutes} min · {workout.intensity} intensity</p>
                  <p className="text-sm text-white/60 mt-3">{exercises.length} exercises ahead</p>
                  <button onClick={handleStart} className="btn-primary mt-5 mx-auto">
                    <Play className="h-5 w-5" /> Start workout
                  </button>
                </div>
              ) : current ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-white">{current.name}</h2>
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        <span className="chip bg-lime-400/10 text-lime-300">{current.sets} sets × {current.reps}</span>
                        {current.duration && <span className="chip bg-white/5 text-white/60">{current.duration}s</span>}
                        <span className="chip bg-violet-500/10 text-violet-300">{current.restSeconds}s rest</span>
                      </div>
                    </div>
                    {phase === 'active' && (
                      <span className="font-display text-2xl font-bold text-lime-300">{elapsed}s</span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-white/60">{current.instructions}</p>
                  {phase === 'active' && <ProgressBar value={progressPct} className="mt-4" />}
                </>
              ) : null}
            </div>
          </Card>

          {/* Exercise list overview */}
          <Card className="p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-white/40 mb-3">Workout queue</p>
            <div className="space-y-1.5">
              {exercises.map((ex, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    i === currentIdx ? 'bg-lime-400/10 text-lime-300' :
                    i < currentIdx ? 'text-white/30' : 'text-white/60'
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold">
                    {i < currentIdx ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className="flex-1 truncate">{ex.name}</span>
                  <span className="text-xs text-white/30">{ex.sets}×{ex.reps}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Camera */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="relative flex h-64 items-center justify-center bg-ink-950 lg:h-80">
              {cameraOn ? (
                <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-white/30">
                  <Video className="h-12 w-12" />
                  <p className="text-sm">Camera preview</p>
                  <p className="text-xs text-white/20">Enable camera for visual feedback</p>
                </div>
              )}
              {cameraOn && (
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-rose-500/20 px-2.5 py-1 text-xs text-rose-300">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-rose-400" /> LIVE
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex gap-2">
                {!cameraOn ? (
                  <button onClick={startCamera} className="btn-ghost flex-1">
                    <Camera className="h-4 w-4" /> Start camera
                  </button>
                ) : (
                  <button onClick={stopCamera} className="btn-ghost flex-1">
                    <CameraOff className="h-4 w-4" /> Stop camera
                  </button>
                )}
              </div>
              <div className="mt-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-3 text-center">
                <Sparkles className="h-4 w-4 text-violet-400 mx-auto mb-1" />
                <p className="text-xs text-violet-300 font-medium">AI form coaching — coming soon</p>
                <p className="text-[10px] text-white/40 mt-0.5">Real-time pose detection is not yet active</p>
              </div>
            </div>
          </Card>

          {/* Player controls */}
          {phase !== 'ready' && (
            <Card className="p-4">
              <div className="grid grid-cols-4 gap-2">
                <button onClick={handlePrev} disabled={currentIdx === 0} className="btn-ghost py-3 disabled:opacity-30">
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPhase(phase === 'active' ? 'paused' : 'active')}
                  className="col-span-2 btn-primary"
                >
                  {phase === 'active' ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Resume</>}
                </button>
                <button onClick={handleNext} className="btn-ghost py-3">
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={completeWorkout}
                className="mt-2 w-full rounded-xl border border-lime-400/20 py-2.5 text-sm font-medium text-lime-300 transition-colors hover:bg-lime-400/5"
              >
                <Check className="h-4 w-4 inline mr-1" /> Finish workout
              </button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ExerciseAnimation({ exercise, active }: { exercise: Exercise | undefined; active: boolean }) {
  if (!exercise) return null;
  const name = exercise.name.toLowerCase();
  const isJump = name.includes('jump');
  const isSquat = name.includes('squat') || name.includes('lunge');
  const isPlank = name.includes('plank') || name.includes('push') || name.includes('press');
  const isStretch = name.includes('stretch') || name.includes('mobility') || name.includes('yoga');

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative flex h-28 w-28 items-center justify-center ${active ? 'animate-float' : ''}`}>
        <div className={`absolute inset-0 rounded-full ${active ? 'bg-lime-400/10 animate-pulse-ring' : 'bg-white/5'}`} />
        <div className={`flex h-20 w-20 items-center justify-center rounded-full ${active ? 'bg-lime-400/15' : 'bg-white/5'} transition-colors`}>
          {isJump && <span className="text-4xl">🤸</span>}
          {isSquat && <span className="text-4xl">🦵</span>}
          {isPlank && <span className="text-4xl">💪</span>}
          {isStretch && <span className="text-4xl">🧘</span>}
          {!isJump && !isSquat && !isPlank && !isStretch && <Dumbbell className="h-10 w-10 text-lime-300" />}
        </div>
      </div>
      <p className="text-xs text-white/30">{active ? 'In progress' : 'Ready'}</p>
    </div>
  );
}

function CompletionScreen({
  workout,
  xp,
  onReset,
  onExit,
  name,
}: {
  workout: GeneratedWorkout;
  xp: number;
  onReset: () => void;
  onExit: () => void;
  name: string;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-scale-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-pulse-ring rounded-full bg-lime-400/20" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-lime-400 text-ink-950 shadow-glow">
          <PartyPopper className="h-12 w-12" />
        </div>
      </div>
      <h1 className="font-display text-3xl font-bold text-white">Workout complete!</h1>
      <p className="mt-2 text-white/60 max-w-sm">
        {name}, you just finished {workout.title}. Character development detected.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-md">
        <Card className="p-4">
          <p className="text-xs text-white/40">Duration</p>
          <p className="font-display text-xl font-bold text-white">{workout.estimatedMinutes}<span className="text-sm text-white/40">m</span></p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-white/40">XP earned</p>
          <p className="font-display text-xl font-bold text-lime-300">+{xp}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-white/40">Exercises</p>
          <p className="font-display text-xl font-bold text-white">{workout.exercises.length}</p>
        </Card>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={onReset} className="btn-ghost">
          <RotateCcw className="h-4 w-4" /> Do it again
        </button>
        <button onClick={onExit} className="btn-primary">
          <Check className="h-4 w-4" /> Back to workouts
        </button>
      </div>
    </div>
  );
}
