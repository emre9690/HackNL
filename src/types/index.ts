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
  assignedHost?: { name: string; role: string };
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

export type DemoAction =
  | { type: 'SET_ONBOARDING'; data: { step: number; prefs: UserPreferences } | null }
  | { type: 'COMPLETE_ONBOARDING'; prefs: UserPreferences; profile: AIProfile }
  | { type: 'SET_ARRIVAL_VIEW'; view: 'badge' | 'join' | null }
  | { type: 'CONNECT'; name: string | null }
  | { type: 'ACCEPT_INCOMING'; value: boolean }
  | { type: 'SELECT_EVENT'; event: EventRoutine }
  | { type: 'ATTEND'; eventId: string; status: AttendStatus };

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
