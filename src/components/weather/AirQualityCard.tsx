"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWeather } from "@/context/WeatherContext";
import { Leaf, ExternalLink } from "lucide-react";
import Link from "next/link";

export const AirQualityCard: React.FC = () => {
  const { weatherData, isDarkMode, t } = useWeather();
  if (!weatherData) return null;

  const { airQuality } = weatherData;
  const pct = Math.min(100, (airQuality.aqi / 300) * 100);

  const pollutants = [
    {
      label: "PM2.5",
      value: airQuality.pm2_5,
      unit: "µg/m³",
      max: 75,
      color: "#FF7043",
    },
    {
      label: "PM10",
      value: airQuality.pm10,
      unit: "µg/m³",
      max: 150,
      color: "#FFA726",
    },
    {
      label: "CO",
      value: airQuality.co,
      unit: "µg/m³",
      max: 500,
      color: "#AB47BC",
    },
    {
      label: "NO₂",
      value: airQuality.no2,
      unit: "µg/m³",
      max: 100,
      color: "#26C6DA",
    },
    {
      label: "O₃",
      value: airQuality.o3,
      unit: "µg/m³",
      max: 180,
      color: "#66BB6A",
    },
    {
      label: "SO₂",
      value: airQuality.so2,
      unit: "µg/m³",
      max: 100,
      color: "#EC407A",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="p-6 wx-glass-card space-y-5"
    >
      <div className="flex items-center justify-between">
        <h3
          className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
        >
          <Leaf className="w-5 h-5 text-emerald-400" />
          {t("airQuality")}
        </h3>
        <Link href="/air-quality">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
          >
            <ExternalLink className="w-3 h-3" />
            {t("air")}
          </motion.div>
        </Link>
      </div>

      {/* AQI Score + Track */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span
            className={`text-5xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}
          >
            {airQuality.aqi}
          </span>
          <span
            className="text-sm font-bold px-4 py-2 rounded-2xl"
            style={{
              background: airQuality.aqiColor + "25",
              color: airQuality.aqiColor,
              border: `1px solid ${airQuality.aqiColor}50`,
            }}
          >
            {airQuality.aqiStatus}
          </span>
        </div>
        <div
          className={`relative h-3 rounded-full overflow-hidden ${isDarkMode ? "bg-white/10" : "bg-slate-200"}`}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500" />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 - pct / 100 }}
            style={{ originX: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`absolute inset-y-0 right-0 rounded-r-full ${isDarkMode ? "bg-slate-900/90" : "bg-slate-100/90"}`}
          />
        </div>
        <div
          className={`flex justify-between text-[10px] font-semibold ${isDarkMode ? "text-white/40" : "text-slate-500"}`}
        >
          <span>Good (0)</span>
          <span>Moderate (100)</span>
          <span>Hazardous (300+)</span>
        </div>
      </div>

      {/* Pollutant compact grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {pollutants.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className={`p-3 rounded-2xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white/50 border-slate-200/80 shadow-sm"}`}
          >
            <div
              className={`text-[10px] font-bold mb-1 ${isDarkMode ? "text-white/50" : "text-slate-500"}`}
            >
              {p.label}
            </div>
            <div className="text-lg font-black" style={{ color: p.color }}>
              {p.value.toFixed(1)}
            </div>
            <div
              className={`text-[10px] ${isDarkMode ? "text-white/40" : "text-slate-400"}`}
            >
              {p.unit}
            </div>
            <div
              className={`mt-1.5 h-1.5 rounded-full overflow-hidden ${isDarkMode ? "bg-white/10" : "bg-slate-200"}`}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, (p.value / p.max) * 100)}%`,
                  background: p.color,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
