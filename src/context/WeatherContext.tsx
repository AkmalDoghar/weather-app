// src/context/WeatherContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  LocationData,
  CompleteWeatherData,
  TempUnit,
  SpeedUnit,
  PressureUnit,
  ThemePreset,
  Language,
} from "@/types/weather";
import { fetchWeatherData, reverseGeocode } from "@/lib/api";
import { translations } from "@/lib/translations";
import { formatTemp } from "@/lib/utils";

interface WeatherContextType {
  location: LocationData;
  weatherData: CompleteWeatherData | null;
  isLoading: boolean;
  isError: boolean;
  errorMsg: string | null;
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
  pressureUnit: PressureUnit;
  themePreset: ThemePreset;
  isDarkMode: boolean;
  language: Language;
  notificationsEnabled: boolean;
  favorites: LocationData[];
  recentSearches: LocationData[];
  t: (key: keyof typeof translations.en) => string;
  setLocation: (loc: LocationData) => void;
  setTempUnit: (unit: TempUnit) => void;
  setSpeedUnit: (unit: SpeedUnit) => void;
  setPressureUnit: (unit: PressureUnit) => void;
  setThemePreset: (preset: ThemePreset) => void;
  setDarkMode: (dark: boolean) => void;
  setLanguage: (lang: Language) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  toggleFavorite: (loc: LocationData) => void;
  isFavorite: (id: string | number) => boolean;
  refreshWeather: () => void;
  useGPSLocation: () => void;
}

const DEFAULT_LOCATION: LocationData = {
  id: "karachi-pk",
  name: "Karachi",
  country: "Pakistan",
  latitude: 24.8607,
  longitude: 67.0011,
  category: "Home",
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [location, setLocationState] = useState<LocationData>(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState<CompleteWeatherData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [tempUnit, setTempUnit] = useState<TempUnit>("C");
  const [speedUnit, setSpeedUnitState] = useState<SpeedUnit>("kmh");
  const [pressureUnit, setPressureUnitState] = useState<PressureUnit>("hPa");
  const [themePreset, setThemePreset] = useState<ThemePreset>("glassmorphism");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<Language>("en");
  const [notificationsEnabled, setNotificationsEnabledState] =
    useState<boolean>(false);
  const [favorites, setFavorites] = useState<LocationData[]>([]);
  const [recentSearches, setRecentSearches] = useState<LocationData[]>([]);
  const notifiedAlertIds = React.useRef<string[]>([]);

  // Apply theme preset class
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove(
      "theme-glassmorphism",
      "theme-neomorphism",
      "theme-material",
      "theme-minimal",
    );
    if (themePreset) {
      html.classList.add(`theme-${themePreset}`);
    }
  }, [themePreset]);

  // Apply dark mode class
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDarkMode]);

  // RTL / language direction
  useEffect(() => {
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  // Load saved preferences on mount
  useEffect(() => {
    try {
      const favs =
        localStorage.getItem("weatherx_favorites") ||
        localStorage.getItem("skypulse_favorites");
      if (favs) setFavorites(JSON.parse(favs));

      const recent =
        localStorage.getItem("weatherx_recent") ||
        localStorage.getItem("skypulse_recent");
      if (recent) setRecentSearches(JSON.parse(recent));

      const savedTheme = (localStorage.getItem("weatherx_theme_preset") ||
        localStorage.getItem("skypulse_theme_preset")) as ThemePreset;
      if (savedTheme) setThemePreset(savedTheme);

      const savedDark =
        localStorage.getItem("weatherx_dark_mode") ||
        localStorage.getItem("skypulse_dark_mode");
      if (savedDark !== null) setIsDarkMode(savedDark === "true");

      const savedLang = (localStorage.getItem("weatherx_lang") ||
        localStorage.getItem("skypulse_lang")) as Language;
      if (savedLang) setLanguage(savedLang);

      const savedTemp = (localStorage.getItem("weatherx_temp_unit") ||
        localStorage.getItem("skypulse_temp_unit")) as TempUnit;
      if (savedTemp) setTempUnit(savedTemp);

      const savedSpeed = localStorage.getItem(
        "weatherx_speed_unit",
      ) as SpeedUnit;
      if (savedSpeed) setSpeedUnitState(savedSpeed);

      const savedPressure = localStorage.getItem(
        "weatherx_pressure_unit",
      ) as PressureUnit;
      if (savedPressure) setPressureUnitState(savedPressure);

      const savedNotifications = localStorage.getItem(
        "weatherx_notifications_enabled",
      );
      if (savedNotifications !== null)
        setNotificationsEnabledState(savedNotifications === "true");

      const savedLocation =
        localStorage.getItem("weatherx_location") ||
        localStorage.getItem("skypulse_location");
      if (savedLocation) {
        try {
          setLocationState(JSON.parse(savedLocation));
        } catch (e) {
          console.warn("Failed to parse saved location", e);
        }
      }
    } catch (e) {
      console.error("Failed to parse localStorage settings", e);
    }
  }, []);

  // Auto GPS on first load
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;

    // If a saved location exists, skip auto GPS so user selection persists
    const savedLocation =
      localStorage.getItem("weatherx_location") ||
      localStorage.getItem("skypulse_location");
    if (savedLocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const loc = await reverseGeocode(latitude, longitude);
          if (loc && loc.name) setLocation(loc);
        } catch (e) {
          console.error("GPS reverse geocode error", e);
        }
      },
      (err) => console.log("GPS permission error", err),
      { timeout: 8000 },
    );
  }, []);

  // Fetch weather when location changes
  const loadWeather = async (loc: LocationData) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMsg(null);
    try {
      const data = await fetchWeatherData(loc);
      setWeatherData(data);
      // update recent searches
      setRecentSearches((prev) => {
        const filtered = prev.filter(
          (i) => i.name.toLowerCase() !== loc.name.toLowerCase(),
        );
        const updated = [loc, ...filtered].slice(0, 6);
        localStorage.setItem("weatherx_recent", JSON.stringify(updated));
        return updated;
      });
    } catch (e: any) {
      setIsError(true);
      setErrorMsg(e.message || "Error fetching weather data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(location);
  }, [location.latitude, location.longitude]);

  // Exposed helpers
  const setLocation = (loc: LocationData) => {
    setLocationState(loc);
    try {
      localStorage.setItem("weatherx_location", JSON.stringify(loc));
    } catch (e) {
      console.warn("Failed to persist location", e);
    }
  };
  const refreshWeather = () => loadWeather(location);
  const useGPSLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      console.warn("Geolocation not supported by browser");
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const loc = await reverseGeocode(latitude, longitude);
          if (loc) setLocation(loc);
        } catch (e) {
          console.error("Reverse geocode error", e);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        console.warn("GPS location request denied or failed:", err.message);
        setIsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  };

  const toggleFavorite = (loc: LocationData) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (i) => i.latitude === loc.latitude && i.longitude === loc.longitude,
      );
      const updated = exists
        ? prev.filter(
            (i) => i.latitude !== loc.latitude || i.longitude !== loc.longitude,
          )
        : [...prev, { ...loc, isFavorite: true }];
      localStorage.setItem("weatherx_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (id: string | number) =>
    favorites.some(
      (i) =>
        i.id === id ||
        (i.latitude === location.latitude &&
          i.longitude === location.longitude),
    );

  const changeThemePreset = (preset: ThemePreset) => {
    setThemePreset(preset);
    localStorage.setItem("weatherx_theme_preset", preset);
  };

  const changeDarkMode = (dark: boolean) => {
    setIsDarkMode(dark);
    localStorage.setItem("weatherx_dark_mode", dark.toString());
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("weatherx_lang", lang);
  };

  const changeNotificationsEnabled = async (enabled: boolean) => {
    if (enabled && typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setNotificationsEnabledState(false);
        localStorage.setItem("weatherx_notifications_enabled", "false");
        return;
      }
    }

    setNotificationsEnabledState(enabled);
    localStorage.setItem("weatherx_notifications_enabled", enabled.toString());
  };

  const changeTempUnit = (unit: TempUnit) => {
    setTempUnit(unit);
    localStorage.setItem("weatherx_temp_unit", unit);
  };

  const changeSpeedUnit = (unit: SpeedUnit) => {
    setSpeedUnitState(unit);
    localStorage.setItem("weatherx_speed_unit", unit);
  };

  const changePressureUnit = (unit: PressureUnit) => {
    setPressureUnitState(unit);
    localStorage.setItem("weatherx_pressure_unit", unit);
  };

  useEffect(() => {
    if (!notificationsEnabled || typeof window === "undefined" || !weatherData)
      return;
    if (!("Notification" in window) || Notification.permission !== "granted")
      return;

    const alertNotifications = weatherData.alerts.filter(
      (alert) =>
        !notifiedAlertIds.current.includes(alert.id) &&
        ["warning", "severe", "extreme"].includes(alert.severity),
    );

    if (alertNotifications.length) {
      alertNotifications.forEach((alert) => {
        new Notification(`Weather Alert: ${alert.event}`, {
          body: `${alert.headline} \n${alert.instruction}`,
          silent: false,
        });
        notifiedAlertIds.current.push(alert.id);
      });
      return;
    }

    const current = weatherData.current;
    new Notification(`Weather update for ${weatherData.location.name}`, {
      body: `${current.conditionText}, ${formatTemp(current.temperature, tempUnit)} • Humidity ${current.humidity}%`,
      silent: true,
    });
  }, [
    weatherData,
    notificationsEnabled,
    tempUnit,
    weatherData?.location?.name,
  ]);

  const t = (key: keyof typeof translations.en): string => {
    const dict = translations[language] || translations.en;
    return (dict as any)[key] || (translations.en as any)[key] || key;
  };

  return (
    <WeatherContext.Provider
      value={{
        location,
        weatherData,
        isLoading,
        isError,
        errorMsg,
        tempUnit,
        speedUnit,
        pressureUnit,
        themePreset,
        isDarkMode,
        language,
        favorites,
        recentSearches,
        t,
        setLocation,
        setTempUnit: changeTempUnit,
        setSpeedUnit: changeSpeedUnit,
        setPressureUnit: changePressureUnit,
        setThemePreset: changeThemePreset,
        setDarkMode: changeDarkMode,
        setLanguage: changeLanguage,
        setNotificationsEnabled: changeNotificationsEnabled,
        toggleFavorite,
        isFavorite,
        refreshWeather,
        useGPSLocation,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather must be used within a WeatherProvider");
  return ctx;
};
