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
  attendDelta: { considering: number; going: number };
}

const vibeColors: Record<string, { bg: string; text: string }> = {
  'Board games': { bg: '#EBF0FB', text: '#1A52A8' },
  'D&D': { bg: '#F3EEFF', text: '#7C3AED' },
  Chess: { bg: '#F3EEFF', text: '#7C3AED' },
  Study: { bg: '#FEF3C7', text: '#D97706' },
  Outdoors: { bg: '#F0FDF4', text: '#16A34A' },
  Walking: { bg: '#F0FDF4', text: '#16A34A' },
  Creative: { bg: '#FFF0E8', text: '#E8651A' },
  Drawing: { bg: '#FFF0E8', text: '#E8651A' },
  Music: { bg: '#FFF0E8', text: '#E8651A' },
  Active: { bg: '#FEF2F2', text: '#DC2626' },
  Bouldering: { bg: '#FEF2F2', text: '#DC2626' },
  Running: { bg: '#FEF2F2', text: '#DC2626' },
  Reading: { bg: '#EEF2FF', text: '#4338CA' },
  Film: { bg: '#EEF2FF', text: '#4338CA' },
  Calm: { bg: '#F0FDF4', text: '#16A34A' },
  'Social-light': { bg: '#F3EEFF', text: '#7C3AED' },
  'Beginner-friendly': { bg: '#FFF0E8', text: '#E8651A' },
  Dance: { bg: '#FFF0E8', text: '#E8651A' },
  Tech: { bg: '#EBF0FB', text: '#1A52A8' },
  Photography: { bg: '#FFF0E8', text: '#E8651A' },
  'Language exchange': { bg: '#F0FDF4', text: '#16A34A' },
  'Tabletop RPG': { bg: '#F3EEFF', text: '#7C3AED' },
  Yoga: { bg: '#F0FDF4', text: '#16A34A' },
  'Food & coffee': { bg: '#FEF3C7', text: '#D97706' },
  Volunteering: { bg: '#F0FDF4', text: '#16A34A' },
  Cycling: { bg: '#FEF2F2', text: '#DC2626' },
};

const whyMessages: Record<string, string> = {
  'Board games': 'A few regulars here say this is the kind of table you end up staying at longer than planned.',
  Study: 'Shared focus tends to work better than solo focus. Worth testing once.',
  Outdoors: 'A good pace for getting to know an area without any pressure.',
  Creative: 'People here tend to stay to the end. That\'s usually a good sign.',
  Active: 'The group here is used to seeing new faces. You won\'t be the only beginner.',
  Reading: 'Sometimes the best company is just other people doing their own thing nearby.',
  Walking: 'Easy to join, easy to leave. No commitment beyond showing up.',
  Bouldering: 'The regulars here celebrate other people\'s first routes.',
  Music: 'Even if you only come to listen, people who show up here tend to come back.',
  Film: 'A good discussion often surprises you. No film knowledge required.',
  Tech: 'The talks are short. The conversations after them aren\'t.',
  'Language exchange': 'The format here works better than a class. You get to use it immediately.',
  Dance: 'Most people say the first time was the hardest. After that, they keep coming back.',
  Chess: 'Consistently the same faces each week — which usually means it\'s worth showing up for.',
};

function getLangMatch(eventLang: string, userLang: string): 'match' | 'neutral' | 'none' {
  if (!userLang) return 'neutral';
  if (userLang === 'Both') return 'match';
  if (eventLang === 'Silent') return 'neutral';
  if (eventLang === userLang) return 'match';
  return 'none';
}

function CheckMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function EventDetail({
  event, onBack, onArrival, onSave, isSaved, attendStatus, onAttend,
  onNavigate, mode, currentScreen, userPreferences, attendDelta,
}: EventDetailProps) {
  const displayEvent = {
    ...event,
    considering: event.considering + attendDelta.considering,
    going: event.going + attendDelta.going,
  };

  const whyMsg =
    whyMessages[event.category] ||
    whyMessages[event.vibe[0]] ||
    'A consistent spot — the kind of place worth checking out at least once.';

  const langMatch = getLangMatch(event.language, userPreferences?.language || '');

  const handleMaybe = () => onAttend(attendStatus === 'maybe' ? 'none' : 'maybe');
  const handleConfirm = () => onAttend(attendStatus === 'going' ? 'none' : 'going');

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ background: '#F7F3EE' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ paddingBottom: 80 }}>
        {/* Back + Save */}
        <div className="px-5 pt-14 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-full"
              style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
            >
              <ArrowLeft size={16} color="#4B5563" />
            </button>
            <span className="text-sm" style={{ color: '#9CA3AF' }}>Back</span>
          </div>
          <motion.button
            onClick={() => onSave(event)}
            whileTap={{ scale: 0.85 }}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
            style={{
              background: isSaved ? '#FFF0E8' : 'white',
              border: `1px solid ${isSaved ? 'rgba(232,101,26,0.4)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
          >
            <Bookmark
              size={15}
              fill={isSaved ? '#E8651A' : 'none'}
              color={isSaved ? '#E8651A' : '#9CA3AF'}
            />
          </motion.button>
        </div>

        <div className="px-5">
          <h1 className="font-black text-2xl mb-3 leading-tight" style={{ color: '#1A1A2E', letterSpacing: -0.5 }}>
            {event.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-col gap-1.5 mb-4">
            <div className="flex items-center gap-1.5 text-sm" style={{ color: '#6B7280' }}>
              <MapPin size={13} />
              <span>{event.location}</span>
              <span style={{ color: '#D1D5DB' }}>·</span>
              <span style={{ color: '#9CA3AF' }}>{event.area}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: '#6B7280' }}>
              <Clock size={13} />
              <span>{event.dayOfWeek} at {event.time}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Globe size={13} color="#9CA3AF" />
              <span className="text-sm" style={{ color: '#6B7280' }}>{event.language}</span>
              {langMatch === 'match' && (
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: '#F0FDF4', color: '#16A34A' }}>
                  Matches your language
                </span>
              )}
              {langMatch === 'none' && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: '#F3F4F6', color: '#9CA3AF' }}>
                  Different language
                </span>
              )}
            </div>
          </div>

          {/* Vibe chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {event.vibe.map((v) => {
              const c = vibeColors[v] || { bg: '#F3F4F6', text: '#6B7280' };
              return (
                <span key={v} className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: c.bg, color: c.text }}>
                  {v}
                </span>
              );
            })}
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#4B5563' }}>
            {event.description}
          </p>

          {/* Worth knowing */}
          <div className="rounded-2xl p-4 mb-5"
            style={{ background: '#FFF0E8', border: '1px solid rgba(232,101,26,0.2)' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#E8651A' }}>
              Worth knowing
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>{whyMsg}</p>
          </div>

          {/* Attendance */}
          <div className="rounded-2xl p-4 mb-5"
            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2">
              <Users size={14} color="#9CA3AF" />
              <span className="text-sm" style={{ color: '#6B7280' }}>
                <span className="font-bold" style={{ color: '#1A1A2E' }}>{displayEvent.considering}</span> considering ·{' '}
                <span className="font-bold" style={{ color: '#1A1A2E' }}>{displayEvent.going}</span> going
              </span>
            </div>
            {attendStatus !== 'none' && (
              <p className="text-xs mt-2 font-medium" style={{ color: '#E8651A' }}>
                You're marked as {attendStatus === 'maybe' ? 'considering' : 'going'}.
              </p>
            )}
          </div>

          {/* Map preview */}
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{ height: 200, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <MapView
              events={[event]}
              center={event.coordinates}
              zoom={15}
              className="h-full w-full"
            />
          </div>

          {/* Action buttons — inline, scroll naturally */}
          <div className="flex gap-2 mb-2">
            <motion.button
              onClick={handleMaybe}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl font-bold text-sm"
              style={{
                background: attendStatus === 'maybe' ? '#FFF0E8' : 'white',
                border: `1.5px solid ${attendStatus === 'maybe' ? '#E8651A' : 'rgba(0,0,0,0.1)'}`,
                color: attendStatus === 'maybe' ? '#E8651A' : '#4B5563',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {attendStatus === 'maybe' && <CheckMark size={12} />}
              I might go
            </motion.button>
            <motion.button
              onClick={handleConfirm}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl font-bold text-sm"
              style={{
                background: attendStatus === 'going' ? '#F0FDF4' : 'white',
                border: `1.5px solid ${attendStatus === 'going' ? '#16A34A' : 'rgba(0,0,0,0.1)'}`,
                color: attendStatus === 'going' ? '#16A34A' : '#4B5563',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {attendStatus === 'going' && <CheckCircle2 size={13} />}
              Confirmed going
            </motion.button>
          </div>
          <motion.button
            onClick={onArrival}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm"
            style={{
              background: 'linear-gradient(135deg, #E8651A, #FF8C42)',
              color: 'white',
              boxShadow: '0 4px 16px rgba(232,101,26,0.35)',
            }}
          >
            <Zap size={15} />
            I'm at the spot
          </motion.button>
        </div>
      </div>

      <BottomNav mode={mode} currentScreen={currentScreen} onNavigate={onNavigate} />
    </motion.div>
  );
}
