'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudRainWind,
  CloudLightning,
  Snowflake,
  CloudFog,
  Sparkles,
  Droplets,
} from 'lucide-react';

interface CoolWeatherIconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  isDay?: boolean;
}

export const CoolWeatherIcon: React.FC<CoolWeatherIconProps> = ({ icon, size = 'md', isDay = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    hero: 'w-24 h-24',
  }[size];

  // Hero Size Super Cool Micro-Animated Icons
  if (size === 'hero') {
    if (icon === 'Sun') {
      return (
        <div className="relative flex items-center justify-center p-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/30 to-yellow-300/10 blur-xl"
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sun className="w-24 h-24 text-amber-400 drop-shadow-[0_0_30px_rgba(253,184,19,0.7)]" />
          </motion.div>
          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-200 animate-spin-slow" />
        </div>
      );
    }

    if (icon === 'CloudRain' || icon === 'CloudRainWind' || icon === 'CloudDrizzle') {
      return (
        <div className="relative flex flex-col items-center justify-center p-4">
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CloudRain className="w-24 h-24 text-sky-400 drop-shadow-[0_0_25px_rgba(56,189,248,0.6)]" />
          </motion.div>
          {/* Animated Falling Raindrops */}
          <div className="flex gap-3 -mt-4">
            {[0, 0.2, 0.4].map((delay, idx) => (
              <motion.div
                key={idx}
                animate={{ y: [0, 14, 0], opacity: [0.2, 1, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay }}
              >
                <Droplets className="w-4 h-4 text-sky-300" />
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    if (icon === 'CloudLightning') {
      return (
        <div className="relative flex items-center justify-center p-4">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.98, 1.05, 0.98] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-yellow-400/20 blur-2xl"
          />
          <CloudLightning className="w-24 h-24 text-yellow-300 drop-shadow-[0_0_35px_rgba(253,224,71,0.8)]" />
        </div>
      );
    }

    if (icon === 'Snowflake') {
      return (
        <div className="relative flex items-center justify-center p-4">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            <Snowflake className="w-24 h-24 text-cyan-200 drop-shadow-[0_0_25px_rgba(165,243,252,0.6)]" />
          </motion.div>
        </div>
      );
    }

    if (icon === 'Moon') {
      return (
        <div className="relative flex items-center justify-center p-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Moon className="w-24 h-24 text-indigo-200 drop-shadow-[0_0_30px_rgba(199,210,254,0.6)]" />
          </motion.div>
          <Sparkles className="absolute top-0 right-1 w-5 h-5 text-indigo-300 animate-pulse" />
        </div>
      );
    }
  }

  // Standard sizes (sm, md, lg)
  switch (icon) {
    case 'Sun':
      return <Sun className={`${sizeClasses} text-amber-400 animate-spin-slow`} />;
    case 'Moon':
      return <Moon className={`${sizeClasses} text-indigo-200`} />;
    case 'CloudSun':
      return <CloudSun className={`${sizeClasses} text-amber-300`} />;
    case 'CloudMoon':
      return <CloudMoon className={`${sizeClasses} text-sky-200`} />;
    case 'Cloud':
      return <Cloud className={`${sizeClasses} text-slate-300`} />;
    case 'CloudRain':
    case 'CloudDrizzle':
      return <CloudRain className={`${sizeClasses} text-sky-400`} />;
    case 'CloudRainWind':
      return <CloudRainWind className={`${sizeClasses} text-blue-400`} />;
    case 'CloudLightning':
      return <CloudLightning className={`${sizeClasses} text-yellow-300 animate-pulse`} />;
    case 'Snowflake':
      return <Snowflake className={`${sizeClasses} text-cyan-200 animate-spin-slow`} />;
    case 'CloudFog':
      return <CloudFog className={`${sizeClasses} text-slate-400`} />;
    default:
      return <Sun className={`${sizeClasses} text-amber-400`} />;
  }
};
