'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';
import { formatTemp } from '@/lib/utils';
import {
  ArrowLeft,
  Wind,
  Droplets,
  CloudRain,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLoader } from '@/components/layout/PageLoader';
import { CoolWeatherIcon } from '@/components/weather/CoolWeatherIcon';

function HourlyCard3D({ item, index, tempUnit }: { item: any; index: number; tempUnit: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [15, -15]);
  const rotateY = useTransform(x, [-50, 50], [-15, 15]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current!.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const isNow = index === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className="cursor-pointer"
    >
      <div
        className={`relative p-5 rounded-3xl border backdrop-blur-xl transition-all flex flex-col items-center gap-3 shadow-xl ${
          isNow
            ? 'bg-sky-500/30 border-sky-400/60 shadow-sky-500/30'
            : 'bg-white/5 border-white/15 hover:bg-white/10'
        }`}
      >
        {/* Shine layer */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

        <div className={`text-xs font-bold uppercase tracking-widest ${isNow ? 'text-sky-200' : 'text-white/50'}`}>
          {isNow ? 'NOW' : item.time}
        </div>

        <CoolWeatherIcon icon={item.icon} size="md" />

        <div className={`text-2xl font-black ${isNow ? 'text-white' : 'text-white/90'}`}>
          {formatTemp(item.temperature, tempUnit)}
        </div>

        <div className="text-[11px] text-white/50 text-center max-w-[100px] line-clamp-1">{item.conditionText}</div>

        <div className="w-full grid grid-cols-2 gap-1 mt-1">
          <div className="flex items-center gap-1 text-[11px] text-sky-300 bg-sky-500/10 rounded-lg px-2 py-1">
            <Droplets className="w-3 h-3" />
            {item.humidity}%
          </div>
          <div className="flex items-center gap-1 text-[11px] text-teal-300 bg-teal-500/10 rounded-lg px-2 py-1">
            <CloudRain className="w-3 h-3" />
            {item.rainChance}%
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-white/50">
          <Wind className="w-3 h-3" />
          {Math.round(item.windSpeed)} km/h
        </div>
      </div>
    </motion.div>
  );
}

export default function HourlyPage() {
  const { weatherData, location, tempUnit, isLoading } = useWeather();

  if (isLoading) return <PageLoader message="Loading hourly forecast..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0e1d3e] to-[#060b19] text-white">
      {/* 3D Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-sky-600/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0], scale: [1.2, 0.9, 1.2] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl"
        />
      </div>

      {/* Floating Western Fire Chiefs / Mapbox Style Header */}
      <PageHeader
        title="24-Hour Forecast"
        subtitle={`${location.name}, ${location.country}`}
        icon={<Clock className="w-5 h-5" />}
        isDarkMode={true}
        extra={
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> <span className="hidden sm:inline">24h Data</span><span className="sm:hidden">24h</span>
          </div>
        }
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-8 space-y-6">

        {/* 3D Hourly Cards Grid */}
        {!weatherData ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-52 rounded-3xl bg-white/5 border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" style={{ perspective: '1200px' }}>
            {weatherData.hourly.map((item, i) => (
              <HourlyCard3D key={i} item={item} index={i} tempUnit={tempUnit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
