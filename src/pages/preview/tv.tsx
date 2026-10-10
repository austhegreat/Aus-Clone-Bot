import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Tv, ArrowLeft, CheckCircle2, ShieldCheck, KeyRound, RefreshCw } from "lucide-react";

export default function TVPreviewPage() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isPaired, setIsPaired] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newCode = [...code];
    newCode[index] = val.toUpperCase();
    setCode(newCode);

    // Auto-advance
    if (val && index < 5) {
      const nextInput = document.getElementById(`tv-code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePair = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsPaired(true);
    }, 800);
  };

  const handleReset = () => {
    setIsPaired(false);
    setCode(["", "", "", "", "", ""]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      <Head>
        <title>Aus Clone Bot — TV Activation Portal</title>
      </Head>

      {/* Top Header */}
      <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 font-semibold text-purple-400">
          <Tv className="w-5 h-5" /> Smart TV Activation Gateway
        </div>
      </header>

      {/* Main Activation Box */}
      <main className="flex-1 max-w-lg w-full p-6 flex flex-col items-center justify-center">
        <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20">
            <Tv className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold text-white text-center">
            {isPaired ? "TV Device Paired!" : "Activate Your Smart TV"}
          </h1>
          <p className="text-slate-400 text-sm text-center mt-2 max-w-sm">
            {isPaired
              ? "Your Smart TV is now linked with your Aus Clone Bot session pass. Enjoy Ultra HD streaming."
              : "Open the streaming app on your TV, find the 6-character activation code displayed on the screen, and enter it below."}
          </p>

          {isPaired ? (
            <div className="w-full my-8 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 flex flex-col items-center text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
              <div className="text-emerald-300 font-semibold text-base">Connected Device: Living Room TV</div>
              <div className="text-xs text-slate-400 mt-1">Resolution: 4K HDR • Profile: Premium</div>
              <button
                onClick={handleReset}
                className="mt-6 text-xs text-slate-400 hover:text-white flex items-center gap-1.5 underline underline-offset-4"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Pair Another TV
              </button>
            </div>
          ) : (
            <form onSubmit={handlePair} className="w-full mt-8 flex flex-col items-center gap-6">
              {/* 6 Digit Inputs */}
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`tv-code-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono bg-slate-950 border border-slate-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white outline-none transition"
                    placeholder="•"
                  />
                ))}
              </div>

              <div className="w-full flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading || code.some((c) => !c)}
                  className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
                >
                  <KeyRound className="w-4 h-4" />
                  {loading ? "Verifying Code..." : "Authorize TV Device"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCode(["A", "U", "S", "7", "8", "9"]);
                  }}
                  className="w-full py-2 text-xs text-slate-400 hover:text-slate-300 transition text-center"
                >
                  Fill Sample Code (AUS789)
                </button>
              </div>
            </form>
          )}

          <div className="w-full mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Authorized TV Gateway
            </span>
            <span>Version 1.0.0</span>
          </div>
        </div>
      </main>
    </div>
  );
}
