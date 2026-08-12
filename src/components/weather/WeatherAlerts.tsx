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
              className={`relative flex items-start gap-4 p-5 rounded-2xl border bg-gradient-to-r ${colorMap} backdrop-blur-md shadow-xl`}
            >
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
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
