'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';

// High definition weather photography for Dashboard background
const BACKGROUND_IMAGES: Record<string, { day: string; night: string }> = {
  clear: {
    day: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1920&auto=format&fit=crop', // Blue Sunny Horizon
    night: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1920&auto=format&fit=crop', // Night Sky & Stars
  },
  cloudy: {
    day: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1920&auto=format&fit=crop', // Fluffy Clouds
    night: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=1920&auto=format&fit=crop', // Night Clouds
  },
  rain: {
    day: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=1920&auto=format&fit=crop', // Rain Landscape
    night: 'https://images.unsplash.com/photo-1509635022432-0220ac12960b?q=80&w=1920&auto=format&fit=crop', // City Rain Night
  },
  snow: {
    day: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=1920&auto=format&fit=crop', // Snowy Mountain
    night: 'https://images.unsplash.com/photo-1485594052223-863a15db4f3a?q=80&w=1920&auto=format&fit=crop', // Snowy Forest Night
  },
  thunderstorm: {
    day: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1920&auto=format&fit=crop', // Lightning Storm
    night: 'https://images.unsplash.com/photo-1511289081-d06d5b374678?q=80&w=1920&auto=format&fit=crop', // Dark Lightning
  },
};

function getBgCategory(code: number): keyof typeof BACKGROUND_IMAGES {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2 || code === 3 || code === 45 || code === 48) return 'cloudy';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 95) return 'thunderstorm';
  return 'clear';
}

export const BackgroundManager: React.FC = () => {
  const { weatherData, isDarkMode } = useWeather();

  const code = weatherData?.current.conditionCode ?? 0;
  const isDay = weatherData?.current.isDay ?? true;
  const category = getBgCategory(code);

  const imageUrl = isDay ? BACKGROUND_IMAGES[category].day : BACKGROUND_IMAGES[category].night;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Image Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={imageUrl}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.85, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      </AnimatePresence>

      {/* Gentle Subtle Overlay (Allows background image to be clearly visible) */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isDarkMode
            ? 'bg-slate-950/45 backdrop-brightness-75'
            : 'bg-white/35 backdrop-brightness-105'
        }`}
      />
    </div>
  );
};
