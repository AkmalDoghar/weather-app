"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWeather } from "@/context/WeatherContext";
import { formatWind, formatPressure } from "@/lib/utils";
import {
  Droplets,
  Wind,
  Eye,
  ArrowUp,
  Gauge,
  CloudCog,
  Umbrella,
  Sunrise,
  Sunset,
  Moon,
} from "lucide-react";

const CHUNK_SIZE = 2; // two cards per column (stacked)

export const WeatherMetricsGrid: React.FC = () => {
  const { weatherData, speedUnit, pressureUnit, isDarkMode, t } = useWeather();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  if (!weatherData) return null;
  const { current, astronomy } = weatherData;

  const metrics = [
    {
      icon: Droplets,
      label: t("humidity"),
      value: `${current.humidity}%`,
      color: "sky",
      desc:
        current.humidity > 70
          ? "High Humidity"
          : current.humidity > 40
            ? "Comfortable"
            : "Dry Air",
    },
    {
      icon: Wind,
      label: t("wind"),
      value: formatWind(current.windSpeed, speedUnit),
      color: "teal",
      desc: `Dir: ${current.windDirection}°`,
    },
    {
      icon: Eye,
      label: t("visibility"),
      value: `${current.visibility} km`,
      color: "indigo",
      desc:
        current.visibility >= 10 ? "Clear Visibility" : "Reduced Visibility",
    },
    {
      icon: Gauge,
      label: t("pressure"),
      value: formatPressure(current.pressure, pressureUnit),
      color: "purple",
      desc: current.pressure > 1013 ? "High Pressure" : "Low Pressure",
    },
    {
      icon: ArrowUp,
      label: t("uvIndex"),
      value: current.uvIndex?.toFixed
        ? current.uvIndex.toFixed(1)
        : String(current.uvIndex),
      color: "amber",
      desc:
        current.uvIndex < 3
          ? "Low UV"
          : current.uvIndex < 6
            ? "Moderate UV"
            : "High UV",
    },
    {
      icon: CloudCog,
      label: t("cloudCover"),
      value: `${current.cloudCover}%`,
      color: "slate",
      desc:
        current.cloudCover > 70
          ? "Overcast"
          : current.cloudCover > 30
            ? "Partly Cloudy"
            : "Clear",
    },
    {
      icon: Umbrella,
      label: t("rainChance"),
      value: `${current.rainChance}%`,
      color: "blue",
      desc:
        current.rainChance > 70
          ? "Likely Rain"
          : current.rainChance > 40
            ? "Possible"
            : "Unlikely",
    },
    {
      icon: Sunrise,
      label: t("sunrise"),
      value: astronomy.sunrise,
      color: "orange",
      desc: "Morning",
    },
    {
      icon: Sunset,
      label: t("sunset"),
      value: astronomy.sunset,
      color: "rose",
      desc: "Evening",
    },
    {
      icon: Moon,
      label: t("moonPhase"),
      value: astronomy.moonPhase,
      color: "indigo",
      desc: `${astronomy.moonIllumination}% illuminated`,
    },
  ];

  const colorMap: Record<string, string> = {
    sky: "border-sky-500/30 text-sky-500 bg-sky-500/10",
    teal: "border-teal-500/30 text-teal-500 bg-teal-500/10",
    indigo: "border-indigo-500/30 text-indigo-500 bg-indigo-500/10",
    purple: "border-purple-500/30 text-purple-500 bg-purple-500/10",
    amber: "border-amber-500/30 text-amber-500 bg-amber-500/10",
    slate: "border-slate-500/30 text-slate-500 bg-slate-500/10",
    blue: "border-blue-500/30 text-blue-500 bg-blue-500/10",
    orange: "border-orange-500/30 text-orange-500 bg-orange-500/10",
    rose: "border-rose-500/30 text-rose-500 bg-rose-500/10",
  };

  // chunk metrics into columns with CHUNK_SIZE items each
  const columns: (typeof metrics)[] = [];
  for (let i = 0; i < metrics.length; i += CHUNK_SIZE) {
    columns.push(metrics.slice(i, i + CHUNK_SIZE));
  }

  const scrollByWidth = (dir: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.75) * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const renderCard = (metric: any, idx: number) => {
    const Icon = metric.icon;
    const badgeClass = colorMap[metric.color] || colorMap.sky;
    return (
      <motion.article
        key={metric.label + idx}
        role="group"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.03 }}
        whileHover={{ y: -6 }}
        className="h-full min-h-[150px] flex flex-col justify-between rounded-2xl  border bg-transparent dark:bg-transparent border-slate-200 dark:border-white/10 p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transform-gpu transition-all overflow-hidden"
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-14 h-14 rounded-lg flex items-center justify-center border ${badgeClass}`}
            aria-hidden
          >
            <Icon className="w-6 h-6" />
          </div>

          <div className="mt-3">
            <div
              className={`text-xl font-extrabold break-words whitespace-normal ${isDarkMode ? "text-white" : "text-slate-900"}`}
              title={String(metric.value)}
            >
              {metric.value}
            </div>
            <div
              className={`text-sm font-semibold mt-1 break-words whitespace-normal ${isDarkMode ? "text-white/75" : "text-slate-500"}`}
            >
              {metric.label}
            </div>
          </div>

          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-tight break-words whitespace-normal">
            {metric.desc}
          </div>
        </div>
      </motion.article>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="wx-glass-card p-6 space-y-4 bg-transparent h-full"
      aria-labelledby="weather-details-heading"
    >
      <div className="flex items-center justify-between gap-3">
        <h3
          id="weather-details-heading"
          className={`text-lg font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
        >
          🌡️ {t("weatherDetails")}
        </h3>
      </div>

      {/* Unified cards section: show all metrics in a responsive grid */}
      <div className="w-full">
        <div className="max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300/60 dark:scrollbar-thumb-white/20 scrollbar-track-transparent">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {metrics.map((metric, i) => renderCard(metric, i))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default WeatherMetricsGrid;
