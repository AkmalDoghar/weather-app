'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';

export const OutfitAdvisorCard: React.FC = () => {
  const { weatherData, isDarkMode, t } = useWeather();

  if (!weatherData?.outfit) return null;
  const { summary, suggestions } = weatherData.outfit;

  const categoryIcons: Record<string, string> = {
    Tops: '👕',
    Bottoms: '👖',
    Footwear: '👟',
    Accessories: '🧣',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.4 }}
      className="wx-glass-card p-6 space-y-5 relative overflow-hidden"
    >
      {/* Glow accent */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
            <span className="text-xl">👗</span>
          </div>
          <div>
            <h3 className={`font-black text-base tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {t('outfitAdvisorTitle')}
            </h3>
            <p className={`text-[11px] ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
              {t('outfitAdvisorSubtitle')}
            </p>
          </div>
        </div>

        {/* Summary */}
        <p className={`text-sm px-4 py-3 rounded-2xl border font-medium leading-relaxed ${
          isDarkMode
            ? 'bg-white/5 border-white/10 text-white/80'
            : 'bg-black/5 border-black/10 text-slate-700'
        }`}>
          {summary}
        </p>

        {/* Outfit Categories Grid */}
        <div className="grid grid-cols-2 gap-3">
          {suggestions.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`p-4 rounded-2xl border space-y-2 ${
                isDarkMode
                  ? 'bg-white/5 border-white/10'
                  : 'bg-black/5 border-black/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{categoryIcons[cat.title] || cat.icon}</span>
                <span className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {cat.title}
                </span>
              </div>
              <ul className="space-y-1">
                {cat.items.map((item, j) => (
                  <li key={j} className={`text-[11px] flex items-center gap-1.5 ${isDarkMode ? 'text-white/65' : 'text-slate-600'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
