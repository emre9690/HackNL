import { MapPin, Clock, Globe, Users, ChevronRight } from 'lucide-react';
import { EventRoutine, AttendStatus } from '../types';

interface EventCardProps {
  event: EventRoutine;
  onView: (event: EventRoutine) => void;
  showConnection?: boolean;
  attendStatus?: AttendStatus;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  'Board games': { bg: '#EBF0FB', text: '#1A52A8' },
  'D&D': { bg: '#F3EEFF', text: '#7C3AED' },
  'Chess': { bg: '#F3EEFF', text: '#7C3AED' },
  'Catan': { bg: '#EBF0FB', text: '#1A52A8' },
  'Tabletop RPG': { bg: '#F3EEFF', text: '#7C3AED' },
  'Trivia': { bg: '#EBF0FB', text: '#1A52A8' },
  'Study': { bg: '#FEF3C7', text: '#D97706' },
  'Reading': { bg: '#EEF2FF', text: '#4338CA' },
  'Writing': { bg: '#EEF2FF', text: '#4338CA' },
  'Outdoors': { bg: '#F0FDF4', text: '#16A34A' },
  'Walking': { bg: '#F0FDF4', text: '#16A34A' },
  'Running': { bg: '#FEF2F2', text: '#DC2626' },
  'Cycling': { bg: '#FEF2F2', text: '#DC2626' },
  'Bouldering': { bg: '#FEF2F2', text: '#DC2626' },
  'Yoga': { bg: '#F0FDF4', text: '#16A34A' },
  'Dance': { bg: '#FFF0E8', text: '#E8651A' },
  'Music': { bg: '#FFF0E8', text: '#E8651A' },
  'Creative': { bg: '#FFF0E8', text: '#E8651A' },
  'Drawing': { bg: '#FFF0E8', text: '#E8651A' },
  'Photography': { bg: '#FFF0E8', text: '#E8651A' },
  'Ceramics': { bg: '#FFF0E8', text: '#E8651A' },
  'Film': { bg: '#EEF2FF', text: '#4338CA' },
  'Tech': { bg: '#EBF0FB', text: '#1A52A8' },
  'Volunteering': { bg: '#F0FDF4', text: '#16A34A' },
  'Food & coffee': { bg: '#FEF3C7', text: '#D97706' },
  'Language exchange': { bg: '#F0FDF4', text: '#16A34A' },
  'Calm': { bg: '#F0FDF4', text: '#16A34A' },
  'Social-light': { bg: '#F3EEFF', text: '#7C3AED' },
  'Beginner-friendly': { bg: '#FFF0E8', text: '#E8651A' },
  'Hands-on': { bg: '#FFF0E8', text: '#E8651A' },
  'Networking': { bg: '#EBF0FB', text: '#1A52A8' },
  'Guitar': { bg: '#FFF0E8', text: '#E8651A' },
  'Trivia nights': { bg: '#EBF0FB', text: '#1A52A8' },
};

function vibeChip(v: string) {
  const c = categoryColors[v] || { bg: '#F3F4F6', text: '#6B7280' };
  return (
    <span
      key={v}
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.text }}
    >
      {v}
    </span>
  );
}

export default function EventCard({ event, onView, showConnection, attendStatus }: EventCardProps) {
  const isMaybe = attendStatus === 'maybe';
  const isGoing = attendStatus === 'going';

  return (
    <div
      className="rounded-2xl p-4 mb-3 cursor-pointer transition-all"
      style={{
        background: 'white',
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
      onClick={() => onView(event)}
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <h3 className="font-bold text-base leading-tight" style={{ color: '#1A1A2E' }}>
          {event.title}
        </h3>
        <button
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #E8651A, #FF8C42)',
            color: 'white',
            boxShadow: '0 2px 8px rgba(232,101,26,0.3)',
          }}
        >
          View <ChevronRight size={11} />
        </button>
      </div>

      <div className="flex flex-col gap-1 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#6B7280' }}>
          <MapPin size={11} />
          <span>{event.location}</span>
          <span style={{ color: '#D1D5DB' }}>·</span>
          <span>{event.distanceKm} km</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#6B7280' }}>
          <Clock size={11} />
          <span>{event.dayOfWeek} {event.time}</span>
          <span style={{ color: '#D1D5DB' }}>·</span>
          <Globe size={11} />
          <span>{event.language}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {event.vibe.map((v) => vibeChip(v))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs" style={{ color: '#9CA3AF' }}>
          <Users size={11} />
          <span>{event.considering} considering · {event.going} going</span>
        </div>
        {(isMaybe || isGoing) && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: isGoing ? '#F0FDF4' : '#FFF0E8',
              color: isGoing ? '#16A34A' : '#E8651A',
            }}
          >
            {isGoing ? '✓ Going' : '○ Considering'}
          </span>
        )}
      </div>

      {showConnection && (
        <div
          className="mt-2 pt-2 text-xs flex items-center gap-1.5"
          style={{ borderTop: '1px solid rgba(0,0,0,0.05)', color: '#16A34A' }}
        >
          <span
            className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: '#F0FDF4' }}
          >
            A
          </span>
          <span>Ana from Sketch Café is going</span>
        </div>
      )}
    </div>
  );
}
