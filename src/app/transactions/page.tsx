"use client";

import { useEffect, useState } from "react";
import PlaidLinkButton from "@/components/plaid/PlaidLinkButton";
import { ReceiptText, Search, ArrowUpRight, ArrowDownRight, Filter, Loader2 } from "lucide-react";

export default function TransactionsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/financial-summary");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-xs text-zinc-400">Cargando historial de transacciones...</p>
      </div>
    );
  }

  const transactions = data?.transactions || [];

  // Filter logic
  const filtered = transactions.filter((tx: any) => {
    const matchesSearch =
      tx.name.toLowerCase().includes(search.toLowerCase()) ||
      (tx.merchantName && tx.merchantName.toLowerCase().includes(search.toLowerCase()));

    if (filterCategory === "ALL") return matchesSearch;
    if (filterCategory === "INCOME") return matchesSearch && (Number(tx.amount) < 0 || tx.category === "Ingreso");
    if (filterCategory === "EXPENSE") return matchesSearch && Number(tx.amount) > 0 && tx.category !== "Ingreso";
    return matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ReceiptText className="w-6 h-6 text-emerald-400" />
            <span>Historial de Transacciones</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Movimientos sincronizados de todas tus cuentas</p>
        </div>

        <div className="flex items-center gap-3">
          <PlaidLinkButton variant="primary" onSuccess={fetchTransactions} />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por comercio o concepto..."
            className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition"
          />
        </div>

        {/* Filter Category Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFilterCategory("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterCategory === "ALL" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Todas
          </button>

          <button
            onClick={() => setFilterCategory("INCOME")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterCategory === "INCOME" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-zinc-400 hover:text-white"
            }`}
          >
            Ingresos
          </button>

          <button
            onClick={() => setFilterCategory("EXPENSE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterCategory === "EXPENSE" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "text-zinc-400 hover:text-white"
            }`}
          >
            Gastos
          </button>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-xs text-zinc-500 py-12 text-center">No se encontraron transacciones para este criterio.</p>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {filtered.map((tx: any) => {
              const isIncome = Number(tx.amount) < 0 || tx.category === "Ingreso";
              return (
                <div key={tx.id} className="p-4 hover:bg-zinc-900/90 transition flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-950 text-zinc-400 border border-zinc-800"
                      }`}
                    >
                      {isIncome ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{tx.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        {new Date(tx.date).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        • {tx.category || "General"}
                      </div>
                    </div>
                  </div>

                  <div className={`text-xs font-bold ${isIncome ? "text-emerald-400" : "text-zinc-200"}`}>
                    {isIncome ? "+" : "-"}${Math.abs(Number(tx.amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
