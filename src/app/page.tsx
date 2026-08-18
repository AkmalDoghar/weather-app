"use client";

import React, { useState, useEffect } from "react";
import { useWeather } from "@/context/WeatherContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
import { RotateCw, AlertTriangle } from "lucide-react";
import { PageLoader } from "@/components/layout/PageLoader";

let hasSeenLanding = false;

export default function Home() {
  const {
    weatherData,
    isLoading,
    isError,
    errorMsg,
    refreshWeather,
    themePreset,
    language,
    t,
  } = useWeather();
  const router = useRouter();

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(() => !hasSeenLanding);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (showLanding) {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              hasSeenLanding = true;
              setShowLanding(false);
            }, 500);
            return 100;
          }
          return prev + 4;
        });
      }, 70);
      return () => clearInterval(interval);
    }
  }, [showLanding]);

  const getStageLabel = (progress: number) => {
    if (language === 'ur') {
      if (progress < 30) return "نیورل ویدر کور شروع ہو رہا ہے…";
      if (progress < 70) return "سیٹلائٹ اور ڈوپلر ریڈار کنیکٹ ہو رہا ہے…";
      if (progress < 99) return "فضائی معلومات کا تجزیہ جاری ہے…";
      return "سکائی پلس بالکل تیار ہے۔";
    }
    if (progress < 30) return "Initializing Neural Weather Core...";
    if (progress < 70) return "Connecting Satellite & Doppler Radar...";
    if (progress < 99) return "Analyzing Atmospheric Telemetry...";
    return "SkyPulse PRO Ready.";
  };

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

      {/* Clean Transparent Landing Splash Screen with Filling Progress & Labels */}
      <AnimatePresence>
        {showLanding && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white p-6 select-none"
          >
            {/* Ambient Dynamic Light Sphere */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-96 h-96 rounded-full bg-sky-500/20 blur-[110px] pointer-events-none"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0.5, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center gap-6 text-center max-w-sm sm:max-w-md w-full px-4"
            >
              {/* Top Pill Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                  {language === 'ur' ? 'سکائی پلس • AI انجن' : 'SkyPulse PRO • AI Engine'}
                </span>
              </div>

              {/* Glass Emblem with Logo Image */}
              <div className="relative group">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-500 opacity-60 blur-xl animate-pulse" />
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-slate-900/75 border border-white/20 backdrop-blur-xl flex items-center justify-center p-3 shadow-2xl overflow-hidden">
                  <img
                    src="/app-icon.png"
                    alt="SkyPulse PRO Logo"
                    className="w-full h-full object-cover rounded-2xl drop-shadow-[0_0_20px_rgba(56,189,248,0.6)]"
                  />
                </div>
              </div>

              {/* Brand Title & Descriptive Tagline */}
              <div className="space-y-1.5">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                  {t("appName")}
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm font-medium tracking-wide">
                  {language === 'ur' ? 'باریک بینانہ موسمی معلومات اور ڈوپلر ریڈار' : 'Precision Weather Intelligence & Doppler Radar'}
                </p>
              </div>

              {/* Filling Progress Container with Stage Labels */}
              <div className="w-full space-y-2 bg-slate-900/60 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xl shadow-xl">
                {/* Telemetry Stage Label & Percentage */}
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 px-1">
                  <span className="truncate text-left text-sky-300 font-mono">
                    {getStageLabel(loadingProgress)}
                  </span>
                  <span className="text-sky-400 font-mono font-bold ml-2">
                    {Math.min(loadingProgress, 100)}%
                  </span>
                </div>

                {/* Filling Progress Track */}
                <div className="w-full h-2.5 bg-slate-950/90 border border-white/10 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sky-400 via-teal-400 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.8)]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(loadingProgress, 100)}%` }}
                    transition={{ ease: "easeInOut", duration: 0.1 }}
                  />
                </div>
              </div>

              {/* Feature Chips / Labels */}
              <div className="flex items-center justify-center flex-wrap gap-2 pt-1 text-[11px] font-semibold text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                  {language === 'ur' ? '⚡ لائیو ریڈار' : '⚡ Real-Time Radar'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                  {language === 'ur' ? '🤖 AI مشیر' : '🤖 AI Advisor'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                  {language === 'ur' ? '🌍 علاقائی پیشگوئی' : '🌍 Hyper-Local Forecast'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Container (Hidden while showLanding is active to prevent flash on refresh) */}
      <div className={showLanding ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-500"}>
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
          {isLoading && !weatherData && !showLanding ? (
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
    </div>
  );
}
