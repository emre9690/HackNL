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
    { screen: 'arrival' as Screen, icon: Zap, label: 'Arrival' },
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
      className="absolute bottom-0 left-0 right-0 z-40"
      style={{
        background: 'rgba(26,26,26,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 28,
      }}
    >
      <div className="flex items-center justify-around pt-3 pb-1 px-2">
        {tabs.map((tab, i) => {
          const isActive =
            mode === 'admin'
              ? false
              : currentScreen === tab.screen;
          const Icon = tab.icon;
          return (
            <button
              key={`${tab.screen}-${i}`}
              onClick={() => onNavigate(tab.screen)}
              className="flex flex-col items-center gap-1 flex-1 py-1 transition-opacity"
              style={{ opacity: isActive ? 1 : 0.4 }}
            >
              <Icon
                size={22}
                color={isActive ? '#4ade80' : '#ffffff'}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? '#4ade80' : '#ffffff' }}
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
