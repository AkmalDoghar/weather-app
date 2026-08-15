"use client";

import React, { useState } from "react";
import { useWeather } from "@/context/WeatherContext";
import { Header } from "@/components/layout/Header";
import { CurrentWeatherHero } from "@/components/weather/CurrentWeatherHero";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { SevenDayForecast } from "@/components/weather/SevenDayForecast";
import { WeatherMetricsGrid } from "@/components/weather/WeatherMetricsGrid";
import { AirQualityCard } from "@/components/weather/AirQualityCard";
import { WeatherAlerts } from "@/components/weather/WeatherAlerts";
import { WeatherCharts } from "@/components/weather/WeatherCharts";
import { WeatherMap } from "@/components/weather/WeatherMap";
import { WeatherCanvas } from "@/components/animation/WeatherCanvas";
import { BackgroundManager } from "@/components/layout/BackgroundManager";
import { Logo } from "@/components/ui/Logo";
import { WeatherIntelligenceBanner } from "@/components/weather/WeatherIntelligenceBanner";
import { BestTimeCard } from "@/components/weather/BestTimeCard";
import { RainTimelineCard } from "@/components/weather/RainTimelineCard";
import { ActivityAdvisorCard } from "@/components/weather/ActivityAdvisorCard";
import { OutfitAdvisorCard } from "@/components/weather/OutfitAdvisorCard";
import { FavoritesModal } from "@/components/drawers/FavoritesModal";
import { SettingsModal } from "@/components/drawers/SettingsModal";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { motion } from "framer-motion";
import { RotateCw, AlertTriangle } from "lucide-react";
import { PageLoader } from "@/components/layout/PageLoader";

export default function Home() {
  const {
    weatherData,
    isLoading,
    isError,
    errorMsg,
    refreshWeather,
    themePreset,
  } = useWeather();

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className={`min-h-screen relative flex flex-col theme-${themePreset}`}>
      {/* Dynamic Weather Wallpaper Background */}
      <BackgroundManager />

      {/* Dynamic Weather Canvas Particle Effect */}
      <WeatherCanvas />

      {/* 3D Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -60, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-sky-700/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 80, 0], scale: [1.2, 0.9, 1.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-indigo-700/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 60, -40, 0], y: [0, -30, 50, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 w-64 h-64 rounded-full bg-teal-600/8 blur-3xl"
        />
      </div>

      {/* Sticky Header */}
      <Header
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 z-10 space-y-6 pb-28">
        {/* Error State */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl backdrop-blur-xl bg-rose-500/20 border border-rose-500/50 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-rose-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg">
                  Failed to Load Weather Data
                </h3>
                <p className="text-xs text-rose-200">
                  {errorMsg || "Network issue or city not found."}
                </p>
              </div>
            </div>
            <button
              onClick={refreshWeather}
              className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 font-semibold text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <RotateCw className="w-4 h-4" />
              Retry
            </button>
          </motion.div>
        )}

        {/* Premium Page Loader */}
        {isLoading && !weatherData ? (
          <PageLoader message="Fetching weather data..." />
        ) : (
          <>
            {/* Live Weather Alerts */}
            <WeatherAlerts />

            {/* 🧠 Weather Intelligence Banner */}
            <WeatherIntelligenceBanner />

            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.8fr_1fr] gap-6">
              <CurrentWeatherHero />
              <WeatherMetricsGrid />
            </div>

            {/* 24-Hour Horizontal Slider */}
            <HourlyForecast />

            <div className="w-full">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <BestTimeCard />
                <RainTimelineCard />
                <AirQualityCard />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SevenDayForecast />
              <WeatherMap />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityAdvisorCard />
              <OutfitAdvisorCard />
            </div>

            <WeatherCharts />
          </>
        )}
      </main>

      {/* AI Helper */}
      <AIAssistant />

      {/* Modals */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
