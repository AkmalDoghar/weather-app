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
  notificationIntervalHours: number;
  lastNotificationTime: number | null;
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
  setNotificationIntervalHours: (hours: number) => void;
  sendManualNotification: () => void;
  toggleFavorite: (loc: LocationData) => void;
  isFavorite: (id: string | number) => boolean;
  refreshWeather: () => void;
  useGPSLocation: () => void;
  isAppInstalled: boolean;
  triggerInstallApp: () => void;
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
  const [notificationIntervalHours, setNotificationIntervalHoursState] =
    useState<number>(24);
  const [lastNotificationTime, setLastNotificationTime] = useState<
    number | null
  >(null);
  const [favorites, setFavorites] = useState<LocationData[]>([]);
  const [recentSearches, setRecentSearches] = useState<LocationData[]>([]);
  const notifiedAlertIds = React.useRef<string[]>([]);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);

  // PWA install prompt handler
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const triggerInstallApp = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const choice = await installPrompt.userChoice;
        if (choice && choice.outcome === "accepted") {
          setIsAppInstalled(true);
          setInstallPrompt(null);
        }
      } catch (e) {
        console.warn("Install prompt error:", e);
      }
    } else {
      if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        window.open("https://skyplusweather.vercel.app/", "_blank");
      }
    }
  };

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

      const savedInterval = localStorage.getItem(
        "weatherx_notification_interval",
      );
      if (savedInterval)
        setNotificationIntervalHoursState(parseInt(savedInterval, 10) || 24);

      const savedLastTime = localStorage.getItem(
        "weatherx_last_notification_time",
      );
      if (savedLastTime)
        setLastNotificationTime(parseInt(savedLastTime, 10));

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

  // Auto GPS & Location permission listener for automatic weather updates
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;

    const requestGPSAndFetchWeather = () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const loc = await reverseGeocode(latitude, longitude);
            if (loc && loc.name) {
              setLocation(loc);
            }
          } catch (e) {
            console.error("GPS reverse geocode error", e);
          }
        },
        (err) => console.log("GPS permission status:", err.code, err.message),
        { timeout: 15000, maximumAge: 0, enableHighAccuracy: false }
      );
    };

    // Trigger permission prompt on app load
    requestGPSAndFetchWeather();

    // Automatically trigger update when user enables location in phone/browser settings
    if (typeof navigator !== "undefined" && navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((permissionStatus) => {
          permissionStatus.onchange = () => {
            if (permissionStatus.state === "granted") {
              requestGPSAndFetchWeather();
            }
          };
        })
        .catch(() => {});
    }
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

  const changeNotificationInterval = (hours: number) => {
    setNotificationIntervalHoursState(hours);
    localStorage.setItem("weatherx_notification_interval", hours.toString());
  };

  const triggerWeatherNotification = async (customMessage?: string) => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    if (!weatherData) return;

    const current = weatherData.current;
    const tempStr = formatTemp(current.temperature, tempUnit);
    const title = `🌤️ Weather Update: ${weatherData.location.name}`;
    const bodyText = customMessage
      ? customMessage
      : `${current.conditionText} • ${tempStr} (Feels ${formatTemp(current.feelsLike, tempUnit)}). Rain chance: ${current.rainChance}%.`;

    const options: NotificationOptions = {
      body: bodyText,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "weather-update",
    };

    try {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && "showNotification" in reg) {
          await reg.showNotification(title, options);
          setLastNotificationTime(Date.now());
          localStorage.setItem("weatherx_last_notification_time", Date.now().toString());
          return;
        }
      }
      new Notification(title, options);
    } catch (e) {
      console.warn("Native Notification call failed on mobile browser:", e);
    }

    const now = Date.now();
    setLastNotificationTime(now);
    localStorage.setItem("weatherx_last_notification_time", now.toString());
  };

  const changeNotificationsEnabled = async (enabled: boolean) => {
    if (!enabled) {
      setNotificationsEnabledState(false);
      localStorage.setItem("weatherx_notifications_enabled", "false");
      return;
    }

    if (typeof window === "undefined") return;

    if (!("Notification" in window)) {
      alert("Mobile Notice: Web Notifications are not supported in this browser tab. On iPhone, add this app to your Home Screen first.");
      setNotificationsEnabledState(false);
      return;
    }

    let perm: NotificationPermission = Notification.permission;
    if (perm === "default") {
      try {
        perm = await new Promise<NotificationPermission>((resolve) => {
          const res = Notification.requestPermission((p) => resolve(p));
          if (res && typeof (res as any).then === "function") {
            (res as any).then(resolve);
          }
        });
      } catch (e) {
        console.warn("Request permission error:", e);
      }
    }

    if (perm !== "granted") {
      alert("Notification Permission Denied! Please allow notifications in your browser/mobile site settings.");
      setNotificationsEnabledState(false);
      localStorage.setItem("weatherx_notifications_enabled", "false");
      return;
    }

    setNotificationsEnabledState(true);
    localStorage.setItem("weatherx_notifications_enabled", "true");

    if (weatherData) {
      await triggerWeatherNotification(
        "Weather notifications activated! Scheduled every " + notificationIntervalHours + " hours."
      );
    }
  };

  const sendManualNotification = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Web Notifications are not supported in this browser window.");
      return;
    }

    if (Notification.permission !== "granted") {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        alert("Please enable notification permissions in your browser settings first.");
        return;
      }
    }
    await triggerWeatherNotification("Test Notification: Mobile & Desktop weather alerts are active!");
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

  // Background Periodic Notification Scheduler
  useEffect(() => {
    if (!notificationsEnabled || typeof window === "undefined" || !weatherData)
      return;
    if (!("Notification" in window) || Notification.permission !== "granted")
      return;

    const checkAndTrigger = () => {
      const now = Date.now();
      const intervalMs = notificationIntervalHours * 60 * 60 * 1000;
      if (!lastNotificationTime || now - lastNotificationTime >= intervalMs) {
        triggerWeatherNotification();
      }
    };

    checkAndTrigger();
    const intervalTimer = setInterval(checkAndTrigger, 60000); // Check every minute
    return () => clearInterval(intervalTimer);
  }, [
    notificationsEnabled,
    weatherData,
    notificationIntervalHours,
    lastNotificationTime,
    tempUnit,
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
        notificationsEnabled,
        notificationIntervalHours,
        lastNotificationTime,
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
        setNotificationIntervalHours: changeNotificationInterval,
        sendManualNotification,
        toggleFavorite,
        isFavorite,
        refreshWeather,
        useGPSLocation,
        isAppInstalled,
        triggerInstallApp,
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
