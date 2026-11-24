import type { GeneratedWorkout, OnboardingData } from '@/types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8787';

export interface GenerateParams {
  goal: string;
  level: string;
  minutes: number;
  equipment: string[];
  soreness: string;
  energy: string;
  limitations: string;
}

function mapLevel(level: string): string {
  const l = level.toLowerCase();
  if (l.includes('begin')) return 'beginner';
  if (l.includes('adv')) return 'advanced';
  return 'intermediate';
}

function mapGoal(goal: string): string {
  const g = goal.toLowerCase();
  if (g.includes('strength')) return 'build strength';
  if (g.includes('stamina')) return 'improve stamina';
  if (g.includes('mobility')) return 'improve mobility';
  if (g.includes('weight')) return 'weight management';
  return 'general fitness';
}

function normalizeEquipment(equipment: string[]): string[] {
  return equipment
    .filter((e) => e !== 'No equipment')
    .map((e) => e.toLowerCase().replace('yoga mat', 'mat'));
}

export function paramsFromOnboarding(
  onboarding: OnboardingData,
  energy: string,
  soreness: string
): GenerateParams {
  return {
    goal: mapGoal(onboarding.goal),
    level: mapLevel(onboarding.level),
    minutes: onboarding.workoutDuration,
    equipment: normalizeEquipment(onboarding.equipment),
    soreness: soreness.toLowerCase(),
    energy: energy.toLowerCase(),
    limitations: onboarding.limitations || onboarding.avoidMovements || '',
  };
}

export interface WorkoutResponse {
  data?: GeneratedWorkout;
  error?: string;
  offline?: boolean;
}

function looksLikeBackendShape(obj: unknown): obj is GeneratedWorkout {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.title === 'string' &&
    typeof o.estimatedMinutes === 'number' &&
    Array.isArray(o.exercises)
  );
}

function extractWorkout(payload: unknown): GeneratedWorkout | null {
  if (looksLikeBackendShape(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const o = payload as Record<string, unknown>;
    if (o.workout && looksLikeBackendShape(o.workout)) return o.workout;
    if (o.data && looksLikeBackendShape(o.data)) return o.data;
  }
  return null;
}

export async function generateWorkout(params: GenerateParams): Promise<WorkoutResponse> {
  try {
    const res = await fetch(`${API_URL}/api/workout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: params }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      return { error: `The coach backend returned an error (${res.status}). Try again in a moment.` };
    }

    const json = await res.json();
    const workout = extractWorkout(json);
    if (!workout) {
      return { error: 'The backend responded, but the workout format was unexpected. Check your backend response shape.' };
    }
    return { data: workout };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('timeout') || message.includes('abort')) {
      return { offline: true, error: 'The request timed out. Your coach backend may be slow or not running.' };
    }
    return {
      offline: true,
      error: 'Could not reach your workout backend. Make sure it is running and reachable.',
    };
  }
}
