import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { EventRoutine } from '../types';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;

const CATEGORY_COLORS: Record<string, string> = {
  'Board games': '#1A52A8',
  'D&D': '#7C3AED',
  'Chess': '#7C3AED',
  'Catan': '#1A52A8',
  'Tabletop RPG': '#7C3AED',
  'Trivia': '#1A52A8',
  'Trivia nights': '#1A52A8',
  'Strategy games': '#1A52A8',
  'Study': '#D97706',
  'Reading': '#4338CA',
  'Writing': '#4338CA',
  'Film': '#4338CA',
  'Outdoors': '#16A34A',
  'Walking': '#16A34A',
  'Yoga': '#16A34A',
  'Volunteering': '#16A34A',
  'Running': '#DC2626',
  'Cycling': '#DC2626',
  'Bouldering': '#DC2626',
  'Active': '#DC2626',
  'Dance': '#E8651A',
  'Music': '#E8651A',
  'Creative': '#E8651A',
  'Drawing': '#E8651A',
  'Photography': '#E8651A',
  'Ceramics': '#E8651A',
  'Food & coffee': '#D97706',
  'Language exchange': '#16A34A',
  'Tech': '#1A52A8',
};

const LEGEND = [
  { color: '#1A52A8', label: 'Games & Tech' },
  { color: '#7C3AED', label: 'RPG & Chess' },
  { color: '#E8651A', label: 'Creative & Music' },
  { color: '#DC2626', label: 'Active & Sport' },
  { color: '#16A34A', label: 'Outdoors & Social' },
  { color: '#D97706', label: 'Study & Food' },
];

function getCategoryColor(event: EventRoutine): string {
  return CATEGORY_COLORS[event.category] || CATEGORY_COLORS[event.vibe[0]] || '#E8651A';
}

function createPinIcon(color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38">
      <filter id="shadow" x="-30%" y="-10%" width="160%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/>
      </filter>
      <path d="M14 0C6.27 0 0 6.27 0 14c0 9.33 14 24 14 24s14-14.67 14-24C28 6.27 21.73 0 14 0z"
        fill="${color}" filter="url(#shadow)"/>
      <circle cx="14" cy="13" r="5" fill="white" opacity="0.95"/>
    </svg>
  `.trim();
  return L.divIcon({
    className: '',
    html: `<div style="width:28px;height:38px;">${svg}</div>`,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -40],
  });
}

interface MapViewProps {
  events: EventRoutine[];
  onEventClick?: (event: EventRoutine) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
  showLegend?: boolean;
}

export default function MapView({
  events,
  onEventClick,
  center = [51.9176, 4.5253],
  zoom = 13,
  className = 'h-full w-full',
  showLegend = false,
}: MapViewProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        className={className}
        style={{ background: '#e8e0d8' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((event) => {
          const color = getCategoryColor(event);
          return (
            <Marker
              key={event.id}
              position={event.coordinates}
              icon={createPinIcon(color)}
            >
              <Popup className="stadkompas-popup">
                <div style={{ padding: '12px 14px', minWidth: 190 }}>
                  <p style={{ color: '#1A1A2E', fontWeight: 700, fontSize: 13, margin: '0 0 2px', fontFamily: 'inherit', lineHeight: 1.3 }}>
                    {event.title}
                  </p>
                  <p style={{ color: '#6B7280', fontSize: 11, margin: '0 0 4px', fontFamily: 'inherit' }}>
                    {event.location}
                  </p>
                  <p style={{ color, fontSize: 11, fontWeight: 600, margin: '0 0 4px', fontFamily: 'inherit' }}>
                    {event.dayOfWeek} · {event.time}
                  </p>
                  <p style={{ color: '#9CA3AF', fontSize: 11, margin: '0 0 10px', fontFamily: 'inherit' }}>
                    {event.going} going · {event.considering} considering
                  </p>
                  {onEventClick && (
                    <button
                      onClick={() => onEventClick(event)}
                      style={{
                        width: '100%',
                        padding: '7px 0',
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #E8651A, #FF8C42)',
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      View event →
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {showLegend && (
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            zIndex: 1000,
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 14,
            padding: '10px 12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p style={{ fontSize: 9, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 7px', fontFamily: 'inherit' }}>
            Legend
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {LEGEND.map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: '#4B5563', fontFamily: 'inherit', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
