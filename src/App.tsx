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

import {
  Screen, AppMode, EventRoutine, UserPreferences, AIProfile,
  AISuggestion, Connection, AttendStatus,
} from './types';
import { events } from './data/events';
import { aiSuggestions as initialSuggestions } from './data/demoUsers';

const LS_PREFS = 'stadspas_prefs';
const LS_PROFILE = 'stadspas_profile';
const LS_SAVED = 'stadspas_saved';
const LS_CONNECTIONS = 'stadspas_connections';

const INITIAL_CONNECTIONS: Connection[] = [
  { id: 'conn1', firstName: 'Ana', lastName: 'V.', eventId: 'ev4', eventTitle: 'Sketch Café', connectedAt: '2024-11-08' },
  { id: 'conn2', firstName: 'Marcus', lastName: 'L.', eventId: 'ev1', eventTitle: 'Catan Night', connectedAt: '2024-11-15' },
];

function loadLS<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch { return null; }
}

function saveLS<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
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
  const [connections, setConnections] = useState<Connection[]>(
    loadLS<Connection[]>(LS_CONNECTIONS) || INITIAL_CONNECTIONS
  );
  const [attendStatus, setAttendStatus] = useState<Record<string, AttendStatus>>({});
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(initialSuggestions);

  useEffect(() => { if (userPreferences) saveLS(LS_PREFS, userPreferences); }, [userPreferences]);
  useEffect(() => { if (aiProfile) saveLS(LS_PROFILE, aiProfile); }, [aiProfile]);
  useEffect(() => { saveLS(LS_SAVED, savedEvents); }, [savedEvents]);
  useEffect(() => { saveLS(LS_CONNECTIONS, connections); }, [connections]);

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
      return exists ? prev.filter((e) => e.id !== event.id) : [...prev, event];
    });
  };

  const handleAttend = (eventId: string, status: AttendStatus) => {
    setAttendStatus((prev) => ({ ...prev, [eventId]: status }));
  };

  const handleAddConnection = (conn: Connection) => {
    setConnections((prev) => {
      if (prev.some((c) => c.id === conn.id || c.firstName === conn.firstName)) return prev;
      return [...prev, conn];
    });
  };

  const handleReset = useCallback(() => {
    localStorage.removeItem(LS_PREFS);
    localStorage.removeItem(LS_PROFILE);
    localStorage.removeItem(LS_SAVED);
    localStorage.removeItem(LS_CONNECTIONS);
    setUserPreferences(null);
    setAiProfile(null);
    setSavedEvents([]);
    setConnections(INITIAL_CONNECTIONS);
    setAttendStatus({});
    setSelectedEvent(null);
    setMode('resident');
    setCurrentScreen('landing');
    setSuggestions(initialSuggestions);
  }, []);

  const handleUpdateSuggestion = (id: string, status: 'approved' | 'rejected') => {
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const handleNavigate = (screen: Screen) => {
    if (screen === 'arrival' && !selectedEvent) setSelectedEvent(events[0]);
    setCurrentScreen(screen);
  };

  const setScreenExternal = useCallback((screen: Screen) => setCurrentScreen(screen), []);
  const setModeExternal = useCallback((m: AppMode) => setMode(m), []);

  const isSaved = (event: EventRoutine) => savedEvents.some((e) => e.id === event.id);

  const renderScreen = () => {
    if (mode === 'admin') {
      return (
        <>
          <AdminDashboard suggestions={suggestions} onUpdateSuggestion={handleUpdateSuggestion} />
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
            initialPrefs={userPreferences}
            isEditing={!!userPreferences}
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
            attendStatus={attendStatus[selectedEvent.id] || 'none'}
            onAttend={(status) => handleAttend(selectedEvent.id, status)}
            onNavigate={handleNavigate}
            mode={mode}
            currentScreen={currentScreen}
            userPreferences={userPreferences}
          />
        ) : null;

      case 'arrival':
        return (
          <ArrivalBadge
            event={selectedEvent || events[0]}
            onBack={() => setCurrentScreen(selectedEvent ? 'event-detail' : 'home')}
            connections={connections}
            onAddConnection={handleAddConnection}
          />
        );

      case 'map':
        return (
          <div className="absolute inset-0 flex flex-col" style={{ background: '#0d0d12' }}>
            <div className="px-5 pt-14 pb-3 flex-shrink-0">
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-0.5">Explore</p>
              <h1 className="text-white font-bold text-xl">Map view</h1>
            </div>
            <div
              className="flex-1 mx-4 mb-24 rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)', minHeight: 0 }}
            >
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
            connections={connections}
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
