"use client";

import { 
  WalletCards, 
  Plus, 
  CreditCard, 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Landmark
} from "lucide-react";
import { MOCK_ACCOUNTS } from "@/lib/mock-data";

export default function AccountsPage() {
  const creditCards = MOCK_ACCOUNTS.filter((a) => a.type === "CREDIT_CARD");
  const totalCreditLimit = creditCards.reduce((sum, c) => sum + (c.creditLimit || 0), 0);
  const totalCreditUsed = creditCards.reduce((sum, c) => sum + c.currentBalance, 0);
  const overallUtilization = ((totalCreditUsed / totalCreditLimit) * 100).toFixed(1);

  const cashAccounts = MOCK_ACCOUNTS.filter((a) => a.type === "CHECKING" || a.type === "SAVINGS");
  const investmentAccounts = MOCK_ACCOUNTS.filter((a) => a.type === "INVESTMENT" || a.type === "ASSET");
  const loanAccounts = MOCK_ACCOUNTS.filter((a) => a.type === "LOAN" || a.type === "MORTGAGE");

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Accounts & Credit Utilization</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Monitor bank account balances, credit card utilization thresholds, and manual assets.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 transition-all font-mono">
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add Manual Asset/Debt</span>
        </button>
      </div>

      {/* Credit Utilization Gauge Card */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h2 className="font-semibold text-sm text-zinc-100">Overall Credit Utilization Ratio</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">Recommended threshold is below 30% for credit score optimization.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold font-mono text-zinc-100">{overallUtilization}%</span>
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono border ${
              Number(overallUtilization) < 30 
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-800" 
                : "bg-amber-950/60 text-amber-400 border-amber-800"
            }`}>
              {Number(overallUtilization) < 30 ? "Optimal Utilization" : "Moderate Risk"}
            </span>
          </div>
        </div>

        {/* Individual Credit Card Utilization Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {creditCards.map((card) => {
            const cardUtil = card.creditLimit ? ((card.currentBalance / card.creditLimit) * 100).toFixed(1) : "0";
            const utilNum = Number(cardUtil);

            return (
              <div key={card.id} className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-xs text-zinc-100">{card.name}</h3>
                    <p className="text-[11px] text-zinc-500 font-mono">{card.institution} • {card.apr}% APR</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-200">{cardUtil}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      utilNum > 50 ? "bg-rose-500" : utilNum > 30 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, utilNum)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>Balance: ${card.currentBalance.toLocaleString()}</span>
                  <span>Limit: ${card.creditLimit?.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Accounts */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h2 className="font-semibold text-sm text-zinc-100 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span>Cash & Liquidity</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              ${cashAccounts.reduce((s, a) => s + a.currentBalance, 0).toLocaleString()}
            </span>
          </div>

          <div className="space-y-3">
            {cashAccounts.map((acc) => (
              <div key={acc.id} className="p-3 rounded bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <div className="font-medium text-xs text-zinc-200">{acc.name}</div>
                  <div className="text-[11px] text-zinc-500 font-mono">{acc.institution}</div>
                </div>
                <div className="font-mono font-semibold text-xs text-zinc-100">
                  ${acc.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment & Real Estate */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h2 className="font-semibold text-sm text-zinc-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Investments & Assets</span>
            </h2>
            <span className="text-xs font-mono text-blue-400 font-semibold">
              ${investmentAccounts.reduce((s, a) => s + a.currentBalance, 0).toLocaleString()}
            </span>
          </div>

          <div className="space-y-3">
            {investmentAccounts.map((acc) => (
              <div key={acc.id} className="p-3 rounded bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <div className="font-medium text-xs text-zinc-200">{acc.name}</div>
                  <div className="text-[11px] text-zinc-500 font-mono">{acc.institution}</div>
                </div>
                <div className="font-mono font-semibold text-xs text-zinc-100">
                  ${acc.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loans & Long-Term Liabilities */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h2 className="font-semibold text-sm text-zinc-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-rose-400" />
              <span>Fixed Loans & Debt</span>
            </h2>
            <span className="text-xs font-mono text-rose-400 font-semibold">
              ${loanAccounts.reduce((s, a) => s + a.currentBalance, 0).toLocaleString()}
            </span>
          </div>

          <div className="space-y-3">
            {loanAccounts.map((acc) => (
              <div key={acc.id} className="p-3 rounded bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <div className="font-medium text-xs text-zinc-200">{acc.name}</div>
                  <div className="text-[11px] text-zinc-500 font-mono">{acc.institution} • {acc.apr}% APR</div>
                </div>
                <div className="font-mono font-semibold text-xs text-rose-400">
                  -${acc.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
