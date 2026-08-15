"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useWeather } from "@/context/WeatherContext";
import { searchCities, fetchWeatherData } from "@/lib/api";
import { formatTemp } from "@/lib/utils";
import { LocationData, CompleteWeatherData } from "@/types/weather";
import { BackgroundManager } from "@/components/layout/BackgroundManager";
import {
  ArrowLeft,
  GitCompare,
  Search,
  Loader2,
  X,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageLoader } from "@/components/layout/PageLoader";

export default function ComparePage() {
  const { weatherData, location, tempUnit, isDarkMode, isLoading } = useWeather();

  if (isLoading) return <PageLoader isDarkMode={isDarkMode} message="Loading compare data..." />;
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [compareLocation, setCompareLocation] = useState<LocationData | null>(
    null,
  );
  const [compareWeather, setCompareWeather] =
    useState<CompleteWeatherData | null>(null);
  const [compareFetching, setCompareFetching] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  async function handleSearch(q: string) {
    setQuery(q);
    if (q.trim().length >= 2) {
      setSearching(true);
      const res = await searchCities(q);
      setSuggestions(res);
      setSearching(false);
    } else {
      setSuggestions([]);
    }
  }

  async function loadCompareCity(city: LocationData) {
    setCompareLocation(city);
    setCompareWeather(null);
    setCompareError(null);
    setCompareFetching(true);
    try {
      const data = await fetchWeatherData(city);
      setCompareWeather(data);
    } catch (error: any) {
      console.error("Failed to fetch compare city weather:", error);
      setCompareError(error?.message || "Unknown error fetching city data");
      setCompareWeather(null);
    } finally {
      setCompareFetching(false);
    }
  }

  const current = weatherData?.current;

  return (
    <div
      className={`min-h-screen relative flex flex-col theme-glassmorphism ${isDarkMode ? "text-white" : "text-slate-900"}`}
    >
      <BackgroundManager />
      {/* Floating Western Fire Chiefs / Mapbox Style Header */}
      <PageHeader
        title="Compare Cities"
        subtitle="Compare weather conditions side by side"
        icon={<GitCompare className="w-5 h-5 text-purple-400" />}
        isDarkMode={isDarkMode}
        extra={
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold shadow-sm">
            <GitCompare className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Side-by-Side</span><span className="sm:hidden">Compare</span>
          </div>
        }
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-8 space-y-6">

        {/* Search Second City */}
        <div className="relative max-w-md">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all ${isDarkMode ? "bg-white/8 border border-white/15 focus-within:border-purple-400/50" : "bg-slate-100/80 border border-slate-200 focus-within:border-sky-500/50"}`}
          >
            {searching ? (
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
            ) : (
              <Search
                className={
                  isDarkMode
                    ? "w-4 h-4 text-white/50"
                    : "w-4 h-4 text-slate-500"
                }
              />
            )}
            <input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search second city to compare..."
              className={`flex-1 bg-transparent text-sm outline-none ${isDarkMode ? "text-white placeholder-white/40" : "text-slate-900 placeholder-slate-500"}`}
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                }}
              >
                <X
                  className={
                    isDarkMode
                      ? "w-4 h-4 text-white/40 hover:text-white"
                      : "w-4 h-4 text-slate-500 hover:text-slate-700"
                  }
                />
              </button>
            )}
          </div>
          {suggestions.length > 0 && (
            <div
              className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl overflow-hidden z-50 ${isDarkMode ? "bg-slate-900/95 border border-white/15" : "bg-white border border-slate-200"}`}
            >
              {suggestions.slice(0, 5).map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    setCompareLocation(city);
                    setSuggestions([]);
                    setQuery(`${city.name}, ${city.country}`);
                    loadCompareCity(city);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left ${isDarkMode ? "hover:bg-white/8" : "hover:bg-slate-100"}`}
                >
                  <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div>
                    <div
                      className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}
                    >
                      {city.name}
                    </div>
                    <div
                      className={
                        isDarkMode
                          ? "text-xs text-white/40"
                          : "text-xs text-slate-500"
                      }
                    >
                      {city.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* City A */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="wx-glass-card p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-sky-400">A</span>
              <div>
                <div className="font-black text-lg text-white">
                  {location.name}
                </div>
                <div className="text-xs text-white/50">{location.country}</div>
              </div>
            </div>
            {current ? (
              <div className="space-y-3">
                <div className="text-5xl font-black text-white">
                  {formatTemp(current.temperature, tempUnit)}
                </div>
                <div className="text-sky-300 font-semibold">
                  {current.conditionText}
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div
                    className={`flex items-center gap-1.5 p-2.5 rounded-xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-100/80 border-slate-200"}`}
                  >
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-bold">{current.humidity}%</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 p-2.5 rounded-xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-100/80 border-slate-200"}`}
                  >
                    <Wind className="w-3.5 h-3.5 text-teal-400" />
                    <span className="font-bold">
                      {Math.round(current.windSpeed)} km/h
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 p-2.5 rounded-xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-100/80 border-slate-200"}`}
                  >
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-bold">
                      {formatTemp(current.feelsLike, tempUnit)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-pulse space-y-2">
                <div className="h-12 bg-white/5 rounded-xl" />
                <div className="h-8 bg-white/5 rounded-xl" />
              </div>
            )}
          </motion.div>

          {/* City B */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="wx-glass-card p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-purple-400">B</span>
              {compareLocation ? (
                <div>
                  <div
                    className={
                      isDarkMode
                        ? "font-black text-lg text-white"
                        : "font-black text-lg text-slate-900"
                    }
                  >
                    {compareLocation.name}
                  </div>
                  <div
                    className={
                      isDarkMode
                        ? "text-xs text-white/50"
                        : "text-xs text-slate-500"
                    }
                  >
                    {compareLocation.country}
                  </div>
                </div>
              ) : (
                <div
                  className={
                    isDarkMode
                      ? "text-white/40 font-semibold text-sm"
                      : "text-slate-500 font-semibold text-sm"
                  }
                >
                  Search a city above
                </div>
              )}
            </div>
            {compareFetching ? (
              <div className="animate-pulse space-y-2">
                <div className="h-12 bg-white/5 rounded-xl" />
                <div className="h-8 bg-white/5 rounded-xl" />
              </div>
            ) : compareWeather ? (
              <div className="space-y-4">
                <div
                  className={`text-5xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}
                >
                  {formatTemp(compareWeather.current.temperature, tempUnit)}
                </div>
                <div className="text-sky-300 font-semibold">
                  {compareWeather.current.conditionText}
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div
                    className={`flex items-center gap-1.5 p-2.5 rounded-xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-100/80 border-slate-200"}`}
                  >
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-bold">
                      {compareWeather.current.humidity}%
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 p-2.5 rounded-xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-100/80 border-slate-200"}`}
                  >
                    <Wind className="w-3.5 h-3.5 text-teal-400" />
                    <span className="font-bold">
                      {Math.round(compareWeather.current.windSpeed)} km/h
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 p-2.5 rounded-xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-100/80 border-slate-200"}`}
                  >
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-bold">
                      {formatTemp(compareWeather.current.feelsLike, tempUnit)}
                    </span>
                  </div>
                </div>
              </div>
            ) : compareLocation ? (
              <div
                className={
                  isDarkMode
                    ? "text-white/60 text-sm py-6 text-center"
                    : "text-slate-500 text-sm py-6 text-center"
                }
              >
                <p>Unable to load comparison data for this city.</p>
              </div>
            ) : (
              <div
                className={
                  isDarkMode
                    ? "flex flex-col items-center justify-center py-12 text-white/30 space-y-3"
                    : "flex flex-col items-center justify-center py-12 text-slate-500/80 space-y-3"
                }
              >
                <GitCompare className="w-12 h-12" />
                <p className="text-sm">Select a second city to compare</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
