import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Monitor,
  Smartphone,
  Tv,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Send,
  Settings,
  ShieldCheck,
  Globe,
  Radio,
  Clock,
  Sparkles,
  ChevronRight,
  Terminal,
} from "lucide-react";
import { SessionCard, SystemConfig } from "@/types";

export default function Dashboard() {
  const [card, setCard] = useState<SessionCard | null>(null);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"card" | "simulator" | "config">("card");

  // Config editor state
  const [adminSecret, setAdminSecret] = useState("admin123");
  const [editRegion, setEditRegion] = useState("");
  const [editPlan, setEditPlan] = useState("");
  const [editDuration, setEditDuration] = useState(48);
  const [editPcUrl, setEditPcUrl] = useState("");
  const [editMobileUrl, setEditMobileUrl] = useState("");
  const [editTvUrl, setEditTvUrl] = useState("");
  const [editChannelUrl, setEditChannelUrl] = useState("");
  const [configSaveMsg, setConfigSaveMsg] = useState("");

  // Telegram Simulator State
  const [chatLog, setChatLog] = useState<
    Array<{ sender: "user" | "bot"; text: string; keyboard?: boolean; timestamp: string }>
  >([]);
  const [simInput, setSimInput] = useState("");

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cardRes, configRes] = await Promise.all([
        fetch("/api/card"),
        fetch("/api/config"),
      ]);

      const cardData = await cardRes.json();
      const configData = await configRes.json();

      if (cardData.card) {
        setCard(cardData.card);
      }
      if (configData.config) {
        setConfig(configData.config);
        setEditRegion(configData.config.defaultRegion);
        setEditPlan(configData.config.defaultPlan);
        setEditDuration(configData.config.sessionDurationHours);
        setEditPcUrl(configData.config.devices.pc.targetUrl);
        setEditMobileUrl(configData.config.devices.mobile.targetUrl);
        setEditTvUrl(configData.config.devices.tv.targetUrl);
        setEditChannelUrl(configData.config.channelUrl);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!card?.expiresAt) return;
    const interval = setInterval(() => {
      const diff = new Date(card.expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${mins}m ${secs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [card]);

  // Initial simulator conversation
  useEffect(() => {
    if (chatLog.length === 0 && card) {
      setChatLog([
        { sender: "user", text: "/start", timestamp: "12:00 PM" },
        {
          sender: "bot",
          text: `<b>✅ ${card.statusHeading}</b>\n\n📍 <b>Region:</b> <code>${card.region}</code>\n💎 <b>Plan:</b> <code>${card.plan}</code>\n⏳ <b>Expiration:</b> <code>${new Date(card.expiresAt).toUTCString()}</code>\n\n👇 <b>Please select your device to proceed:</b>`,
          keyboard: true,
          timestamp: "12:00 PM",
        },
      ]);
    }
  }, [card]);

  const handleRefreshCard = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "web_guest_user" }),
      });
      const data = await res.json();
      if (data.card) {
        setCard(data.card);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCard = () => {
    if (!card) return;
    const copyText = `✅ ${card.statusHeading}\n\n📍 Region: ${card.region}\n💎 Plan: ${card.plan}\n⏳ Expiration: ${card.expiresAt}\n\nDevice links:\nPC: ${card.deviceLinks.pc}\nMobile: ${card.deviceLinks.mobile}\nTV: ${card.deviceLinks.tv}`;
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSaveMsg("Saving...");
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          channelUrl: editChannelUrl,
          defaultRegion: editRegion,
          defaultPlan: editPlan,
          sessionDurationHours: Number(editDuration),
          devices: {
            pc: { targetUrl: editPcUrl },
            mobile: { targetUrl: editMobileUrl },
            tv: { targetUrl: editTvUrl },
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setConfigSaveMsg("✅ Configuration saved! Both Web and Bot updated.");
        fetchData();
      } else {
        setConfigSaveMsg(`❌ ${data.error || "Failed to update configuration"}`);
      }
    } catch (e) {
      setConfigSaveMsg("❌ Network error saving configuration");
    }
  };

  const handleSendSimulator = (cmd: string) => {
    const input = cmd.trim();
    if (!input) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newLogs = [...chatLog, { sender: "user" as const, text: input, timestamp: time }];

    if (input === "/start" || input === "/status") {
      newLogs.push({
        sender: "bot",
        text: `<b>✅ ${card?.statusHeading || "Success! Your access pass is active"}</b>\n\n📍 <b>Region:</b> <code>${card?.region || "Australia (AU)"}</code>\n💎 <b>Plan:</b> <code>${card?.plan || "Premium Ultra HD (4K)"}</code>\n⏳ <b>Expiration:</b> <code>${card?.expiresAt ? new Date(card.expiresAt).toUTCString() : "Active"}</code>\n\n👇 <b>Please select your device to proceed:</b>`,
        keyboard: true,
        timestamp: time,
      });
    } else if (input === "/refresh") {
      newLogs.push({
        sender: "bot",
        text: `🔄 <b>Pass Refreshed!</b>\n\n<b>✅ ${card?.statusHeading}</b>\n\n📍 <b>Region:</b> <code>${card?.region}</code>\n💎 <b>Plan:</b> <code>${card?.plan}</code>\n⏳ <b>Expiration:</b> <code>Refreshed for 48h</code>`,
        keyboard: true,
        timestamp: time,
      });
    } else if (input === "/help") {
      newLogs.push({
        sender: "bot",
        text: `<b>🤖 Aus Clone Bot Commands:</b>\n\n• /start — Retrieve access card\n• /status — Check active pass details\n• /refresh — Force fresh pass\n• /help — Show help message`,
        keyboard: false,
        timestamp: time,
      });
    } else {
      newLogs.push({
        sender: "bot",
        text: `❓ Unrecognized command. Send <code>/start</code> to view your login card or <code>/help</code> for details.`,
        keyboard: false,
        timestamp: time,
      });
    }

    setChatLog(newLogs);
    setSimInput("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Head>
        <title>Aus Clone Bot — Companion Dashboard</title>
      </Head>

      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">
              AC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white">Aus Clone Bot</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  Active V1.0
                </span>
              </div>
              <p className="text-xs text-slate-400">Telegram Utility Bot &amp; Companion Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab("card")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === "card"
                  ? "bg-sky-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Pass Card
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === "simulator"
                  ? "bg-sky-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Bot Simulator
            </button>
            <button
              onClick={() => setActiveTab("config")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === "config"
                  ? "bg-sky-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Admin Config
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 flex flex-col gap-8">
        {/* TAB 1: PASS CARD */}
        {activeTab === "card" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Reconstructed Result Card */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sky-400" /> Reconstructed Utility Pass Card
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Mirrors the reference Telegram bot's observed layout. Powered by shared business logic.
                </p>
              </div>

              {/* The Visual Card */}
              <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Card Header */}
                <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-white">
                        {card?.statusHeading || "Success! Your access pass is active"}
                      </h3>
                      <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Status: Active &amp; Verified
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleRefreshCard}
                    disabled={loading}
                    title="Refresh Card"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {/* Card Fields */}
                <div className="py-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-xs text-slate-400 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-sky-400" /> Region:
                    </span>
                    <span className="text-sm font-semibold text-white font-mono bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                      {card?.region || "Australia (AU)"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-xs text-slate-400 flex items-center gap-2">
                      <Radio className="w-4 h-4 text-purple-400" /> Subscription Plan:
                    </span>
                    <span className="text-sm font-semibold text-purple-300 font-mono bg-purple-950/40 px-2.5 py-1 rounded-md border border-purple-800/40">
                      {card?.plan || "Premium Ultra HD (4K)"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-xs text-slate-400 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" /> Expiration:
                    </span>
                    <div className="text-right">
                      <div className="text-xs font-mono text-slate-200">
                        {card?.expiresAt ? new Date(card.expiresAt).toUTCString() : "Loading..."}
                      </div>
                      <div className="text-[11px] font-medium text-amber-400 mt-0.5">
                        {timeLeft ? `Expires in ${timeLeft}` : ""}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Device Selector Prompt */}
                <div className="pt-2 pb-4">
                  <div className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-3">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400" /> Please select your device to proceed:
                  </div>

                  {/* Device Buttons Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <Link
                      href={card?.deviceLinks.pc || "/preview/pc"}
                      className="py-3 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition shadow-lg shadow-sky-600/20 text-center"
                    >
                      <Monitor className="w-4 h-4" />
                      <span>Login PC</span>
                    </Link>

                    <Link
                      href={card?.deviceLinks.mobile || "/preview/mobile"}
                      className="py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-600/20 text-center"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Login Mobile</span>
                    </Link>

                    <Link
                      href={card?.deviceLinks.tv || "/preview/tv"}
                      className="py-3 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition shadow-lg shadow-purple-600/20 text-center"
                    >
                      <Tv className="w-4 h-4" />
                      <span>Login TV</span>
                    </Link>
                  </div>

                  {/* Channel Subscription Button */}
                  <div className="mt-3">
                    <a
                      href={card?.channelUrl || config?.channelUrl || "https://t.me/aus_updates"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                      <span>📢 Subscribe Channel</span>
                    </a>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px]">ID: {card?.id?.slice(0, 13)}...</span>
                  <button
                    onClick={handleCopyCard}
                    className="flex items-center gap-1 text-slate-300 hover:text-white transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy Raw Card"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Portal Portfolios & Quick Launchers */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-white">Device Destination Portals</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Preview the verified device destination interfaces currently bound to the bot.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Link
                  href="/preview/pc"
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20 group-hover:scale-105 transition">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">PC Streaming Portal</div>
                      <div className="text-xs text-slate-400">Ultra HD Web player preview</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                </Link>

                <Link
                  href="/preview/mobile"
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">Mobile Launch Gateway</div>
                      <div className="text-xs text-slate-400">Smartphone deep-link &amp; QR pair</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                </Link>

                <Link
                  href="/preview/tv"
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-105 transition">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">Smart TV Activation</div>
                      <div className="text-xs text-slate-400">6-character TV pairing gateway</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                </Link>
              </div>

              {/* Status Box */}
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Operational Policy
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Aus Clone Bot operates as an authorized utility pass generator. It does not harvest
                  third-party passwords, cookies, or session tokens. Device destination URLs are fully
                  configurable via the Admin Config tab.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TELEGRAM BOT SIMULATOR */}
        {activeTab === "simulator" && (
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-sky-400" /> Telegram Bot Interactive Simulator
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Test the Telegram bot commands directly in your browser. Buttons and formatting execute identical code.
              </p>
            </div>

            {/* Chat Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl h-[520px] flex flex-col overflow-hidden shadow-2xl">
              {/* Chat Header */}
              <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/40">
                    AC
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Aus Clone Bot</div>
                    <div className="text-[10px] text-emerald-400">bot • online</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => handleSendSimulator("/start")}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[11px] text-slate-200"
                  >
                    /start
                  </button>
                  <button
                    onClick={() => handleSendSimulator("/status")}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[11px] text-slate-200"
                  >
                    /status
                  </button>
                  <button
                    onClick={() => handleSendSimulator("/refresh")}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[11px] text-slate-200"
                  >
                    /refresh
                  </button>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
                {chatLog.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs ${
                        msg.sender === "user"
                          ? "bg-sky-600 text-white rounded-br-none"
                          : "bg-slate-800 border border-slate-700/80 text-slate-200 rounded-bl-none shadow"
                      }`}
                    >
                      <div
                        className="whitespace-pre-wrap leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      />

                      {/* Inline Keyboard Simulation */}
                      {msg.keyboard && card && (
                        <div className="mt-4 pt-3 border-t border-slate-700/80 flex flex-col gap-2">
                          <div className="grid grid-cols-3 gap-1.5">
                            <Link
                              href={card.deviceLinks.pc || "/preview/pc"}
                              className="py-2 bg-slate-700 hover:bg-slate-600 text-sky-300 text-center rounded-lg font-medium text-[11px] transition"
                            >
                              🖥️ Login PC
                            </Link>
                            <Link
                              href={card.deviceLinks.mobile || "/preview/mobile"}
                              className="py-2 bg-slate-700 hover:bg-slate-600 text-emerald-300 text-center rounded-lg font-medium text-[11px] transition"
                            >
                              📱 Login Mobile
                            </Link>
                            <Link
                              href={card.deviceLinks.tv || "/preview/tv"}
                              className="py-2 bg-slate-700 hover:bg-slate-600 text-purple-300 text-center rounded-lg font-medium text-[11px] transition"
                            >
                              📺 Login TV
                            </Link>
                          </div>
                          <a
                            href={card.channelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-center rounded-lg font-medium text-[11px] transition"
                          >
                            📢 Subscribe Channel
                          </a>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendSimulator(simInput);
                }}
                className="p-3 bg-slate-800/80 border-t border-slate-700 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={simInput}
                  onChange={(e) => setSimInput(e.target.value)}
                  placeholder="Type a command (/start, /refresh, /help)..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: ADMIN CONFIGURATION */}
        {activeTab === "config" && (
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-sky-400" /> Utility &amp; Destination URL Configuration
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Customize destination URLs for PC, Mobile, and TV device buttons, and set default parameters.
              </p>
            </div>

            <form
              onSubmit={handleSaveConfig}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl"
            >
              {configSaveMsg && (
                <div className="p-3 bg-slate-800 border border-slate-700 text-xs rounded-xl font-medium text-white">
                  {configSaveMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Default Region
                  </label>
                  <input
                    type="text"
                    value={editRegion}
                    onChange={(e) => setEditRegion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-500"
                    placeholder="e.g. Australia (AU)"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Default Plan
                  </label>
                  <input
                    type="text"
                    value={editPlan}
                    onChange={(e) => setEditPlan(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-500"
                    placeholder="e.g. Premium Ultra HD (4K)"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Session Expiration Duration (Hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={720}
                  value={editDuration}
                  onChange={(e) => setEditDuration(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="border-t border-slate-800 pt-4 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  Device Destinations (Observable URLs)
                </h4>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    PC Destination URL (Login PC Button)
                  </label>
                  <input
                    type="url"
                    value={editPcUrl}
                    onChange={(e) => setEditPcUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-sky-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Mobile Destination URL (Login Mobile Button)
                  </label>
                  <input
                    type="url"
                    value={editMobileUrl}
                    onChange={(e) => setEditMobileUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-sky-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    TV Destination URL (Login TV Button)
                  </label>
                  <input
                    type="url"
                    value={editTvUrl}
                    onChange={(e) => setEditTvUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-sky-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Telegram Channel URL (Subscribe Channel Button)
                  </label>
                  <input
                    type="url"
                    value={editChannelUrl}
                    onChange={(e) => setEditChannelUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-sky-500"
                    placeholder="https://t.me/..."
                  />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Admin Authorization Secret
                </label>
                <input
                  type="password"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-sky-600/20"
              >
                Save Configuration
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
