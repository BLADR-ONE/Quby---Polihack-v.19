export type ProfileKey = 'baby' | 'elderly' | 'asthma' | 'allergies' | 'normal';

export type QubyProfile = {
  name: string;
  description: string;
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  co2Max: number;
  pm25Max: number;
};

export const PROFILE_ORDER: ProfileKey[] = [
  'baby',
  'elderly',
  'asthma',
  'allergies',
  'normal',
];

export const PROFILES: Record<ProfileKey, QubyProfile> = {
  baby: {
    name: 'Baby Mode',
    description: 'Sensitive limits for babies and small children.',
    tempMin: 20,
    tempMax: 24,
    humidityMin: 40,
    humidityMax: 50,
    co2Max: 800,
    pm25Max: 15,
  },

  elderly: {
    name: 'Elderly Mode',
    description: 'Comfort-focused limits for elderly people.',
    tempMin: 20,
    tempMax: 25,
    humidityMin: 35,
    humidityMax: 55,
    co2Max: 900,
    pm25Max: 20,
  },

  asthma: {
    name: 'Asthma Mode',
    description: 'More sensitive mode for respiratory comfort.',
    tempMin: 19,
    tempMax: 24,
    humidityMin: 35,
    humidityMax: 50,
    co2Max: 750,
    pm25Max: 12,
  },

  allergies: {
    name: 'Allergy Mode',
    description: 'Focused on humidity and particle sensitivity.',
    tempMin: 19,
    tempMax: 25,
    humidityMin: 30,
    humidityMax: 50,
    co2Max: 850,
    pm25Max: 15,
  },

  normal: {
    name: 'Normal Mode',
    description: 'Standard indoor air quality monitoring.',
    tempMin: 18,
    tempMax: 26,
    humidityMin: 30,
    humidityMax: 60,
    co2Max: 1000,
    pm25Max: 25,
  },
};