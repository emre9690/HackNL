import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Globe, Users, Zap, Bookmark, CheckCircle2 } from 'lucide-react';
import { EventRoutine, Screen, AppMode, AttendStatus, UserPreferences } from '../types';
import MapView from '../components/MapView';
import BottomNav from '../components/BottomNav';

interface EventDetailProps {
  event: EventRoutine;
  onBack: () => void;
  onArrival: () => void;
  onSave: (event: EventRoutine) => void;
  isSaved: boolean;
  attendStatus: AttendStatus;
  onAttend: (status: AttendStatus) => void;
  onNavigate: (screen: Screen) => void;
  mode: AppMode;
  currentScreen: Screen;
  userPreferences: UserPreferences | null;
}

const vibeColors: Record<string, string> = {
  Games: 'bg-blue-500/20 text-blue-300 border-blue-500/20',
  'Social-light': 'bg-purple-500/20 text-purple-300 border-purple-500/20',
  Calm: 'bg-green-500/20 text-green-300 border-green-500/20',
  Study: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20',
  Outdoors: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20',
  Creative: 'bg-orange-500/20 text-orange-300 border-orange-500/20',
  Active: 'bg-red-500/20 text-red-300 border-red-500/20',
  'Beginner-friendly': 'bg-pink-500/20 text-pink-300 border-pink-500/20',
  Reading: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/20',
};

const whyMessages: Record<string, string> = {
  Games: 'A few regulars here say this is the kind of table you end up staying at longer than planned.',
  Study: 'Shared focus tends to work better than solo focus. Worth testing once.',
  Outdoors: 'A good pace for getting to know an area without any pressure.',
  Creative: 'People here tend to stay to the end. That\'s usually a good sign.',
  Active: 'The group here is used to seeing new faces. You won\'t be the only beginner.',
  Reading: 'Sometimes the best company is just other people doing their own thing nearby.',
  Walking: 'Easy to join, easy to leave. No commitment beyond showing up.',
  Bouldering: 'The regulars here are the kind who celebrate other people\'s first routes.',
};

function getLanguageMatch(eventLang: string, userLang: string): 'match' | 'neutral' | 'none' {
  if (!userLang) return 'neutral';
  if (userLang === 'Both') return 'match';
  if (eventLang === 'Silent') return 'neutral';
  if (eventLang === userLang) return 'match';
  return 'none';
}

export default function EventDetail({
  event,
  onBack,
  onArrival,
  onSave,
  isSaved,
  attendStatus,
  onAttend,
  onNavigate,
  mode,
  currentScreen,
  userPreferences,
}: EventDetailProps) {
  const whyMsg =
    whyMessages[event.category] ||
    whyMessages[event.vibe[0]] ||
    'A consistent spot — the kind of place worth checking out at least once.';

  const langMatch = getLanguageMatch(event.language, userPreferences?.language || '');

  const handleMaybeGo = () => {
    onAttend(attendStatus === 'maybe' ? 'none' : 'maybe');
  };
  const handleConfirmGo = () => {
    onAttend(attendStatus === 'going' ? 'none' : 'going');
  };

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
      <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ paddingBottom: 160 }}>
        {/* Back + Save header */}
        <div className="px-5 pt-14 pb-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <ArrowLeft size={16} color="rgba(255,255,255,0.8)" />
            </button>
            <span className="text-white/40 text-sm">Back</span>
          </div>
          {/* Save icon — top right */}
          <motion.button
            onClick={() => onSave(event)}
            whileTap={{ scale: 0.85 }}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
            style={{
              background: isSaved ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${isSaved ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            <Bookmark
              size={15}
              fill={isSaved ? '#4ade80' : 'none'}
              color={isSaved ? '#4ade80' : 'rgba(255,255,255,0.6)'}
            />
          </motion.button>
        </div>

        <div className="px-5">
          <h1 className="text-white font-black text-2xl mb-3 leading-tight">{event.title}</h1>

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
            <div className="flex items-center gap-2">
              <Globe size={13} className="text-white/50 flex-shrink-0" />
              <span className="text-white/50 text-sm">{event.language}</span>
              {langMatch === 'match' && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}
                >
                  Matches your language
                </span>
              )}
              {langMatch === 'none' && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Different language
                </span>
              )}
            </div>
          </div>

          {/* Vibe chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {event.vibe.map((v) => (
              <span
                key={v}
                className={`text-xs font-medium px-3 py-1 rounded-full border ${vibeColors[v] || 'bg-white/10 text-white/60 border-white/10'}`}
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
            style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4ade80' }}>
              Worth knowing
            </p>
            <p className="text-white/60 text-sm leading-relaxed">{whyMsg}</p>
          </div>

          {/* Attendance */}
          <div
            className="rounded-2xl p-4 mb-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-2">
              <Users size={14} color="rgba(255,255,255,0.4)" />
              <span className="text-white/50 text-sm">
                <span className="text-white/80 font-medium">{event.considering}</span> considering ·{' '}
                <span className="text-white/80 font-medium">{event.going}</span> going
              </span>
            </div>
            {attendStatus !== 'none' && (
              <p className="text-xs mt-2" style={{ color: '#4ade80' }}>
                You're marked as {attendStatus === 'maybe' ? 'considering' : 'going'}.
              </p>
            )}
          </div>

          {/* Map preview — fixed height, clipped */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ height: 150, border: '1px solid rgba(255,255,255,0.08)' }}
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

      {/* Action buttons — fixed, above bottom nav */}
      <div
        className="absolute left-0 right-0 px-5 pt-3 pb-3"
        style={{
          bottom: 68,
          background: 'linear-gradient(to top, #0d0d12 70%, transparent)',
        }}
      >
        {/* Row 1: might go + confirmed */}
        <div className="flex gap-2 mb-2">
          <motion.button
            onClick={handleMaybeGo}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl font-semibold text-sm transition-colors"
            style={{
              background: attendStatus === 'maybe' ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${attendStatus === 'maybe' ? 'rgba(74,222,128,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: attendStatus === 'maybe' ? '#4ade80' : 'rgba(255,255,255,0.6)',
            }}
          >
            {attendStatus === 'maybe' && <Check size={13} />}
            I might go
          </motion.button>
          <motion.button
            onClick={handleConfirmGo}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl font-semibold text-sm transition-colors"
            style={{
              background: attendStatus === 'going' ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${attendStatus === 'going' ? 'rgba(74,222,128,0.6)' : 'rgba(255,255,255,0.1)'}`,
              color: attendStatus === 'going' ? '#4ade80' : 'rgba(255,255,255,0.6)',
            }}
          >
            {attendStatus === 'going' && <CheckCircle2 size={13} />}
            Confirmed going
          </motion.button>
        </div>
        {/* Row 2: arrival */}
        <motion.button
          onClick={onArrival}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-colors"
          style={{
            background: 'rgba(251,191,36,0.15)',
            border: '1px solid rgba(251,191,36,0.4)',
            color: '#fbbf24',
          }}
        >
          <Zap size={15} />
          I'm at the spot
        </motion.button>
      </div>

      <BottomNav mode={mode} currentScreen={currentScreen} onNavigate={onNavigate} />
    </motion.div>
  );
}

// small check icon inline
function Check({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
