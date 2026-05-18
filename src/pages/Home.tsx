import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import EventCard from '../components/EventCard';
import BottomNav from '../components/BottomNav';
import { EventRoutine, UserPreferences, Screen, AppMode, AttendStatus } from '../types';
import { events } from '../data/events';

interface HomeProps {
  userPreferences: UserPreferences | null;
  onViewEvent: (event: EventRoutine) => void;
  onNavigate: (screen: Screen) => void;
  mode: AppMode;
  currentScreen: Screen;
  attendDelta: Record<string, { considering: number; going: number }>;
  attendStatus: Record<string, AttendStatus>;
}

const FILTERS = ['For You', 'All', 'Outdoors', 'Creative', 'Study', 'Games', 'Music', 'Food'];

function getForYouEvents(prefs: UserPreferences | null): EventRoutine[] {
  if (!prefs || prefs.interests.length === 0) return events.slice(0, 8);
  const lower = prefs.interests.map((i) => i.toLowerCase());
  const vibeMap: Record<string, string> = {
    'Quiet': 'Calm', 'Social-light': 'Social-light', 'Mixed': '', 'Energetic': 'Active',
  };
  const scored = events.map((e) => {
    let score = 0;
    lower.forEach((interest) => {
      if (e.category.toLowerCase().includes(interest)) score += 3;
      if (e.title.toLowerCase().includes(interest)) score += 2;
    });
    e.vibe.forEach((v) => {
      if (lower.includes(v.toLowerCase())) score += 2;
    });
    if (prefs.vibe && vibeMap[prefs.vibe]) {
      if (e.vibe.some((v) => v.toLowerCase().includes(vibeMap[prefs.vibe].toLowerCase()))) score += 1;
    }
    if (prefs.language && (prefs.language === 'Both' || e.language === prefs.language)) score += 2;
    if (prefs.area) {
      const areaWord = prefs.area.toLowerCase().split(' ')[0];
      if (e.area.toLowerCase().includes(areaWord)) score += 1;
    }
    return { e, score };
  });
  const sorted = scored.sort((a, b) => b.score - a.score);
  const matched = sorted.filter((x) => x.score > 0).map((x) => x.e);
  if (matched.length >= 6) return matched;
  return sorted.slice(0, 8).map((x) => x.e);
}

export default function Home({
  userPreferences, onViewEvent, onNavigate, mode, currentScreen, attendDelta, attendStatus,
}: HomeProps) {
  const [activeFilter, setActiveFilter] = useState('For You');
  const [search, setSearch] = useState('');

  const area = userPreferences?.area || 'Rotterdam';
  const forYouEvents = getForYouEvents(userPreferences);

  const isForYou = activeFilter === 'For You';
  const isAll = activeFilter === 'All';

  const pool = isForYou ? forYouEvents : events;

  const displayedEvents = pool.filter((event) => {
    const matchesSearch =
      search === '' ||
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase()) ||
      event.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      isForYou || isAll ||
      event.vibe.some((v) => v.toLowerCase().includes(activeFilter.toLowerCase())) ||
      event.category.toLowerCase().includes(activeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const getAdjustedEvent = (e: EventRoutine) => {
    const delta = attendDelta[e.id];
    if (!delta) return e;
    return { ...e, considering: e.considering + delta.considering, going: e.going + delta.going };
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ background: '#F7F3EE' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="px-5 pt-14 pb-3 flex-shrink-0">
        <p className="text-xs font-medium mb-0.5" style={{ color: '#9CA3AF' }}>
          Good to see you
        </p>
        <h1 className="font-black text-2xl" style={{ color: '#1A1A2E', letterSpacing: -0.5 }}>
          Spaces near{' '}
          <span style={{ color: '#E8651A' }}>{area.split(' ')[0]}</span>
        </h1>
      </div>

      {/* Search */}
      <div className="px-5 mb-3 flex-shrink-0">
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
          style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          <Search size={15} color="#9CA3AF" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search routines, places, hobbies..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: '#1A1A2E' }}
          />
        </div>
      </div>

      {/* Unified filter strip */}
      <div className="flex-shrink-0 mb-3 relative">
        <div
          className="flex gap-1.5 px-5 overflow-x-auto"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            const isPrimary = filter === 'For You' || filter === 'All';
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{
                  background: isActive
                    ? (isPrimary ? '#1A1A2E' : '#E8651A')
                    : 'white',
                  border: `1.5px solid ${isActive ? (isPrimary ? '#1A1A2E' : '#E8651A') : 'rgba(0,0,0,0.08)'}`,
                  color: isActive ? 'white' : '#6B7280',
                  boxShadow: isActive
                    ? (isPrimary ? 'none' : '0 2px 8px rgba(232,101,26,0.25)')
                    : '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                {filter === 'All'
                  ? `All · ${events.length}`
                  : filter === 'For You'
                    ? `For You · ${forYouEvents.length}`
                    : filter}
              </button>
            );
          })}
        </div>
        {/* Fade edges */}
        <div
          className="absolute top-0 left-0 h-full w-6 pointer-events-none"
          style={{ background: 'linear-gradient(to left, transparent, #F7F3EE)' }}
        />
        <div
          className="absolute top-0 right-0 h-full w-8 pointer-events-none"
          style={{ background: 'linear-gradient(to right, transparent, #F7F3EE)' }}
        />
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto px-5 pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFilter}-${search}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isAll && search === '' && (
              <p className="text-xs font-medium mb-3" style={{ color: '#9CA3AF' }}>
                All events in Rotterdam
              </p>
            )}
            {displayedEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm" style={{ color: '#9CA3AF' }}>No spaces found.</p>
                <button
                  onClick={() => { setSearch(''); setActiveFilter('For You'); }}
                  className="mt-2 text-xs underline"
                  style={{ color: '#E8651A' }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              displayedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <EventCard
                    event={getAdjustedEvent(event)}
                    onView={onViewEvent}
                    showConnection={event.id === 'ev4'}
                    attendStatus={attendStatus[event.id] || 'none'}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav mode={mode} currentScreen={currentScreen} onNavigate={onNavigate} />
    </motion.div>
  );
}
