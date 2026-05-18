import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Globe, Users, Zap, Bookmark } from 'lucide-react';
import { EventRoutine, Screen, AppMode } from '../types';
import MapView from '../components/MapView';
import BottomNav from '../components/BottomNav';

interface EventDetailProps {
  event: EventRoutine;
  onBack: () => void;
  onArrival: () => void;
  onSave: (event: EventRoutine) => void;
  isSaved: boolean;
  onNavigate: (screen: Screen) => void;
  mode: AppMode;
  currentScreen: Screen;
}

const vibeColors: Record<string, string> = {
  Games: 'bg-blue-500/20 text-blue-300',
  'Social-light': 'bg-purple-500/20 text-purple-300',
  Calm: 'bg-green-500/20 text-green-300',
  Study: 'bg-yellow-500/20 text-yellow-300',
  Outdoors: 'bg-emerald-500/20 text-emerald-300',
  Creative: 'bg-orange-500/20 text-orange-300',
  Active: 'bg-red-500/20 text-red-300',
  'Beginner-friendly': 'bg-pink-500/20 text-pink-300',
  Reading: 'bg-indigo-500/20 text-indigo-300',
};

export default function EventDetail({
  event,
  onBack,
  onArrival,
  onSave,
  isSaved,
  onNavigate,
  mode,
  currentScreen,
}: EventDetailProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ background: '#0d0d12' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Back button */}
        <div className="px-5 pt-14 pb-4 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ArrowLeft size={16} color="rgba(255,255,255,0.8)" />
          </button>
          <span className="text-white/50 text-sm">Back</span>
        </div>

        <div className="px-5">
          {/* Title */}
          <h1 className="text-white font-black text-2xl mb-2 leading-tight">{event.title}</h1>

          {/* Meta */}
          <div className="flex flex-col gap-1.5 mb-4">
            <div className="flex items-center gap-1.5 text-white/50 text-sm">
              <MapPin size={13} />
              <span>{event.location}</span>
              <span className="text-white/25">·</span>
              <span className="text-white/35">{event.area}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50 text-sm">
              <Clock size={13} />
              <span>{event.dayOfWeek} at {event.time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50 text-sm">
              <Globe size={13} />
              <span>{event.language}</span>
            </div>
          </div>

          {/* Vibe chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {event.vibe.map((v) => (
              <span
                key={v}
                className={`text-xs font-medium px-3 py-1 rounded-full ${vibeColors[v] || 'bg-white/10 text-white/60'}`}
              >
                {v}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-white/60 text-sm leading-relaxed mb-5">{event.description}</p>

          {/* Why it fits */}
          <div
            className="rounded-2xl p-4 mb-5"
            style={{
              background: 'rgba(74,222,128,0.06)',
              border: '1px solid rgba(74,222,128,0.15)',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#4ade80' }}>
              Why this might fit you
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              Based on your interest in{' '}
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{event.vibe[0].toLowerCase()}</span>{' '}
              activities and preference for{' '}
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{event.language.split('/')[0].trim()}</span>
              -language spaces, this routine matches your profile well.
            </p>
          </div>

          {/* Attendance */}
          <div
            className="rounded-2xl p-4 mb-5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-center gap-2">
              <Users size={14} color="rgba(255,255,255,0.4)" />
              <span className="text-white/50 text-sm">
                <span className="text-white/80 font-medium">{event.considering}</span> considering ·{' '}
                <span className="text-white/80 font-medium">{event.going}</span> going
              </span>
            </div>
          </div>

          {/* Map preview */}
          <div
            className="rounded-2xl overflow-hidden mb-5"
            style={{
              height: 160,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <MapView
              events={[event]}
              center={event.coordinates}
              zoom={15}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pb-28 pt-4 flex gap-2"
        style={{
          background: 'linear-gradient(to top, #0d0d12 60%, transparent)',
        }}
      >
        <button
          onClick={() => onSave(event)}
          className="flex items-center gap-2 px-4 py-3.5 rounded-2xl font-semibold text-sm flex-shrink-0 transition-all"
          style={{
            background: isSaved ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${isSaved ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.1)'}`,
            color: isSaved ? '#4ade80' : 'rgba(255,255,255,0.6)',
          }}
        >
          <Bookmark size={15} fill={isSaved ? '#4ade80' : 'none'} />
          {isSaved ? 'Saved' : 'I might go'}
        </button>

        <button
          onClick={onArrival}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all"
          style={{
            background: 'rgba(251,191,36,0.15)',
            border: '1px solid rgba(251,191,36,0.4)',
            color: '#fbbf24',
          }}
        >
          <Zap size={15} />
          I'm at the spot
        </button>
      </div>

      <BottomNav mode={mode} currentScreen={currentScreen} onNavigate={onNavigate} />
    </motion.div>
  );
}
