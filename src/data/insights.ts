export interface InsightStat {
  label: string;
  value: number;
  color: string;
}

export interface InsightSection {
  title: string;
  stats: InsightStat[];
}

export const insightSections: InsightSection[] = [
  {
    title: 'Top routine interests near Erasmus',
    stats: [
      { label: 'Study', value: 34, color: '#4ade80' },
      { label: 'Games', value: 21, color: '#60a5fa' },
      { label: 'Walking', value: 18, color: '#f472b6' },
      { label: 'Creative', value: 14, color: '#fb923c' },
      { label: 'Bouldering', value: 8, color: '#a78bfa' },
      { label: 'Reading', value: 5, color: '#fbbf24' },
    ],
  },
  {
    title: 'Language demand',
    stats: [
      { label: 'English', value: 58, color: '#4ade80' },
      { label: 'Dutch', value: 29, color: '#60a5fa' },
      { label: 'Both', value: 13, color: '#fbbf24' },
    ],
  },
  {
    title: 'Format popularity (save rate)',
    stats: [
      { label: 'Quiet table', value: 72, color: '#4ade80' },
      { label: 'Drop-in', value: 68, color: '#60a5fa' },
      { label: 'Group walk', value: 54, color: '#f472b6' },
      { label: 'Workshop', value: 41, color: '#fb923c' },
      { label: 'Sport', value: 38, color: '#a78bfa' },
    ],
  },
  {
    title: 'Neighbourhood gap score (higher = more needed)',
    stats: [
      { label: 'Noord', value: 82, color: '#f87171' },
      { label: 'Zuid', value: 74, color: '#fb923c' },
      { label: 'Delfshaven', value: 61, color: '#fbbf24' },
      { label: 'Kralingen', value: 43, color: '#4ade80' },
      { label: 'Centrum', value: 28, color: '#60a5fa' },
    ],
  },
];

export const summaryCards = [
  {
    label: 'Active Users This Week',
    value: '342',
    change: '+18%',
    positive: true,
  },
  {
    label: 'Events Saved',
    value: '1,204',
    change: '+31%',
    positive: true,
  },
  {
    label: 'Attendance Confirmations',
    value: '89',
    change: '+12%',
    positive: true,
  },
  {
    label: 'Avg. Events per User',
    value: '3.5',
    change: '+0.4',
    positive: true,
  },
];
