'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';
import { Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

export const WeatherIntelligenceBanner: React.FC = () => {
  const { weatherData, isDarkMode } = useWeather();

  if (!weatherData?.intelligence) return null;
  const { headline, description, riskPeriod } = weatherData.intelligence;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="wx-glass-card p-5 relative overflow-hidden"
    >
      {/* Glow accent */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-start">
        {/* Icon */}
        <div className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center bg-sky-500/15 border border-sky-500/30 text-sky-500">
          <Sparkles className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <p className={`text-sm font-black tracking-tight leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {headline}
          </p>
          <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-white/65' : 'text-slate-600'}`}>
            {description}
          </p>
        </div>

        {/* Risk / OK badge */}
        <div className="flex-shrink-0">
          {riskPeriod ? (
            <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 whitespace-nowrap">
              <AlertTriangle className="w-3.5 h-3.5" />
              {riskPeriod}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 whitespace-nowrap">
              <CheckCircle className="w-3.5 h-3.5" />
              All Clear
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
