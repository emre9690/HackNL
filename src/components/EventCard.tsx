import { MapPin, Clock, Globe, Users, ChevronRight } from 'lucide-react';
import { EventRoutine } from '../types';

interface EventCardProps {
  event: EventRoutine;
  onView: (event: EventRoutine) => void;
  showConnection?: boolean;
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
  'Social-Light': 'bg-purple-500/20 text-purple-300',
};

export default function EventCard({ event, onView, showConnection }: EventCardProps) {
  return (
    <div
      className="rounded-2xl p-4 mb-3 cursor-pointer group transition-all"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)',
      }}
      onClick={() => onView(event)}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-white font-semibold text-base leading-tight">{event.title}</h3>
        <button
          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 transition-all"
          style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}
        >
          View <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex flex-col gap-1.5 mb-3">
        <div className="flex items-center gap-1.5 text-white/50 text-xs">
          <MapPin size={11} />
          <span>{event.location}</span>
          <span className="text-white/30">·</span>
          <span className="text-white/40">{event.distanceKm} km</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/50 text-xs">
          <Clock size={11} />
          <span>{event.dayOfWeek} {event.time}</span>
          <span className="text-white/30">·</span>
          <Globe size={11} />
          <span>{event.language}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {event.vibe.map((v) => (
          <span
            key={v}
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${vibeColors[v] || 'bg-white/10 text-white/60'}`}
          >
            {v}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-white/40 text-xs">
          <Users size={11} />
          <span>{event.considering} considering · {event.going} going</span>
        </div>
      </div>

      {showConnection && (
        <div
          className="mt-2 pt-2 text-xs flex items-center gap-1.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: '#4ade80' }}
        >
          <span className="w-4 h-4 rounded-full bg-green-400/20 flex items-center justify-center text-[10px]">A</span>
          <span>Ana from Sketch Café is going</span>
        </div>
      )}
    </div>
  );
}
