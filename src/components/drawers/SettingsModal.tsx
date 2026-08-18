"use client";

import React, { useEffect } from "react";
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
  Clock,
  Send,
  Smartphone,
  Download,
  CheckCircle,
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
    notificationIntervalHours,
    setNotificationIntervalHours,
    sendManualNotification,
    isAppInstalled,
    triggerInstallApp,
    t,
  } = useWeather();

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[60] flex items-end sm:items-center justify-center backdrop-blur-md transition-colors ${
        isDarkMode ? "bg-slate-950/80" : "bg-slate-900/40"
      }`}
    >
      {/* Modal container — sits above BottomNav on mobile */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border backdrop-blur-2xl transition-all flex flex-col ${
          isDarkMode
            ? "bg-slate-900 border-white/15 text-white shadow-black/60"
            : "bg-white border-slate-200 text-slate-900 shadow-slate-900/10"
        }`}
        style={{
          maxHeight: "calc(100dvh - 88px)",
          WebkitOverflowScrolling: "touch",
        } as React.CSSProperties}
      >
        {/* Sticky drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className={`w-10 h-1 rounded-full ${isDarkMode ? "bg-white/25" : "bg-slate-300"}`} />
        </div>

        {/* Scrollable content area */}
        <div
          className="overflow-y-scroll overscroll-contain p-6 space-y-6 flex-1 pb-10"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" } as React.CSSProperties}
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

        {/* Notifications & Schedule */}
        <div
          className={`p-4 rounded-2xl border space-y-3.5 transition-all ${
            isDarkMode
              ? "bg-white/5 border-white/10"
              : "bg-slate-100/70 border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
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
                    ? `Push alerts active (Every ${notificationIntervalHours}h)`
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

          {notificationsEnabled && (
            <div className="pt-2 border-t border-white/10 space-y-3">
              {/* Frequency selection */}
              <div className="space-y-1.5">
                <label
                  className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                    isDarkMode ? "text-sky-200/70" : "text-slate-600"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  Notification Frequency (Interval)
                </label>
                <div
                  className={`grid grid-cols-5 gap-1 p-1 rounded-xl border ${
                    isDarkMode ? "bg-black/20 border-white/10" : "bg-slate-200/50 border-slate-300/60"
                  }`}
                >
                  {[
                    { label: "1h", value: 1 },
                    { label: "3h", value: 3 },
                    { label: "6h", value: 6 },
                    { label: "12h", value: 12 },
                    { label: "24h", value: 24 },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setNotificationIntervalHours(item.value)}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                        notificationIntervalHours === item.value
                          ? "bg-sky-500 text-white shadow-sm"
                          : isDarkMode
                            ? "text-white/60 hover:text-white hover:bg-white/5"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className={`text-[10px] ${isDarkMode ? "text-white/40" : "text-slate-500"}`}>
                  Default: 24 Hours (Daily weather report)
                </div>
              </div>

              {/* Manual Trigger Test Button */}
              <div className="pt-1 flex items-center justify-between">
                <button
                  onClick={sendManualNotification}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isDarkMode
                      ? "bg-sky-500/20 border-sky-500/30 text-sky-300 hover:bg-sky-500/30"
                      : "bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100"
                  }`}
                >
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  Send Test Notification Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Download / Install App Option */}
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
            isDarkMode
              ? "bg-gradient-to-r from-sky-500/15 via-indigo-500/10 to-purple-500/15 border-sky-500/30"
              : "bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-50 border-sky-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 shadow-md">
              <Smartphone className="w-5 h-5 text-sky-400 animate-pulse" />
            </div>
            <div>
              <div
                className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
              >
                {t("downloadApp")}
              </div>
              <div
                className={`text-[11px] ${isDarkMode ? "text-white/60" : "text-slate-500"}`}
              >
                {t("downloadAppSubtitle")}
              </div>
            </div>
          </div>
          <button
            onClick={triggerInstallApp}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
              isAppInstalled
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-default"
                : "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 shadow-sky-500/25 active:scale-95"
            }`}
          >
            {isAppInstalled ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{t("appInstalled")}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t("installAppBtn")}</span>
              </>
            )}
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
        </div>{/* end scrollable content */}
      </div>
    </div>
  );
};
