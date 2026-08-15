"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  isDarkMode?: boolean;
  extra?: ReactNode;
  backLabel?: string;
  backHref?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  isDarkMode = true,
  extra,
  backLabel = "Back",
  backHref = "/",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-1"
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Sleek Glass 3D Back Button */}
        <Link href={backHref} passHref>
          <motion.div
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.94 }}
            className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl border backdrop-blur-xl shadow-lg transition-all cursor-pointer select-none group ${
              isDarkMode
                ? "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-sky-500/10"
                : "bg-white/80 border-slate-300 text-slate-800 hover:bg-white shadow-slate-900/10"
            }`}
          >
            <ChevronLeft className="w-5 h-5 text-sky-400 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs sm:text-sm font-bold tracking-wide">{backLabel}</span>
          </motion.div>
        </Link>

        {/* Title & Subtitle */}
        <div className="min-w-0 flex-1">
          <h1
            className={`text-xl sm:text-3xl font-black tracking-tight flex items-center gap-2 truncate ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {icon ? (
              <span className="p-1.5 sm:p-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex-shrink-0">
                {icon}
              </span>
            ) : null}
            <span className="truncate">{title}</span>
          </h1>
          {subtitle ? (
            <p
              className={`text-xs sm:text-sm truncate mt-0.5 font-medium ${
                isDarkMode ? "text-sky-200/70" : "text-slate-600"
              }`}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {extra ? <div className="flex items-center gap-2 self-start sm:self-auto">{extra}</div> : null}
    </motion.div>
  );
};
