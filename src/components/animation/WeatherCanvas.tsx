'use client';

import React, { useEffect, useRef } from 'react';
import { useWeather } from '@/context/WeatherContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export const WeatherCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particles = useRef<Particle[]>([]);
  const { weatherData } = useWeather();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const icon = weatherData?.current?.icon || 'CloudSun';
    const isDay = weatherData?.current?.isDay !== false;

    function spawnParticle(): Particle {
      const W = canvas!.width;
      const H = canvas!.height;

      if (icon === 'CloudRain' || icon === 'CloudRainWind' || icon === 'CloudDrizzle') {
        return {
          x: Math.random() * W,
          y: -10,
          vx: 0.8 + Math.random() * 1.5,
          vy: 12 + Math.random() * 8,
          alpha: 0.5 + Math.random() * 0.4,
          size: 1.5 + Math.random(),
          color: '#7dd3fc',
          life: 0,
          maxLife: Math.random() * 60 + 40,
        };
      }
      if (icon === 'Snowflake') {
        return {
          x: Math.random() * W,
          y: -10,
          vx: (Math.random() - 0.5) * 2,
          vy: 1.5 + Math.random() * 2.5,
          alpha: 0.6 + Math.random() * 0.4,
          size: 3 + Math.random() * 4,
          color: '#e0f2fe',
          life: 0,
          maxLife: H / 2 + Math.random() * H,
        };
      }
      if (icon === 'CloudLightning') {
        return {
          x: Math.random() * W,
          y: -10,
          vx: 0.5 + Math.random(),
          vy: 10 + Math.random() * 8,
          alpha: 0.7,
          size: 1,
          color: '#fde68a',
          life: 0,
          maxLife: 50,
        };
      }
      // Stars / clear night
      if (!isDay) {
        return {
          x: Math.random() * W,
          y: Math.random() * H * 0.5,
          vx: 0,
          vy: 0,
          alpha: Math.random() * 0.8 + 0.2,
          size: 1 + Math.random() * 2,
          color: '#e0e7ff',
          life: 0,
          maxLife: 200,
        };
      }
      // Dust / clear day — subtle floating motes
      return {
        x: Math.random() * W,
        y: H + 10,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.5 - Math.random() * 0.8,
        alpha: 0.15 + Math.random() * 0.2,
        size: 2 + Math.random() * 3,
        color: isDay ? '#fef3c7' : '#c7d2fe',
        life: 0,
        maxLife: 200,
      };
    }

    function animate() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      // Spawn particles
      const spawnRate = (icon === 'CloudRain' || icon === 'CloudRainWind') ? 8 :
                        icon === 'CloudLightning' ? 5 :
                        icon === 'Snowflake' ? 3 : 1;
      for (let s = 0; s < spawnRate; s++) {
        if (particles.current.length < 300) {
          particles.current.push(spawnParticle());
        }
      }

      particles.current = particles.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio > 0.8 ? p.alpha * (1 - (lifeRatio - 0.8) / 0.2) : p.alpha;

        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = p.color;

        if (icon === 'CloudRain' || icon === 'CloudRainWind') {
          ctx.fillRect(p.x, p.y, p.size, p.size * 8);
        } else if (icon === 'Snowflake') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        return p.life < p.maxLife && p.y < canvas!.height + 20 && p.x > -10 && p.x < canvas!.width + 10;
      });

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      particles.current = [];
    };
  }, [weatherData?.current?.icon, weatherData?.current?.isDay]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};
