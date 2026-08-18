import axios from 'axios';
import {
  LocationData,
  CompleteWeatherData,
  HourlyForecastData,
  DailyForecastData,
  AirQualityData,
  WeatherAlert,
  RainTimelineItem,
  BestTimeWindow,
  WeatherIntelligenceSummary,
} from '@/types/weather';
import { getWeatherCondition, getAQIInfo } from './utils';
import { evaluateActivities, generateOutfitAdvice } from '@/constants/activities';

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_BASE = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEOCODE_BASE = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export async function searchCities(query: string): Promise<LocationData[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await axios.get(GEOCODING_BASE, {
      params: {
        name: query,
        count: 8,
        language: 'en',
        format: 'json',
      },
    });
    if (!res.data.results) return [];
    return res.data.results.map((item: any) => ({
      id: `${item.id}`,
      name: item.name,
      country: item.country || '',
      latitude: item.latitude,
      longitude: item.longitude,
      admin1: item.admin1,
    }));
  } catch (err) {
    console.error('Error searching cities:', err);
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<LocationData> {
  try {
    const res = await axios.get(REVERSE_GEOCODE_BASE, {
      params: {
        latitude: lat,
        longitude: lon,
        localityLanguage: 'en',
      },
    });
    const city = res.data.city || res.data.locality || res.data.principalSubdivision || 'Current Location';
    const country = res.data.countryName || '';
    return {
      id: `gps-${lat.toFixed(2)}-${lon.toFixed(2)}`,
      name: city,
      country,
      latitude: lat,
      longitude: lon,
    };
  } catch (err) {
    return {
      id: `gps-${lat.toFixed(2)}-${lon.toFixed(2)}`,
      name: 'Current Location',
      country: '',
      latitude: lat,
      longitude: lon,
    };
  }
}

export async function fetchWeatherData(location: LocationData): Promise<CompleteWeatherData> {
  const lat = typeof location?.latitude === 'number' && !isNaN(location.latitude) ? location.latitude : 24.8607;
  const lon = typeof location?.longitude === 'number' && !isNaN(location.longitude) ? location.longitude : 67.0011;

  const weatherPromise = axios.get(OPEN_METEO_BASE, {
    params: {
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'wind_speed_10m',
        'wind_direction_10m',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'sunrise',
        'sunset',
        'uv_index_max',
        'precipitation_probability_max',
      ].join(','),
      timezone: 'auto',
      forecast_days: 7,
    },
  });

  const aqiPromise = axios
    .get(AIR_QUALITY_BASE, {
      params: {
        latitude: lat,
        longitude: lon,
        current: ['us_aqi', 'pm10', 'pm2_5', 'carbon_monoxide', 'nitrogen_dioxide', 'sulphur_dioxide', 'ozone'].join(','),
        timezone: 'auto',
      },
    })
    .catch(() => ({ data: { current: { us_aqi: 45, pm2_5: 12, pm10: 22, carbon_monoxide: 210, nitrogen_dioxide: 14, ozone: 30 } } }));

  const [weatherRes, aqiRes] = await Promise.all([weatherPromise, aqiPromise]);
  const wData = weatherRes.data;
  const aData = aqiRes.data;

  const currentWMO = wData.current.weather_code;
  const isDay = wData.current.is_day === 1;
  const condition = getWeatherCondition(currentWMO, isDay);

  const currentTemp = wData.current.temperature_2m;
  const feelsLike = wData.current.apparent_temperature;

  const currentIso = wData.current.time || '';
  const currentHourPrefix = currentIso ? currentIso.substring(0, 13) : '';
  let currentHourIdx = wData.hourly.time.findIndex((tStr: string) =>
    tStr.startsWith(currentHourPrefix)
  );
  if (currentHourIdx < 0) {
    const nowMs = Date.now();
    currentHourIdx = wData.hourly.time.findIndex(
      (tStr: string) => new Date(tStr + 'Z').getTime() + 3600000 > nowMs
    );
  }
  if (currentHourIdx < 0) currentHourIdx = 0;

  const hourlySlice = wData.hourly.time.slice(currentHourIdx, currentHourIdx + 24);

  const hourlyList: HourlyForecastData[] = hourlySlice.map((timeStr: string, idxInSlice: number) => {
    const idx = currentHourIdx + idxInSlice;
    const code = wData.hourly.weather_code[idx];
    const cond = getWeatherCondition(code, true);
    
    // Parse 12-hour formatted time directly from Open-Meteo local ISO string (e.g. "2026-08-17T15:00")
    let timeFormatted = timeStr;
    if (timeStr && timeStr.includes('T')) {
      const hStr = timeStr.split('T')[1]?.split(':')[0];
      const h = parseInt(hStr, 10);
      if (!isNaN(h)) {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        timeFormatted = `${h12} ${ampm}`;
      }
    }

    const dateObj = new Date(timeStr + 'Z');
    const precip = wData.hourly.precipitation ? wData.hourly.precipitation[idx] || 0 : 0;
    return {
      time: timeFormatted,
      timestamp: dateObj.getTime(),
      temperature: wData.hourly.temperature_2m[idx],
      conditionCode: code,
      conditionText: cond.text,
      icon: cond.icon,
      rainChance: wData.hourly.precipitation_probability[idx] || 0,
      humidity: wData.hourly.relative_humidity_2m[idx],
      windSpeed: wData.hourly.wind_speed_10m[idx],
      precipitationAmount: precip,
    };
  });

  const dailyList: DailyForecastData[] = wData.daily.time.map((dateStr: string, idx: number) => {
    const code = wData.daily.weather_code[idx];
    const cond = getWeatherCondition(code, true);
    const dateObj = new Date(dateStr);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const sunriseStr = wData.daily.sunrise[idx] ? new Date(wData.daily.sunrise[idx]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '6:00 AM';
    const sunsetStr = wData.daily.sunset[idx] ? new Date(wData.daily.sunset[idx]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '7:00 PM';

    return {
      date: dateStr,
      dayName,
      tempMax: wData.daily.temperature_2m_max[idx],
      tempMin: wData.daily.temperature_2m_min[idx],
      conditionCode: code,
      conditionText: cond.text,
      icon: cond.icon,
      rainChance: wData.daily.precipitation_probability_max[idx] || 0,
      uvIndexMax: wData.daily.uv_index_max[idx] || 0,
      sunrise: sunriseStr,
      sunset: sunsetStr,
    };
  });

  const rawAQI = aData.current?.us_aqi || 42;
  const aqiDetails = getAQIInfo(rawAQI);

  const airQuality: AirQualityData = {
    aqi: Math.round(rawAQI),
    aqiStatus: aqiDetails.status,
    aqiColor: aqiDetails.color,
    pm2_5: aData.current?.pm2_5 || 12,
    pm10: aData.current?.pm10 || 24,
    co: aData.current?.carbon_monoxide || 210,
    no2: aData.current?.nitrogen_dioxide || 14,
    o3: aData.current?.ozone || 32,
    so2: aData.current?.sulphur_dioxide || 5,
  };

  // Rain Timeline & Peak Risk
  let maxRainChanceIn24h = 0;
  let peakRainTimeStr = '';
  const rainTimeline: RainTimelineItem[] = hourlyList.map((h) => {
    if (h.rainChance > maxRainChanceIn24h) {
      maxRainChanceIn24h = h.rainChance;
      peakRainTimeStr = h.time;
    }
    return {
      time: h.time,
      timestamp: h.timestamp,
      rainChance: h.rainChance,
      precipitationAmount: h.precipitationAmount || 0,
      isPeakRisk: false,
    };
  });

  if (maxRainChanceIn24h > 40 && peakRainTimeStr) {
    const peakItem = rainTimeline.find((i) => i.time === peakRainTimeStr);
    if (peakItem) peakItem.isPeakRisk = true;
  }

  // Weather Intelligence Summary
  let intelHeadline = `${condition.text} with current temperature at ${Math.round(currentTemp)}°C.`;
  let intelDesc = 'Weather conditions remain stable for routine outdoor activities.';
  let intelRisk: string | undefined = undefined;

  if (maxRainChanceIn24h > 60) {
    intelHeadline = `High precipitation probability expected today, peaking around ${peakRainTimeStr || 'this evening'}.`;
    intelDesc = `Rain chance reaches ${maxRainChanceIn24h}%. Keep an umbrella handy and plan indoor alternatives.`;
    intelRisk = `Rain risk high at ${peakRainTimeStr || 'later today'}`;
  } else if (currentTemp > 35) {
    intelHeadline = `Sweltering heat today with temperature reaching ${Math.round(wData.daily.temperature_2m_max[0])}°C.`;
    intelDesc = 'Stay hydrated, seek shade during peak sunlight hours, and wear light cotton clothing.';
  } else if (currentTemp < 10) {
    intelHeadline = `Cold conditions expected throughout the day.`;
    intelDesc = 'Layer up with thermal outerwear if stepping outside.';
  }

  const intelligence: WeatherIntelligenceSummary = {
    headline: intelHeadline,
    description: intelDesc,
    riskPeriod: intelRisk,
  };

  // Best Time to Go Outside calculation
  const bestHourly = hourlyList.slice(6, 20).sort((a, b) => a.rainChance - b.rainChance || Math.abs(a.temperature - 22) - Math.abs(b.temperature - 22))[0] || hourlyList[0];
  const bestTimeWindow: BestTimeWindow = {
    timeRange: `${bestHourly.time} - ${hourlyList[hourlyList.indexOf(bestHourly) + 2]?.time || 'Later'}`,
    temp: bestHourly.temperature,
    rainChance: bestHourly.rainChance,
    uv: Math.min(8, Math.round(wData.daily.uv_index_max[0] * 0.8)),
    recommendation: bestHourly.rainChance < 20 ? 'Optimal window for walking, jogging, or outdoor errands.' : 'Moderate rain risk. Carry a rain jacket.',
    isOptimal: bestHourly.rainChance < 30,
  };

  const alerts: WeatherAlert[] = [];
  if (wData.current.precipitation > 5 || maxRainChanceIn24h >= 70) {
    alerts.push({
      id: 'rain-alert-1',
      event: 'Heavy Rain Warning',
      headline: `Significant Precipitation Expected (${maxRainChanceIn24h}%)`,
      severity: 'warning',
      description: 'Localized waterlogging in low-lying roads. Drive cautiously.',
      instruction: 'Carry an umbrella and avoid flooded streets.',
    });
  }
  if (wData.daily.uv_index_max[0] >= 8) {
    alerts.push({
      id: 'uv-alert-1',
      event: 'High UV Radiation',
      headline: `Extreme UV Index (${Math.round(wData.daily.uv_index_max[0])}) around Midday`,
      severity: 'info',
      description: 'Unprotected skin burn risk within 15-20 minutes.',
      instruction: 'Wear sunglasses, apply SPF 30+ sunscreen, and wear a hat.',
    });
  }

  const updatedTimeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const completeResult: CompleteWeatherData = {
    location,
    current: {
      temperature: currentTemp,
      feelsLike,
      humidity: wData.current.relative_humidity_2m,
      windSpeed: wData.current.wind_speed_10m,
      windDirection: wData.current.wind_direction_10m,
      pressure: wData.current.pressure_msl,
      visibility: 10,
      uvIndex: wData.daily.uv_index_max[0] || 5,
      cloudCover: wData.current.cloud_cover,
      rainChance: hourlyList[0]?.rainChance || 0,
      conditionCode: currentWMO,
      conditionText: condition.text,
      icon: condition.icon,
      isDay,
      time: updatedTimeStr,
      tempMax: wData.daily.temperature_2m_max[0],
      tempMin: wData.daily.temperature_2m_min[0],
    },
    hourly: hourlyList,
    daily: dailyList,
    airQuality,
    astronomy: {
      sunrise: dailyList[0]?.sunrise || '6:15 AM',
      sunset: dailyList[0]?.sunset || '7:05 PM',
      daylightDuration: '12h 50m',
      moonPhase: 'Waxing Crescent',
      moonIllumination: 68,
    },
    alerts,
    lastUpdated: updatedTimeStr,
    intelligence,
    bestTimeWindow,
    rainTimeline,
  };

  completeResult.activities = evaluateActivities(completeResult);
  completeResult.outfit = generateOutfitAdvice(completeResult);

  return completeResult;
}
