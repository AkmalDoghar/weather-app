import { ActivityType, ActivityEvaluation, CompleteWeatherData, OutfitRecommendation } from '@/types/weather';

export interface ActivityConfig {
  type: ActivityType;
  title: string;
  icon: string;
  minTemp: number;
  maxTemp: number;
  maxRainChance: number;
  maxWindSpeed: number;
  maxUV: number;
}

export const ACTIVITIES_CONFIG: ActivityConfig[] = [
  {
    type: 'walking',
    title: 'Walking',
    icon: 'Footprints',
    minTemp: 10,
    maxTemp: 32,
    maxRainChance: 30,
    maxWindSpeed: 30,
    maxUV: 8,
  },
  {
    type: 'running',
    title: 'Running',
    icon: 'Activity',
    minTemp: 8,
    maxTemp: 26,
    maxRainChance: 20,
    maxWindSpeed: 25,
    maxUV: 7,
  },
  {
    type: 'cycling',
    title: 'Cycling',
    icon: 'Bike',
    minTemp: 12,
    maxTemp: 30,
    maxRainChance: 15,
    maxWindSpeed: 22,
    maxUV: 8,
  },
  {
    type: 'cricket',
    title: 'Cricket',
    icon: 'Trophy',
    minTemp: 15,
    maxTemp: 36,
    maxRainChance: 10,
    maxWindSpeed: 25,
    maxUV: 9,
  },
  {
    type: 'photography',
    title: 'Photography',
    icon: 'Camera',
    minTemp: 5,
    maxTemp: 35,
    maxRainChance: 25,
    maxWindSpeed: 35,
    maxUV: 10,
  },
  {
    type: 'picnic',
    title: 'Picnic',
    icon: 'Utensils',
    minTemp: 16,
    maxTemp: 30,
    maxRainChance: 15,
    maxWindSpeed: 20,
    maxUV: 7,
  },
  {
    type: 'travel',
    title: 'Travel & Sightseeing',
    icon: 'Compass',
    minTemp: 5,
    maxTemp: 38,
    maxRainChance: 40,
    maxWindSpeed: 40,
    maxUV: 10,
  },
];

export function evaluateActivities(weather: CompleteWeatherData): ActivityEvaluation[] {
  const current = weather.current;
  const temp = current.temperature;
  const rain = current.rainChance;
  const wind = current.windSpeed;
  const uv = current.uvIndex;

  return ACTIVITIES_CONFIG.map((act) => {
    let score = 100;
    const reasons: string[] = [];

    if (temp < act.minTemp) {
      score -= 30;
      reasons.push(`Temperature (${Math.round(temp)}°C) is chilly`);
    } else if (temp > act.maxTemp) {
      score -= 35;
      reasons.push(`High temperature (${Math.round(temp)}°C)`);
    }

    if (rain > act.maxRainChance) {
      score -= 40;
      reasons.push(`High chance of rain (${rain}%)`);
    }

    if (wind > act.maxWindSpeed) {
      score -= 25;
      reasons.push(`Windy conditions (${wind} km/h)`);
    }

    if (uv > act.maxUV) {
      score -= 20;
      reasons.push(`Extreme UV Index (${uv})`);
    }

    let status: 'Recommended' | 'Caution' | 'Not Recommended' = 'Recommended';
    if (score < 50) {
      status = 'Not Recommended';
    } else if (score < 80) {
      status = 'Caution';
    }

    const primaryReason = reasons.length > 0 ? reasons.join(', ') : 'Ideal outdoor conditions!';

    return {
      activity: act.type,
      titleKey: act.title,
      iconName: act.icon,
      status,
      score: Math.max(10, Math.min(100, score)),
      reason: primaryReason,
    };
  });
}

export function generateOutfitAdvice(weather: CompleteWeatherData): OutfitRecommendation {
  const temp = weather.current.feelsLike;
  const rain = weather.current.rainChance;
  const wind = weather.current.windSpeed;
  const uv = weather.current.uvIndex;

  let summary = '';
  const suggestions: { title: string; icon: string; items: string[] }[] = [];

  if (temp >= 30) {
    summary = 'Hot conditions! Wear lightweight, breathable cotton clothing and sun protection.';
    suggestions.push({
      title: 'Clothing',
      icon: 'Shirt',
      items: ['Light T-shirt / Polo', 'Shorts / Breathable trousers', 'Linen shirt'],
    });
  } else if (temp >= 20) {
    summary = 'Pleasant and comfortable weather. Light layers recommended.';
    suggestions.push({
      title: 'Clothing',
      icon: 'Shirt',
      items: ['Cotton T-shirt', 'Chinos or Jeans', 'Light cardigan if evening'],
    });
  } else if (temp >= 10) {
    summary = 'Cool weather ahead. A jacket or hoodie is recommended.';
    suggestions.push({
      title: 'Clothing',
      icon: 'Shirt',
      items: ['Sweater / Hoodie', 'Light jacket', 'Warm trousers'],
    });
  } else {
    summary = 'Cold conditions! Bundle up with warm layers and thermal wear.';
    suggestions.push({
      title: 'Clothing',
      icon: 'Shirt',
      items: ['Heavy coat / Down jacket', 'Thermal undershirt', 'Warm scarf & gloves'],
    });
  }

  if (rain >= 30) {
    suggestions.push({
      title: 'Rain Protection',
      icon: 'Umbrella',
      items: ['Compact umbrella', 'Waterproof raincoat', 'Water-resistant shoes'],
    });
  }

  if (uv >= 6) {
    suggestions.push({
      title: 'Sun Protection',
      icon: 'Sun',
      items: ['UV-blocking sunglasses', 'Wide-brim hat or cap', 'SPF 30+ Sunscreen'],
    });
  }

  if (wind >= 25) {
    suggestions.push({
      title: 'Wind Defense',
      icon: 'Wind',
      items: ['Windbreaker jacket', 'Secured eyewear'],
    });
  }

  return {
    summary,
    suggestions,
  };
}
