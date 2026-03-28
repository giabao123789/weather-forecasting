import type { TemperatureUnit, WeatherData } from '@/types';

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong.',
) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function getDisplayedTemperature(
  weather: WeatherData,
  unit: TemperatureUnit,
) {
  return unit === 'c' ? weather.temperatureC : weather.temperatureF;
}
