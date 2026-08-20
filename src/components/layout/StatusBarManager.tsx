'use client';

import { useEffect } from 'react';
import { useWeather } from '@/context/WeatherContext';

export const DARK_STATUS_COLOR = '#060b19';
export const LIGHT_STATUS_COLOR = '#f1f5f9';

// Updates the mobile status bar background (theme-color meta) to match the app
// theme, like native apps (WhatsApp, etc.) do.
export const StatusBarManager: React.FC = () => {
  const { isDarkMode } = useWeather();

  useEffect(() => {
    const color = isDarkMode ? DARK_STATUS_COLOR : LIGHT_STATUS_COLOR;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', color);
      return;
    }

    meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = color;
    document.head.appendChild(meta);
  }, [isDarkMode]);

  return null;
};