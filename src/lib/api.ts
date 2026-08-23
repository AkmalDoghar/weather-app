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

function getMoonPhase(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let c = 0, e = 0, jd = 0, b = 0;
  if (month < 3) {
    c = year - 1;
    e = month + 12;
  } else {
    c = year;
    e = month;
  }
  c = Math.floor(c / 100);
  b = 2 - c + Math.floor(c / 4);
  jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (e + 1)) + day + b - 1524.5;
  const daysSinceNewMoon = jd - 2451549.5;
  const newMoons = daysSinceNewMoon / 29.53;
  const phase = newMoons - Math.floor(newMoons);
  const illumination = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
  const names = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
  return { name: names[Math.floor(phase * 8 + 0.5) % 8], illumination: Math.round(illumination * 100) };
}

// ✅ FIX: Parse Open-Meteo local ISO string without timezone distortion
function parseLocalISOToTimeStr(iso: string): string {
  if (!iso) return 'N/A';
  const timePart = iso.split('T')[1];
  if (!timePart) return 'N/A';
  const [hStr, mStr] = timePart.split(':');
  const h = parseInt(hStr, 10);
  if (isNaN(h)) return 'N/A';
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${mStr || '00'} ${ampm}`;
}

export async function fetchWeatherData(location: LocationData): Promise<CompleteWeatherData> {
  const lat = typeof location?.latitude === 'number' && !isNaN(location.latitude) ? location.latitude : 24.8607;
  const lon = typeof location?.longitude === 'number' && !isNaN(location.longitude) ? location.longitude : 67.0011;

  const weatherPromise = axios.get(OPEN_METEO_BASE, {
    params: {
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
        'dew_point_2m', 'is_day', 'precipitation', 'weather_code',
        'cloud_cover', 'pressure_msl', 'wind_speed_10m', 'wind_direction_10m',
        'wind_gusts_10m', 'uv_index', 'visibility',
      ].join(','),
      hourly: [
        'temperature_2m', 'relative_humidity_2m', 'dew_point_2m',
        'precipitation_probability', 'precipitation', 'weather_code',
        'wind_speed_10m', 'visibility',
      ].join(','),
      daily: [
        'weather_code', 'temperature_2m_max', 'temperature_2m_min',
        'sunrise', 'sunset', 'uv_index_max', 'precipitation_probability_max',
        'wind_speed_10m_max',
      ].join(','),
      timezone: 'auto',
      forecast_days: 7,
    },
  });

  const aqiPromise = axios.get(AIR_QUALITY_BASE, {
    params: { latitude: lat, longitude: lon, current: ['us_aqi', 'pm10', 'pm2_5', 'carbon_monoxide', 'nitrogen_dioxide', 'sulphur_dioxide', 'ozone'].join(','), timezone: 'auto' },
  }).catch(() => ({ data: { current: { us_aqi: 45, pm2_5: 12, pm10: 22, carbon_monoxide: 210, nitrogen_dioxide: 14, ozone: 30 } } }));

  const [weatherRes, aqiRes] = await Promise.all([weatherPromise, aqiPromise]);
  const wData = weatherRes.data;
  const aData = aqiRes.data;

  // Find the current hour index (match by prefix of ISO string)
  const currentIso = wData.current.time || '';
  const currentHourPrefix = currentIso.substring(0, 13);
  let currentHourIdx = wData.hourly.time.findIndex((t: string) => t.startsWith(currentHourPrefix));
  if (currentHourIdx < 0) {
    const nowMs = Date.now();
    currentHourIdx = wData.hourly.time.findIndex(
      (t: string) => new Date(t + 'Z').getTime() + 3600000 > nowMs
    );
  }
  if (currentHourIdx < 0) currentHourIdx = 0;

  // Build sunrise/sunset lookup for accurate day/night icon per hour
  const dailySunMap = new Map<string, { rise: number; set: number }>();
  wData.daily.time.forEach((dateStr: string, idx: number) => {
    const rise = wData.daily.sunrise[idx]?.split('T')[1]?.split(':');
    const set = wData.daily.sunset[idx]?.split('T')[1]?.split(':');
    if (rise && set) {
      dailySunMap.set(dateStr, {
        rise: parseInt(rise[0], 10) * 60 + parseInt(rise[1], 10),
        set: parseInt(set[0], 10) * 60 + parseInt(set[1], 10),
      });
    }
  });

  const hourlySlice = wData.hourly.time.slice(currentHourIdx, currentHourIdx + 24);
  const hourlyList: HourlyForecastData[] = hourlySlice.map((timeStr: string, sliceIdx: number) => {
    const idx = currentHourIdx + sliceIdx;
    const code = wData.hourly.weather_code[idx];
    const datePart = timeStr.split('T')[0];
    const hNum = parseInt(timeStr.split('T')[1]?.split(':')[0] || '12', 10);
    const sunTimes = dailySunMap.get(datePart);
    const isDayHour = sunTimes
      ? hNum * 60 >= sunTimes.rise && hNum * 60 < sunTimes.set
      : hNum >= 6 && hNum < 19;
    const cond = getWeatherCondition(code, isDayHour);
    // Format time as "3 PM" from local ISO string (no timezone shift)
    const ampm = hNum >= 12 ? 'PM' : 'AM';
    const h12 = hNum % 12 || 12;
    return {
      time: `${h12} ${ampm}`,
      timestamp: new Date(timeStr + 'Z').getTime(),
      temperature: wData.hourly.temperature_2m[idx],
      conditionCode: code,
      conditionText: cond.text,
      icon: cond.icon,
      isDay: isDayHour,
      rainChance: wData.hourly.precipitation_probability[idx] || 0,
      humidity: wData.hourly.relative_humidity_2m[idx],
      windSpeed: wData.hourly.wind_speed_10m[idx],
      precipitationAmount: wData.hourly.precipitation[idx] || 0,
    };
  });

  const dailyList: DailyForecastData[] = wData.daily.time.map((dateStr: string, idx: number) => {
    const code = wData.daily.weather_code[idx];
    const cond = getWeatherCondition(code, true);
    // Use UTC noon to avoid day name shifting due to local timezone offset
    const dateObj = new Date(dateStr + 'T12:00:00Z');
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    // ✅ FIX: Parse ISO locally — avoids timezone distortion for other cities
    const sunriseStr = parseLocalISOToTimeStr(wData.daily.sunrise[idx]);
    const sunsetStr = parseLocalISOToTimeStr(wData.daily.sunset[idx]);
    return {
      date: dateStr,
      dayName,
      tempMax: wData.daily.temperature_2m_max[idx],
      tempMin: wData.daily.temperature_2m_min[idx],
      conditionCode: code,
      conditionText: cond.text,
      icon: cond.icon,
      rainChance: wData.daily.precipitation_probability_max?.[idx] || 0,
      uvIndexMax: wData.daily.uv_index_max[idx] || 0,
      sunrise: sunriseStr,
      sunset: sunsetStr,
      windSpeedMax: wData.daily.wind_speed_10m_max?.[idx] || 0,
    };
  });

  // ── ✅ FIXED: Daylight Duration from actual ISO sunrise/sunset ─────────────────
  const srISO = wData.daily.sunrise[0];
  const ssISO = wData.daily.sunset[0];
  const srParts = srISO?.split('T')[1]?.split(':');
  const ssParts = ssISO?.split('T')[1]?.split(':');
  let daylightDuration = 'N/A';
  if (srParts && ssParts) {
    const srMins = parseInt(srParts[0], 10) * 60 + parseInt(srParts[1], 10);
    const ssMins = parseInt(ssParts[0], 10) * 60 + parseInt(ssParts[1], 10);
    const diff = ssMins - srMins;
    if (diff > 0) daylightDuration = `${Math.floor(diff / 60)}h ${(diff % 60).toString().padStart(2, '0')}m`;
  }

  // ── ✅ FIXED: Real Moon Phase (astronomical calculation) ──────────────────────
  const moon = getMoonPhase(new Date());

  // ── Air Quality ───────────────────────────────────────────────────────────────
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

  // ── Rain Timeline & Peak Risk ─────────────────────────────────────────────────
  let maxRainChanceIn24h = 0;
  let peakRainTimeStr = '';
  const rainTimeline: RainTimelineItem[] = hourlyList.map((h) => {
    if (h.rainChance > maxRainChanceIn24h) {
      maxRainChanceIn24h = h.rainChance;
      peakRainTimeStr = h.time;
    }
    return { time: h.time, timestamp: h.timestamp, rainChance: h.rainChance, precipitationAmount: h.precipitationAmount || 0, isPeakRisk: false };
  });
  if (maxRainChanceIn24h > 40 && peakRainTimeStr) {
    const peak = rainTimeline.find((i) => i.time === peakRainTimeStr);
    if (peak) peak.isPeakRisk = true;
  }

  // ── Weather Intelligence ───────────────────────────────────────────────────────
  const currentTemp = wData.current.temperature_2m;
  const isDay = wData.current.is_day === 1;
  const currentCondText = getWeatherCondition(wData.current.weather_code, isDay).text;
  let intelHeadline = `${currentCondText} with current temperature at ${Math.round(currentTemp)}°C.`;
  let intelDesc = 'Weather conditions remain stable for routine outdoor activities.';
  let intelRisk: string | undefined;
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
  const intelligence: WeatherIntelligenceSummary = { headline: intelHeadline, description: intelDesc, riskPeriod: intelRisk };

  // ── Best Time to Go Outside ───────────────────────────────────────────────────
  const bestHourly = hourlyList.slice(0, 14).sort(
    (a, b) => a.rainChance - b.rainChance || Math.abs(a.temperature - 24) - Math.abs(b.temperature - 24)
  )[0] || hourlyList[0];
  const bestIdx = hourlyList.indexOf(bestHourly);
  const bestTimeWindow: BestTimeWindow = {
    timeRange: `${bestHourly.time} - ${hourlyList[bestIdx + 2]?.time || 'Later'}`,
    temp: bestHourly.temperature,
    rainChance: bestHourly.rainChance,
    uv: Math.min(8, Math.round((wData.daily.uv_index_max[0] || 5) * 0.8)),
    recommendation: bestHourly.rainChance < 20 ? 'Optimal window for walking, jogging, or outdoor errands.' : 'Moderate rain risk. Carry a rain jacket.',
    isOptimal: bestHourly.rainChance < 30,
  };

  // ── Alerts ───────────────────────────────────────────────────────────────────
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
      feelsLike: wData.current.apparent_temperature,
      humidity: wData.current.relative_humidity_2m,
      windSpeed: wData.current.wind_speed_10m,
      windGust: wData.current.wind_gusts_10m ?? wData.current.wind_speed_10m,
      windDirection: wData.current.wind_direction_10m,
      pressure: wData.current.pressure_msl,
      // ✅ FIXED: Real visibility in km (Open-Meteo gives meters)
      visibility: Math.round((wData.current.visibility / 1000) * 10) / 10,
      // ✅ FIXED: Current UV index, not daily max
      uvIndex: wData.current.uv_index ?? wData.daily.uv_index_max[0] ?? 5,
      // ✅ FIXED: Real dew point
      dewPoint: wData.current.dew_point_2m ?? (currentTemp - (100 - wData.current.relative_humidity_2m) / 5),
      cloudCover: wData.current.cloud_cover,
      rainChance: hourlyList[0]?.rainChance || 0,
      conditionCode: wData.current.weather_code,
      conditionText: getWeatherCondition(wData.current.weather_code, isDay).text,
      icon: getWeatherCondition(wData.current.weather_code, isDay).icon,
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
      // ✅ FIXED: Calculated from actual sunrise/sunset
      daylightDuration,
      // ✅ FIXED: Astronomically computed
      moonPhase: moon.name,
      moonIllumination: moon.illumination,
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
