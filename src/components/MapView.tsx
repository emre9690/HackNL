import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { EventRoutine } from '../types';

// Fix default marker icon paths for Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const mintIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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
      style={{ background: '#1a1a1a' }}
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
          icon={mintIcon}
          eventHandlers={{
            click: () => onEventClick && onEventClick(event),
          }}
        >
          <Popup>
            <div className="text-sm">
              <strong>{event.title}</strong>
              <br />
              <span className="text-gray-600">
                {event.dayOfWeek} · {event.time}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
