import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

import PhoneFrame from './components/PhoneFrame';
import DemoControls from './components/DemoControls';
import ArrivalBadge from './components/ArrivalBadge';
import AdminDashboard from './components/AdminDashboard';
import MapView from './components/MapView';
import BottomNav from './components/BottomNav';

import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import SavedEvents from './pages/SavedEvents';
import Profile from './pages/Profile';

import { Screen, AppMode, EventRoutine, UserPreferences, AIProfile, AISuggestion } from './types';
import { events } from './data/events';
import { aiSuggestions as initialSuggestions } from './data/demoUsers';

const LS_PREFS = 'stadspas_prefs';
const LS_PROFILE = 'stadspas_profile';
const LS_SAVED = 'stadspas_saved';

function loadLS<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function saveLS<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [mode, setMode] = useState<AppMode>('resident');
  const [selectedEvent, setSelectedEvent] = useState<EventRoutine | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(
    loadLS<UserPreferences>(LS_PREFS)
  );
  const [aiProfile, setAiProfile] = useState<AIProfile | null>(
    loadLS<AIProfile>(LS_PROFILE)
  );
  const [savedEvents, setSavedEvents] = useState<EventRoutine[]>(
    loadLS<EventRoutine[]>(LS_SAVED) || []
  );
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(initialSuggestions);

  // Persist state
  useEffect(() => {
    if (userPreferences) saveLS(LS_PREFS, userPreferences);
  }, [userPreferences]);

  useEffect(() => {
    if (aiProfile) saveLS(LS_PROFILE, aiProfile);
  }, [aiProfile]);

  useEffect(() => {
    saveLS(LS_SAVED, savedEvents);
  }, [savedEvents]);

  const handleOnboardingComplete = (prefs: UserPreferences, profile: AIProfile) => {
    setUserPreferences(prefs);
    setAiProfile(profile);
    setCurrentScreen('home');
  };

  const handleViewEvent = (event: EventRoutine) => {
    setSelectedEvent(event);
    setCurrentScreen('event-detail');
  };

  const handleSaveEvent = (event: EventRoutine) => {
    setSavedEvents((prev) => {
      const exists = prev.find((e) => e.id === event.id);
      if (exists) return prev.filter((e) => e.id !== event.id);
      return [...prev, event];
    });
  };

  const handleReset = useCallback(() => {
    localStorage.removeItem(LS_PREFS);
    localStorage.removeItem(LS_PROFILE);
    localStorage.removeItem(LS_SAVED);
    setUserPreferences(null);
    setAiProfile(null);
    setSavedEvents([]);
    setSelectedEvent(null);
    setMode('resident');
    setCurrentScreen('landing');
    setSuggestions(initialSuggestions);
  }, []);

  const handleUpdateSuggestion = (id: string, status: 'approved' | 'rejected') => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const handleNavigate = (screen: Screen) => {
    if (screen === 'arrival' && !selectedEvent) {
      // Use first event as default for arrival demo
      setSelectedEvent(events[0]);
    }
    setCurrentScreen(screen);
  };

  const setScreenExternal = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  const setModeExternal = useCallback((m: AppMode) => {
    setMode(m);
  }, []);

  const isSaved = (event: EventRoutine) => savedEvents.some((e) => e.id === event.id);

  const renderScreen = () => {
    if (mode === 'admin') {
      return (
        <>
          <AdminDashboard
            suggestions={suggestions}
            onUpdateSuggestion={handleUpdateSuggestion}
          />
          <BottomNav mode="admin" currentScreen={currentScreen} onNavigate={handleNavigate} />
        </>
      );
    }

    switch (currentScreen) {
      case 'landing':
        return <Landing onNavigate={setCurrentScreen} />;

      case 'onboarding':
        return (
          <Onboarding
            onComplete={handleOnboardingComplete}
            onNavigate={setCurrentScreen}
          />
        );

      case 'home':
        return (
          <Home
            userPreferences={userPreferences}
            onViewEvent={handleViewEvent}
            onNavigate={handleNavigate}
            mode={mode}
            currentScreen={currentScreen}
          />
        );

      case 'event-detail':
        return selectedEvent ? (
          <EventDetail
            event={selectedEvent}
            onBack={() => setCurrentScreen('home')}
            onArrival={() => setCurrentScreen('arrival')}
            onSave={handleSaveEvent}
            isSaved={isSaved(selectedEvent)}
            onNavigate={handleNavigate}
            mode={mode}
            currentScreen={currentScreen}
          />
        ) : null;

      case 'arrival':
        return (
          <ArrivalBadge
            event={selectedEvent || events[0]}
            onBack={() => setCurrentScreen(selectedEvent ? 'event-detail' : 'home')}
          />
        );

      case 'map':
        return (
          <div className="absolute inset-0 flex flex-col" style={{ background: '#0d0d12' }}>
            <div className="px-5 pt-14 pb-3 flex-shrink-0">
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-0.5">
                Explore
              </p>
              <h1 className="text-white font-bold text-xl">Map view</h1>
            </div>
            <div className="flex-1 mx-4 mb-28 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <MapView
                events={events}
                onEventClick={handleViewEvent}
                center={[51.9176, 4.5253]}
                zoom={13}
                className="h-full w-full"
              />
            </div>
            <BottomNav mode={mode} currentScreen={currentScreen} onNavigate={handleNavigate} />
          </div>
        );

      case 'saved':
        return (
          <SavedEvents
            savedEvents={savedEvents}
            onViewEvent={handleViewEvent}
            onNavigate={handleNavigate}
            mode={mode}
            currentScreen={currentScreen}
          />
        );

      case 'profile':
        return (
          <Profile
            userPreferences={userPreferences}
            aiProfile={aiProfile}
            onEditPreferences={() => setCurrentScreen('onboarding')}
            onReset={handleReset}
            onNavigate={handleNavigate}
            mode={mode}
            currentScreen={currentScreen}
          />
        );

      default:
        return <Landing onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <PhoneFrame>
        <AnimatePresence mode="wait">
          <div key={`${currentScreen}-${mode}`} style={{ position: 'absolute', inset: 0 }}>
            {renderScreen()}
          </div>
        </AnimatePresence>
      </PhoneFrame>

      <DemoControls
        onSetScreen={setScreenExternal}
        onSetMode={setModeExternal}
        onReset={handleReset}
        currentScreen={currentScreen}
      />
    </div>
  );
}
