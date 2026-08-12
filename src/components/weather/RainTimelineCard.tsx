'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';
import { CloudRain, Droplets } from 'lucide-react';

export const RainTimelineCard: React.FC = () => {
  const { weatherData, isDarkMode } = useWeather();

  if (!weatherData?.rainTimeline) return null;

  // Show only every 3rd hour to keep it clean (8 data points)
  const items = weatherData.rainTimeline.filter((_, i) => i % 3 === 0).slice(0, 8);
  const maxRain = Math.max(...items.map((i) => i.rainChance), 1);

  const getBarColor = (chance: number, isPeak: boolean) => {
    if (isPeak) return 'from-rose-500 to-rose-400';
    if (chance >= 70) return 'from-blue-600 to-blue-400';
    if (chance >= 40) return 'from-sky-500 to-sky-400';
    return 'from-teal-400 to-teal-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2 }}
      className="wx-glass-card p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500">
          <CloudRain className="w-5 h-5" />
        </div>
        <div>
          <h3 className={`font-black text-base tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Rain Risk Timeline
          </h3>
          <p className={`text-[11px] ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>24-hour precipitation probability</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end gap-2 h-28">
        {items.map((item, i) => {
          const barHeightPct = Math.max(8, (item.rainChance / maxRain) * 100);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
              <div className="w-full flex flex-col justify-end h-20 relative">
                {item.isPeakRisk && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-black text-rose-500 whitespace-nowrap">Peak</div>
                )}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${barHeightPct}%` }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: 'easeOut' }}
                  className={`w-full rounded-t-xl bg-gradient-to-t ${getBarColor(item.rainChance, item.isPeakRisk)} relative`}
                >
                  {item.isPeakRisk && (
                    <div className="absolute inset-0 rounded-t-xl animate-pulse opacity-50 bg-rose-400" />
                  )}
                </motion.div>
              </div>
              <span className={`text-[9px] font-bold ${item.isPeakRisk ? 'text-rose-500' : isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
                {item.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] font-bold flex-wrap">
        <span className="flex items-center gap-1.5 text-teal-500"><Droplets className="w-3 h-3" /> Low (&lt;40%)</span>
        <span className="flex items-center gap-1.5 text-sky-500"><Droplets className="w-3 h-3" /> Moderate (40-70%)</span>
        <span className="flex items-center gap-1.5 text-rose-500"><Droplets className="w-3 h-3" /> High (&gt;70%)</span>
      </div>
    </motion.div>
  );
};
