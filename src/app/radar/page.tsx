'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';
import { ArrowLeft, Layers, CloudRain, Cloud, Thermometer, Wind, Navigation } from 'lucide-react';

const LAYERS = [
  { id: 'rain', label: 'Rain', icon: CloudRain, color: 'sky', tile: 'precipitation_new' },
  { id: 'clouds', label: 'Clouds', icon: Cloud, color: 'slate', tile: 'clouds_new' },
  { id: 'temp', label: 'Temp', icon: Thermometer, color: 'amber', tile: 'temp_new' },
  { id: 'wind', label: 'Wind', icon: Wind, color: 'teal', tile: 'wind_new' },
] as const;

export default function RadarPage() {
  const { location, isDarkMode } = useWeather();
  const [activeLayer, setActiveLayer] = useState<'rain' | 'clouds' | 'temp' | 'wind'>('rain');

  const activeLayerInfo = LAYERS.find((l) => l.id === activeLayer)!;

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 2}%2C${location.latitude - 2}%2C${location.longitude + 2}%2C${location.latitude + 2}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-[#060b19] via-[#0a1a2e] to-[#060b19] text-white'
        : 'bg-gradient-to-br from-[#f1f5f9] via-[#e2e8f0] to-[#f8fafc] text-slate-900'
    }`}>
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-0 left-0 w-[40rem] h-[40rem] rounded-full blur-3xl ${
            isDarkMode ? 'bg-sky-900/30' : 'bg-sky-400/20'
          }`}
        />
        <motion.div
          animate={{ x: [0, -60, 60, 0], y: [0, 80, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute bottom-0 right-0 w-[36rem] h-[36rem] rounded-full blur-3xl ${
            isDarkMode ? 'bg-teal-900/20' : 'bg-emerald-300/20'
          }`}
        />
      </div>

      <div className="relative z-10 flex flex-col flex-1 max-w-7xl w-full mx-auto px-4 py-8 gap-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className={`p-3 rounded-2xl border transition-all ${
                isDarkMode
                  ? 'bg-white/10 border-white/15 hover:bg-white/20 text-white'
                  : 'bg-white/70 border-slate-300 hover:bg-white text-slate-800 shadow-sm'
              }`}>
                <ArrowLeft className="w-5 h-5" />
              </div>
            </Link>
            <div>
              <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                <Layers className="w-7 h-7 text-emerald-500" />
                Weather Radar
              </h1>
              <div className={`flex items-center gap-2 text-sm mt-0.5 ${isDarkMode ? 'text-sky-300/70' : 'text-slate-600'}`}>
                <Navigation className="w-3.5 h-3.5" />
                {location.name}, {location.country} •{' '}
                {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
              </div>
            </div>
          </div>

          {/* Active Layer Badge */}
          <motion.div
            key={activeLayer}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl border font-bold text-sm bg-${activeLayerInfo.color}-500/20 border-${activeLayerInfo.color}-400/40 text-${activeLayerInfo.color}-500`}
          >
            <activeLayerInfo.icon className="w-4 h-4" />
            {activeLayerInfo.label} Layer Active
          </motion.div>
        </motion.div>

        {/* Layer Controls — 3D floating pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-3"
          style={{ perspective: '800px' }}
        >
          {LAYERS.map((layer, i) => {
            const Icon = layer.icon;
            const isActive = activeLayer === layer.id;
            return (
              <motion.button
                key={layer.id}
                initial={{ opacity: 0, y: 20, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveLayer(layer.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all shadow-xl ${
                  isActive
                    ? `bg-${layer.color}-500/30 border-${layer.color}-400/60 text-slate-900 shadow-${layer.color}-500/30`
                    : isDarkMode
                    ? 'bg-white/5 border-white/15 text-white/60 hover:bg-white/10'
                    : 'bg-white/80 border-slate-300 text-slate-700 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {layer.label}
                {isActive && (
                  <motion.span
                    layoutId="layer-dot"
                    className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-white' : 'bg-slate-900'}`}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Main Map Container with 3D frame effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, rotateX: 6 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className={`flex-1 relative rounded-3xl overflow-hidden border shadow-2xl ${
            isDarkMode ? 'border-white/15 shadow-black/50' : 'border-slate-300 shadow-slate-900/10'
          }`}
          style={{ minHeight: '65vh', perspective: 1000 }}
        >
          {/* Overlay gradient top */}
          <div className={`absolute inset-x-0 top-0 h-8 bg-gradient-to-b z-10 pointer-events-none ${
            isDarkMode ? 'from-slate-950/60 to-transparent' : 'from-slate-900/20 to-transparent'
          }`} />

          {/* Radar Legend Corner Overlay */}
          <motion.div
            key={activeLayer}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`absolute bottom-4 left-4 z-20 p-3.5 rounded-2xl border backdrop-blur-md shadow-2xl ${
              isDarkMode ? 'bg-slate-900/90 border-white/15 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
            }`}
          >
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>{activeLayerInfo.label} Legend</div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-28 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500" />
            </div>
            <div className={`flex justify-between text-[10px] mt-1 w-28 ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>
              <span>Low</span>
              <span>High</span>
            </div>
          </motion.div>

          {/* Location Badge */}
          <div className={`absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-md shadow-xl text-xs ${
            isDarkMode ? 'bg-slate-900/90 border-white/15 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
          }`}>
            <Navigation className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="font-semibold">{location.name}</span>
          </div>

          <iframe
            title="Weather Radar Map"
            src={mapSrc}
            className="w-full h-full border-0"
            style={{ minHeight: '65vh', filter: isDarkMode ? 'saturate(1.2) contrast(1.1) brightness(0.85)' : 'saturate(1.1) contrast(1.05) brightness(1)' }}
          />
        </motion.div>

        {/* Info Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: 'Map Coverage', value: '±2° radius', icon: '🗺️' },
            { label: 'Data Source', value: 'OpenStreetMap', icon: '📡' },
            { label: 'Radar Layer', value: activeLayerInfo.label, icon: '📊' },
            { label: 'Auto Update', value: 'Every 5 min', icon: '🔄' },
          ].map((info, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.02 }}
              className="p-4 wx-glass-card text-center"
            >
              <div className="text-2xl mb-1">{info.icon}</div>
              <div className={`text-[11px] font-semibold ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>{info.label}</div>
              <div className={`text-sm font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{info.value}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
