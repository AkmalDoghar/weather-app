'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';
import { FilledSun, FilledMoon, CoolWeatherIcon } from '@/components/weather/CoolWeatherIcon';
import { formatTemp } from '@/lib/utils';
import { Droplets, CloudRain, ChevronLeft, ChevronRight } from 'lucide-react';

export const HourlyForecast: React.FC = () => {
  const { weatherData, tempUnit, isDarkMode, t } = useWeather();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' });
    }
  };

  if (!weatherData) return null;

  const displayHours = weatherData.hourly;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="wx-glass-card p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          ⏰ {t('hourlyForecast')}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all text-slate-700 dark:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all text-slate-700 dark:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {displayHours.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className={`flex-shrink-0 snap-start w-28 p-4 rounded-2xl border text-center space-y-3 cursor-pointer transition-all ${
              i === 0
                ? 'bg-sky-500/25 border-sky-400/50 shadow-lg shadow-sky-500/20'
                : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <div className={`text-[11px] font-extrabold uppercase tracking-widest ${
              i === 0 ? 'text-sky-500' : isDarkMode ? 'text-white/60' : 'text-slate-600'
            }`}>
              {i === 0 ? 'NOW' : item.time}
            </div>
            <div className="flex justify-center">
              {item.icon === 'Sun' || item.icon === 'Moon' ? (
                item.isDay ? (
                  <FilledSun className="w-6 h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                ) : (
                  <FilledMoon className="w-6 h-6 text-indigo-200 drop-shadow-[0_0_8px_rgba(199,210,254,0.6)]" />
                )
              ) : (
                <CoolWeatherIcon icon={item.icon} size="sm" />
              )}
            </div>
            <div className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {formatTemp(item.temperature, tempUnit)}
            </div>
            <div className="space-y-1 font-semibold">
              <div className="flex items-center justify-center gap-1 text-[10px] text-sky-500">
                <CloudRain className="w-2.5 h-2.5" />
                {item.rainChance}%
              </div>
              <div className="flex items-center justify-center gap-1 text-[10px] text-teal-500">
                <Droplets className="w-2.5 h-2.5" />
                {item.humidity}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
