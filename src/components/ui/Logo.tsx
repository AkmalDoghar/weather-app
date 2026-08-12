"use client";

import React from "react";
import { motion } from "framer-motion";

import { useWeather } from "@/context/WeatherContext";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showTagline = true,
}) => {
  const { isDarkMode } = useWeather();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const textClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">
      {/* 3D Glassmorphic Vector Sun & Cloud Logo Emblem */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: 3 }}
        whileTap={{ scale: 0.95 }}
        className={`relative ${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-sky-500/25 transition-all`}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-400 to-purple-600 opacity-60 blur-md group-hover:opacity-100 transition-opacity" />

        {/* Inner Glass Container */}
        <div
          className={`relative w-full h-full rounded-[15px] backdrop-blur-xl flex items-center justify-center overflow-hidden border ${isDarkMode ? "bg-slate-950/80 border-white/20" : "bg-white/70 border-sky-200/80 shadow-inner shadow-sky-100/80"}`}
        >
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full p-1.5"
          >
            <defs>
              <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD54F" />
                <stop offset="100%" stopColor="#FF9800" />
              </linearGradient>
              <linearGradient
                id="cloudGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#E0F7FA" />
                <stop offset="100%" stopColor="#80DEEA" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Sun Rays */}
            <circle
              cx="20"
              cy="17"
              r="11"
              fill="url(#sunGrad)"
              opacity="0.25"
              filter="url(#glow)"
            />
            <circle cx="20" cy="17" r="7.5" fill="url(#sunGrad)" />

            {/* Cloud path */}
            <path
              d="M13 28C10.7909 28 9 26.2091 9 24C9 22.0424 10.4079 20.4132 12.2747 20.076C12.747 16.6343 15.6961 14 19.25 14C23.0054 14 26.071 16.9174 26.2415 20.6122C28.3496 21.0592 29.875 22.9099 29.875 25.125C29.875 27.8174 27.6924 30 25 30H13.5C13.3333 30 13.1667 29.9333 13 28Z"
              fill="url(#cloudGrad)"
              fillOpacity="0.9"
              filter="url(#glow)"
            />

            {/* Lightning / Orbit Sparkle */}
            <circle
              cx="28"
              cy="13"
              r="1.5"
              fill="#4FC3F7"
              className="animate-pulse"
            />
            <circle
              cx="10"
              cy="15"
              r="1"
              fill="#FFD54F"
              className="animate-ping opacity-75"
            />
          </svg>
        </div>
      </motion.div>

      {/* Brand Title */}
      <div className="flex flex-col">
        <div
          className={`font-black tracking-tight leading-none font-manrope ${textClasses[size]} flex items-center gap-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}
        >
          <span>SkyPulse</span>
          <span
            className={`text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded-md font-bold ml-1 border ${isDarkMode ? "bg-sky-500/20 text-sky-500 border-sky-500/30" : "bg-sky-100 text-sky-700 border-sky-200"}`}
          >
            PRO
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[10px] font-semibold tracking-wide mt-0.5 hidden sm:block ${isDarkMode ? "text-sky-300/70" : "text-slate-600"}`}
          >
            Weather Intelligence & Decision Engine
          </span>
        )}
      </div>
    </div>
  );
};
