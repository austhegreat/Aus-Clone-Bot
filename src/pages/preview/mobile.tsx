import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Smartphone, ArrowLeft, QrCode, ExternalLink, ShieldCheck, Download, Wifi } from "lucide-react";

export default function MobilePreviewPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      <Head>
        <title>Aus Clone Bot — Mobile Portal</title>
      </Head>

      {/* Top Header */}
      <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 font-semibold text-emerald-400">
          <Smartphone className="w-5 h-5" /> Mobile Launch Gateway
        </div>
      </header>

      {/* Mobile Mockup View */}
      <main className="flex-1 max-w-md w-full p-6 flex flex-col items-center justify-center">
        <div className="w-full bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl relative flex flex-col items-center">
          {/* Phone Speaker Notch */}
          <div className="w-24 h-1.5 bg-slate-700 rounded-full mb-6"></div>

          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
            <Smartphone className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-white text-center">Mobile Session Active</h2>
          <p className="text-slate-400 text-xs text-center mt-2 px-2">
            Your smartphone pass is verified. Tap below to launch the mobile client or scan the QR code.
          </p>

          {/* Simulated QR Code */}
          <div className="my-6 p-4 bg-white rounded-2xl shadow-md flex flex-col items-center">
            <div className="w-40 h-40 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-slate-100 p-2 text-center border-4 border-slate-800">
              <QrCode className="w-20 h-20 text-emerald-400" />
              <span className="text-[10px] text-slate-400 mt-1 font-mono tracking-wider">AUS-MOBILE-PAIR</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => alert("Launching Mobile App Deep Link...")}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <ExternalLink className="w-4 h-4" /> Open In Mobile App
            </button>

            <button
              onClick={() => alert("Mobile Web Session Loaded")}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition border border-slate-700"
            >
              Continue via Mobile Browser
            </button>
          </div>

          {/* Quick status */}
          <div className="w-full mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Wifi className="w-3 h-3" /> 5G / Wi-Fi Sync
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-sky-400" /> Encrypted
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
