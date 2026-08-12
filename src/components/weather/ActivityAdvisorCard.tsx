'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';
import { ThumbsUp, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ActivityStatus } from '@/types/weather';

const ACTIVITY_ICONS: Record<string, string> = {
  walking: '🚶',
  running: '🏃',
  cycling: '🚴',
  cricket: '🏏',
  photography: '📷',
  picnic: '🧺',
  travel: '✈️',
};

const STATUS_STYLES: Record<ActivityStatus, { border: string; badge: string; icon: React.ReactNode }> = {
  Recommended: {
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500',
    icon: <ThumbsUp className="w-3.5 h-3.5" />,
  },
  Caution: {
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/15 border-amber-500/30 text-amber-500',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  'Not Recommended': {
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/15 border-rose-500/30 text-rose-500',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

export const ActivityAdvisorCard: React.FC = () => {
  const { weatherData, isDarkMode } = useWeather();
  const [expanded, setExpanded] = useState(false);

  if (!weatherData?.activities || weatherData.activities.length === 0) return null;

  const activities = weatherData.activities;
  const shown = expanded ? activities : activities.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.3 }}
      className="wx-glass-card p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
          <span className="text-xl">🎯</span>
        </div>
        <div>
          <h3 className={`font-black text-base tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Activity Advisor
          </h3>
          <p className={`text-[11px] ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
            Today's outdoor activity conditions
          </p>
        </div>
      </div>

      {/* Activity Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <AnimatePresence>
          {shown.map((act, i) => {
            const styles = STATUS_STYLES[act.status];
            return (
              <motion.div
                key={act.activity}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`p-4 rounded-2xl border ${styles.border} ${isDarkMode ? 'bg-white/5' : 'bg-black/5'} space-y-3 cursor-default transition-all`}
              >
                {/* Emoji icon */}
                <div className="text-3xl text-center">
                  {ACTIVITY_ICONS[act.activity] || '🌤️'}
                </div>

                {/* Activity Name */}
                <div className={`text-xs font-black text-center capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {act.activity}
                </div>

                {/* Score bar */}
                <div className={`w-full h-1.5 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${act.score}%` }}
                    transition={{ delay: i * 0.06 + 0.2, duration: 0.6 }}
                    className={`h-full rounded-full ${
                      act.status === 'Recommended' ? 'bg-emerald-500' :
                      act.status === 'Caution' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  />
                </div>

                {/* Status Badge */}
                <div className={`flex items-center justify-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border ${styles.badge}`}>
                  {styles.icon}
                  {act.status}
                </div>

                {/* Reason */}
                <p className={`text-[10px] text-center leading-snug ${isDarkMode ? 'text-white/45' : 'text-slate-500'}`}>
                  {act.reason}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Show more toggle */}
      {activities.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
            isDarkMode
              ? 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              : 'bg-black/5 border-black/10 text-slate-600 hover:bg-black/10'
          }`}
        >
          {expanded ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> Show All {activities.length} Activities</>}
        </button>
      )}
    </motion.div>
  );
};
