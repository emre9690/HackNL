export interface EventRoutine {
  id: string;
  title: string;
  location: string;
  area: string;
  coordinates: [number, number];
  time: string;
  dayOfWeek: string;
  language: string;
  vibe: string[];
  description: string;
  considering: number;
  going: number;
  codeWord: string;
  category: string;
  distanceKm: string;
  participants: string[];
}

export interface UserPreferences {
  firstName: string;
  lastName: string;
  phone: string;
  interests: string[];
  vibe: string;
  language: string;
  ageRange: string;
  area: string;
  freeText: string;
}

export interface AIProfile {
  archetype: string;
  summary: string;
  tags: string[];
  recommendedCategories: string[];
}

export interface AISuggestion {
  id: string;
  title: string;
  location: string;
  area: string;
  time: string;
  language: string;
  vibeTags: string[];
  reason: string;
  suggestedAction: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Connection {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  eventId: string;
  eventTitle: string;
  connectedAt: string;
  status: 'pending' | 'accepted';
}

export type AttendStatus = 'none' | 'maybe' | 'going';

export type Screen =
  | 'landing'
  | 'onboarding'
  | 'home'
  | 'event-detail'
  | 'arrival'
  | 'map'
  | 'saved'
  | 'profile'
  | 'admin';

export type AppMode = 'resident' | 'admin';
