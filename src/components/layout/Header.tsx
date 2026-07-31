"use client";

import { RefreshCw, Lock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <Lock className="w-3.5 h-3.5 text-zinc-500" />
          <span>Carlos' Workspace</span>
        </div>
        <div className="h-4 w-px bg-zinc-800" />
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Assets: $543,650</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Debts: $35,960</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-700/80 text-xs text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 transition-all font-mono shadow-sm active:scale-95 disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-emerald-400" : ""}`} />
          <span>{isSyncing ? "Syncing Plaid..." : "Sync Accounts"}</span>
        </button>

        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-200">
          C
        </div>
      </div>
    </header>
  );
}
