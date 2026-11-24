import { useState } from 'react';
import { Dumbbell, Sparkles, ArrowRight, Zap, Brain, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Welcome() {
  const { setProfile } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Tell us your name — your coach needs something to yell.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid email helps us save your progress across refreshes.');
      return;
    }
    setProfile({
      name: name.trim(),
      email: email.trim(),
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-lime-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-10 flex items-center gap-3 animate-fade-in">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-400 text-ink-950 shadow-glow">
            <Dumbbell className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">FITADAPT</span>
        </div>

        <div className="animate-fade-up">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/5 px-3 py-1 text-xs font-medium text-lime-300">
            <Sparkles className="h-3.5 w-3.5" /> AI-powered adaptive fitness
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight text-balance">
            Your fitness era.
            <br />
            <span className="gradient-text">Your rules.</span>
          </h1>
          <p className="mt-3 text-white/60 leading-relaxed">
            A fitness coach that actually understands your schedule, energy and excuses.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Your name</label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Aarav"
              className="w-full rounded-2xl border border-white/10 bg-ink-850/60 px-4 py-3.5 text-white placeholder-white/30 outline-none transition-all focus:border-lime-400/50 focus:bg-ink-850 focus:ring-2 focus:ring-lime-400/20"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/10 bg-ink-850/60 px-4 py-3.5 text-white placeholder-white/30 outline-none transition-all focus:border-lime-400/50 focus:bg-ink-850 focus:ring-2 focus:ring-lime-400/20"
            />
          </div>

          {error && (
            <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2 animate-fade-in">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full text-base group">
            Let's go
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="mt-12 grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {[
            { icon: <Brain className="h-5 w-5" />, label: 'AI coach' },
            { icon: <Zap className="h-5 w-5" />, label: '10-min plans' },
            { icon: <Heart className="h-5 w-5" />, label: 'No gym required' },
          ].map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-ink-850/40 p-3 text-center">
              <span className="text-lime-300">{f.icon}</span>
              <span className="text-xs text-white/60">{f.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-white/30">
          Local profile · No password needed for this MVP
        </p>
      </div>
    </div>
  );
}
