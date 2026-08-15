'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';
import { ArrowLeft, Wind, Leaf, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageLoader } from '@/components/layout/PageLoader';

interface PollutantCardProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  max: number;
  index: number;
}

function PollutantCard({ label, value, unit, color, max, index }: PollutantCardProps) {
  const { isDarkMode } = useWeather();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-40, 40], [12, -12]);
  const rotateY = useTransform(x, [-40, 40], [-12, 12]);
  const springX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const pct = Math.min(100, (value / max) * 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'backOut' }}
      onMouseMove={(e) => {
        const rect = ref.current!.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d' }}
      className="cursor-pointer"
    >
      <div className="relative p-6 rounded-3xl wx-glass-card overflow-hidden shadow-xl hover:shadow-2xl transition-all group">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
        <div
          className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
          style={{ background: color }}
        />

        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-bold ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>{label}</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full border" style={{ borderColor: color + '60', background: color + '20', color }}>
            {unit}
          </span>
        </div>

        <div className="text-4xl font-black mb-4" style={{ color: isDarkMode ? '#ffffff' : color }}>{value.toFixed(1)}</div>

        {/* 3D Progress Bar */}
        <div className={`relative h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} style={{ transform: 'translateZ(10px)' }}>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: pct / 100 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.9, ease: 'easeOut' }}
            style={{
              originX: 0,
              background: `linear-gradient(90deg, ${color}99, ${color})`,
              boxShadow: `0 0 12px ${color}88`,
            }}
            className="absolute inset-y-0 left-0 w-full rounded-full"
          />
        </div>
        <div className={`flex justify-between mt-1.5 text-[10px] ${isDarkMode ? 'text-white/30' : 'text-slate-500'}`}>
          <span>0</span>
          <span>{max}</span>
        </div>
      </div>
    </motion.div>
  );
}

function AQIGauge({ aqi, status, color, isDarkMode }: { aqi: number; status: string; color: string; isDarkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H * 0.75;
    const R = W * 0.4;

    ctx.clearRect(0, 0, W, H);

    // Track arc
    ctx.beginPath();
    ctx.arc(cx, cy, R, Math.PI, 0, false);
    ctx.lineWidth = 18;
    ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Filled arc based on AQI (0-300)
    const pct = Math.min(1, aqi / 300);
    const endAngle = Math.PI + (Math.PI * pct);

    const grad = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
    grad.addColorStop(0, '#4CAF50');
    grad.addColorStop(0.5, '#FBC02D');
    grad.addColorStop(1, '#F44336');
    ctx.beginPath();
    ctx.arc(cx, cy, R, Math.PI, endAngle, false);
    ctx.lineWidth = 18;
    ctx.strokeStyle = grad;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center value
    ctx.font = `bold 44px Inter, sans-serif`;
    ctx.fillStyle = isDarkMode ? '#ffffff' : '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${aqi}`, cx, cy - 20);

    ctx.font = `600 16px Inter, sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(status, cx, cy + 16);
  }, [aqi, color, status, isDarkMode]);

  return <canvas ref={canvasRef} width={280} height={180} className="mx-auto" />;
}

export default function AirQualityPage() {
  const { weatherData, location, isDarkMode, isLoading } = useWeather();

  if (isLoading) return <PageLoader isDarkMode={isDarkMode} message="Loading air quality data..." />;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-[#060b19] via-[#0a1a2e] to-[#081226] text-white'
        : 'bg-gradient-to-br from-[#f1f5f9] via-[#e2e8f0] to-[#f8fafc] text-slate-900'
    }`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-0 left-0 w-[32rem] h-[32rem] rounded-full blur-3xl ${
            isDarkMode ? 'bg-emerald-700/15' : 'bg-emerald-300/25'
          }`}
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full blur-3xl ${
            isDarkMode ? 'bg-rose-700/15' : 'bg-rose-300/20'
          }`}
        />
      </div>

      {/* Floating Western Fire Chiefs / Mapbox Style Header */}
      <PageHeader
        title="Air Quality Index"
        subtitle={`${location.name}, ${location.country}`}
        icon={<Leaf className="w-5 h-5 text-emerald-400" />}
        isDarkMode={isDarkMode}
        extra={
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold shadow-sm bg-[#0b1528]/80"
            style={{
              borderColor: weatherData ? weatherData.airQuality.aqiColor + '50' : 'rgba(16,185,129,0.4)',
              color: weatherData ? weatherData.airQuality.aqiColor : '#34d399',
            }}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>AQI {weatherData ? weatherData.airQuality.aqi : '--'}</span>
          </div>
        }
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-8 space-y-6">

        {!weatherData ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-16 h-16 rounded-full border-4 border-emerald-400/20 border-t-emerald-400" />
          </div>
        ) : (
          <>
            {/* AQI Hero Gauge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="p-8 wx-glass-card text-center"
              style={{ perspective: 1000 }}
            >
              <h2 className={`text-lg font-bold mb-4 uppercase tracking-widest ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>Current AQI Score</h2>
              <AQIGauge
                aqi={weatherData.airQuality.aqi}
                status={weatherData.airQuality.aqiStatus}
                color={weatherData.airQuality.aqiColor}
                isDarkMode={isDarkMode}
              />
              <div
                className="inline-flex items-center gap-2 mt-4 px-6 py-2 rounded-full font-bold text-sm border"
                style={{ background: weatherData.airQuality.aqiColor + '22', borderColor: weatherData.airQuality.aqiColor + '60', color: weatherData.airQuality.aqiColor }}
              >
                <AlertTriangle className="w-4 h-4" />
                {weatherData.airQuality.aqiStatus} Air Quality
              </div>
            </motion.div>

            {/* Pollutant Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1200px' }}>
              <PollutantCard label="Fine Particles PM2.5" value={weatherData.airQuality.pm2_5} unit="µg/m³" color="#FF7043" max={75} index={0} />
              <PollutantCard label="Coarse Particles PM10" value={weatherData.airQuality.pm10} unit="µg/m³" color="#FFA726" max={150} index={1} />
              <PollutantCard label="Carbon Monoxide CO" value={weatherData.airQuality.co} unit="µg/m³" color="#AB47BC" max={500} index={2} />
              <PollutantCard label="Nitrogen Dioxide NO₂" value={weatherData.airQuality.no2} unit="µg/m³" color="#26C6DA" max={100} index={3} />
              <PollutantCard label="Ozone O₃" value={weatherData.airQuality.o3} unit="µg/m³" color="#66BB6A" max={180} index={4} />
              <PollutantCard label="Sulphur Dioxide SO₂" value={weatherData.airQuality.so2} unit="µg/m³" color="#EC407A" max={100} index={5} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
