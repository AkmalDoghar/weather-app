"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  isDarkMode?: boolean;
  extra?: ReactNode;
  backHref?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  isDarkMode = true,
  extra,
  backHref = "/",
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`sticky top-0 z-50 w-full mb-6 sm:mb-8 border-b backdrop-blur-2xl transition-all pt-[env(safe-area-inset-top,12px)] ${
        isDarkMode
          ? "bg-[#060b19]/80 border-white/15 text-white shadow-lg shadow-black/40"
          : "bg-white/85 border-slate-200/80 text-slate-900 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-3.5">
        {/* Left: Integrated Glass Back Button */}
        <Link href={backHref} passHref className="flex-shrink-0 select-none">
          <motion.div
            whileHover={{ scale: 1.08, x: -2 }}
            whileTap={{ scale: 0.92 }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer group ${
              isDarkMode
                ? "bg-white/10 border-white/15 hover:bg-white/20 text-sky-400"
                : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-sky-600"
            }`}
            title="Back"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
          </motion.div>
        </Link>

        {/* Center: Full-Width Prominent Header Title & Subtitle */}
        <div className="flex-1 min-w-0 flex items-center gap-2.5 sm:gap-3.5 justify-start">
          {icon ? (
            <span
              className={`p-2 rounded-xl flex-shrink-0 hidden sm:flex items-center justify-center border ${
                isDarkMode
                  ? "bg-sky-500/15 border-sky-400/25 text-sky-400"
                  : "bg-sky-500/10 border-sky-500/20 text-sky-600"
              }`}
            >
              {icon}
            </span>
          ) : null}
          <div className="min-w-0 flex flex-col justify-center">
            <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight truncate leading-tight flex items-center gap-2">
              <span className="sm:hidden">{icon}</span>
              <span className="truncate">{title}</span>
            </h1>
            {subtitle ? (
              <p
                className={`text-xs sm:text-sm font-semibold truncate leading-tight mt-0.5 ${
                  isDarkMode ? "text-sky-300/80" : "text-slate-600"
                }`}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        {/* Right: Embedded Right Button / Badge */}
        <div className="flex-shrink-0 flex items-center justify-end">
          {extra ? (
            extra
          ) : (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold shadow-sm ${
                isDarkMode
                  ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-700"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live</span>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};
