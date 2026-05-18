import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import EventCard from '../components/EventCard';
import BottomNav from '../components/BottomNav';
import { EventRoutine, Screen, AppMode } from '../types';

interface SavedEventsProps {
  savedEvents: EventRoutine[];
  onViewEvent: (event: EventRoutine) => void;
  onNavigate: (screen: Screen) => void;
  mode: AppMode;
  currentScreen: Screen;
}

export default function SavedEvents({
  savedEvents,
  onViewEvent,
  onNavigate,
  mode,
  currentScreen,
}: SavedEventsProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ background: '#0d0d12' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-5 pt-14 pb-4 flex-shrink-0">
        <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">Saved</p>
        <h1 className="text-white font-bold text-xl">Your saved routines</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28">
        {savedEvents.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-64 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Bookmark size={24} color="rgba(255,255,255,0.2)" />
            </div>
            <p className="text-white/30 text-sm mb-1">Nothing saved yet.</p>
            <p className="text-white/20 text-xs">Explore nearby spaces.</p>
            <button
              onClick={() => onNavigate('home')}
              className="mt-4 px-5 py-2 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.25)',
                color: '#4ade80',
              }}
            >
              Browse spaces
            </button>
          </motion.div>
        ) : (
          savedEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <EventCard event={event} onView={onViewEvent} />
            </motion.div>
          ))
        )}
      </div>

      <BottomNav mode={mode} currentScreen={currentScreen} onNavigate={onNavigate} />
    </motion.div>
  );
}
