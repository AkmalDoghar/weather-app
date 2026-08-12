'use client';

import React, { useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from 'chart.js';
import { motion } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';
import { TrendingUp } from 'lucide-react';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

export const WeatherCharts: React.FC = () => {
  const { weatherData, tempUnit, isDarkMode } = useWeather();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!weatherData || !canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const gridColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
    const textColor = isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.7)';

    const labels = weatherData.hourly.slice(0, 12).map((h) => h.time);
    const temps = weatherData.hourly.slice(0, 12).map((h) =>
      tempUnit === 'F' ? Math.round((h.temperature * 9) / 5 + 32) : Math.round(h.temperature)
    );
    const humidity = weatherData.hourly.slice(0, 12).map((h) => h.humidity);
    const rain = weatherData.hourly.slice(0, 12).map(h => h.rainChance);

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `Temp (°${tempUnit})`,
            data: temps,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56,189,248,0.15)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#38bdf8',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
          {
            label: 'Humidity (%)',
            data: humidity,
            borderColor: '#34d399',
            backgroundColor: 'rgba(52,211,153,0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: '#34d399',
            yAxisID: 'y2',
          },
          {
            label: 'Rain Chance (%)',
            data: rain,
            borderColor: '#818cf8',
            backgroundColor: 'rgba(129,140,248,0.08)',
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: '#818cf8',
            yAxisID: 'y2',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            backgroundColor: isDarkMode ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.95)',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            padding: 12,
            titleColor: isDarkMode ? '#94a3b8' : '#64748b',
            bodyColor: isDarkMode ? '#f8fafc' : '#0f172a',
            cornerRadius: 12,
          },
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 11 } },
          },
          y: {
            position: 'left',
            grid: { color: gridColor },
            ticks: { color: '#0284c7', font: { size: 11 } },
          },
          y2: {
            position: 'right',
            grid: { display: false },
            ticks: { color: '#059669', font: { size: 11 } },
            min: 0,
            max: 100,
          },
        },
        animation: { duration: 1000, easing: 'easeInOutQuart' },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [weatherData, tempUnit, isDarkMode]);

  if (!weatherData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="p-6 wx-glass-card space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <TrendingUp className="w-5 h-5 text-sky-400" />
          12-Hour Weather Trends
        </h3>
        <div className="flex gap-3">
          {[{ label: 'Temp', color: 'sky' }, { label: 'Humidity', color: 'emerald' }, { label: 'Rain', color: 'indigo' }].map((item) => (
            <div key={item.label} className={`flex items-center gap-1.5 text-xs font-medium ${isDarkMode ? 'text-white/50' : 'text-slate-600'}`}>
              <div className={`w-3 h-0.5 rounded-full bg-${item.color}-400`} />
              {item.label}
            </div>
          ))}
        </div>
      </div>
      <div className="relative h-64">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </motion.div>
  );
};
