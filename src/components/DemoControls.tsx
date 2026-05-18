import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Users, Shield } from 'lucide-react';
import { Screen, AppMode } from '../types';

interface DemoControlsProps {
  onSetScreen: (screen: Screen) => void;
  onSetMode: (mode: AppMode) => void;
  onReset: () => void;
  currentScreen: Screen;
}

const demoSequence: Screen[] = [
  'landing',
  'onboarding',
  'home',
  'event-detail',
  'arrival',
  'admin',
];

export default function DemoControls({
  onSetScreen,
  onSetMode,
  onReset,
  currentScreen,
}: DemoControlsProps) {
  const [isAutoDemo, setIsAutoDemo] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isAutoDemo) {
      intervalRef.current = setInterval(() => {
        setDemoIndex((prev) => {
          const next = (prev + 1) % demoSequence.length;
          const screen = demoSequence[next];
          if (screen === 'admin') {
            onSetMode('admin');
          } else {
            onSetMode('resident');
          }
          onSetScreen(screen);
          return next;
        });
      }, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoDemo, onSetScreen, onSetMode]);

  const handleResident = () => {
    setIsAutoDemo(false);
    onSetMode('resident');
    onSetScreen('home');
  };

  const handleAdmin = () => {
    setIsAutoDemo(false);
    onSetMode('admin');
    onSetScreen('admin');
  };

  const handleAutoDemo = () => {
    setIsAutoDemo((prev) => !prev);
    if (!isAutoDemo) {
      setDemoIndex(0);
      onSetMode('resident');
      onSetScreen('landing');
    }
  };

  const handleReset = () => {
    setIsAutoDemo(false);
    onReset();
  };

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
        <p className="text-white/30 text-[10px] font-medium uppercase tracking-widest text-center">
          Demo
        </p>

        <button
          onClick={handleResident}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all w-full"
          style={{
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.25)',
            color: '#4ade80',
          }}
        >
          <Users size={12} />
          Resident
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

      {/* Current screen indicator */}
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
