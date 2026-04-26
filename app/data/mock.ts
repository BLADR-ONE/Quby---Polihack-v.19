export type SensorReading = {
  temperature: number;
  humidity: number;
  co2: number;
  fumes: number;
  smoke: number;
};

export const MOCK_READINGS: SensorReading[] = [
  { temperature: 22, humidity: 46, co2: 720, fumes: 6, smoke: 10 },
  { temperature: 24, humidity: 54, co2: 910, fumes: 13, smoke: 18 },
  { temperature: 27, humidity: 61, co2: 1280, fumes: 28, smoke: 42 },
  { temperature: 21, humidity: 43, co2: 780, fumes: 9, smoke: 12 },
];

export const MAP_POINTS = [
  {
    name: 'Central Park Cluj',
    icon: '🌳',
    color: '#16a34a',
    top: 58,
    left: 40,
    time: 'Today, 11:05',
    status: 'SAFE',
    temperature: 21,
    humidity: 49,
    co2: '620 ppm',
  },
  {
    name: 'Piața Unirii',
    icon: '🏛️',
    color: '#d97706',
    top: 132,
    left: 126,
    time: 'Today, 12:20',
    status: 'WARNING',
    temperature: 24,
    humidity: 52,
    co2: '940 ppm',
  },
  {
    name: 'Bulevardul Eroilor',
    icon: '🚗',
    color: '#dc2626',
    top: 88,
    left: 232,
    time: 'Today, 13:10',
    status: 'CRITICAL',
    temperature: 26,
    humidity: 47,
    co2: '1320 ppm',
  },
];

export const HISTORY_ITEMS = [
  {
    id: '1',
    time: 'Today, 13:10',
    title: 'Traffic fumes spike',
    summary: 'Quby detected high CO2 and fumes near a busy road in Cluj.',
    profile: 'Adult Mode',
    status: 'CRITICAL',
  },
  {
    id: '2',
    time: 'Today, 12:20',
    title: 'Humidity slightly high',
    summary: 'Ventilation was recommended while using Allergy Mode.',
    profile: 'Allergy Mode',
    status: 'WARNING',
  },
  {
    id: '3',
    time: 'Today, 11:05',
    title: 'Outdoor air looked good',
    summary: 'All monitored values stayed inside the selected profile limits.',
    profile: 'Kid Mode',
    status: 'SAFE',
  },
];
