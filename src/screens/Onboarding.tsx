import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Dumbbell,
  Target,
  Activity,
  User,
  Clock,
  Package,
  ShieldAlert,
  MessageSquare,
} from 'lucide-react';
import type {
  OnboardingData,
  GymReason,
  FitnessGoal,
  FitnessLevel,
  Equipment,
  CoachLanguage,
  CoachPersonality,
} from '@/types';
import { useApp } from '@/context/AppContext';

const TOTAL_STEPS = 8;

const gymReasons: { id: GymReason; label: string; emoji: string }[] = [
  { id: 'Gym membership but never go', label: 'I have a gym membership but never go', emoji: '💸' },
  { id: 'Too expensive', label: 'Too expensive', emoji: '🏷️' },
  { id: 'Chaotic schedule', label: 'Work / college schedule is chaotic', emoji: '🌀' },
  { id: 'Gym anxiety', label: 'Gym anxiety', emoji: '😰' },
  { id: 'Prefer home workouts', label: 'I prefer working out at home', emoji: '🏠' },
  { id: 'Need accountability', label: 'I just need someone to keep me accountable', emoji: '🤝' },
];

const goals: { id: FitnessGoal; label: string; desc: string }[] = [
  { id: 'Build strength', label: 'Build strength', desc: 'Muscle & power' },
  { id: 'Improve stamina', label: 'Improve stamina', desc: 'Endurance & cardio' },
  { id: 'General fitness', label: 'General fitness', desc: 'Stay active & healthy' },
  { id: 'Improve mobility', label: 'Improve mobility', desc: 'Flexibility & movement' },
  { id: 'Weight management', label: 'Weight management', desc: 'Sustainable habits' },
];

const levels: { id: FitnessLevel; label: string; desc: string }[] = [
  { id: 'Beginner', label: 'Beginner', desc: 'New to working out or restarting' },
  { id: 'Intermediate', label: 'Intermediate', desc: 'Work out occasionally' },
  { id: 'Advanced', label: 'Advanced', desc: 'Consistent training for 6+ months' },
];

const equipmentList: { id: Equipment; label: string }[] = [
  { id: 'No equipment', label: 'No equipment' },
  { id: 'Chair', label: 'Chair' },
  { id: 'Yoga mat', label: 'Yoga mat' },
  { id: 'Dumbbells', label: 'Dumbbells' },
  { id: 'Water bottles', label: 'Water bottles' },
  { id: 'Backpack', label: 'Backpack' },
  { id: 'Stairs', label: 'Stairs' },
];

const languages: CoachLanguage[] = ['English', 'Hindi', 'Kannada', 'Hinglish'];
const personalities: { id: CoachPersonality; label: string; desc: string }[] = [
  { id: 'Supportive bestie', label: 'Supportive bestie', desc: 'Hype, encouragement, gentle nudges' },
  { id: 'Savage motivator', label: 'Savage motivator', desc: 'Witty, honest, slightly ruthless' },
  { id: 'Calm coach', label: 'Calm coach', desc: 'Steady, mindful, no pressure' },
  { id: 'Strict accountability partner', label: 'Strict accountability partner', desc: 'No excuses, no zero days' },
];

const durations: (10 | 15 | 20 | 30 | 45)[] = [10, 15, 20, 30, 45];

const empty: OnboardingData = {
  gymReasons: [],
  goal: 'General fitness',
  level: 'Beginner',
  age: '',
  height: '',
  weight: '',
  wakeTime: '07:00',
  workStart: '09:00',
  workEnd: '18:00',
  sleepTime: '23:00',
  workoutTime: 'morning',
  workoutDuration: 20,
  equipment: [],
  avoidMovements: '',
  limitations: '',
  coachLanguage: 'English',
  coachPersonality: 'Supportive bestie',
};

export function Onboarding() {
  const { setOnboarding, profile } = useApp();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(empty);

  const update = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const canProceed = (() => {
    switch (step) {
      case 0: return data.gymReasons.length > 0;
      case 1: return !!data.goal;
      case 2: return !!data.level;
      case 3: return data.age.trim() !== '' && data.height.trim() !== '';
      case 4: return !!data.workoutTime && !!data.workoutDuration;
      case 5: return data.equipment.length > 0;
      case 6: return true;
      case 7: return !!data.coachLanguage && !!data.coachPersonality;
      default: return true;
    }
  })();

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else setOnboarding(data);
  };
  const back = () => step > 0 && setStep(step - 1);

  const stepIcons = [
    <Dumbbell className="h-4 w-4" />,
    <Target className="h-4 w-4" />,
    <Activity className="h-4 w-4" />,
    <User className="h-4 w-4" />,
    <Clock className="h-4 w-4" />,
    <Package className="h-4 w-4" />,
    <ShieldAlert className="h-4 w-4" />,
    <MessageSquare className="h-4 w-4" />,
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-2xl px-5 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-white/40">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <span className="text-xs text-white/40">Hi {profile?.name}</span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i <= step ? 'bg-lime-400' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        <div key={step} className="animate-fade-up">
          {step === 0 && (
            <Step
              title="What's your gym situation?"
              subtitle="Pick whatever feels true. No judgment — only solutions."
            >
              <div className="grid gap-3">
                {gymReasons.map((r) => (
                  <SelectCard
                    key={r.id}
                    selected={data.gymReasons.includes(r.id)}
                    onClick={() =>
                      update('gymReasons',
                        data.gymReasons.includes(r.id)
                          ? data.gymReasons.filter((g) => g !== r.id)
                          : [...data.gymReasons, r.id]
                      )
                    }
                  >
                    <span className="text-xl">{r.emoji}</span>
                    <span className="flex-1 text-sm">{r.label}</span>
                  </SelectCard>
                ))}
              </div>
            </Step>
          )}

          {step === 1 && (
            <Step title="What's your main goal?" subtitle="We'll tune your workouts around this.">
              <div className="grid gap-3 sm:grid-cols-2">
                {goals.map((g) => (
                  <SelectCard
                    key={g.id}
                    selected={data.goal === g.id}
                    onClick={() => update('goal', g.id)}
                    column
                  >
                    <div className="flex-1">
                      <p className="font-medium text-white">{g.label}</p>
                      <p className="text-xs text-white/40">{g.desc}</p>
                    </div>
                  </SelectCard>
                ))}
              </div>
            </Step>
          )}

          {step === 2 && (
            <Step title="Your current fitness level" subtitle="Be honest — we'll progress you up gradually.">
              <div className="grid gap-3">
                {levels.map((l) => (
                  <SelectCard key={l.id} selected={data.level === l.id} onClick={() => update('level', l.id)}>
                    <div className="flex-1">
                      <p className="font-medium text-white">{l.label}</p>
                      <p className="text-xs text-white/40">{l.desc}</p>
                    </div>
                  </SelectCard>
                ))}
              </div>
            </Step>
          )}

          {step === 3 && (
            <Step title="Basic profile" subtitle="Used to personalise intensity. Weight is optional.">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Age">
                  <input value={data.age} onChange={(e) => update('age', e.target.value)} type="number" placeholder="22" className={inputCls} />
                </Field>
                <Field label="Height (cm)">
                  <input value={data.height} onChange={(e) => update('height', e.target.value)} type="number" placeholder="170" className={inputCls} />
                </Field>
                <Field label="Weight (kg) — optional">
                  <input value={data.weight} onChange={(e) => update('weight', e.target.value)} type="number" placeholder="65" className={inputCls} />
                </Field>
              </div>
            </Step>
          )}

          {step === 4 && (
            <Step title="Your daily schedule" subtitle="We'll find the best workout window for you.">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Wake-up time"><input type="time" value={data.wakeTime} onChange={(e) => update('wakeTime', e.target.value)} className={inputCls} /></Field>
                <Field label="Sleep time"><input type="time" value={data.sleepTime} onChange={(e) => update('sleepTime', e.target.value)} className={inputCls} /></Field>
                <Field label="Work/college start"><input type="time" value={data.workStart} onChange={(e) => update('workStart', e.target.value)} className={inputCls} /></Field>
                <Field label="Work/college end"><input type="time" value={data.workEnd} onChange={(e) => update('workEnd', e.target.value)} className={inputCls} /></Field>
              </div>
              <div className="mt-5">
                <p className="mb-2 text-sm font-medium text-white/70">Preferred workout time</p>
                <div className="flex flex-wrap gap-2">
                  {['morning', 'afternoon', 'evening', 'night'].map((t) => (
                    <Chip key={t} selected={data.workoutTime === t} onClick={() => update('workoutTime', t)}>
                      {t[0].toUpperCase() + t.slice(1)}
                    </Chip>
                  ))}
                </div>
              </div>
              <div className="mt-5">
                <p className="mb-2 text-sm font-medium text-white/70">Available duration</p>
                <div className="flex flex-wrap gap-2">
                  {durations.map((d) => (
                    <Chip key={d} selected={data.workoutDuration === d} onClick={() => update('workoutDuration', d)}>
                      {d} min
                    </Chip>
                  ))}
                </div>
              </div>
            </Step>
          )}

          {step === 5 && (
            <Step title="Equipment you have" subtitle="Select all that apply. We'll work with what you've got.">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {equipmentList.map((eq) => (
                  <SelectCard
                    key={eq.id}
                    selected={data.equipment.includes(eq.id)}
                    onClick={() =>
                      update('equipment',
                        data.equipment.includes(eq.id)
                          ? data.equipment.filter((e) => e !== eq.id)
                          : [...data.equipment, eq.id]
                      )
                    }
                    column
                  >
                    <span className="text-sm">{eq.label}</span>
                  </SelectCard>
                ))}
              </div>
            </Step>
          )}

          {step === 6 && (
            <Step
              title="Movement preferences & limitations"
              subtitle="We'll avoid anything that bothers you. This isn't medical advice — see a pro for pain."
            >
              <Field label="Any movements you want to avoid? (optional)">
                <textarea
                  value={data.avoidMovements}
                  onChange={(e) => update('avoidMovements', e.target.value)}
                  placeholder="e.g. Burpees, jumping, planks on wrists…"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </Field>
              <div className="mt-4">
                <Field label="Any current pain or physical limitations? (optional)">
                  <textarea
                    value={data.limitations}
                    onChange={(e) => update('limitations', e.target.value)}
                    placeholder="e.g. Bad lower back, knee surgery recovery…"
                    rows={3}
                    className={`${inputCls} resize-none`}
                  />
                </Field>
                <button
                  onClick={() => update('limitations', 'Prefer not to say')}
                  className="mt-2 text-xs text-white/40 hover:text-white/60 underline"
                >
                  Prefer not to say
                </button>
              </div>
            </Step>
          )}

          {step === 7 && (
            <Step title="Your coach preferences" subtitle="Pick the vibe and language that keeps you showing up.">
              <div className="mb-5">
                <p className="mb-2 text-sm font-medium text-white/70">Coach language</p>
                <div className="flex flex-wrap gap-2">
                  {languages.map((l) => (
                    <Chip key={l} selected={data.coachLanguage === l} onClick={() => update('coachLanguage', l)}>
                      {l}
                    </Chip>
                  ))}
                </div>
              </div>
              <p className="mb-2 text-sm font-medium text-white/70">Coach personality</p>
              <div className="grid gap-3">
                {personalities.map((p) => (
                  <SelectCard key={p.id} selected={data.coachPersonality === p.id} onClick={() => update('coachPersonality', p.id)}>
                    <div className="flex-1">
                      <p className="font-medium text-white">{p.label}</p>
                      <p className="text-xs text-white/40">{p.desc}</p>
                    </div>
                  </SelectCard>
                ))}
              </div>
            </Step>
          )}
        </div>

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            onClick={back}
            disabled={step === 0}
            className="btn-ghost disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex gap-1">
            {stepIcons.map((icon, i) => (
              <div
                key={i}
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                  i === step ? 'bg-lime-400/20 text-lime-300' : i < step ? 'text-white/30' : 'text-white/15'
                }`}
              >
                {icon}
              </div>
            ))}
          </div>
          <button onClick={next} disabled={!canProceed} className="btn-primary">
            {step === TOTAL_STEPS - 1 ? 'Build my plan' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-white/10 bg-ink-850/60 px-4 py-3 text-white placeholder-white/30 outline-none transition-all focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20';

function Step({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white text-balance">{title}</h1>
      <p className="mt-1.5 text-sm text-white/50">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/70">{label}</span>
      {children}
    </label>
  );
}

function Chip({ children, selected, onClick }: { children: React.ReactNode; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all active:scale-95 ${
        selected
          ? 'bg-lime-400 text-ink-950 shadow-glow'
          : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}

function SelectCard({
  children,
  selected,
  onClick,
  column,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  column?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
        column ? 'flex-col items-start' : ''
      } ${
        selected
          ? 'border-lime-400/50 bg-lime-400/10 shadow-glow'
          : 'border-white/10 bg-ink-850/40 hover:bg-ink-800/60 hover:border-white/20'
      }`}
    >
      {children}
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all ${
        selected ? 'bg-lime-400 text-ink-950' : 'border border-white/20 text-transparent'
      }`}>
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </div>
    </button>
  );
}
