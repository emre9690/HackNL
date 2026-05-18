import { AISuggestion } from '../types';

export const aiSuggestions: AISuggestion[] = [
  {
    id: 'sug1',
    title: 'Language Exchange at WORM',
    location: 'WORM Rotterdam',
    area: 'Delfshaven',
    time: 'Saturday 15:00',
    language: 'Dutch / English / Spanish',
    vibeTags: ['Social-light', 'Language', 'Creative'],
    reason:
      'High demand for English-Dutch exchange in Delfshaven. 23 users in the area expressed interest in language learning over the past 30 days. WORM has available space on Saturday afternoons.',
    suggestedAction: 'Partner with WORM venue; assign a bilingual host.',
    status: 'pending',
  },
  {
    id: 'sug2',
    title: 'Tech & Coffee Morning',
    location: 'Spaces Blaak',
    area: 'Rotterdam Centrum',
    time: 'Wednesday 09:00',
    language: 'English',
    vibeTags: ['Tech', 'Study', 'Social-light'],
    reason:
      '18 users listed "tech" as an interest but no active tech-focused routine exists in the city. Morning time slot aligns with peak weekday availability data.',
    suggestedAction: 'Pilot a drop-in coworking/networking hour. No agenda required.',
    status: 'pending',
  },
  {
    id: 'sug3',
    title: 'Sunset Yoga at Katendrecht',
    location: 'Katendrecht Pier',
    area: 'Kop van Zuid',
    time: 'Tuesday 19:00',
    language: 'English',
    vibeTags: ['Active', 'Calm', 'Outdoors'],
    reason:
      'Kop van Zuid has the highest gap score for outdoor activities. Sunset timings match high evening availability. 31 users in the area have no current outdoor routine match.',
    suggestedAction: 'Contact a local yoga instructor; venue is public land.',
    status: 'pending',
  },
  {
    id: 'sug4',
    title: 'Board Game Afternoon (Dutch-language)',
    location: 'Café De Witte Aap',
    area: 'Witte de Withstraat',
    time: 'Sunday 14:00',
    language: 'Dutch',
    vibeTags: ['Games', 'Social-light', 'Dutch'],
    reason:
      'Data shows Dutch-language events are underrepresented (29% demand, <15% supply). A Dutch-language games afternoon would serve the integration-focused user segment.',
    suggestedAction: 'Coordinate with café for reserved table; promote via Dutch-language channels.',
    status: 'pending',
  },
];
