"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWeather } from "@/context/WeatherContext";
import { formatTemp } from "@/lib/utils";
import {
  Clock,
  Thermometer,
  Droplets,
  SunMedium,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const BestTimeCard: React.FC = () => {
  const { weatherData, tempUnit, isDarkMode } = useWeather();

  if (!weatherData?.bestTimeWindow) return null;
  const win = weatherData.bestTimeWindow;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1 }}
      className="wx-glass-card p-6 relative overflow-hidden"
    >
      {/* Decorative glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3
              className={`font-black text-base tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              Best Time to Go Outside
            </h3>
            <p
              className={`text-[11px] ${isDarkMode ? "text-white/50" : "text-slate-500"}`}
            >
              Optimal weather window today
            </p>
          </div>
          <div className="ml-auto">
            {win.isOptimal ? (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-500" />
            )}
          </div>
        </div>

        {/* Time Range Highlight */}
        <div
          className={`text-3xl font-black tracking-tight ${win.isOptimal ? "text-emerald-500" : "text-amber-500"}`}
        >
          {win.timeRange}
        </div>

        {/* Stats Row */}
        <div className="grid grid-flow-col auto-cols-[minmax(110px,1fr)] gap-3 overflow-x-auto pb-1 sm:grid-cols-3 sm:grid-flow-row sm:auto-cols-auto">
          <div
            className={`flex flex-col items-center gap-1.5 p-3 min-w-[110px] rounded-2xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}
          >
            <Thermometer className="w-4 h-4 text-sky-500" />
            <span
              className={`text-sm font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {formatTemp(win.temp, tempUnit)}
            </span>
            <span className="text-[10px] text-slate-500">Temp</span>
          </div>
          <div
            className={`flex flex-col items-center gap-1.5 p-3 min-w-[110px] rounded-2xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}
          >
            <Droplets className="w-4 h-4 text-blue-500" />
            <span
              className={`text-sm font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {win.rainChance}%
            </span>
            <span className="text-[10px] text-slate-500">Rain</span>
          </div>
          <div
            className={`flex flex-col items-center gap-1.5 p-3 min-w-[110px] rounded-2xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}
          >
            <SunMedium className="w-4 h-4 text-amber-500" />
            <span
              className={`text-sm font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {win.uv}
            </span>
            <span className="text-[10px] text-slate-500">UV</span>
          </div>
        </div>

        {/* Recommendation */}
        <p
          className={`text-xs px-4 py-3 rounded-2xl border font-medium leading-relaxed ${
            win.isOptimal
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
          }`}
        >
          {win.recommendation}
        </p>
      </div>
    </motion.div>
  );
};
