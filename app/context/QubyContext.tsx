import React, { createContext, useContext, useState } from 'react';

import { PROFILES, ProfileKey, QubyProfile } from '@/constants/profiles';

type SensorReading = {
  temperature: number;
  humidity: number;
  co2: number;
  fumes: number;
  smoke: number;
  particlesStatus: string;
};

type RoomStatus = 'SAFE' | 'WARNING' | 'CRITICAL';

type QubyContextType = {
  activeProfile: ProfileKey;
  setActiveProfile: (profile: ProfileKey) => void;
  activeProfileData: QubyProfile;
  reading: SensorReading;
  status: RoomStatus;
  alerts: string[];
  recommendation: string;
};

const QubyContext = createContext<QubyContextType | undefined>(undefined);

const mockReading: SensorReading = {
  temperature: 23,
  humidity: 56,
  co2: 820,
  fumes: 18,
  smoke: 35,
  particlesStatus: 'Moderate',
};

function evaluateReading(reading: SensorReading, profile: QubyProfile) {
  const alerts: string[] = [];
  let status: RoomStatus = 'SAFE';

  if (reading.temperature < profile.tempMin) {
    alerts.push('Temperature is too low for this profile.');
    status = 'WARNING';
  }

  if (reading.temperature > profile.tempMax) {
    alerts.push('Temperature is too high for this profile.');
    status = 'WARNING';
  }

  if (reading.humidity < profile.humidityMin) {
    alerts.push('Humidity is too low. Air may feel dry.');
    status = 'WARNING';
  }

  if (reading.humidity > profile.humidityMax) {
    alerts.push('Humidity is too high. Ventilation is recommended.');
    status = 'WARNING';
  }

  if (reading.co2 > profile.co2Max) {
    alerts.push('CO2 level is too high for this profile.');
    status = 'WARNING';
  }

  if (reading.fumes > profile.fumesMax) {
    alerts.push('Particle level is too high for this profile.');
    status = 'WARNING';
  }

  if (reading.co2 > profile.co2Max + 500 || reading.fumes > profile.fumesMax + 25) {
    status = 'CRITICAL';
  }

  let recommendation = 'Room conditions are currently good. No action is needed.';

  if (status === 'WARNING') {
    recommendation = 'Ventilate the room and keep monitoring the air quality.';
  }

  if (status === 'CRITICAL') {
    recommendation = 'Air quality is poor. Ventilate immediately and avoid staying in the room too long.';
  }

  return {
    status,
    alerts,
    recommendation,
  };
}

export function QubyProvider({ children }: { children: React.ReactNode }) {
  const [activeProfile, setActiveProfile] = useState<ProfileKey>('adult');

  const activeProfileData = PROFILES[activeProfile];
  const reading = mockReading;
  const result = evaluateReading(reading, activeProfileData);

  return (
    <QubyContext.Provider
      value={{
        activeProfile,
        setActiveProfile,
        activeProfileData,
        reading,
        status: result.status,
        alerts: result.alerts,
        recommendation: result.recommendation,
      }}
    >
      {children}
    </QubyContext.Provider>
  );
}

export function useQuby() {
  const context = useContext(QubyContext);

  if (!context) {
    throw new Error('useQuby must be used inside QubyProvider');
  }

  return context;
}