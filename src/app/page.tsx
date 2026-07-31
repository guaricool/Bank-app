"use client";

import Link from "next/link";
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldAlert, 
  Flame, 
  Wallet, 
  ChevronRight,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from "recharts";
import { MOCK_NET_WORTH_HISTORY, MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from "@/lib/mock-data";

export default function OverviewDashboard() {
  const currentSnapshot = MOCK_NET_WORTH_HISTORY[MOCK_NET_WORTH_HISTORY.length - 1];
  const previousSnapshot = MOCK_NET_WORTH_HISTORY[MOCK_NET_WORTH_HISTORY.length - 2];
  
  const netWorthDelta = currentSnapshot.netWorth - previousSnapshot.netWorth;
  const netWorthPct = ((netWorthDelta / previousSnapshot.netWorth) * 100).toFixed(1);

  // Highest APR debt for quick alert
  const highestAprDebt = MOCK_ACCOUNTS
    .filter(a => a.isLiability && a.apr)
    .sort((a, b) => (b.apr || 0) - (a.apr || 0))[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner: JTBD Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Financial Command Center</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time net worth, monthly burn rate, and priority debt payoff trajectory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/debt-payoff"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all shadow-sm shadow-emerald-900/40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Debt Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Priority Alert Banner */}
      {highestAprDebt && (
        <div className="bg-rose-950/30 border border-rose-900/60 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-rose-900/40 border border-rose-800/60 text-rose-400 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-rose-200">High Interest Priority Alert</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700">
                  {highestAprDebt.apr}% APR
                </span>
              </div>
              <p className="text-xs text-rose-300/80 mt-1">
                <strong className="text-rose-200">{highestAprDebt.name}</strong> carries ${highestAprDebt.currentBalance.toLocaleString()} balance. Payoff avalanche recommends targeting this first.
              </p>
            </div>
          </div>

          <Link
            href="/debt-payoff"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-300 hover:text-rose-100 font-mono underline decoration-rose-600 underline-offset-4"
          >
            <span>Run Avalanche Payoff</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Hero Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Net Worth */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 relative overflow-hidden group hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Net Worth</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-zinc-100 font-mono tracking-tight">
              ${currentSnapshot.netWorth.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+${netWorthDelta.toLocaleString()} ({netWorthPct}%)</span>
              <span className="text-zinc-500 font-sans text-[11px] ml-1">vs last mo</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Assets */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 relative overflow-hidden group hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Total Assets</span>
            <Wallet className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-zinc-100 font-mono tracking-tight">
              ${currentSnapshot.assets.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-zinc-500 mt-2 font-mono">
              4 Accounts (Cash + Investments + Real Estate)
            </div>
          </div>
        </div>

        {/* Metric 3: Total Liabilities */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 relative overflow-hidden group hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Total Liabilities</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-zinc-100 font-mono tracking-tight">
              ${currentSnapshot.liabilities.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-zinc-400 mt-2 font-mono flex items-center gap-1">
              <span>Avg APR: 14.5%</span>
              <span>•</span>
              <span className="text-rose-400">4 Active Debts</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Monthly Burn Rate */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 relative overflow-hidden group hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Monthly Burn Rate</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-zinc-100 font-mono tracking-tight">
              ${currentSnapshot.burnRate.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-zinc-500 mt-2 font-mono">
              Avg 30-day baseline cash burn
            </div>
          </div>
        </div>
      </div>

      {/* Net Worth Chart & Asset/Liability Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Net Worth Trajectory */}
        <div className="lg:col-span-2 bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm text-zinc-100">Net Worth Trajectory</h2>
              <p className="text-xs text-zinc-400 mt-0.5">12-month historical progression</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Net Worth
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Liabilities
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_NET_WORTH_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="liabilitiesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} 
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "6px", fontSize: "12px" }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, ""]}
                />
                <Area type="monotone" dataKey="netWorth" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#netWorthGrad)" name="Net Worth" />
                <Area type="monotone" dataKey="liabilities" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#liabilitiesGrad)" name="Liabilities" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Account Breakdown Summary */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 className="font-semibold text-sm text-zinc-100">Accounts & Balances</h2>
              <Link href="/accounts" className="text-xs text-emerald-400 hover:underline font-mono">
                View All →
              </Link>
            </div>

            <div className="divide-y divide-zinc-800/60 mt-3">
              {MOCK_ACCOUNTS.map((acc) => (
                <div key={acc.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-zinc-200">{acc.name}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{acc.institution}</div>
                  </div>
                  <div className={`font-mono font-semibold ${acc.isLiability ? "text-rose-400" : "text-zinc-100"}`}>
                    {acc.isLiability ? "-" : ""}${acc.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 font-mono flex items-center justify-between">
            <span>Net Ratio: 93.4% Equity</span>
            <span className="text-emerald-400 font-semibold">Healthy</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions Feed */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h2 className="font-semibold text-sm text-zinc-100">Recent Transactions</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Filtered category burn across linked accounts</p>
          </div>
          <Link href="/transactions" className="text-xs text-zinc-400 hover:text-zinc-200 font-mono">
            Full Feed →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800/80">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Account</th>
                <th className="py-2 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {MOCK_TRANSACTIONS.slice(0, 5).map((tx) => (
                <tr key={tx.id} className="data-table-row">
                  <td className="py-3 px-3 font-mono text-zinc-400">{tx.date}</td>
                  <td className="py-3 px-3 font-medium text-zinc-200">{tx.merchantName}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-400 font-mono text-[11px]">{tx.accountName}</td>
                  <td className={`py-3 px-3 text-right font-mono font-semibold ${tx.amount < 0 ? "text-emerald-400" : "text-zinc-200"}`}>
                    {tx.amount < 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
