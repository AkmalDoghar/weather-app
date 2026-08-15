"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "@/context/WeatherContext";
import { formatTemp } from "@/lib/utils";
import { X, Send, Sparkles, Loader2, Trash2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

function getAIResponse(
  query: string,
  context: string,
  locationName: string,
): string {
  const q = query.toLowerCase();
  const city = locationName || "your city";
  const cityMatches = [
    "lahore",
    "karachi",
    "islamabad",
    "rawalpindi",
    "multan",
    "peshawar",
    "faisalabad",
    "quetta",
    "sialkot",
    "gujranwala",
    "bahawalpur",
  ];
  const askedCity = cityMatches.find((item) => q.includes(item));

  if (askedCity && askedCity !== city.toLowerCase()) {
    return `Aap ${askedCity.charAt(0).toUpperCase() + askedCity.slice(1)} ka weather pooch rahe hain, lekin current app data ${city} par based hai.\n\n📍 Current city: ${city}\n🌡️ Weather summary: ${context}\n\nAgar aap us city ka exact weather check karna chahte hain, to header mein city search se us city ko select karen.`;
  }

  if (
    /^(hi|hello|salam|assalam|hey|yo|aoa|hy|hlo|hey there|hello there)/.test(q)
  ) {
    return `Assalam o Alaikum! 👋 Main WeatherX AI hoon.\n\n📍 ${city}\n🌡️ Current weather: ${context}\n\nMain aapko ye samjha sakta hoon:\n• 🌡️ Temperature aur feels-like\n• 🌧️ Baarish / rain chance\n• 👕 Kya pehnna chahiye\n• 🏃 Best time bahar jane ka\n• 🌬️ Wind, humidity aur AQI\n\nKoi bhi weather ka sawal poochiye.`;
  }

  if (
    /(umbrella|barish hogi|baarish hogi|rain|rain chance|baadal|storm|thunder|lightning|smog|weather alert)/.test(
      q,
    )
  ) {
    return `Weather risk summary:\n\n📍 ${city}\n🌡️ ${context}\n\n🌂 Agar rain chance 40% se zyada ho, to umbrella ya light waterproof layer lena behtar hai.\n⚠️ Heavy rain ya storm ke case mein best time bahar jane ka avoid karna chahiye.\n📅 Forecast page se next hours check karen.`;
  }

  if (
    /(wear|outfit|clothes|kapre|pehnna|pehno|dress|libaas|what to wear|kya pehn|kya pehna chahiye)/.test(
      q,
    )
  ) {
    return `Aaj ke mausam ke hisaab se outfit recommendation:\n\n🌡️ ${context}\n\n👗 Agar temperature comfortable hai to breathable cotton clothes ideal hain.\n🧥 Agar humidity ya cool breeze ho to light jacket ya sweater useful ho sakta hai.\n☔ Agar rain chance high ho to waterproof layer choose karen.\n📌 Outfit Advisor card se detailed suggestion dekhen.`;
  }

  if (
    /(run|walk|exercise|cricket|cycling|picnic|travel|safar|khelna|sport|outdoor|bahar jana|go outside)/.test(
      q,
    )
  ) {
    return `Outdoor activity ke liye best guidance:\n\n${context}\n\n🎯 Agar rain chance low aur temperature normal ho, to walking, cycling, picnic, aur light travel best hain.\n🚫 Agar heavy rain, high wind, ya extreme heat ho, to outside activity avoid karen.\n🧭 Activity Advisor card check karen for specific recommendations.`;
  }

  if (
    /(best time|kab jaen|kab bahar|when to go|waqt|time|best time to go|best window)/.test(
      q,
    )
  ) {
    return `Best time to go outside:\n\n${context}\n\n⏰ Generally subah ya shaam ka waqt more comfortable hota hai jab temperature balanced aur rain chance kam hota hai.\n📌 Best Time to Go Outside card ko dekhen.`;
  }

  if (
    /(temperature|garmi|sardi|thanda|garam|hot|cold|feels like|kitni garmi|kitni sardi|degree)/.test(
      q,
    )
  ) {
    return `Current comfort level:\n\n🌡️ ${context}\n\nAgar temperature high hai to hydration zaroor rakhen, light clothes pehnain, aur shade / indoor breaks lein.\n💧 Agar cool hai to light jacket ya warm layer useful ho sakti hai.`;
  }

  if (
    /(wind|hawa|humidity|humid|uv|sun|sunlight|visibility|pressure|air quality|aqi|pollution)/.test(
      q,
    )
  ) {
    return `Weather detail summary:\n\n📍 ${city}\n🌡️ ${context}\n\n💨 Wind aur humidity ka combination comfort ko influence karta hai.\n☀️ UV aur outdoor heat exposure ko consider karen.\n🌿 AQI aur pollution se bhi daily plans change hote hain.`;
  }

  if (/(sunrise|sunset|subah|shaam|dhoop|night|raat|andhera)/.test(q)) {
    return `Sun timing ke basis par recommendation:\n\n📍 ${city}\n🌡️ ${context}\n\n☀️ Sunrise aur sunset timings ko follow karke outdoor plans better bana sakte hain.\n🌤️ Subah aur shaam usually more comfortable hote hain agar temperature moderate ho.`;
  }

  if (
    /(forecast|kal|tomorrow|next day|aage|upcoming|future|next hours)/.test(q)
  ) {
    return `Upcoming forecast insight:\n\n📍 ${city}\n🌡️ ${context}\n\n📅 Forecast page par kal aur next hours ka rain, temperature aur conditions dekhna behtar hai.\n🧠 Weather Intelligence section aapko quick summary dega.`;
  }

  if (
    /(mausam|mosam|weather|aaj|today|kesa|kaisa|how is|weather today)/.test(q)
  ) {
    return `Aaj ka weather summary:\n\n📍 ${city}\n🌡️ ${context}\n\nAaj ka scenario ${context.toLowerCase().includes("rain") || context.toLowerCase().includes("cloud") ? "rain-prone aur variable hai" : "overall steady aur manageable hai"} .\n\nAap pooch sakte hain:\n• "Kab bahar jana chahiye?"\n• "Kya pehnna chahiye?"\n• "Baarish hogi?"\n• "AQI kaisa hai?"\n• "Kal ka forecast kya hai?"`;
  }

  return `Aaj ${city} ka weather summary:\n\n🌡️ ${context}\n\nMain weather se related sawalon ka jawab de sakta hoon, jaise:\n• 🌧️ Baarish, rain chance aur storm risk\n• 👕 Outfit aur layering advice\n• 🏃 Best time for outdoor activities\n• 🌬️ Wind, humidity aur AQI\n• 📅 Upcoming forecast\n\nAap koi bhi weather ka sawal poochiye.`;
}

export const AIAssistant: React.FC = () => {
  const { weatherData, tempUnit, isDarkMode } = useWeather();
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [panelPos, setPanelPos] = useState({ x: 0, y: 0 });
  const dragOrigin = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  const dragMovedRef = useRef(false);
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "default",
      title: "Weather chat",
      messages: [
        {
          role: "assistant",
          text: "Hi! I'm Sky Plus 🌤️ Ask me anything about today's weather — should you go outside? What to wear? Will it rain? I'm here to help!",
          timestamp: Date.now(),
        },
      ],
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState("default");
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const activeSession =
    sessions.find((session) => session.id === activeSessionId) ?? sessions[0];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages.length, open]);

  useEffect(() => {
    const updateInitialPos = () => {
      setPanelPos({
        x: Math.max(window.innerWidth - 440, 16),
        y: Math.max(window.innerHeight - 520, 16),
      });
    };

    updateInitialPos();
    window.addEventListener("resize", updateInitialPos);

    return () => window.removeEventListener("resize", updateInitialPos);
  }, []);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (!dragging) return;

      const deltaX = Math.abs(event.clientX - dragOrigin.current.x);
      const deltaY = Math.abs(event.clientY - dragOrigin.current.y);
      if (deltaX > 6 || deltaY > 6) {
        dragMovedRef.current = true;
      }

      const nextX = Math.min(
        Math.max(
          dragOrigin.current.startX + (event.clientX - dragOrigin.current.x),
          12,
        ),
        Math.max(12, window.innerWidth - 430),
      );
      const nextY = Math.min(
        Math.max(
          dragOrigin.current.startY + (event.clientY - dragOrigin.current.y),
          12,
        ),
        Math.max(12, window.innerHeight - 520),
      );

      setPanelPos({ x: nextX, y: nextY });
    };

    const handleUp = () => {
      if (!dragging) return;
      if (!dragMovedRef.current) {
        setOpen((prev) => !prev);
      }
      dragMovedRef.current = false;
      setDragging(false);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [dragging]);

  function buildContext() {
    if (!weatherData?.current) return "weather data loading...";
    const c = weatherData.current;
    return `${c.conditionText}, ${formatTemp(c.temperature, tempUnit)}, humidity ${c.humidity}%, rain chance ${c.rainChance}%`;
  }

  function createSession(title = "New chat") {
    const newId = `${Date.now()}`;
    const session: ChatSession = { id: newId, title, messages: [] };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(newId);
  }

  function deleteSession(sessionId: string) {
    setSessions((prev) => {
      const filtered = prev.filter((session) => session.id !== sessionId);

      if (filtered.length === 0) {
        const fallbackSession: ChatSession = {
          id: "default",
          title: "Weather chat",
          messages: [
            {
              role: "assistant",
              text: "Hi! I'm Sky Plus 🌤️ Ask me anything about today's weather — should you go outside? What to wear? Will it rain? I'm here to help!",
              timestamp: Date.now(),
            },
          ],
        };
        setActiveSessionId(fallbackSession.id);
        return [fallbackSession];
      }

      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered[0].id);
      }

      return filtered;
    });
  }

  function updateSession(
    sessionId: string,
    updater: (messages: Message[]) => Message[],
  ) {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: updater(session.messages),
              title: session.messages.length === 0 ? "New chat" : session.title,
            }
          : session,
      ),
    );
  }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || thinking || !activeSession) return;

    const userMsg: Message = {
      role: "user",
      text: trimmed,
      timestamp: Date.now(),
    };
    setInput("");
    setThinking(true);

    updateSession(activeSession.id, (messages) => [...messages, userMsg]);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const reply = getAIResponse(
      trimmed,
      buildContext(),
      weatherData?.location?.name ?? "Your city",
    );
    const assistantMsg: Message = {
      role: "assistant",
      text: reply,
      timestamp: Date.now(),
    };

    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeSession.id
          ? {
              ...session,
              title:
                session.title === "New chat" && trimmed.length > 0
                  ? trimmed.slice(0, 24) + (trimmed.length > 24 ? "..." : "")
                  : session.title,
              messages: [...session.messages, assistantMsg],
            }
          : session,
      ),
    );

    setThinking(false);
  }

  const chatPanelStyle = {
    left: panelPos.x,
    top: panelPos.y,
  };

  const handleDragStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragMovedRef.current = false;
    dragOrigin.current = {
      x: event.clientX,
      y: event.clientY,
      startX: panelPos.x,
      startY: panelPos.y,
    };
    setDragging(true);
  };

  const launcherStyle = {
    left: panelPos.x + 360,
    top: panelPos.y + 272 + 30,
    right: "auto",
    bottom: "auto",
  };

  const WeatherBrandMark = ({ className = "" }: { className?: string }) => (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="rgba(255,255,255,0.14)"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="2"
      />
      <circle cx="22" cy="22" r="9" fill="#FEE27A" />
      <path
        d="M24 38.5C17.5 38.5 12.5 33.7 12.5 27.5C12.5 21.6 16.8 17 22.4 17C26.1 17 29.5 18.9 31.6 22.1C33.8 20.9 36.7 20.4 39.4 21.2C43.4 22.2 46.6 25.9 46.6 30.2C46.6 35.2 42.3 39.1 36.9 39.1H24Z"
        fill="white"
        fillOpacity="0.92"
      />
      <path
        d="M19 47C21.5 44.6 25.6 43.4 29.8 43.5C34.9 43.6 39.7 46.2 42 50"
        stroke="white"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <>
      {/* --- FAB Button --- */}
      {/* Desktop: draggable positional button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onPointerDown={handleDragStart}
        className="fixed z-[70] w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-2xl shadow-sky-500/40 flex items-center justify-center border border-white/20 transition-all cursor-grab active:cursor-grabbing hidden sm:flex"
        style={launcherStyle}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="brand"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <WeatherBrandMark className="w-8 h-8" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile: fixed bottom-right above BottomNav */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((prev) => !prev)}
        className={`fixed z-[70] w-13 h-13 right-4 bottom-24 w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-2xl shadow-sky-500/40 flex items-center justify-center border border-white/20 sm:hidden transition-all ${open ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"}`}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x2" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-5 h-5 text-white" />
            </motion.div>
          ) : (
            <motion.div key="brand2" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <WeatherBrandMark className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* --- Desktop Chat Panel (draggable) --- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`fixed z-[60] w-[92vw] max-w-[420px] sm:w-[440px] rounded-3xl overflow-hidden shadow-2xl border hidden sm:flex flex-col ${
              isDarkMode
                ? "bg-slate-900/95 border-white/15"
                : "bg-white/95 border-black/10"
            } backdrop-blur-2xl`}
            style={{ ...chatPanelStyle, maxHeight: "68vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-gradient-to-r from-sky-600 to-indigo-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden">
                  <WeatherBrandMark className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-black text-white text-sm">Sky Plus</div>
                  <div className="text-[10px] text-sky-100/80 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Weather assistant
                  </div>
                </div>
              </div>
              <button
                onClick={() => createSession("New chat")}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 text-white text-[10px] font-semibold border border-white/15 hover:bg-white/15 transition-all"
              >
                New chat
              </button>
            </div>

            {/* Sessions */}
            <div className="border-b border-white/10 px-3 py-2 bg-slate-950/10">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setActiveSessionId(session.id)}
                      className={`rounded-xl px-2.5 py-1.5 text-[10px] font-semibold transition-all ${
                        activeSessionId === session.id
                          ? "bg-sky-500 text-white"
                          : isDarkMode
                            ? "bg-white/5 text-white/80 hover:bg-white/10"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {session.title}
                    </button>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className={`rounded-lg p-1.5 transition-all ${
                        isDarkMode
                          ? "text-white/60 hover:bg-white/5 hover:text-white"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      }`}
                      aria-label={`Delete ${session.title}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(activeSession?.messages ?? []).map((msg, i) => (
                <motion.div
                  key={`${msg.timestamp}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                      <WeatherBrandMark className="w-5 h-5" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-sky-500 text-white rounded-tr-sm font-medium"
                      : isDarkMode
                        ? "bg-white/10 text-white/90 border border-white/10 rounded-tl-sm"
                        : "bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {thinking && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <WeatherBrandMark className="w-5 h-5" />
                  </div>
                  <div className={`px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-xs ${isDarkMode ? "bg-white/10 border border-white/10" : "bg-slate-100 border border-slate-200"}`}>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-500" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className={`flex items-center gap-2 px-4 py-3 border-t ${isDarkMode ? "border-white/10" : "border-black/10"}`}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about weather..."
                className={`flex-1 bg-transparent text-sm outline-none ${isDarkMode ? "text-white placeholder-white/40" : "text-slate-900 placeholder-slate-400"}`}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || thinking}
                className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center disabled:opacity-40 transition-all hover:bg-sky-600 flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Mobile Bottom Sheet Panel --- */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[63] bg-black/50 backdrop-blur-sm sm:hidden"
            />
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 35 }}
              className={`fixed z-[64] inset-x-0 bottom-0 flex flex-col rounded-t-3xl border-t overflow-hidden sm:hidden ${
                isDarkMode
                  ? "bg-slate-900 border-white/15"
                  : "bg-white border-slate-200"
              }`}
              style={{ height: "calc(100dvh - 88px)" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-2.5 pb-1">
                <div className={`w-10 h-1 rounded-full ${isDarkMode ? "bg-white/25" : "bg-slate-300"}`} />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/10 bg-gradient-to-r from-sky-600 to-indigo-600">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden">
                    <WeatherBrandMark className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-black text-white text-sm">Sky Plus</div>
                    <div className="text-[10px] text-sky-100/80 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Weather AI
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => createSession("New chat")}
                    className="px-2.5 py-1.5 rounded-xl bg-white/10 text-white text-[10px] font-semibold border border-white/15"
                  >
                    New chat
                  </button>
                  <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Sessions */}
              <div className="border-b border-white/10 px-3 py-2">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setActiveSessionId(session.id)}
                        className={`rounded-xl px-2.5 py-1.5 text-[10px] font-semibold transition-all ${
                          activeSessionId === session.id
                            ? "bg-sky-500 text-white"
                            : isDarkMode
                              ? "bg-white/5 text-white/80"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {session.title}
                      </button>
                      <button onClick={() => deleteSession(session.id)} className="rounded-lg p-1 text-white/50">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
                {(activeSession?.messages ?? []).map((msg, i) => (
                  <motion.div
                    key={`m-${msg.timestamp}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                        <WeatherBrandMark className="w-5 h-5" />
                      </div>
                    )}
                    <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-sky-500 text-white rounded-tr-sm font-medium"
                        : isDarkMode
                          ? "bg-white/10 text-white/90 border border-white/10 rounded-tl-sm"
                          : "bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {thinking && (
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <WeatherBrandMark className="w-5 h-5" />
                    </div>
                    <div className={`px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-xs ${isDarkMode ? "bg-white/10 border border-white/10" : "bg-slate-100 border border-slate-200"}`}>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-500" />
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <div className={`flex items-center gap-2 px-4 py-3 border-t pb-safe ${isDarkMode ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"}`}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Weather ke baare mein poochiye..."
                  className={`flex-1 bg-transparent text-sm outline-none ${isDarkMode ? "text-white placeholder-white/40" : "text-slate-900 placeholder-slate-400"}`}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || thinking}
                  className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center disabled:opacity-40 transition-all hover:bg-sky-600 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

