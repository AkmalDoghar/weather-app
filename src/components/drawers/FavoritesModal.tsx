'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';
import { Heart, X, MapPin, Clock, Trash2 } from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({ isOpen, onClose }) => {
  const { favorites, recentSearches, setLocation, toggleFavorite, isDarkMode, t } = useWeather();

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-colors ${
      isDarkMode ? 'bg-slate-950/80' : 'bg-slate-900/40'
    }`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto border backdrop-blur-2xl transition-all ${
          isDarkMode
            ? 'bg-slate-900/95 border-white/15 text-white shadow-black/60'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-900/10'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <h3 className="text-xl font-bold">{t('favorites')}</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-all ${
              isDarkMode
                ? 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                : 'bg-black/5 border-black/10 text-slate-600 hover:bg-black/10 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Favorites */}
        <div className="space-y-2">
          <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Saved Locations</label>
          {favorites.length === 0 ? (
            <div className={`p-4 rounded-2xl border text-center text-sm ${
              isDarkMode ? 'bg-white/5 border-white/10 text-white/40' : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}>
              No favorites yet. Tap the ♥ on any location to save it.
            </div>
          ) : (
            favorites.map((loc) => (
              <div
                key={loc.id}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all group ${
                  isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100/70 border-slate-200/80 hover:bg-slate-200/60'
                }`}
              >
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <button
                  className="flex-1 text-left"
                  onClick={() => { setLocation(loc); onClose(); }}
                >
                  <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{loc.name}</div>
                  <div className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>{loc.country}</div>
                </button>
                <button
                  onClick={() => toggleFavorite(loc)}
                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
              <Clock className="w-3.5 h-3.5" />
              Recent Searches
            </label>
            {recentSearches.map((loc) => (
              <button
                key={loc.id}
                onClick={() => { setLocation(loc); onClose(); }}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                  isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100/70 border-slate-200/80 hover:bg-slate-200/60'
                }`}
              >
                <Clock className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <div>
                  <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{loc.name}</div>
                  <div className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>{loc.country}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
