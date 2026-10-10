import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Monitor, ArrowLeft, ShieldCheck, CheckCircle2, Play, KeyRound } from "lucide-react";

export default function TV8DestinationPage() {
  const router = useRouter();
  const { nftoken } = router.query;
  const tokenString = typeof nftoken === "string" ? nftoken : "";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Head>
        <title>Netflix PC Portal (/tv8) — Aus Clone Bot Destination</title>
      </Head>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 font-semibold text-sky-400">
          <Monitor className="w-5 h-5" /> PC Destination: /tv8
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col justify-center gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Login PC Destination Endpoint (`/tv8`)</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Observed target path for the <b>🖥️ Login PC</b> button from Telegram.
              </p>
            </div>
          </div>

          <div className="py-6 flex flex-col gap-6">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-emerald-300">
                  Target Endpoint Successfully Reached
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  The bot successfully handed off the token payload to the desktop activation interface.
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-sky-400" /> Received Token Payload (`nftoken` query param):
              </label>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-sky-300 break-all leading-relaxed max-h-36 overflow-y-auto">
                {tokenString || "No nftoken parameter detected. Open via the Login PC button on the dashboard or Telegram."}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                <div className="text-[11px] text-slate-400">Target Action</div>
                <div className="text-sm font-bold text-white mt-1">PC / Web Stream</div>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                <div className="text-[11px] text-slate-400">Query Parameter</div>
                <div className="text-sm font-bold text-sky-400 mt-1 font-mono">?nftoken=...</div>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                <div className="text-[11px] text-slate-400">Resolution</div>
                <div className="text-sm font-bold text-emerald-400 mt-1">4K Ultra HD Active</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
