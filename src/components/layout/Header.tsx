"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "@/context/WeatherContext";
import { searchCities } from "@/lib/api";
import { LocationData } from "@/types/weather";
import { Logo } from "@/components/ui/Logo";
import {
  Search,
  MapPin,
  X,
  Loader2,
  Heart,
  Settings,
  Navigation,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  onOpenFavorites: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenFavorites,
  onOpenSettings,
}) => {
  const {
    location,
    setLocation,
    tempUnit,
    setTempUnit,
    language,
    setLanguage,
    isDarkMode,
    setDarkMode,
    useGPSLocation,
    isLoading,
    t,
  } = useWeather();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setSearching(true);
        const results = await searchCities(query);
        setSuggestions(results);
        setShowSuggestions(true);
        setSearching(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectCity(city: LocationData) {
    setLocation(city);
    setQuery("");
    setShowSuggestions(false);
  }

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-xl px-3 py-2 sm:px-4 sm:py-3 border-b transition-all duration-300 ${
        isDarkMode
          ? "bg-transparent border-white/10 shadow-none"
          : "bg-transparent border-white/50 shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex items-center justify-between gap-2 sm:justify-start">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <img
              src="/logo.png"
              alt="WeatherX logo"
              className="w-12 h-14 object-cover rounded-full"
            />
            <span
              className={`ml-2 mr-2 text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              Sky Plus
              
            </span>

          </div>

          {/* Action Controls Dock */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* GPS Location Button */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={useGPSLocation}
              disabled={isLoading}
              title="Locate via GPS"
              className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 hover:bg-sky-500/25 transition-all disabled:opacity-50 flex items-center gap-1.5 text-xs font-bold"
            >
              <Navigation
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden xl:inline">{location.name}</span>
            </motion.button>

            {/* Light/Dark Toggle */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setDarkMode(!isDarkMode)}
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
              className={`p-2 rounded-xl border transition-all ${
                isDarkMode
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25"
                  : "bg-indigo-500/15 border-indigo-500/30 text-indigo-500 hover:bg-indigo-500/25"
              }`}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </motion.button>

            {/* Favorites Button */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={onOpenFavorites}
              title="Saved Locations"
              className={`p-2 rounded-xl border transition-all ${
                isDarkMode
                  ? "bg-white/5 border-white/10 text-rose-400 hover:bg-rose-500/15 hover:border-rose-500/30"
                  : "bg-black/5 border-black/10 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20"
              }`}
            >
              <Heart className="w-4 h-4 fill-current" />
            </motion.button>

            {/* Settings Button */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={onOpenSettings}
              title="App Settings"
              className={`p-2 rounded-xl border transition-all ${
                isDarkMode
                  ? "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                  : "bg-black/5 border-black/10 text-slate-600 hover:text-slate-900 hover:bg-black/10"
              }`}
            >
              <Settings className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <div
          ref={searchRef}
          className="relative w-full sm:flex-1 sm:min-w-[200px] sm:max-w-md"
        >
          <div
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-300 ${
              isDarkMode
                ? "bg-white/8 border-white/15 focus-within:border-sky-400/70 focus-within:bg-white/12 focus-within:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                : "bg-black/5 border-black/10 focus-within:border-sky-500/70 focus-within:bg-white focus-within:shadow-[0_0_20px_rgba(56,189,248,0.15)]"
            }`}
          >
            {searching ? (
              <Loader2 className="w-4 h-4 text-sky-400 animate-spin flex-shrink-0" />
            ) : (
              <Search
                className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? "text-white/40" : "text-slate-400"}`}
              />
            )}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className={`flex-1 bg-transparent text-sm outline-none min-w-0 font-medium ${
                isDarkMode
                  ? "text-white placeholder-white/35"
                  : "text-slate-900 placeholder-slate-400"
              }`}
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setShowSuggestions(false);
                }}
              >
                <X
                  className={`w-3.5 h-3.5 ${isDarkMode ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-slate-900"}`}
                />
              </button>
            )}
          </div>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                className={`absolute top-full left-0 right-0 mt-2.5 rounded-2xl border backdrop-blur-2xl shadow-2xl overflow-hidden z-50 ${
                  isDarkMode
                    ? "bg-slate-900/95 border-white/15"
                    : "bg-white/95 border-black/10"
                }`}
              >
                {suggestions.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => selectCity(city)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                      isDarkMode
                        ? "hover:bg-white/8 text-white"
                        : "hover:bg-black/5 text-slate-900"
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold">{city.name}</div>
                      <div
                        className={`text-xs ${isDarkMode ? "text-white/40" : "text-slate-500"}`}
                      >
                        {city.admin1 ? `${city.admin1}, ` : ""}
                        {city.country}
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop/Tablet Controls */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap">
          {/* Temperature Unit Pill */}
          <div
            className={`flex p-0.5 rounded-2xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}
          >
            {(["C", "F"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setTempUnit(u)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  tempUnit === u
                    ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md shadow-sky-500/25"
                    : isDarkMode
                      ? "text-white/50 hover:text-white"
                      : "text-slate-500 hover:text-slate-900"
                }`}
              >
                °{u}
              </button>
            ))}
          </div>

          {/* Language Pill */}
          <div
            className={`flex p-0.5 rounded-2xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}
          >
            {(["en", "ur"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  language === l
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-amber-500/25"
                    : isDarkMode
                      ? "text-white/50 hover:text-white"
                      : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {l === "en" ? "EN" : "اردو"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
