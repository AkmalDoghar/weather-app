'use client';
import { useEffect } from 'react';
import { useWeather } from '@/context/WeatherContext';

// This component applies the selected theme preset as a class on the <html> element.
// It runs on the client side only.
export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { themePreset } = useWeather();

  useEffect(() => {
    // Remove any previous theme preset classes
    const html = document.documentElement;
    html.classList.remove('theme-glassmorphism', 'theme-neomorphism', 'theme-material', 'theme-minimal');
    // Add the current preset class
    if (themePreset) {
      html.classList.add(`theme-${themePreset}`);
    }
  }, [themePreset]);

  return <>{children}</>;
};
