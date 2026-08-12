'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('WeatherX App Boundary Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#060b19] flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full p-8 rounded-3xl backdrop-blur-xl bg-rose-500/15 border border-rose-500/40 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Something went wrong!</h2>
          <p className="text-xs text-rose-200/80">
            {error.message || 'Unable to fetch weather data. Please check your network connection.'}
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 transition-all"
        >
          <RotateCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
