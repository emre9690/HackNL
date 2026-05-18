import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { EventRoutine } from '../types';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;

function createPulseIcon(color = '#4ade80') {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:22px;height:22px;display:flex;align-items:center;justify-content:center;">
        <div style="
          position:absolute;
          width:22px;height:22px;
          border-radius:50%;
          background:${color}22;
          border:1.5px solid ${color}66;
          animation:stadspas-pulse 2.2s ease-in-out infinite;
        "></div>
        <div style="
          position:relative;
          width:10px;height:10px;
          border-radius:50%;
          background:${color};
          box-shadow:0 0 6px ${color}99;
        "></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  });
}

interface MapViewProps {
  events: EventRoutine[];
  onEventClick?: (event: EventRoutine) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function MapView({
  events,
  onEventClick,
  center = [51.9176, 4.5253],
  zoom = 13,
  className = 'h-full w-full',
}: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={className}
      style={{ background: '#1a1a2e' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map((event) => (
        <Marker
          key={event.id}
          position={event.coordinates}
          icon={createPulseIcon()}
          eventHandlers={{
            click: () => onEventClick && onEventClick(event),
          }}
        >
          <Popup className="stadspas-popup">
            <div style={{ padding: '10px 14px', minWidth: 160 }}>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 13, margin: '0 0 3px', fontFamily: 'inherit', lineHeight: 1.3 }}>
                {event.title}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: '0 0 5px', fontFamily: 'inherit' }}>
                {event.location}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#4ade80', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
                  {event.dayOfWeek} · {event.time}
                </span>
                <span style={{
                  background: 'rgba(74,222,128,0.15)',
                  color: '#4ade80',
                  fontSize: 10,
                  padding: '1px 6px',
                  borderRadius: 99,
                  border: '1px solid rgba(74,222,128,0.25)',
                  fontFamily: 'inherit',
                }}>
                  {event.language}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
