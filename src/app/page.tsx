"use client";

import { useEffect, useState } from "react";
import PlaidLinkButton from "@/components/plaid/PlaidLinkButton";
import {
  Wallet,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ShieldCheck,
  Landmark,
  Loader2,
} from "lucide-react";

export default function GeneralOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchSummary = async () => {
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
    fetchSummary();
  }, []);

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed-demo", { method: "POST" });
      if (res.ok) {
        await fetchSummary();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-xs text-zinc-400">Cargando tus datos financieros privados...</p>
      </div>
    );
  }

  const hasAccounts = data?.hasData;
  const summary = data?.summary || { netWorth: 0, totalAssets: 0, totalDebts: 0, liquidAssets: 0 };
  const transactions = data?.transactions || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Resumen General Financiero
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Vista unificada de activos líquidos y pasivos para {data?.user?.name || data?.user?.email}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PlaidLinkButton variant="primary" onSuccess={fetchSummary} />
        </div>
      </div>

      {/* Clean Slate State if No Accounts Linked */}
      {!hasAccounts ? (
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-10 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto relative z-10">
            <Landmark className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="max-w-md mx-auto space-y-2 relative z-10">
            <h2 className="text-xl font-bold text-white">Tu Dashboard está 100% Limpio</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No tienes ninguna cuenta ni pasivo vinculado. Conecta tus cuentas bancarias y tarjetas de crédito vía Plaid para sincronizar tus saldos y deudas en tiempo real.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-2">
            <PlaidLinkButton variant="hero" onSuccess={fetchSummary} />

            <button
              onClick={handleSeedDemo}
              disabled={seeding}
              className="px-5 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium rounded-xl text-sm border border-zinc-800 transition flex items-center gap-2 disabled:opacity-50"
            >
              {seeding ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <Sparkles className="w-4 h-4 text-emerald-400" />}
              <span>Probar Datos Demo</span>
            </button>
          </div>

          <div className="pt-4 border-t border-zinc-900 text-[11px] text-zinc-500 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
            <span>Encriptación bancaria SSL de 256 bits. Tus credenciales nunca se almacenan.</span>
          </div>
        </div>
      ) : (
        <>
          {/* Top Key Metrics Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Patrimonio Neto */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/80 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span>Patrimonio Neto Total</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">
                ${summary.netWorth.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">Activos Líquidos - Deudas Totales</p>
            </div>

            {/* Cuentas y Ahorros */}
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-lg">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span>Total Activos (Ahorros / Débito)</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-emerald-400 tracking-tight">
                ${summary.totalAssets.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">Disponible en cuentas líquidas</p>
            </div>

            {/* Total Deudas */}
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-lg">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span>Total Pasivos (Deudas)</span>
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-rose-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-rose-400 tracking-tight">
                ${summary.totalDebts.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">Tarjetas de crédito y préstamos</p>
            </div>
          </div>

          {/* Accounts Breakdown & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Liquid Accounts Preview */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>Cuentas de Ahorro y Débito</span>
                </h3>
                <a href="/accounts" className="text-xs text-emerald-400 hover:underline">
                  Ver Todo →
                </a>
              </div>

              <div className="space-y-2">
                {data?.liquidAccounts?.map((acc: any) => (
                  <div
                    key={acc.id}
                    className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/60 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-medium text-white">{acc.name}</div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{acc.type}</div>
                    </div>
                    <div className="text-xs font-bold text-emerald-400">
                      ${Number(acc.currentBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Debt Accounts Preview */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-rose-400" />
                  <span>Tarjetas y Deudas</span>
                </h3>
                <a href="/debt-payoff" className="text-xs text-rose-400 hover:underline">
                  Simular Pago →
                </a>
              </div>

              <div className="space-y-2">
                {data?.debtAccounts?.map((acc: any) => (
                  <div
                    key={acc.id}
                    className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/60 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-medium text-white">{acc.name}</div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        {acc.debt?.apr ? `APR: ${acc.debt.apr}%` : acc.type}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-rose-400">
                      ${Number(acc.currentBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions List */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Actividad Reciente</h3>
              <a href="/transactions" className="text-xs text-emerald-400 hover:underline">
                Ver todas las transacciones →
              </a>
            </div>

            {transactions.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">No hay transacciones recientes registradas.</p>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {transactions.slice(0, 5).map((tx: any) => {
                  const isIncome = Number(tx.amount) < 0 || tx.category === "Ingreso";
                  return (
                    <div key={tx.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isIncome ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {isIncome ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-white">{tx.name}</div>
                          <div className="text-[10px] text-zinc-500">
                            {new Date(tx.date).toLocaleDateString("es-ES")} • {tx.category || "General"}
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
        </>
      )}
    </div>
  );
}
