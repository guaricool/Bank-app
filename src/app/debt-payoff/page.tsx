"use client";

import { useState, useMemo } from "react";
import { 
  TrendingDown, 
  Sparkles, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Info
} from "lucide-react";
import { MOCK_DEBTS } from "@/lib/mock-data";
import { calculateDebtPayoff, StrategyType } from "@/lib/debt-engine";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from "recharts";

export default function DebtPayoffPage() {
  const [strategy, setStrategy] = useState<StrategyType>("AVALANCHE");
  const [extraMonthly, setExtraMonthly] = useState<number>(400);
  const [lumpSum, setLumpSum] = useState<number>(0);

  // Compute live payoff results
  const result = useMemo(() => {
    return calculateDebtPayoff(MOCK_DEBTS, strategy, extraMonthly, lumpSum);
  }, [strategy, extraMonthly, lumpSum]);

  const totalMinimums = MOCK_DEBTS.reduce((sum, d) => sum + d.minimumPayment, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Debt Payoff Simulator</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
              Interactive
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Simulate Avalanche (Mathematically Optimal) vs Snowball strategies with extra payment sliders.
          </p>
        </div>
      </div>

      {/* Control Panel Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Selector */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm text-zinc-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Payoff Strategy</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setStrategy("AVALANCHE")}
              className={`p-3 rounded-lg border text-left transition-all ${
                strategy === "AVALANCHE"
                  ? "bg-emerald-950/40 border-emerald-500 text-emerald-100 shadow-sm"
                  : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <div className="font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-between">
                <span>Avalanche</span>
                {strategy === "AVALANCHE" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                Highest APR first. Minimizes total interest mathematically.
              </p>
            </button>

            <button
              onClick={() => setStrategy("SNOWBALL")}
              className={`p-3 rounded-lg border text-left transition-all ${
                strategy === "SNOWBALL"
                  ? "bg-blue-950/40 border-blue-500 text-blue-100 shadow-sm"
                  : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <div className="font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-between">
                <span>Snowball</span>
                {strategy === "SNOWBALL" && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                Smallest balance first. Builds quick momentum & psychological wins.
              </p>
            </button>
          </div>
        </div>

        {/* Sliders & Inputs */}
        <div className="lg:col-span-2 bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm text-zinc-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Extra Monthly Contribution</span>
            </h2>
            <span className="text-sm font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/60">
              +${extraMonthly}/mo
            </span>
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={extraMonthly}
              onChange={(e) => setExtraMonthly(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] font-mono text-zinc-500">
              <span>+$0/mo (Min payments only)</span>
              <span>+$1,000/mo</span>
              <span>+$2,000/mo</span>
            </div>
          </div>

          {/* One-time Lump Sum Input */}
          <div className="pt-3 border-t border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-300">One-Time Lump Sum Payment</label>
              <p className="text-[11px] text-zinc-500">Apply a bonus, tax refund, or savings dump immediately.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono">$</span>
              <input
                type="number"
                min="0"
                step="250"
                value={lumpSum}
                onChange={(e) => setLumpSum(Math.max(0, Number(e.target.value)))}
                placeholder="e.g. 1000"
                className="w-32 bg-zinc-950 border border-zinc-700 rounded-md px-3 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Results Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Freedom Date */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5">
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Debt-Free Target</span>
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-2">
            {result.payoffDate}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">
            {result.totalMonths} months total duration
          </div>
        </div>

        {/* Total Interest Paid */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5">
          <div className="text-xs text-zinc-400">Total Interest Cost</div>
          <div className="text-xl font-bold text-zinc-100 font-mono mt-2">
            ${result.totalInterestPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">
            On ${result.totalPrincipalPaid.toLocaleString()} initial debt
          </div>
        </div>

        {/* Interest Saved */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5">
          <div className="text-xs text-zinc-400">Interest Saved vs Minimums</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-2">
            +${result.interestSavedVsMin.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-500/80 mt-1 font-mono">
            Cash kept in your pocket
          </div>
        </div>

        {/* Time Saved */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5">
          <div className="text-xs text-zinc-400">Time Saved vs Minimums</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-2">
            {result.monthsSavedVsMin} Months Faster
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">
            {(result.monthsSavedVsMin / 12).toFixed(1)} years cut off timeline
          </div>
        </div>
      </div>

      {/* Interactive Payoff Chart */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-sm text-zinc-100">Projected Debt Elimination Trajectory</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Month-by-month balance trajectory under {strategy}</p>
          </div>
          <div className="text-xs font-mono text-zinc-400">
            Total Monthly Budget: <strong className="text-emerald-400">${(totalMinimums + extraMonthly).toLocaleString()}/mo</strong>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.monthlyBalances} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="dateLabel" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "6px", fontSize: "12px" }}
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, "Balance"]}
              />
              <Line type="monotone" dataKey="totalBalance" stroke="#10b981" strokeWidth={2.5} dot={false} name="Total Debt" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payoff Queue / Ordered Cards */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h2 className="font-semibold text-sm text-zinc-100">Recommended Payoff Execution Order</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Target debts in sequence while maintaining minimums on others</p>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Strategy: <strong className="text-zinc-200">{strategy}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {result.payoffOrder.map((item, idx) => {
            const debt = MOCK_DEBTS.find((d) => d.id === item.id)!;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg border flex flex-col justify-between space-y-3 relative ${
                  idx === 0
                    ? "bg-emerald-950/20 border-emerald-600/80 shadow-md shadow-emerald-950/40"
                    : "bg-zinc-950/60 border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    idx === 0 ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 text-zinc-300"
                  }`}>
                    #{idx + 1}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    {debt.apr}% APR
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-zinc-100">{debt.name}</h3>
                  <div className="text-lg font-bold font-mono text-zinc-100 mt-1">
                    ${debt.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    Min payment: ${debt.minimumPayment}/mo
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 text-[11px] font-mono flex items-center justify-between">
                  <span className="text-zinc-400">Target Payoff:</span>
                  <span className="text-emerald-400 font-semibold">{item.payoffDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
