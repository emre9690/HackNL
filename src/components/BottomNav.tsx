import { Home, Map, Bookmark, Zap, User, Sparkles, CheckCircle, BarChart2 } from 'lucide-react';
import { Screen, AppMode } from '../types';

interface BottomNavProps {
  mode: AppMode;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function BottomNav({ mode, currentScreen, onNavigate }: BottomNavProps) {
  const residentTabs = [
    { screen: 'home' as Screen, icon: Home, label: 'Home' },
    { screen: 'map' as Screen, icon: Map, label: 'Map' },
    { screen: 'saved' as Screen, icon: Bookmark, label: 'Saved' },
    { screen: 'arrival' as Screen, icon: Zap, label: 'Here' },
    { screen: 'profile' as Screen, icon: User, label: 'Profile' },
  ];

  const adminTabs = [
    { screen: 'admin' as Screen, icon: Sparkles, label: 'Suggestions' },
    { screen: 'admin' as Screen, icon: CheckCircle, label: 'Approved' },
    { screen: 'admin' as Screen, icon: BarChart2, label: 'Insights' },
  ];

  const tabs = mode === 'admin' ? adminTabs : residentTabs;

  return (
    <div
      className="absolute bottom-0 left-0 right-0"
      style={{
        zIndex: 1000,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        paddingBottom: 12,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center justify-around pt-2 pb-0 px-2">
        {tabs.map((tab, i) => {
          const isActive = mode === 'admin' ? false : currentScreen === tab.screen;
          const Icon = tab.icon;
          return (
            <button
              key={`${tab.screen}-${i}`}
              onClick={() => onNavigate(tab.screen)}
              className="flex flex-col items-center gap-0.5 flex-1 py-1 transition-all"
            >
              <div
                className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
                style={{
                  background: isActive ? 'rgba(232,101,26,0.12)' : 'transparent',
                }}
              >
                <Icon
                  size={20}
                  color={isActive ? '#E8651A' : '#9CA3AF'}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>
              <span
                className="text-[10px] font-medium transition-colors"
                style={{ color: isActive ? '#E8651A' : '#9CA3AF' }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
