"use client";

import React from "react";
import { useWeather } from "@/context/WeatherContext";
import { formatTemp } from "@/lib/utils";
import { CoolWeatherIcon } from "./CoolWeatherIcon";
import { motion } from "framer-motion";
import {
  MapPin,
  Heart,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from "lucide-react";

export const CurrentWeatherHero: React.FC = () => {
  const {
    location,
    weatherData,
    tempUnit,
    t,
    isFavorite,
    toggleFavorite,
    isDarkMode,
  } = useWeather();

  if (!weatherData) return null;

  const { current } = weatherData;
  const currentlyFavorite = isFavorite(location.id);

  const currentDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="wx-glass-card relative overflow-hidden p-6 lg:p-8 group"
    >
      {/* Decorative Glow Effects */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.8fr_1fr] lg:items-center">
        {/* Left Side: Location, Date & Temperature */}
        <div className="space-y-4">
          {/* Location Badge */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="p-3 rounded-3xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <MapPin className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <h2
                  className={`text-3xl lg:text-4xl font-black tracking-tight flex flex-wrap items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
                >
                  {location.name}
                  {location.country && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/15 text-sky-500 border border-sky-500/20">
                      {location.country}
                    </span>
                  )}
                </h2>
              </div>
            </div>

            <button
              onClick={() => toggleFavorite(location)}
              className={`p-3 rounded-3xl border transition-all ${
                currentlyFavorite
                  ? "bg-rose-500/20 border-rose-500/50 text-rose-500 shadow-lg shadow-rose-500/20"
                  : "bg-black/5 dark:bg-white/10 border-black/10 dark:border-white/15 text-slate-700 dark:text-white/70 hover:text-rose-500"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${currentlyFavorite ? "fill-rose-500" : ""}`}
              />
            </button>
          </div>

          {/* Date & Time */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-700 dark:text-sky-200">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              {currentDateStr}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-700 dark:text-sky-200">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              {current.time}
            </span>
            <span className="text-slate-500 dark:text-white/40">
              {t("lastUpdated")}: {weatherData.lastUpdated}
            </span>
          </div>

          {/* Large Temperature Display */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div
              className={`text-6xl lg:text-8xl font-black tracking-tighter bg-clip-text text-transparent ${
                isDarkMode
                  ? "bg-gradient-to-br from-white via-slate-100 to-sky-200"
                  : "bg-gradient-to-br from-slate-900 via-slate-800 to-sky-600"
              }`}
            >
              {formatTemp(current.temperature, tempUnit)}
            </div>
            <div className="space-y-3">
              <div
                className={`text-sm font-bold flex items-center gap-1.5 ${isDarkMode ? "text-sky-200" : "text-slate-700"}`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                {t("feelsLike")}:{" "}
                <span className="font-extrabold text-sky-500">
                  {formatTemp(current.feelsLike, tempUnit)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-extrabold">
                <span className="flex items-center rounded-2xl bg-emerald-500/10 px-3 py-2 text-emerald-500 border border-emerald-500/20">
                  <ArrowUp className="w-3.5 h-3.5" />{" "}
                  {formatTemp(current.tempMax, tempUnit)}
                </span>
                <span className="flex items-center rounded-2xl bg-sky-500/10 px-3 py-2 text-sky-500 border border-sky-500/20">
                  <ArrowDown className="w-3.5 h-3.5" />{" "}
                  {formatTemp(current.tempMin, tempUnit)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                {t("rainChance")}
              </div>
              <div className="mt-2 text-lg font-black text-sky-500">
                {current.rainChance}%
              </div>
            </div>
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                {t("uvIndex")}
              </div>
              <div className="mt-2 text-lg font-black text-amber-400">
                {current.uvIndex.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Weather Condition Box */}
        <div
          className={`flex flex-col items-center lg:items-end gap-4 p-6 rounded-[2rem] border transition-all ${
            isDarkMode
              ? "bg-white/5 border-white/10"
              : "bg-slate-900/5 border-slate-900/10"
          }`}
        >
          <CoolWeatherIcon
            icon={current.icon}
            size="hero"
            isDay={current.isDay}
          />
          <div className="text-center lg:text-right space-y-2">
            <div
              className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {current.conditionText}
            </div>
            <div className="text-sm font-semibold text-sky-500 max-w-xs">
              {current.isDay
                ? t("daytimeWeather")
                : t("nighttimeWeather")}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
