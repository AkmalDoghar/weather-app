"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  isDarkMode?: boolean;
  extra?: ReactNode;
  backLabel?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  isDarkMode = true,
  extra,
  backLabel = "Back",
}) => {
  const buttonClasses = `inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all ${
    isDarkMode
      ? "bg-white/10 border-white/15 text-white hover:bg-white/20"
      : "bg-white/90 border-slate-200 text-slate-900 hover:bg-slate-100 shadow-sm"
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-4 sm:items-center">
        <Link href="/">
          <a className={buttonClasses}>
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </a>
        </Link>

        <div className="min-w-0">
          <h1
            className={`text-3xl font-black tracking-tight ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              {icon ? <span className="flex-shrink-0">{icon}</span> : null}
              {title}
            </span>
          </h1>
          {subtitle ? (
            <p
              className={`mt-1 text-sm ${
                isDarkMode ? "text-slate-300/70" : "text-slate-600"
              }`}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {extra ? <div>{extra}</div> : null}
    </motion.div>
  );
};
