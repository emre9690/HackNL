import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw } from 'lucide-react';
import EventCard from '../components/EventCard';
import BottomNav from '../components/BottomNav';
import { EventRoutine, UserPreferences, Screen, AppMode } from '../types';
import { events } from '../data/events';

interface HomeProps {
  userPreferences: UserPreferences | null;
  onViewEvent: (event: EventRoutine) => void;
  onNavigate: (screen: Screen) => void;
  mode: AppMode;
  currentScreen: Screen;
}

const FILTERS = ['For You', 'Calm', 'Active', 'Creative', 'Study', 'Games', 'This week'];

export default function Home({ userPreferences, onViewEvent, onNavigate, mode, currentScreen }: HomeProps) {
  const [activeFilter, setActiveFilter] = useState('For You');
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const area = userPreferences?.area || 'Erasmus';

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      search === '' ||
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase()) ||
      event.category.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === 'For You' ||
      activeFilter === 'This week' ||
      event.vibe.some((v) => v.toLowerCase() === activeFilter.toLowerCase()) ||
      event.category.toLowerCase() === activeFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ background: '#0d0d12' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-white/40 text-xs font-medium">Good to see you</p>
            <h1 className="text-white font-bold text-xl">
              Spaces near{' '}
              <span style={{ color: '#4ade80' }}>{area.split(' ')[0]}</span>
            </h1>
          </div>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <RefreshCw size={15} color="rgba(255,255,255,0.4)" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 mb-3 flex-shrink-0">
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Search size={15} color="rgba(255,255,255,0.3)" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search routines, places, hobbies..."
            className="flex-1 bg-transparent text-sm text-white/70 outline-none placeholder-white/25"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex gap-2 px-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: isActive ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${isActive ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: isActive ? '#4ade80' : 'rgba(255,255,255,0.5)',
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto px-5 pb-28" key={refreshKey}>
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-white/30">
            <p className="text-sm">No spaces found.</p>
            <button
              onClick={() => { setSearch(''); setActiveFilter('For You'); }}
              className="mt-2 text-xs underline"
              style={{ color: '#4ade80' }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <EventCard
                event={event}
                onView={onViewEvent}
                showConnection={event.id === 'ev4'}
              />
            </motion.div>
          ))
        )}
      </div>

      <BottomNav mode={mode} currentScreen={currentScreen} onNavigate={onNavigate} />
    </motion.div>
  );
}
