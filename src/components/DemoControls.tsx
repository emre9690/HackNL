import { useState, useRef } from 'react';
import { Play, RotateCcw, Users, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Screen, AppMode, UserPreferences, AIProfile, DemoAction } from '../types';
import { events } from '../data/events';

const DEMO_PREFS: UserPreferences = {
  firstName: 'Alex',
  lastName: 'R.',
  phone: '+31 6 12 34 56 78',
  interests: ['Board games', 'Catan', 'Language exchange', 'Food & coffee'],
  vibe: 'Mixed',
  language: 'Both',
  ageRange: '26–40',
  area: 'Rotterdam Centrum',
  freeText: 'New to Rotterdam. Love board games and meeting people over coffee.',
};

const DEMO_PROFILE: AIProfile = {
  archetype: 'The Social Game-Changer',
  summary: 'You enjoy spaces that mix play with connection. Game nights, trivia evenings, and casual meetups are where you feel at home.',
  tags: ['board-games', 'catan', 'language-exchange', 'food-coffee'],
  recommendedCategories: ['Board games', 'Language exchange', 'Food & coffee'],
};

interface DemoControlsProps {
  onSetScreen: (screen: Screen) => void;
  onSetMode: (mode: AppMode) => void;
  onReset: () => void;
  currentScreen: Screen;
  onDemoAction: (action: DemoAction) => void;
}

export default function DemoControls({
  onSetScreen,
  onSetMode,
  onReset,
  currentScreen,
  onDemoAction,
}: DemoControlsProps) {
  const [isAutoDemo, setIsAutoDemo] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const stopAutoDemo = () => {
    clearAllTimeouts();
    setIsAutoDemo(false);
    onDemoAction({ type: 'SET_ONBOARDING', data: null });
    onDemoAction({ type: 'SET_ARRIVAL_VIEW', view: null });
    onDemoAction({ type: 'CONNECT', name: null });
    onDemoAction({ type: 'ACCEPT_INCOMING', value: false });
  };

  const handleUser = () => {
    stopAutoDemo();
    onSetMode('resident');
    onSetScreen('landing');
  };

  const handleAdmin = () => {
    stopAutoDemo();
    onSetMode('admin');
    onSetScreen('admin');
  };

  const handleAutoDemo = () => {
    if (isAutoDemo) {
      stopAutoDemo();
      return;
    }

    setIsAutoDemo(true);
    onReset();

    const schedule = (delay: number, fn: () => void) => {
      const t = setTimeout(fn, delay);
      timeoutsRef.current.push(t);
    };

    // 1. Landing page
    schedule(0, () => { onSetMode('resident'); onSetScreen('landing'); });

    // 2. Navigate to onboarding, pre-fill interests (step 0)
    schedule(2000, () => onSetScreen('onboarding'));
    schedule(2100, () => onDemoAction({ type: 'SET_ONBOARDING', data: { step: 0, prefs: DEMO_PREFS } }));

    // 3. Advance to details step (step 1) — name, vibe, area
    schedule(4600, () => onDemoAction({ type: 'SET_ONBOARDING', data: { step: 1, prefs: DEMO_PREFS } }));

    // 4. Advance to free-text step (step 2)
    schedule(7100, () => onDemoAction({ type: 'SET_ONBOARDING', data: { step: 2, prefs: DEMO_PREFS } }));

    // 5. Complete onboarding → home screen
    schedule(8700, () => onDemoAction({ type: 'COMPLETE_ONBOARDING', prefs: DEMO_PREFS, profile: DEMO_PROFILE }));

    // 6. Select Catan Night event → event detail
    schedule(10700, () => {
      onDemoAction({ type: 'SELECT_EVENT', event: events[0] });
      onSetScreen('event-detail');
    });

    // 7. Mark as going
    schedule(12700, () => onDemoAction({ type: 'ATTEND', eventId: 'ev1', status: 'going' }));

    // 8. Go to arrival badge ("I'm here")
    schedule(14700, () => {
      onSetScreen('arrival');
      onDemoAction({ type: 'SET_ARRIVAL_VIEW', view: 'badge' });
    });

    // 9. Slide to join panel
    schedule(17200, () => onDemoAction({ type: 'SET_ARRIVAL_VIEW', view: 'join' }));

    // 10. Connect with Liam
    schedule(19700, () => onDemoAction({ type: 'CONNECT', name: 'Liam' }));
    schedule(19900, () => onDemoAction({ type: 'CONNECT', name: null }));

    // 11. Accept incoming contact request from Sophie
    schedule(22200, () => onDemoAction({ type: 'ACCEPT_INCOMING', value: true }));
    schedule(22400, () => onDemoAction({ type: 'ACCEPT_INCOMING', value: false }));

    // 12. Switch to admin dashboard
    schedule(24700, () => { onSetMode('admin'); onSetScreen('admin'); });

    // 13. End demo
    schedule(27000, () => {
      setIsAutoDemo(false);
      onDemoAction({ type: 'SET_ARRIVAL_VIEW', view: null });
    });
  };

  const handleReset = () => {
    stopAutoDemo();
    onReset();
  };

  if (isHidden) {
    return (
      <div className="fixed bottom-8 right-6 z-50" style={{ pointerEvents: 'auto' }}>
        <button
          onClick={() => setIsHidden(false)}
          className="rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium"
          style={{
            background: 'rgba(15,15,20,0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.4)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          }}
        >
          <ChevronUp size={11} />
          Demo
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-8 right-6 z-50 flex flex-col gap-2"
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className="rounded-2xl p-3 flex flex-col gap-2"
        style={{
          background: 'rgba(15,15,20,0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          minWidth: 140,
        }}
      >
        <div className="flex items-center justify-between">
          <p className="text-white/30 text-[10px] font-medium uppercase tracking-widest">Demo</p>
          <button
            onClick={() => setIsHidden(true)}
            className="text-white/20 hover:text-white/40 transition-colors"
            title="Hide demo panel"
          >
            <ChevronDown size={12} />
          </button>
        </div>

        <button
          onClick={handleUser}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all w-full"
          style={{
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.25)',
            color: '#4ade80',
          }}
        >
          <Users size={12} />
          User
        </button>

        <button
          onClick={handleAdmin}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all w-full"
          style={{
            background: 'rgba(251,191,36,0.1)',
            border: '1px solid rgba(251,191,36,0.25)',
            color: '#fbbf24',
          }}
        >
          <Shield size={12} />
          Admin
        </button>

        <button
          onClick={handleAutoDemo}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all w-full"
          style={{
            background: isAutoDemo ? 'rgba(96,165,250,0.2)' : 'rgba(96,165,250,0.08)',
            border: `1px solid ${isAutoDemo ? 'rgba(96,165,250,0.5)' : 'rgba(96,165,250,0.2)'}`,
            color: '#60a5fa',
          }}
        >
          <Play size={12} fill={isAutoDemo ? '#60a5fa' : 'none'} />
          {isAutoDemo ? 'Stop' : 'Auto Demo'}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all w-full"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      <div
        className="rounded-xl px-3 py-1.5 text-center"
        style={{
          background: 'rgba(15,15,20,0.8)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <p className="text-white/25 text-[9px] uppercase tracking-widest">{currentScreen}</p>
      </div>
    </div>
  );
}
