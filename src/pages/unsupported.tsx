import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Tv, ArrowLeft, CheckCircle2, ShieldCheck, KeyRound, AlertTriangle } from "lucide-react";

export default function UnsupportedTVDestinationPage() {
  const router = useRouter();
  const { nftoken } = router.query;
  const tokenString = typeof nftoken === "string" ? nftoken : "";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Head>
        <title>Netflix TV Portal (/unsupported) — Aus Clone Bot Destination</title>
      </Head>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 font-semibold text-purple-400">
          <Tv className="w-5 h-5" /> TV Destination: /unsupported
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col justify-center gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Login TV Destination Endpoint (`/unsupported`)</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Observed target path for the <b>📺 Login TV</b> button from Telegram.
              </p>
            </div>
          </div>

          <div className="py-6 flex flex-col gap-6">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-purple-300">
                  TV Activation Portal Reached
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Note: The reference bot targets <code>/unsupported</code> on Netflix for TV login routing. This simulated gateway accepts the token and offers TV pairing.
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-purple-400" /> Received Token Payload (`nftoken` query param):
              </label>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-purple-300 break-all leading-relaxed max-h-36 overflow-y-auto">
                {tokenString || "No nftoken parameter detected. Open via the Login TV button on the dashboard or Telegram."}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                <div className="text-[11px] text-slate-400">Target Device</div>
                <div className="text-sm font-bold text-white mt-1">Smart TV Client</div>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                <div className="text-[11px] text-slate-400">Query Parameter</div>
                <div className="text-sm font-bold text-purple-400 mt-1 font-mono">?nftoken=...</div>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                <div className="text-[11px] text-slate-400">TV Pairing Code</div>
                <div className="text-sm font-bold text-emerald-400 mt-1 font-mono">AUS-TV-PASS</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
