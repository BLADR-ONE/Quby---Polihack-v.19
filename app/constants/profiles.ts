
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
    description: 'Sensitive limits for babies and very small children.',
    tempMin: 20,
    tempMax: 24,
    humidityMin: 40,
    humidityMax: 50,
    co2Max: 800,
    fumesMax: 15,
    smokeMax: 35,
  },

  kid: {
    name: 'Kid Mode',
    icon: '🧒',
    description: 'For children sensitive to poor air quality, high CO₂ and particles.',
    tempMin: 20,
    tempMax: 24,
    humidityMin: 40,
    humidityMax: 60,
    co2Max: 1000,
    fumesMax: 15,
    smokeMax: 45,
  },

  elderly: {
    name: 'Elderly Mode',
    icon: '👵',
    description: 'Comfort-focused limits for elderly people.',
    tempMin: 20,
    tempMax: 25,
    humidityMin: 35,
    humidityMax: 55,
    co2Max: 900,
    fumesMax: 20,
    smokeMax: 45,
  },

  asthma: {
    name: 'Asthma Mode',
    icon: '🫁',
    description: 'More sensitive mode for respiratory comfort.',
    tempMin: 19,
    tempMax: 24,
    humidityMin: 35,
    humidityMax: 50,
    co2Max: 750,
    fumesMax: 12,
    smokeMax: 35,
  },

  allergies: {
    name: 'Allergy Mode',
    icon: '🌿',
    description: 'Focused on humidity and particle sensitivity.',
    tempMin: 19,
    tempMax: 25,
    humidityMin: 30,
    humidityMax: 50,
    co2Max: 850,
    fumesMax: 15,
    smokeMax: 40,
  },

  adult: {
    name: 'Adult Mode',
    icon: '🏠',
    description: 'Standard indoor air quality monitoring.',
    tempMin: 18,
    tempMax: 26,
    humidityMin: 30,
    humidityMax: 60,
    co2Max: 1000,
    fumesMax: 25,
    smokeMax: 50,
  },
};