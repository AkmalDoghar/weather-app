"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cloud, Droplets, Wind, Thermometer } from "lucide-react";

import { useWeather } from "@/context/WeatherContext";

interface PageLoaderProps {
  isDarkMode?: boolean;
  message?: string;
}

const ICONS = [Cloud, Droplets, Wind, Thermometer];
const ICON_COLORS = [
  "text-sky-400",
  "text-blue-400",
  "text-teal-400",
  "text-amber-400",
];

export const PageLoader: React.FC<PageLoaderProps> = ({
  isDarkMode = true,
  message,
}) => {
  const { language, t } = useWeather();
  const displayMessage = message
    ? (language === 'ur' && (message === "Loading weather data..." || message === "Fetching weather data...") ? t("loading") : message)
    : t("loading");

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-[#0e1d3e] to-[#060b19] text-white"
          : "bg-gradient-to-br from-sky-50 via-white to-slate-100 text-slate-900"
      }`}
    >
      {/* Background animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { size: "w-72 h-72", pos: "-top-24 -left-24", color: isDarkMode ? "bg-sky-600/20" : "bg-sky-300/30", delay: 0 },
          { size: "w-96 h-96", pos: "-bottom-24 -right-24", color: isDarkMode ? "bg-indigo-600/15" : "bg-indigo-300/20", delay: 3 },
          { size: "w-56 h-56", pos: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", color: isDarkMode ? "bg-teal-700/10" : "bg-teal-300/15", delay: 1.5 },
        ].map((orb, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: orb.delay }}
            className={`absolute ${orb.pos} ${orb.size} rounded-full ${orb.color} blur-3xl`}
          />
        ))}
      </div>

      {/* Animated weather icons ring */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className={`absolute inset-0 rounded-full border-2 border-transparent ${
            isDarkMode
              ? "border-t-sky-500/60 border-r-sky-400/30"
              : "border-t-sky-500/80 border-r-sky-400/40"
          }`}
          style={{ borderStyle: "solid" }}
        />
        {/* Inner spinning ring (reverse) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className={`absolute inset-3 rounded-full border-2 border-transparent ${
            isDarkMode
              ? "border-t-indigo-500/50 border-l-indigo-400/30"
              : "border-t-indigo-500/70 border-l-indigo-400/40"
          }`}
          style={{ borderStyle: "solid" }}
        />
        {/* Center pulsing cloud icon */}
        <motion.div
          animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${
            isDarkMode
              ? "bg-sky-500/15 border-sky-400/30 shadow-sky-500/20"
              : "bg-sky-500/10 border-sky-400/25 shadow-sky-500/10"
          }`}
        >
          <Cloud className="w-10 h-10 text-sky-400" />
        </motion.div>

        {/* Orbiting icons */}
        {ICONS.map((Icon, i) => {
          const angle = (i / ICONS.length) * 2 * Math.PI;
          const radius = 56;
          const cx = Math.cos(angle) * radius;
          const cy = Math.sin(angle) * radius;
          return (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transformOrigin: "center center" }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ transform: `translate(${cx}px, ${cy}px)` }}
              >
                <motion.div
                  animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  className={`p-2 rounded-xl border backdrop-blur-sm ${
                    isDarkMode
                      ? "bg-white/8 border-white/15 shadow-sm"
                      : "bg-white/70 border-slate-200 shadow-sm"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${ICON_COLORS[i]}`} />
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-2 z-10">
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`text-sm font-semibold tracking-wide ${
            isDarkMode ? "text-sky-300/80" : "text-slate-500"
          }`}
        >
          {displayMessage}
        </motion.p>

        {/* Animated loading dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-sky-400"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
