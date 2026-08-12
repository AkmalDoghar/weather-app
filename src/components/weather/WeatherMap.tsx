'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';
import { Map, Layers, CloudRain, Cloud, Thermometer, Wind, Navigation, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const WeatherMap: React.FC = () => {
  const { location, isDarkMode, t } = useWeather();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="p-6 wx-glass-card space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <Map className="w-5 h-5 text-emerald-400" />
          {t('weatherRadar')}
        </h3>
        <Link href="/radar">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
            <ExternalLink className="w-3 h-3" />
            Full Map
          </motion.div>
        </Link>
      </div>

      <div className={`relative w-full h-72 rounded-2xl overflow-hidden border ${isDarkMode ? 'border-white/10 bg-slate-950' : 'border-slate-300/80 bg-slate-100 shadow-inner'}`}>
        <iframe
          title="Weather Radar Map"
          className="w-full h-full border-0"
          style={{ filter: isDarkMode ? 'saturate(1.1) contrast(1.1) brightness(0.85)' : 'saturate(1.1) contrast(1.05) brightness(1)' }}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 1.5}%2C${location.latitude - 1.5}%2C${location.longitude + 1.5}%2C${location.latitude + 1.5}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`}
        />
        <div className={`absolute top-3 left-3 p-2.5 rounded-xl border backdrop-blur-md flex items-center gap-2 shadow-xl text-xs ${isDarkMode ? 'bg-slate-900/90 border-white/15 text-white' : 'bg-white/90 border-slate-200 text-slate-900'}`}>
          <Navigation className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <div>
            <div className="font-bold">{location.name}</div>
            <div className={`text-[10px] ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>{location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
