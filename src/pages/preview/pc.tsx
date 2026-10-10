import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Monitor, Play, CheckCircle, ArrowLeft, Volume2, ShieldCheck, Film } from "lucide-react";

export default function PCPreviewPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Head>
        <title>Aus Clone Bot — PC Portal</title>
      </Head>

      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-2 font-semibold text-sky-400">
            <Monitor className="w-5 h-5" /> PC Streaming Portal
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" /> Session Authorized
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Desktop Web Player
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Connected via Aus Clone Bot Session Gateway. Optimized for Ultra HD (4K) desktop playback.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">
                Resolution: <b>3840 x 2160 (4K)</b>
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">
                Audio: <b>Dolby Atmos 5.1</b>
              </span>
            </div>
          </div>

          {/* Simulated Video Player */}
          <div className="relative mt-6 aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center group shadow-2xl">
            {isPlaying ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 text-center animate-pulse">
                <Film className="w-16 h-16 text-sky-400 mb-4 animate-bounce" />
                <h3 className="text-xl font-semibold text-white">Streaming Video Playback Simulation</h3>
                <p className="text-slate-400 text-sm max-w-md mt-2">
                  Session token is authenticated. Media stream is rendering via adaptive bitrate HLS/DASH.
                </p>
                <button
                  onClick={() => setIsPlaying(false)}
                  className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-lg border border-slate-600 transition"
                >
                  Pause Stream
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center p-6">
                <div
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center cursor-pointer hover:scale-110 hover:bg-sky-500 hover:text-white transition duration-200 border border-sky-500/40 shadow-lg shadow-sky-500/20"
                >
                  <Play className="w-8 h-8 ml-1" />
                </div>
                <div>
                  <h4 className="font-medium text-white text-base">Click to Launch PC Player Stream</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Demonstration environment verified for PC desktop destination.
                  </p>
                </div>
              </div>
            )}

            {/* Player Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Link
                </span>
                <span>Buffer: 100%</span>
              </div>
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <span className="font-mono">100%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
              <div className="text-xs text-slate-400 font-medium">Session Protocol</div>
              <div className="text-sm font-semibold text-white mt-1">HTTPS Encrypted Token</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
              <div className="text-xs text-slate-400 font-medium">Target Device Profile</div>
              <div className="text-sm font-semibold text-sky-400 mt-1">PC / Web Browser</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
              <div className="text-xs text-slate-400 font-medium">Destination State</div>
              <div className="text-sm font-semibold text-emerald-400 mt-1">Active & Ready</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
