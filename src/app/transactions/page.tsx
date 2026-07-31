"use client";

import { useState } from "react";
import { Search, Filter, ArrowUpRight, ArrowDownRight, Tag } from "lucide-react";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", "Groceries", "Housing", "Utilities", "Dining Out", "Transportation", "Entertainment", "Debt Payments", "Income"];

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    const matchesSearch = tx.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || tx.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpense = filteredTransactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Transaction Feed & Burn Analysis</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Categorized cash outflows across connected bank and credit card accounts.
          </p>
        </div>

        <div className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800">
          Filtered Outflow Total: <strong className="text-rose-400">${totalExpense.toFixed(2)}</strong>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search merchant or payee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-zinc-100 text-zinc-950 font-semibold"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-zinc-400 font-mono uppercase text-[10px] bg-zinc-950/60 border-b border-zinc-800">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Merchant / Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500 font-mono">
                    No transactions match your search filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="data-table-row">
                    <td className="py-3.5 px-4 font-mono text-zinc-400">{tx.date}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-zinc-200">{tx.merchantName}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">{tx.name}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">{tx.accountName}</td>
                    <td className={`py-3.5 px-4 text-right font-mono font-semibold text-sm ${tx.amount < 0 ? "text-emerald-400" : "text-zinc-200"}`}>
                      {tx.amount < 0 ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
