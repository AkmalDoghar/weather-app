export interface LocationData {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  isFavorite?: boolean;
  category?: 'Home' | 'Work' | 'University' | 'Other';
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  cloudCover: number;
  rainChance: number;
  conditionCode: number;
  conditionText: string;
  icon: string;
  isDay: boolean;
  time: string;
  tempMax: number;
  tempMin: number;
}

export interface HourlyForecastData {
  time: string;
  timestamp: number;
  temperature: number;
  conditionCode: number;
  conditionText: string;
  icon: string;
  isDay: boolean;
  rainChance: number;
  humidity: number;
  windSpeed: number;
  precipitationAmount?: number;
}

export interface DailyForecastData {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  conditionCode: number;
  conditionText: string;
  icon: string;
  rainChance: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  windSpeedMax?: number;
  humidityAvg?: number;
}

export interface AirQualityData {
  aqi: number;
  aqiStatus: 'Good' | 'Moderate' | 'Unhealthy (Sensitive)' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  aqiColor: string;
  pm2_5: number;
  pm10: number;
  co: number;
  no2: number;
  o3: number;
  so2: number;
}

export interface WeatherAlert {
  id: string;
  event: string;
  headline: string;
  severity: 'warning' | 'severe' | 'extreme' | 'info';
  description: string;
  instruction: string;
}

export interface AstronomyData {
  sunrise: string;
  sunset: string;
  daylightDuration?: string;
  moonPhase: string;
  moonIllumination: number;
}

export type ActivityType = 'walking' | 'running' | 'cycling' | 'cricket' | 'photography' | 'picnic' | 'travel';
export type ActivityStatus = 'Recommended' | 'Caution' | 'Not Recommended';

export interface ActivityEvaluation {
  activity: ActivityType;
  titleKey: string;
  iconName: string;
  status: ActivityStatus;
  score: number;
  reason: string;
}

export interface BestTimeWindow {
  timeRange: string;
  temp: number;
  rainChance: number;
  uv: number;
  recommendation: string;
  isOptimal: boolean;
}

export interface RainTimelineItem {
  time: string;
  timestamp: number;
  rainChance: number;
  precipitationAmount: number;
  isPeakRisk: boolean;
}

export interface OutfitRecommendation {
  summary: string;
  suggestions: {
    title: string;
    icon: string;
    items: string[];
  }[];
}

export interface WeatherIntelligenceSummary {
  headline: string;
  description: string;
  riskPeriod?: string;
}

export interface CompleteWeatherData {
  location: LocationData;
  current: CurrentWeather;
  hourly: HourlyForecastData[];
  daily: DailyForecastData[];
  airQuality: AirQualityData;
  astronomy: AstronomyData;
  alerts: WeatherAlert[];
  lastUpdated: string;
  intelligence?: WeatherIntelligenceSummary;
  bestTimeWindow?: BestTimeWindow;
  rainTimeline?: RainTimelineItem[];
  activities?: ActivityEvaluation[];
  outfit?: OutfitRecommendation;
}

export type TempUnit = 'C' | 'F';
export type SpeedUnit = 'kmh' | 'mph' | 'ms';
export type PressureUnit = 'hPa' | 'inHg';
export type ThemePreset = 'glassmorphism' | 'neomorphism' | 'material' | 'minimal';
export type ThemeMode = 'light' | 'dark' | 'system' | 'dynamic';
export type Language = 'en' | 'ur';
export type NotificationInterval = 1 | 3 | 6 | 12 | 24;

