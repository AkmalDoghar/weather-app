'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';
import { formatTemp } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  Sun,
  Droplets,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLoader } from '@/components/layout/PageLoader';
import { CoolWeatherIcon } from '@/components/weather/CoolWeatherIcon';

function DayCard3D({ item, unitTemp, index }: { item: any; unitTemp: any; index: number }) {
  const { isDarkMode } = useWeather();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [12, -12]);
  const rotateY = useTransform(x, [-50, 50], [-12, 12]);
  const springX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current!.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }
  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const isToday = index === 0;
  const tempRange = item.tempMax - item.tempMin;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: 30 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: 'easeOut' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d' }}
      className="cursor-pointer group"
    >
      <div
        className={`relative p-6 rounded-3xl overflow-hidden flex flex-col gap-5 h-full transition-all group-hover:shadow-sky-500/20 ${
          isToday
            ? isDarkMode
              ? 'bg-gradient-to-b from-sky-600/30 to-indigo-900/50 border border-sky-400/50 shadow-2xl backdrop-blur-xl'
              : 'bg-gradient-to-b from-sky-100/90 to-indigo-50/90 border border-sky-400/60 shadow-lg backdrop-blur-xl'
            : 'wx-glass-card'
        }`}
      >
        {/* Reflective shimmer */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Day Label */}
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-lg font-black ${isToday ? (isDarkMode ? 'text-sky-200' : 'text-sky-950') : (isDarkMode ? 'text-white' : 'text-slate-900')}`}>
              {isToday ? 'Today' : item.dayName}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>{item.date}</div>
          </div>
          {isToday && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-500 border border-sky-500/30">
              NOW
            </span>
          )}
        </div>

        {/* 3D Floating Icon */}
        <div className="flex justify-center" style={{ transform: 'translateZ(20px)' }}>
          <CoolWeatherIcon icon={item.icon} size="lg" />
        </div>
        <div className={`text-sm font-semibold text-center ${isDarkMode ? 'text-white/70' : 'text-slate-700'}`}>{item.conditionText}</div>

        {/* Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-lg font-black text-emerald-500">
            <ArrowUp className="w-4 h-4" />
            {formatTemp(item.tempMax, unitTemp)}
          </div>
          <div className="flex items-center gap-1 text-lg font-black text-sky-500">
            <ArrowDown className="w-4 h-4" />
            {formatTemp(item.tempMin, unitTemp)}
          </div>
        </div>

        {/* Temp Range Bar */}
        <div className={`relative w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: index * 0.08 + 0.3, duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-400 to-amber-400"
            style={{ originX: 0, width: `${Math.max(30, Math.min(100, (tempRange / 20) * 100))}%` }}
          />
        </div>

        {/* Details Row */}
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-sky-500 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20">
            <Droplets className="w-3.5 h-3.5" />
            Rain {item.rainChance}%
          </div>
          <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
            <Sun className="w-3.5 h-3.5" />
            UV {Math.round(item.uvIndexMax)}
          </div>
        </div>

        {/* Sunrise / Sunset */}
        <div className={`flex items-center justify-between text-[11px] pt-1 border-t ${
          isDarkMode ? 'text-white/40 border-white/10' : 'text-slate-500 border-slate-200'
        }`}>
          <span>🌅 {item.sunrise}</span>
          <span>🌇 {item.sunset}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ForecastPage() {
  const { weatherData, location, tempUnit, isDarkMode, isLoading } = useWeather();

  if (isLoading) return <PageLoader isDarkMode={isDarkMode} message="Loading forecast..." />;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-[#060b19] via-[#0d1b36] to-[#0a1628] text-white'
        : 'bg-gradient-to-br from-[#f1f5f9] via-[#e2e8f0] to-[#f8fafc] text-slate-900'
    }`}>
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-0 right-0 w-[36rem] h-[36rem] rounded-full blur-3xl ${
            isDarkMode ? 'bg-indigo-700/20' : 'bg-sky-400/20'
          }`}
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 80, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute bottom-0 left-0 w-[32rem] h-[32rem] rounded-full blur-3xl ${
            isDarkMode ? 'bg-sky-700/15' : 'bg-indigo-300/25'
          }`}
        />
      </div>

      {/* Floating Western Fire Chiefs / Mapbox Style Header */}
      <PageHeader
        title="7-Day Forecast"
        subtitle={`${location.name}, ${location.country}`}
        icon={<Calendar className="w-5 h-5 text-sky-400" />}
        isDarkMode={isDarkMode}
        extra={
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold shadow-sm">
            <Sun className="w-3.5 h-3.5 text-amber-400" /> <span className="hidden sm:inline">Daily Outlook</span><span className="sm:hidden">Outlook</span>
          </div>
        }
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-8 space-y-6">

        {!weatherData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={`h-80 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-slate-200'}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" style={{ perspective: '1200px' }}>
            {weatherData.daily.map((item, i) => (
              <DayCard3D key={i} item={item} unitTemp={tempUnit} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
