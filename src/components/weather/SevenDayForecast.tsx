'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';
import { formatTemp } from '@/lib/utils';
import { CoolWeatherIcon } from './CoolWeatherIcon';
import { Droplets, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const SevenDayForecast: React.FC = () => {
  const { weatherData, isLoading, tempUnit, isDarkMode, t } = useWeather();

  if (!weatherData) return null;

  const allMax = Math.max(...weatherData.daily.map((d) => d.tempMax));
  const allMin = Math.min(...weatherData.daily.map((d) => d.tempMin));
  const range = allMax - allMin || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="wx-glass-card p-6 space-y-4"
    >
      <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-full bg-sky-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: isLoading ? 0 : '100%' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          📅 {t('sevenDayForecast')}
        </h3>
        <Link href="/forecast">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 text-xs font-bold text-sky-500 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20 hover:bg-sky-500/20 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Full View
          </motion.div>
        </Link>
      </div>

      <div className="space-y-2">
        {weatherData.daily.map((item, i) => {
          const barLeft = ((item.tempMin - allMin) / range) * 100;
          const barWidth = ((item.tempMax - item.tempMin) / range) * 100;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 p-3 rounded-2xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 transition-all cursor-default"
            >
              <div className={`w-12 text-xs font-bold ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`}>
                {i === 0 ? 'Today' : item.dayName}
              </div>
              <CoolWeatherIcon icon={item.icon} size="sm" />
              <div className="flex items-center gap-1 text-[11px] font-bold text-sky-500 w-10">
                <Droplets className="w-3 h-3" />
                {item.rainChance}%
              </div>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-sky-500 w-12 text-right">
                  {formatTemp(item.tempMin, tempUnit)}
                </span>
                <div className="flex-1 relative h-2 rounded-full bg-black/10 dark:bg-white/10">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-400"
                    style={{ left: `${barLeft}%`, width: `${Math.max(8, barWidth)}%` }}
                  />
                </div>
                <span className="text-[11px] font-extrabold text-amber-500 w-12">
                  {formatTemp(item.tempMax, tempUnit)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
