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
  KeyRound,
  Info,
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
  const [editHeading, setEditHeading] = useState("");
  const [editRegion, setEditRegion] = useState("");
  const [editPlan, setEditPlan] = useState("");
  const [editDuration, setEditDuration] = useState(48);
  const [editDomain, setEditDomain] = useState("");
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
        setEditHeading(configData.config.defaultHeading || "NETCRACK Success!");
        setEditRegion(configData.config.defaultRegion || "🇯🇵 Japan");
        setEditPlan(configData.config.defaultPlan || "Premium");
        setEditDuration(configData.config.sessionDurationHours || 48);
        setEditDomain(configData.config.targetDomain || "http://localhost:3000");
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
        { sender: "user", text: "/start", timestamp: "11:12 PM" },
        {
          sender: "bot",
          text: `<b>🎉 ${card.statusHeading}</b>\n\n🌍 <b>Region:</b> ${card.region}\n📝 <b>Plan:</b> ${card.plan}\n⌛ <b>Expires:</b> ${card.formattedExpiryText || card.expiresAt}\n\nSelect device to login:`,
          keyboard: true,
          timestamp: "11:12 PM",
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
    const copyText = `🎉 ${card.statusHeading}\n\n🌍 Region: ${card.region}\n📝 Plan: ${card.plan}\n⌛ Expires: ${card.formattedExpiryText || card.expiresAt}\n\nSelect device to login:\nPC (/tv8): ${card.deviceLinks.pc}\nMobile (/account): ${card.deviceLinks.mobile}\nTV (/unsupported): ${card.deviceLinks.tv}`;
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
          defaultHeading: editHeading,
          defaultRegion: editRegion,
          defaultPlan: editPlan,
          sessionDurationHours: Number(editDuration),
          targetDomain: editDomain,
          devices: {
            pc: { targetUrl: `${editDomain}/tv8` },
            mobile: { targetUrl: `${editDomain}/account` },
            tv: { targetUrl: `${editDomain}/unsupported` },
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setConfigSaveMsg("✅ Configuration saved! Both Web and Telegram bot updated.");
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
        text: `<b>🎉 ${card?.statusHeading || "NETCRACK Success!"}</b>\n\n🌍 <b>Region:</b> ${card?.region || "🇯🇵 Japan"}\n📝 <b>Plan:</b> ${card?.plan || "Premium"}\n⌛ <b>Expires:</b> ${card?.formattedExpiryText || "8/10/2026, 23.12.03 WIB"}\n\nSelect device to login:`,
        keyboard: true,
        timestamp: time,
      });
    } else if (input === "/refresh") {
      newLogs.push({
        sender: "bot",
        text: `🔄 <b>Pass Refreshed!</b>\n\n<b>🎉 ${card?.statusHeading}</b>\n\n🌍 <b>Region:</b> ${card?.region}\n📝 <b>Plan:</b> ${card?.plan}\n⌛ <b>Expires:</b> Refreshed for 48h\n\nSelect device to login:`,
        keyboard: true,
        timestamp: time,
      });
    } else if (input === "/help") {
      newLogs.push({
        sender: "bot",
        text: `<b>🤖 Aus Clone Bot Commands:</b>\n\n• /start — Retrieve access pass card\n• /status — Check active pass details\n• /refresh — Force generate new access pass\n• /help — Show help message`,
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
        <title>Aus Clone Bot — Utility Dashboard &amp; Telegram Companion</title>
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
                  Verified 1:1
                </span>
              </div>
              <p className="text-xs text-slate-400">Reconstruction of @netflixgetlink_bot</p>
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
                  <Sparkles className="w-5 h-5 text-sky-400" /> Reconstructed Card (Exact UI Match)
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  1:1 recreation of the observed Telegram message layout, verified with screenshot analysis.
                </p>
              </div>

              {/* The Visual Card Matching Screenshot 3 */}
              <div className="bg-[#17212b] border border-[#242f3d] rounded-2xl p-6 sm:p-7 shadow-2xl relative font-sans">
                {/* Header Text */}
                <div className="flex items-center justify-between pb-3">
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🎉</span> {card?.statusHeading || "NETCRACK Success!"}
                  </div>
                  <button
                    onClick={handleRefreshCard}
                    disabled={loading}
                    title="Refresh Card"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {/* Fields */}
                <div className="py-2 flex flex-col gap-1.5 text-sm">
                  <div className="text-slate-200">
                    <span className="mr-1">🌍</span> <b>Region:</b> {card?.region || "🇯🇵 Japan"}
                  </div>
                  <div className="text-slate-200">
                    <span className="mr-1">📝</span> <b>Plan:</b> {card?.plan || "Premium"}
                  </div>
                  <div className="text-slate-200">
                    <span className="mr-1">⌛</span> <b>Expires:</b>{" "}
                    {card?.formattedExpiryText || card?.expiresAt || "8/10/2026, 23.12.03 WIB"}
                  </div>
                </div>

                {/* Prompt */}
                <div className="pt-4 pb-3 text-sm text-slate-300">
                  Select device to login:
                </div>

                {/* 1 Column Vertical Stack of Buttons (Exact match to Telegram UI) */}
                <div className="flex flex-col gap-2">
                  {/* Login PC Button with Tooltip */}
                  <div className="relative group">
                    <Link
                      href={card?.deviceLinks.pc || "/tv8"}
                      className="w-full py-3 px-4 bg-[#242f3d] hover:bg-[#2b394a] text-slate-100 rounded-xl text-sm font-medium flex items-center justify-between transition border border-[#2b394a]"
                    >
                      <span className="flex items-center gap-2.5">
                        <span>🖥️</span> Login PC
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                    </Link>
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute left-4 bottom-full mb-1 z-20 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-[11px] font-mono text-sky-300 shadow-xl max-w-lg break-all">
                      <div className="text-[10px] text-slate-400 font-sans mb-0.5">Target Destination URL:</div>
                      {card?.deviceLinks.pc}
                    </div>
                  </div>

                  {/* Login Mobile Button with Tooltip */}
                  <div className="relative group">
                    <Link
                      href={card?.deviceLinks.mobile || "/account"}
                      className="w-full py-3 px-4 bg-[#242f3d] hover:bg-[#2b394a] text-slate-100 rounded-xl text-sm font-medium flex items-center justify-between transition border border-[#2b394a]"
                    >
                      <span className="flex items-center gap-2.5">
                        <span>📱</span> Login Mobile
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                    </Link>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute left-4 bottom-full mb-1 z-20 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-[11px] font-mono text-emerald-300 shadow-xl max-w-lg break-all">
                      <div className="text-[10px] text-slate-400 font-sans mb-0.5">Target Destination URL:</div>
                      {card?.deviceLinks.mobile}
                    </div>
                  </div>

                  {/* Login TV Button with Tooltip */}
                  <div className="relative group">
                    <Link
                      href={card?.deviceLinks.tv || "/unsupported"}
                      className="w-full py-3 px-4 bg-[#242f3d] hover:bg-[#2b394a] text-slate-100 rounded-xl text-sm font-medium flex items-center justify-between transition border border-[#2b394a]"
                    >
                      <span className="flex items-center gap-2.5">
                        <span>📺</span> Login TV
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                    </Link>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute left-4 bottom-full mb-1 z-20 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-[11px] font-mono text-purple-300 shadow-xl max-w-lg break-all">
                      <div className="text-[10px] text-slate-400 font-sans mb-0.5">Target Destination URL:</div>
                      {card?.deviceLinks.tv}
                    </div>
                  </div>

                  {/* Subscribe Channel Button */}
                  <a
                    href={card?.channelUrl || "https://t.me/aus_updates"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition border border-slate-700"
                  >
                    <span>📢</span> Subscribe Channel
                  </a>
                </div>

                {/* Footer Copy Action */}
                <div className="mt-4 pt-3 border-t border-[#242f3d] flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px]">Countdown: {timeLeft || "Active"}</span>
                  <button
                    onClick={handleCopyCard}
                    className="flex items-center gap-1 text-slate-300 hover:text-white transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy Pass"}
                  </button>
                </div>
              </div>

              {/* Token Inspector Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-2">
                  <KeyRound className="w-4 h-4 text-sky-400" /> Active Session Token (`nftoken`)
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] text-sky-300 break-all max-h-24 overflow-y-auto">
                  {card?.nftoken}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Identical token payload attached across all 3 device buttons (PC /tv8, Mobile /account, TV /unsupported).
                </p>
              </div>
            </div>

            {/* Right Column: Destination Endpoint Gateways */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-white">Observed Destination Gateways</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Click below to inspect the actual destination endpoints decoded from the reference bot.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Link
                  href={card?.deviceLinks.pc || "/tv8"}
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20 group-hover:scale-105 transition">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">🖥️ Login PC: <code>/tv8</code></div>
                      <div className="text-xs text-slate-400">Target path decoded from hover tooltip</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                </Link>

                <Link
                  href={card?.deviceLinks.mobile || "/account"}
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">📱 Login Mobile: <code>/account</code></div>
                      <div className="text-xs text-slate-400">Mobile streaming profile gateway</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                </Link>

                <Link
                  href={card?.deviceLinks.tv || "/unsupported"}
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-105 transition">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">📺 Login TV: <code>/unsupported</code></div>
                      <div className="text-xs text-slate-400">Smart TV login/pairing endpoint</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                </Link>
              </div>

              {/* Technical Analysis Note */}
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-sky-400" /> Interface &amp; Token Architecture
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The original bot targets <code>netflix.com</code> paths (<code>/tv8</code>, <code>/account</code>, <code>/unsupported</code>)
                  with a query token parameter <code>nftoken</code>. Aus Clone Bot matches this exact parameter structure and button layout,
                  while allowing the base domain to be configured freely via the Admin Config tab.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TELEGRAM BOT SIMULATOR */}
        {activeTab === "simulator" && (
          <div className="max-w-xl mx-auto w-full flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-sky-400" /> Telegram Bot Interactive Simulator
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Visual test environment replicating the Telegram desktop experience.
              </p>
            </div>

            {/* Chat Box */}
            <div className="bg-[#0e1621] border border-[#242f3d] rounded-2xl h-[560px] flex flex-col overflow-hidden shadow-2xl">
              {/* Chat Header */}
              <div className="bg-[#17212b] px-4 py-3 border-b border-[#242f3d] flex items-center justify-between">
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
                    className="px-2 py-1 bg-[#242f3d] hover:bg-[#2b394a] rounded text-[11px] text-slate-200"
                  >
                    /start
                  </button>
                  <button
                    onClick={() => handleSendSimulator("/status")}
                    className="px-2 py-1 bg-[#242f3d] hover:bg-[#2b394a] rounded text-[11px] text-slate-200"
                  >
                    /status
                  </button>
                  <button
                    onClick={() => handleSendSimulator("/refresh")}
                    className="px-2 py-1 bg-[#242f3d] hover:bg-[#2b394a] rounded text-[11px] text-slate-200"
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
                          ? "bg-[#2b5278] text-white rounded-br-none"
                          : "bg-[#182533] border border-[#242f3d] text-slate-200 rounded-bl-none shadow"
                      }`}
                    >
                      <div
                        className="whitespace-pre-wrap leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      />

                      {/* Inline Keyboard Simulation (Single column vertical stack) */}
                      {msg.keyboard && card && (
                        <div className="mt-4 pt-3 border-t border-[#242f3d] flex flex-col gap-1.5">
                          <Link
                            href={card.deviceLinks.pc || "/tv8"}
                            className="py-2.5 px-3 bg-[#242f3d] hover:bg-[#2b394a] text-slate-100 text-center rounded-lg font-medium text-[11px] transition flex items-center justify-between"
                          >
                            <span>🖥️ Login PC</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>
                          <Link
                            href={card.deviceLinks.mobile || "/account"}
                            className="py-2.5 px-3 bg-[#242f3d] hover:bg-[#2b394a] text-slate-100 text-center rounded-lg font-medium text-[11px] transition flex items-center justify-between"
                          >
                            <span>📱 Login Mobile</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>
                          <Link
                            href={card.deviceLinks.tv || "/unsupported"}
                            className="py-2.5 px-3 bg-[#242f3d] hover:bg-[#2b394a] text-slate-100 text-center rounded-lg font-medium text-[11px] transition flex items-center justify-between"
                          >
                            <span>📺 Login TV</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>
                          <a
                            href={card.channelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-center rounded-lg font-medium text-[11px] transition"
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
                className="p-3 bg-[#17212b] border-t border-[#242f3d] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={simInput}
                  onChange={(e) => setSimInput(e.target.value)}
                  placeholder="Type a command (/start, /refresh, /help)..."
                  className="flex-1 bg-[#0e1621] border border-[#242f3d] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-[#2b5278] hover:bg-sky-600 text-white rounded-xl transition"
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
                <Settings className="w-5 h-5 text-sky-400" /> Utility &amp; Destination Domain Settings
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Configure the target domain, region name, plan tier, and duration for newly generated passes.
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
                    Status Heading
                  </label>
                  <input
                    type="text"
                    value={editHeading}
                    onChange={(e) => setEditHeading(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-500"
                    placeholder="e.g. NETCRACK Success!"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Default Region
                  </label>
                  <input
                    type="text"
                    value={editRegion}
                    onChange={(e) => setEditRegion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-500"
                    placeholder="e.g. 🇯🇵 Japan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Default Plan
                  </label>
                  <input
                    type="text"
                    value={editPlan}
                    onChange={(e) => setEditPlan(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-500"
                    placeholder="e.g. Premium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Session Duration (Hours)
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
              </div>

              <div className="border-t border-slate-800 pt-4 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  Target Domain &amp; Path Binding
                </h4>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Base Target Domain
                  </label>
                  <input
                    type="text"
                    value={editDomain}
                    onChange={(e) => setEditDomain(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-sky-500"
                    placeholder="http://localhost:3000 (or custom domain)"
                  />
                  <div className="text-[11px] text-slate-400 mt-1 flex gap-3">
                    <span>PC: <code>{editDomain}/tv8</code></span>
                    <span>Mobile: <code>{editDomain}/account</code></span>
                    <span>TV: <code>{editDomain}/unsupported</code></span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Telegram Channel URL
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
