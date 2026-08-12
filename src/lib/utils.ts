import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TempUnit, SpeedUnit, PressureUnit } from '@/types/weather';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Temperature Conversion Helper
export function formatTemp(tempC: number, unit: TempUnit): string {
  if (unit === 'F') {
    const tempF = Math.round((tempC * 9) / 5 + 32);
    return `${tempF}°F`;
  }
  return `${Math.round(tempC)}°C`;
}

// Wind Speed Conversion Helper
export function formatWind(speedKmh: number, unit: SpeedUnit): string {
  if (unit === 'mph') {
    return `${Math.round(speedKmh * 0.621371)} mph`;
  }
  if (unit === 'ms') {
    return `${Math.round(speedKmh / 3.6)} m/s`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

// Pressure Conversion Helper
export function formatPressure(hpa: number, unit: PressureUnit): string {
  if (unit === 'inHg') {
    return `${(hpa * 0.02953).toFixed(2)} inHg`;
  }
  return `${Math.round(hpa)} hPa`;
}

// WMO Weather Code to Condition Text and Lucide Icon mapping
export function getWeatherCondition(code: number, isDay: boolean = true) {
  switch (code) {
    case 0:
      return { text: 'Clear Sky', icon: isDay ? 'Sun' : 'Moon' };
    case 1:
      return { text: 'Mainly Clear', icon: isDay ? 'CloudSun' : 'CloudMoon' };
    case 2:
      return { text: 'Partly Cloudy', icon: isDay ? 'CloudSun' : 'CloudMoon' };
    case 3:
      return { text: 'Overcast', icon: 'Cloud' };
    case 45:
    case 48:
      return { text: 'Foggy & Hazy', icon: 'CloudFog' };
    case 51:
    case 53:
    case 55:
      return { text: 'Light Drizzle', icon: 'CloudDrizzle' };
    case 61:
    case 63:
      return { text: 'Moderate Rain', icon: 'CloudRain' };
    case 65:
      return { text: 'Heavy Rain', icon: 'CloudRainWind' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { text: 'Snowfall', icon: 'Snowflake' };
    case 80:
    case 81:
    case 82:
      return { text: 'Rain Showers', icon: 'CloudRain' };
    case 95:
    case 96:
    case 99:
      return { text: 'Thunderstorm', icon: 'CloudLightning' };
    default:
      return { text: 'Partly Cloudy', icon: 'CloudSun' };
  }
}

// AQI Status Helper
export function getAQIInfo(aqi: number) {
  if (aqi <= 50) return { status: 'Good' as const, color: '#4CAF50' };
  if (aqi <= 100) return { status: 'Moderate' as const, color: '#FBC02D' };
  if (aqi <= 150) return { status: 'Unhealthy (Sensitive)' as const, color: '#FB8C00' };
  if (aqi <= 200) return { status: 'Unhealthy' as const, color: '#E53935' };
  if (aqi <= 300) return { status: 'Very Unhealthy' as const, color: '#8E24AA' };
  return { status: 'Hazardous' as const, color: '#B71C1C' };
}
