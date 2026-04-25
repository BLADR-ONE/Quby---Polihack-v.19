export type ProfileKey = 'baby' | 'elderly' | 'asthma' | 'allergies' | 'normal';

export type QubyProfile = {
  name: string;
  description: string;
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  airQualityMax: number;
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
    description: 'Sensitive comfort thresholds for babies and children.',
    tempMin: 20,
    tempMax: 24,
    humidityMin: 35,
    humidityMax: 50,
    airQualityMax: 300,
  },

  elderly: {
    name: 'Elderly Mode',
    description: 'Clear alerts for elderly and vulnerable users.',
    tempMin: 20,
    tempMax: 25,
    humidityMin: 35,
    humidityMax: 55,
    airQualityMax: 350,
  },

  asthma: {
    name: 'Asthma Mode',
    description: 'More sensitive alerts for air quality and humidity.',
    tempMin: 19,
    tempMax: 24,
    humidityMin: 35,
    humidityMax: 50,
    airQualityMax: 250,
  },

  allergies: {
    name: 'Allergy Mode',
    description: 'Focused on humidity, VOC, smoke and mold-risk conditions.',
    tempMin: 19,
    tempMax: 25,
    humidityMin: 30,
    humidityMax: 50,
    airQualityMax: 280,
  },

  normal: {
    name: 'Normal Mode',
    description: 'Standard indoor air quality monitoring.',
    tempMin: 18,
    tempMax: 26,
    humidityMin: 30,
    humidityMax: 60,
    airQualityMax: 500,
  },
};