export type ProfileKey =
  | 'baby'
  | 'kid'
  | 'adult'
  | 'elderly'
  | 'asthma'
  | 'allergies';

export type QubyProfile = {
  name: string;
  icon: string;
  description: string;
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  co2Max: number;
  fumesMax: number;
  smokeMax: number;
};

export const PROFILE_ORDER: ProfileKey[] = [
  'baby',
  'kid',
  'adult',
  'elderly',
  'asthma',
  'allergies',
];

export const PROFILES: Record<ProfileKey, QubyProfile> = {
  baby: {
    name: 'Baby Mode',
    icon: '🍼',
    description: 'Sensitive mode for nurseries and babies. Lower tolerance for poor air and overheating.',
    tempMin: 16,
    tempMax: 20,
    humidityMin: 40,
    humidityMax: 50,
    co2Max: 800,
    fumesMax: 10,
    smokeMax: 25,
  },

  kid: {
    name: 'Kid Mode',
    icon: '🧒',
    description: 'Balanced limits for children, with stricter air quality warnings.',
    tempMin: 18,
    tempMax: 24,
    humidityMin: 35,
    humidityMax: 50,
    co2Max: 900,
    fumesMax: 12,
    smokeMax: 30,
  },

  adult: {
    name: 'Adult Mode',
    icon: '🏠',
    description: 'Standard indoor comfort and air quality monitoring.',
    tempMin: 18,
    tempMax: 26,
    humidityMin: 30,
    humidityMax: 50,
    co2Max: 1000,
    fumesMax: 25,
    smokeMax: 50,
  },

  elderly: {
    name: 'Elderly Mode',
    icon: '👵',
    description: 'Comfort-focused limits for elderly people and vulnerable users.',
    tempMin: 20,
    tempMax: 24,
    humidityMin: 35,
    humidityMax: 50,
    co2Max: 900,
    fumesMax: 15,
    smokeMax: 35,
  },

  asthma: {
    name: 'Asthma Mode',
    icon: '🫁',
    description: 'Very sensitive mode for respiratory comfort. Lower tolerance for smoke, fumes and dampness.',
    tempMin: 18,
    tempMax: 24,
    humidityMin: 35,
    humidityMax: 50,
    co2Max: 800,
    fumesMax: 10,
    smokeMax: 25,
  },

  allergies: {
    name: 'Allergy Mode',
    icon: '🌿',
    description: 'Focused on humidity control, ventilation and reducing mold-trigger conditions.',
    tempMin: 18,
    tempMax: 25,
    humidityMin: 30,
    humidityMax: 50,
    co2Max: 850,
    fumesMax: 12,
    smokeMax: 30,
  },
};