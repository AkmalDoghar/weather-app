import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#060b19] text-white p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-16 rounded-2xl bg-white/5 border border-white/10" />

      {/* Hero Skeleton */}
      <div className="h-72 rounded-3xl bg-white/8 border border-white/10" />

      {/* Hourly Skeleton */}
      <div className="h-44 rounded-3xl bg-white/8 border border-white/10" />

      {/* 2-Column Forecast & Map Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 rounded-3xl bg-white/8 border border-white/10" />
        <div className="h-80 rounded-3xl bg-white/8 border border-white/10" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="h-60 rounded-3xl bg-white/8 border border-white/10" />
    </div>
  );
}
