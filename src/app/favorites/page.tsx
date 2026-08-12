'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useWeather } from '@/context/WeatherContext';
import { Heart, MapPin, Trash2, ArrowLeft, Plus } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites, toggleFavorite, setLocation, location, isDarkMode } = useWeather();

  return (
    <div className="min-h-screen bg-[#060b19] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <Link href="/">
            <div className="p-3 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Saved Locations</h1>
            <p className="text-sky-300/70 text-sm flex items-center gap-1.5 mt-0.5">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              {favorites.length} saved {favorites.length === 1 ? 'location' : 'locations'}
            </p>
          </div>
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 space-y-4"
          >
            <div className="text-6xl">❤️</div>
            <h2 className="text-xl font-bold text-white/70">No Saved Locations Yet</h2>
            <p className="text-sm text-white/40">Tap the heart icon on any city to save it here.</p>
            <Link href="/">
              <div className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 font-bold text-sm transition-all shadow-lg">
                <Plus className="w-4 h-4" /> Explore Weather
              </div>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {favorites.map((fav, i) => {
              const isActive = fav.latitude === location.latitude && fav.longitude === location.longitude;
              return (
                <motion.div
                  key={fav.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`wx-glass-card p-5 flex items-center gap-4 transition-all ${isActive ? 'ring-2 ring-sky-500/50' : ''}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                    🌍
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white">{fav.name}</span>
                      {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/50 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {fav.country}
                      {fav.admin1 ? ` · ${fav.admin1}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLocation(fav)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500/15 border border-sky-500/30 text-sky-400 hover:bg-sky-500/25 transition-all"
                    >
                      Select
                    </button>
                    <button
                      onClick={() => toggleFavorite(fav)}
                      className="p-2.5 rounded-xl text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
