import type { CoachPersonality, Progress } from '@/types';
import { levelInfo, completedThisWeek } from '@/lib/storage';

export function greeting(name: string): string {
  const h = new Date().getHours();
  if (h < 5) return `Burning midnight oil, ${name}?`;
  if (h < 12) return `Good morning, ${name}`;
  if (h < 17) return `Good afternoon, ${name}`;
  if (h < 21) return `Good evening, ${name}`;
  return `Late grind, ${name}?`;
}

const savage: string[] = [
  "Your step count is giving work-from-home.",
  "Three workouts this week? Character development detected.",
  "You slept 8 hours? Snow White is taking notes.",
  "Rest day today. Even your laptop gets shut down sometimes.",
  "Your fitness era starts now. No more situationships with your workout plan.",
];

const bestie: string[] = [
  "Showing up is the whole flex. You're doing it.",
  "Small wins compound. You're literally building a habit.",
  "Proud of you for checking in today.",
  "One workout at a time. We've got this.",
  "Your future self is already saying thank you.",
];

const calm: string[] = [
  "Breathe. Move. Rest. Repeat.",
  "Consistency over intensity. Always.",
  "Honour your energy today. Movement is a gift.",
  "Progress isn't always loud. Sometimes it's just showing up.",
];

const strict: string[] = [
  "No zero days. Even 5 minutes counts.",
  "Your excuses called — I hung up.",
  "Discipline is the secret. There is no other one.",
  "Schedule it like a meeting with your boss. You are the boss.",
];

export function coachLine(personality: CoachPersonality, seed = 0): string {
  let pool: string[];
  switch (personality) {
    case 'Savage motivator': pool = savage; break;
    case 'Supportive bestie': pool = bestie; break;
    case 'Calm coach': pool = calm; break;
    case 'Strict accountability partner': pool = strict; break;
  }
  return pool[seed % pool.length];
}

export function fitnessLore(progress: Progress, name: string): string[] {
  const lore: string[] = [];
  const { streak, xp } = progress;
  const weekCount = completedThisWeek(progress.completedWorkouts);

  if (streak === 0) {
    lore.push(`No streak yet. Today is day one. Iconic origin story moment.`);
  } else if (streak < 3) {
    lore.push(`${streak}-day streak. The habit is forming. Keep it warm.`);
  } else if (streak < 7) {
    lore.push(`${streak}-day streak. We're past the awkward phase now.`);
  } else {
    lore.push(`${streak}-day streak. You're officially a Consistent Human.`);
  }

  const { current } = levelInfo(xp);
  lore.push(`Current level: ${current}. ${xp} XP banked. Spending it on gains.`);

  if (weekCount === 0) {
    lore.push(`No workouts completed this week yet. The week is still young.`);
  } else if (weekCount >= 3) {
    lore.push(`${weekCount} workouts this week. That's main character energy.`);
  } else {
    lore.push(`${weekCount} workout${weekCount > 1 ? 's' : ''} this week. Building momentum.`);
  }

  if (progress.completedWorkouts.length >= 10) {
    lore.push(`${progress.completedWorkouts.length} total workouts. Past the honeymoon phase.`);
  }

  return lore;
}

export function randomCoachLine(personality: CoachPersonality): string {
  return coachLine(personality, Math.floor(Math.random() * 5));
}
