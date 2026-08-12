"use client";

import React from "react";
import { useWeather } from "@/context/WeatherContext";
import { TempUnit, SpeedUnit, PressureUnit, Language } from "@/types/weather";
import {
  Settings,
  X,
  Thermometer,
  Wind,
  Gauge,
  Globe,
  Bell,
  Sun,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    isDarkMode,
    setDarkMode,
    tempUnit,
    setTempUnit,
    speedUnit,
    setSpeedUnit,
    pressureUnit,
    setPressureUnit,
    language,
    setLanguage,
    notificationsEnabled,
    setNotificationsEnabled,
    t,
  } = useWeather();

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-colors ${
        isDarkMode ? "bg-slate-950/80" : "bg-slate-900/40"
      }`}
    >
      <div
        className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto border backdrop-blur-2xl transition-all ${
          isDarkMode
            ? "bg-slate-900/95 border-white/15 text-white shadow-black/60"
            : "bg-white/95 border-slate-200 text-slate-900 shadow-slate-900/10"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-500" />
            <h3 className="text-xl font-bold">{t("settings")}</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-all ${
              isDarkMode
                ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                : "bg-black/5 border-black/10 text-slate-600 hover:bg-black/10 hover:text-slate-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Temperature Unit */}
        <div className="space-y-2">
          <label
            className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDarkMode ? "text-sky-200/70" : "text-slate-600"
            }`}
          >
            <Thermometer className="w-4 h-4 text-rose-500" />
            {t("temperatureUnit")}
          </label>
          <div
            className={`flex p-1 rounded-2xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"}`}
          >
            {(["C", "F"] as TempUnit[]).map((u) => (
              <button
                key={u}
                onClick={() => setTempUnit(u)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  tempUnit === u
                    ? "bg-sky-500 text-white shadow-md"
                    : isDarkMode
                      ? "text-white/60 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {u === "C" ? "Celsius (°C)" : "Fahrenheit (°F)"}
              </button>
            ))}
          </div>
        </div>

        {/* Wind Speed Unit */}
        <div className="space-y-2">
          <label
            className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDarkMode ? "text-sky-200/70" : "text-slate-600"
            }`}
          >
            <Wind className="w-4 h-4 text-teal-500" />
            {t("windUnit")}
          </label>
          <div
            className={`flex p-1 rounded-2xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"}`}
          >
            {(["kmh", "mph", "ms"] as SpeedUnit[]).map((u) => (
              <button
                key={u}
                onClick={() => setSpeedUnit(u)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all uppercase ${
                  speedUnit === u
                    ? "bg-teal-500 text-slate-950 shadow-md font-extrabold"
                    : isDarkMode
                      ? "text-white/60 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Pressure Unit */}
        <div className="space-y-2">
          <label
            className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDarkMode ? "text-sky-200/70" : "text-slate-600"
            }`}
          >
            <Gauge className="w-4 h-4 text-purple-500" />
            {t("pressureUnit")}
          </label>
          <div
            className={`flex p-1 rounded-2xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"}`}
          >
            {(["hPa", "inHg"] as PressureUnit[]).map((u) => (
              <button
                key={u}
                onClick={() => setPressureUnit(u)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  pressureUnit === u
                    ? "bg-purple-500 text-white shadow-md"
                    : isDarkMode
                      ? "text-white/60 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <label
            className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDarkMode ? "text-sky-200/70" : "text-slate-600"
            }`}
          >
            <Globe className="w-4 h-4 text-amber-500" />
            {t("language")}
          </label>
          <div
            className={`flex p-1 rounded-2xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"}`}
          >
            {(["en", "ur"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  language === l
                    ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                    : isDarkMode
                      ? "text-white/60 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {l === "en" ? "English" : "اردو (Urdu RTL)"}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Toggle */}
        <div
          className={`flex items-center justify-between p-3.5 rounded-2xl border ${
            isDarkMode
              ? "bg-white/5 border-white/10"
              : "bg-slate-100/70 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-sky-500" />
            <div>
              <div
                className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
              >
                {t("notifications")}
              </div>
              <div
                className={`text-[11px] ${isDarkMode ? "text-white/50" : "text-slate-500"}`}
              >
                {notificationsEnabled
                  ? "Enabled weather push alerts"
                  : "Disabled weather push alerts"}
              </div>
            </div>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              notificationsEnabled
                ? "bg-sky-500"
                : isDarkMode
                  ? "bg-white/20"
                  : "bg-slate-300"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform shadow ${
                notificationsEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <div
          className={`flex items-center justify-between p-3.5 rounded-2xl border ${
            isDarkMode
              ? "bg-white/5 border-white/10"
              : "bg-slate-100/70 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Sun className="w-4 h-4 text-yellow-500" />
            <div>
              <div
                className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
              >
                {t("darkMode")}
              </div>
              <div
                className={`text-[11px] ${isDarkMode ? "text-white/50" : "text-slate-500"}`}
              >
                Toggle dark theme aesthetics
              </div>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!isDarkMode)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              isDarkMode ? "bg-sky-500" : "bg-slate-300"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform shadow ${
                isDarkMode ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
