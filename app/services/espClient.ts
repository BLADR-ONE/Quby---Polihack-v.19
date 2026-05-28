import { SensorReading } from '@/data/mock';

const REQUEST_TIMEOUT_MS = 2500;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function normalizeEndpoint(endpoint: string) {
  const trimmedEndpoint = endpoint.trim();

  if (!trimmedEndpoint) {
    return '';
  }

  const endpointWithProtocol = /^https?:\/\//i.test(trimmedEndpoint)
    ? trimmedEndpoint
    : `http://${trimmedEndpoint}`;

  return endpointWithProtocol.endsWith('/reading')
    ? endpointWithProtocol
    : `${endpointWithProtocol.replace(/\/$/, '')}/reading`;
}

function parseReading(payload: unknown): SensorReading | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const data = payload as Record<string, unknown>;

  if (
    !isFiniteNumber(data.temperature) ||
    !isFiniteNumber(data.humidity) ||
    !isFiniteNumber(data.co2) ||
    !isFiniteNumber(data.fumes) ||
    !isFiniteNumber(data.smoke)
  ) {
    return null;
  }

  return {
    temperature: data.temperature,
    humidity: data.humidity,
    co2: data.co2,
    fumes: data.fumes,
    smoke: data.smoke,
  };
}

export async function fetchEspReading(endpoint: string) {
  const normalizedEndpoint = normalizeEndpoint(endpoint);

  if (!normalizedEndpoint) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(normalizedEndpoint, {
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    return parseReading(await response.json());
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function getNormalizedEspEndpoint(endpoint: string) {
  return normalizeEndpoint(endpoint);
}
