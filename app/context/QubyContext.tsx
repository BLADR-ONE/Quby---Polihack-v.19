  import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { PROFILES, ProfileKey, QubyProfile } from '@/constants/profiles';
import { MOCK_READINGS, SensorReading } from '@/data/mock';

type RoomStatus = 'SAFE' | 'WARNING' | 'CRITICAL';

type EvaluationResult = {
  alerts: string[];
  recommendation: string;
  status: RoomStatus;
};

type QubyContextType = {
  activeProfile: ProfileKey;
  setActiveProfile: (profile: ProfileKey) => void;
  activeProfileData: QubyProfile;
  alerts: string[];
  bluetoothState: string;
  historyMode: string;
  reading: SensorReading;
  recommendation: string;
  status: RoomStatus;
};

const QubyContext = createContext<QubyContextType | undefined>(undefined);

function evaluateReading(
  reading: SensorReading,
  profile: QubyProfile,
): EvaluationResult {
  const alerts: string[] = [];
  let status: RoomStatus = 'SAFE';

  if (reading.temperature < profile.tempMin) {
    alerts.push('Temperature is lower than the selected profile range.');
  }
  if (reading.temperature > profile.tempMax) {
    alerts.push('Temperature is higher than the selected profile range.');
  }
  if (reading.humidity < profile.humidityMin) {
    alerts.push('Humidity is too low and the air may feel dry.');
  }
  if (reading.humidity > profile.humidityMax) {
    alerts.push('Humidity is too high and fresh air is recommended.');
  }
  if (reading.co2 > profile.co2Max) {
    alerts.push('CO2 is above the profile threshold.');
  }
  if (reading.fumes > profile.fumesMax) {
    alerts.push('Fumes are above the profile threshold.');
  }
  if (reading.smoke > profile.smokeMax) {
    alerts.push('Smoke is above the profile threshold.');
  }

  if (alerts.length > 0) {
    status = 'WARNING';
  }

  const criticalHit =
    reading.co2 > profile.co2Max + 250 ||
    reading.fumes > profile.fumesMax + 10 ||
    reading.smoke > profile.smokeMax + 10;

  if (criticalHit) {
    status = 'CRITICAL';
  }

  let recommendation = 'Air quality looks stable for this profile.';
  if (status === 'WARNING') {
    recommendation = 'Keep monitoring and improve ventilation if possible.';
  }
  if (status === 'CRITICAL') {
    recommendation =
      'Air quality is poor. Move to fresher air and ventilate immediately.';
  }

  return { alerts, recommendation, status };
}

export function QubyProvider({ children }: PropsWithChildren) {
  const [activeProfile, setActiveProfile] = useState<ProfileKey>('adult');
  const [readingIndex, setReadingIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setReadingIndex((current) => (current + 1) % MOCK_READINGS.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const activeProfileData = PROFILES[activeProfile];
  const reading = MOCK_READINGS[readingIndex];
  const result = evaluateReading(reading, activeProfileData);

  return (
    <QubyContext.Provider
      value={{
        activeProfile,
        setActiveProfile,
        activeProfileData,
        alerts: result.alerts,
        bluetoothState: 'WI-FI, ESP32 Bluetooth later',
        historyMode: 'Database TBA',
        reading,
        recommendation: result.recommendation,
        status: result.status,
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
