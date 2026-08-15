'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';
import { AlertTriangle, CloudLightning, Thermometer, Droplets, X } from 'lucide-react';

const ALERT_ICONS: Record<string, any> = {
  warning: AlertTriangle,
  severe: CloudLightning,
  extreme: AlertTriangle,
  info: Droplets,
};

export const WeatherAlerts: React.FC = () => {
  const { weatherData } = useWeather();
  const [dismissed, setDismissed] = React.useState<string[]>([]);

  if (!weatherData || !weatherData.alerts.length) return null;

  const visibleAlerts = weatherData.alerts.filter((a) => !dismissed.includes(a.id));
  if (!visibleAlerts.length) return null;

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {visibleAlerts.map((alert, i) => {
          const Icon = ALERT_ICONS[alert.severity] || AlertTriangle;
          const colorMap = {
            warning: 'from-amber-600/30 border-amber-500/50 text-amber-300 shadow-amber-500/20',
            severe: 'from-rose-600/30 border-rose-500/50 text-rose-300 shadow-rose-500/20',
            extreme: 'from-red-700/40 border-red-600/60 text-red-200 shadow-red-500/30',
            info: 'from-sky-600/30 border-sky-500/50 text-sky-300 shadow-sky-500/20',
          }[alert.severity];

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10, scaleY: 0.9 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className={`relative border bg-gradient-to-r ${colorMap} backdrop-blur-md shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl`}
            >
              {/* Mobile: single compact row */}
              <div className="flex sm:hidden items-center gap-2 px-3 py-2">
                <Icon className="w-3.5 h-3.5 flex-shrink-0 animate-pulse" />
                <span className="font-bold text-xs text-white flex-1 truncate min-w-0">{alert.event}</span>
                <button
                  onClick={() => setDismissed((prev) => [...prev, alert.id])}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Desktop: full layout */}
              <div className="hidden sm:flex items-start gap-4 p-5">
                <Icon className="w-6 h-6 flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-white">{alert.event}</div>
                  <div className="text-xs text-white/70 mt-0.5">{alert.headline}</div>
                  <div className="text-[11px] text-white/50 mt-1">{alert.instruction}</div>
                </div>
                <button
                  onClick={() => setDismissed((prev) => [...prev, alert.id])}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
