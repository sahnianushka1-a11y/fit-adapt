import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Welcome } from '@/screens/Welcome';
import { Onboarding } from '@/screens/Onboarding';
import { AppShell } from '@/components/AppShell';
import { Dashboard } from '@/screens/Dashboard';
import { WorkoutGenerator } from '@/screens/WorkoutGenerator';
import { WorkoutPlayer } from '@/screens/WorkoutPlayer';
import { WeeklyPlan } from '@/screens/WeeklyPlan';
import { Progress } from '@/screens/Progress';
import { Profile } from '@/screens/Profile';
import type { Tab, GeneratedWorkout } from '@/types';

function AppContent() {
  const { isOnboarded, profile, onboarding } = useApp();
  const [tab, setTab] = useState<Tab>('home');
  const [activeWorkout, setActiveWorkout] = useState<GeneratedWorkout | null>(null);

  if (!profile) return <Welcome />;
  if (!onboarding) return <Onboarding />;

  const handleLogout = () => {
    setTab('home');
  };

  const renderTab = () => {
    switch (tab) {
      case 'home':
        return <Dashboard onNavigate={setTab} />;
      case 'plan':
        return <WeeklyPlan onNavigate={setTab} />;
      case 'workouts':
        return activeWorkout ? (
          <WorkoutPlayer workout={activeWorkout} onClear={() => setActiveWorkout(null)} />
        ) : (
          <WorkoutGenerator
            onNavigate={setTab}
            onWorkoutReady={(w) => setActiveWorkout(w)}
          />
        );
      case 'progress':
        return <Progress />;
      case 'profile':
        return <Profile onNavigate={setTab} onLogout={handleLogout} />;
      default:
        return <Dashboard onNavigate={setTab} />;
    }
  };

  return (
    <AppShell active={tab} onNavigate={setTab}>
      {renderTab()}
    </AppShell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
