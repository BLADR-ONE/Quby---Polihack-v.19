  import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { PROFILES, ProfileKey, QubyProfile } from '@/constants/profiles';
import { MOCK_READINGS, SensorReading } from '@/data/mock';
import {
  notifyForStatus,
  setupNotifications,
} from '@/notifications/qubyNotifications';
import { fetchEspReading } from '@/services/espClient';

type RoomStatus = 'SAFE' | 'WARNING' | 'CRITICAL';
type ConnectionStatus = 'MOCK' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

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
  connectionStatus: ConnectionStatus;
  espEndpoint: string;
  historyMode: string;
  reading: SensorReading;
  recommendation: string;
  setEspEndpoint: (endpoint: string) => void;
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
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('MOCK');
  const [espEndpoint, setEspEndpoint] = useState('');
  const [espReading, setEspReading] = useState<SensorReading | null>(null);
  const [readingIndex, setReadingIndex] = useState(0);
  const previousStatus = useRef<RoomStatus | null>(null);

  useEffect(() => {
    setupNotifications();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setReadingIndex((current) => (current + 1) % MOCK_READINGS.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!espEndpoint.trim()) {
      setConnectionStatus('MOCK');
      setEspReading(null);
      return;
    }

    let isActive = true;

    async function syncReading() {
      setConnectionStatus((current) =>
        current === 'CONNECTED' ? current : 'CONNECTING',
      );

      const nextReading = await fetchEspReading(espEndpoint);

      if (!isActive) {
        return;
      }

      if (nextReading) {
        setEspReading(nextReading);
        setConnectionStatus('CONNECTED');
      } else {
        setConnectionStatus('ERROR');
      }
    }

    syncReading();
    const interval = setInterval(syncReading, 3500);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [espEndpoint]);

  const activeProfileData = PROFILES[activeProfile];
  const reading = espReading ?? MOCK_READINGS[readingIndex];
  const result = evaluateReading(reading, activeProfileData);

  useEffect(() => {
    if (previousStatus.current === result.status) {
      return;
    }

    previousStatus.current = result.status;
    notifyForStatus(result.status, result.alerts);
  }, [result.status, result.alerts]);

  return (
    <QubyContext.Provider
      value={{
        activeProfile,
        setActiveProfile,
        activeProfileData,
        alerts: result.alerts,
        bluetoothState:
          connectionStatus === 'CONNECTED'
            ? 'Wi-Fi ESP32 connected'
            : connectionStatus === 'ERROR'
              ? 'Wi-Fi ESP32 unavailable, using mock data'
              : connectionStatus === 'CONNECTING'
                ? 'Connecting to ESP32 over Wi-Fi'
                : 'Mock data, add ESP32 endpoint in Settings',
        connectionStatus,
        espEndpoint,
        historyMode: 'Database TBA',
        reading,
        recommendation: result.recommendation,
        setEspEndpoint,
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
