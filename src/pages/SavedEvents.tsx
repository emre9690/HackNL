import { motion } from 'framer-motion';
import { Bookmark, X } from 'lucide-react';
import EventCard from '../components/EventCard';
import BottomNav from '../components/BottomNav';
import { EventRoutine, Screen, AppMode } from '../types';

interface SavedEventsProps {
  savedEvents: EventRoutine[];
  onViewEvent: (event: EventRoutine) => void;
  onSaveEvent: (event: EventRoutine) => void;
  onNavigate: (screen: Screen) => void;
  mode: AppMode;
  currentScreen: Screen;
}

export default function SavedEvents({
  savedEvents,
  onViewEvent,
  onSaveEvent,
  onNavigate,
  mode,
  currentScreen,
}: SavedEventsProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ background: '#F7F3EE' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-5 pt-14 pb-4 flex-shrink-0">
        <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>Saved</p>
        <h1 className="font-black text-xl" style={{ color: '#1A1A2E', letterSpacing: -0.5 }}>Your saved routines</h1>
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
              style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              <Bookmark size={24} color="#9CA3AF" />
            </div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#4B5563' }}>Nothing saved yet.</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Tap the bookmark icon on any event.</p>
            <button
              onClick={() => onNavigate('home')}
              className="mt-4 px-5 py-2 rounded-full text-xs font-bold"
              style={{
                background: '#FFF0E8',
                border: '1px solid rgba(232,101,26,0.25)',
                color: '#E8651A',
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
              className="relative"
            >
              <button
                onClick={() => onSaveEvent(event)}
                className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full"
                style={{ background: '#FEF2F2', border: '1px solid rgba(220,38,38,0.2)', color: '#DC2626' }}
                title="Remove from saved"
              >
                <X size={12} />
              </button>
              <EventCard event={event} onView={onViewEvent} />
            </motion.div>
          ))
        )}
      </div>

      <BottomNav mode={mode} currentScreen={currentScreen} onNavigate={onNavigate} />
    </motion.div>
  );
}
