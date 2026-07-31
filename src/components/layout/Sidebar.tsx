"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  TrendingDown, 
  WalletCards, 
  ReceiptText, 
  ShieldCheck, 
  Eye, 
  Sparkles,
  Users
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [familyMode, setFamilyMode] = useState(false);

  const navItems = [
    {
      label: "Overview",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Debt Payoff",
      href: "/debt-payoff",
      icon: TrendingDown,
      badge: "Simulator",
    },
    {
      label: "Accounts & Credit",
      href: "/accounts",
      icon: WalletCards,
    },
    {
      label: "Transactions",
      href: "/transactions",
      icon: ReceiptText,
    },
  ];

  return (
    <aside className={`w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col justify-between h-screen sticky top-0 ${familyMode ? 'text-[17px]' : 'text-sm'}`}>
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400 font-bold text-base shadow-sm">
              F
            </div>
            <div>
              <h1 className="font-semibold text-zinc-100 tracking-tight text-sm leading-none">Family Finance</h1>
              <p className="text-[11px] text-zinc-400 mt-1 font-mono">Private · Precise</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
            <ShieldCheck className="w-3 h-3" />
            Self-Hosted
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md font-medium transition-all ${
                  isActive
                    ? "bg-zinc-900 text-zinc-100 border border-zinc-700/80 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-zinc-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls (Family Mode toggle) */}
      <div className="p-3 border-t border-zinc-800/80 space-y-2">
        <button
          onClick={() => setFamilyMode(!familyMode)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium border transition-all ${
            familyMode
              ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60"
              : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Family Mode (+17px)</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${familyMode ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-zinc-600'}`} />
        </button>

        <div className="px-3 py-2 rounded bg-zinc-900/40 border border-zinc-800/60">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
            <span>Status</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Synced
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
