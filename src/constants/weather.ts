// WeatherX Application Constants

export const APP_NAME = 'WeatherX';
export const APP_TAGLINE = 'Weather that helps you decide';
export const APP_VERSION = '1.0.0';

export const WEATHERX_COLORS = {
  primary: '#4FC3F7',
  sunny: '#FDB813',
  night: '#0B1F3A',
  rain: '#607D8B',
  cloud: '#ECEFF1',
  danger: '#FF5252',
  success: '#4CAF50',
  warning: '#FFB300',
};

export const DEFAULT_LOCATIONS = [
  {
    id: 'karachi-pk',
    name: 'Karachi',
    country: 'Pakistan',
    latitude: 24.8607,
    longitude: 67.0011,
    category: 'Home' as const,
  },
  {
    id: 'lahore-pk',
    name: 'Lahore',
    country: 'Pakistan',
    latitude: 31.5497,
    longitude: 74.3436,
    category: 'Work' as const,
  },
  {
    id: 'islamabad-pk',
    name: 'Islamabad',
    country: 'Pakistan',
    latitude: 33.6844,
    longitude: 73.0479,
    category: 'University' as const,
  },
  {
    id: 'london-uk',
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    id: 'tokyo-jp',
    name: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    id: 'dubai-ae',
    name: 'Dubai',
    country: 'United Arab Emirates',
    latitude: 25.2048,
    longitude: 55.2708,
  },
];

export function convertTemp(celsius: number, unit: 'C' | 'F'): number {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function convertSpeed(kmh: number, unit: 'kmh' | 'mph' | 'ms'): number {
  if (unit === 'mph') return Math.round(kmh * 0.621371);
  if (unit === 'ms') return Math.round(kmh / 3.6);
  return Math.round(kmh);
}

export function getSpeedUnitLabel(unit: 'kmh' | 'mph' | 'ms'): string {
  if (unit === 'mph') return 'mph';
  if (unit === 'ms') return 'm/s';
  return 'km/h';
}

export function convertPressure(hPa: number, unit: 'hPa' | 'inHg'): number {
  if (unit === 'inHg') return parseFloat((hPa * 0.02953).toFixed(2));
  return Math.round(hPa);
}
