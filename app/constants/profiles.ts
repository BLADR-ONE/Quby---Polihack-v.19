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
    description: 'Extra sensitive limits for nurseries and very young children.',
    tempMin: 19,
    tempMax: 23,
    humidityMin: 40,
    humidityMax: 55,
    co2Max: 800,
    fumesMax: 10,
    smokeMax: 20,
  },
  kid: {
    name: 'Kid Mode',
    icon: '🧒',
    description: 'Balanced limits for children with quicker warnings on bad air.',
    tempMin: 18,
    tempMax: 24,
    humidityMin: 35,
    humidityMax: 55,
    co2Max: 900,
    fumesMax: 12,
    smokeMax: 25,
  },
  adult: {
    name: 'Adult Mode',
    icon: '🧑',
    description: 'Standard daily comfort thresholds for home, office, or outdoors.',
    tempMin: 18,
    tempMax: 26,
    humidityMin: 30,
    humidityMax: 60,
    co2Max: 1000,
    fumesMax: 18,
    smokeMax: 35,
  },
  elderly: {
    name: 'Elderly Mode',
    icon: '👵',
    description: 'Comfort-focused mode with lower tolerance for stale air.',
    tempMin: 20,
    tempMax: 24,
    humidityMin: 35,
    humidityMax: 55,
    co2Max: 900,
    fumesMax: 12,
    smokeMax: 22,
  },
  asthma: {
    name: 'Asthma Mode',
    icon: '🫁',
    description: 'Very sensitive mode for users affected by smoke and fumes.',
    tempMin: 18,
    tempMax: 24,
    humidityMin: 35,
    humidityMax: 50,
    co2Max: 800,
    fumesMax: 8,
    smokeMax: 16,
  },
  allergies: {
    name: 'Allergy Mode',
    icon: '🌿',
    description: 'Focuses more on humidity and air freshness risk factors.',
    tempMin: 18,
    tempMax: 25,
    humidityMin: 35,
    humidityMax: 50,
    co2Max: 850,
    fumesMax: 10,
    smokeMax: 20,
  },
};
