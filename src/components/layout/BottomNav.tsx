"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Calendar, MapPin, Leaf, GitCompare, Heart } from "lucide-react";
import { useWeather } from "@/context/WeatherContext";

const NAV_ITEMS = [
  {
    href: "/",
    defaultLabel: "Home",
    icon: Home,
    activeColor: "from-sky-400 to-blue-500",
    textColor: "text-sky-400",
    shadowColor: "shadow-sky-500/40",
  },
  {
    href: "/forecast",
    defaultLabel: "Forecast",
    icon: Calendar,
    activeColor: "from-indigo-400 to-purple-500",
    textColor: "text-indigo-400",
    shadowColor: "shadow-indigo-500/40",
  },
  {
    href: "/radar",
    defaultLabel: "Map",
    icon: MapPin,
    activeColor: "from-amber-400 to-orange-500",
    textColor: "text-amber-400",
    shadowColor: "shadow-amber-500/40",
  },
  {
    href: "/air-quality",
    defaultLabel: "Air",
    icon: Leaf,
    activeColor: "from-emerald-400 to-teal-500",
    textColor: "text-emerald-400",
    shadowColor: "shadow-emerald-500/40",
  },
  {
    href: "/compare",
    defaultLabel: "Compare",
    icon: GitCompare,
    activeColor: "from-fuchsia-400 to-pink-500",
    textColor: "text-fuchsia-400",
    shadowColor: "shadow-fuchsia-500/40",
  },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { t, isDarkMode } = useWeather();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-3 pt-1 pointer-events-none">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="pointer-events-auto relative group w-full max-w-3xl"
      >
        {/* Ambient Glow Backdrop */}
        <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-r from-sky-500/8 via-purple-500/8 to-rose-500/8 blur-2xl opacity-70 group-hover:opacity-90 transition-opacity pointer-events-none" />

        {/* Glass Container */}
        <div
          className={`grid grid-cols-5 w-full items-center p-1.5 sm:p-2.5 rounded-[2.5rem] backdrop-blur-lg border transition-all duration-300 ${
            isDarkMode
              ? "bg-slate-950/20 border-white/10 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]"
              : "bg-white/20 border-slate-200/30 shadow-[0_10px_25px_-8px_rgba(15,23,42,0.12)]"
          }`}
          style={{
            boxShadow: isDarkMode
              ? "0 12px 30px -12px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
              : "0 10px 25px -8px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const keyMap: Record<string, "home" | "forecast" | "radar" | "air" | "compare"> = {
              "/": "home",
              "/forecast": "forecast",
              "/radar": "radar",
              "/air-quality": "air",
              "/compare": "compare",
            };
            const translationKey = keyMap[item.href] || "home";
            const label = t(translationKey);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center w-full"
              >
                <motion.div
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex flex-col items-center justify-center gap-1 w-full py-2 px-1 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "text-white"
                      : isDarkMode
                        ? "text-white/70 hover:text-white"
                        : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {/* Animated Spring Active Pill Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDockPill"
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.activeColor} opacity-25 shadow-[0_10px_30px_-16px_rgba(0,0,0,0.45)] ${item.shadowColor}`}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 relative z-10 transition-transform duration-300 ${
                      isActive ? `${item.textColor} scale-125` : ""
                    }`}
                  />

                  {/* Text Label */}
                  <span
                    className={`text-[10px] sm:text-xs font-semibold tracking-tight relative z-10 whitespace-nowrap transition-colors truncate max-w-full ${
                      isActive
                        ? isDarkMode
                          ? "text-white"
                          : "text-slate-950"
                        : isDarkMode
                          ? "text-slate-300"
                          : "text-slate-500"
                    }`}
                  >
                    {label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
};
