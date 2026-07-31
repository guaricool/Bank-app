"use client";

import { useEffect, useState } from "react";
import PlaidLinkButton from "@/components/plaid/PlaidLinkButton";
import {
  CreditCard,
  Car,
  Home,
  Flame,
  Snowflake,
  AlertCircle,
  Calculator,
  Loader2,
  Percent,
  Calendar,
} from "lucide-react";

export default function DebtPayoffPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [strategy, setStrategy] = useState<"AVALANCHE" | "SNOWBALL">("AVALANCHE");
  const [extraPayment, setExtraPayment] = useState<number>(200);

  const fetchDebts = async () => {
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
    fetchDebts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
        <p className="text-xs text-zinc-400">Cargando tus tarjetas y deudas...</p>
      </div>
    );
  }

  const debtAccounts = data?.debtAccounts || [];
  const debtsList = data?.debts || [];

  const totalDebt = debtAccounts.reduce((acc: number, item: any) => acc + Number(item.currentBalance), 0);
  const totalMinPayment = debtsList.reduce((acc: number, d: any) => acc + Number(d.minimumPayment || 0), 0);

  // Credit card limit calculations
  const creditCards = debtAccounts.filter((acc: any) => acc.type === "CREDIT_CARD");
  const totalCardBalance = creditCards.reduce((acc: number, c: any) => acc + Number(c.currentBalance), 0);
  const totalCardLimit = creditCards.reduce((acc: number, c: any) => acc + Number(c.creditLimit || 0), 0);
  const utilizationRatio = totalCardLimit > 0 ? Math.round((totalCardBalance / totalCardLimit) * 100) : 0;

  // Payoff simulation calculation
  const sortedDebts = [...debtsList].sort((a, b) => {
    if (strategy === "AVALANCHE") {
      return Number(b.apr || 0) - Number(a.apr || 0); // High APR first
    }
    return Number(a.balance) - Number(b.balance); // Smallest balance first
  });

  // Calculate estimated payoff months
  let monthsToPayoff = 0;
  if (totalDebt > 0 && (totalMinPayment + extraPayment) > 0) {
    monthsToPayoff = Math.ceil(totalDebt / (totalMinPayment + extraPayment));
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-rose-400" />
            <span>Deudas y Créditos</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Tarjetas de crédito, préstamos de vehículo, hipotecas y plan acelerado de pago
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PlaidLinkButton variant="primary" onSuccess={fetchDebts} />
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Debt */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-950/30 to-zinc-950 border border-rose-500/30 shadow-lg">
          <div className="text-xs text-rose-400 font-medium uppercase tracking-wider mb-1">Total Pasivos / Deudas</div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            ${totalDebt.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Suma de saldos pendientes en tarjetas y préstamos</p>
        </div>

        {/* Minimum Monthly Payment */}
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg">
          <div className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Pago Mínimo Mensual</div>
          <div className="text-3xl font-extrabold text-amber-400 tracking-tight">
            ${totalMinPayment.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Compromiso mínimo mensual requerido</p>
        </div>

        {/* Credit Utilization */}
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Uso de Crédito (Tarjetas)</span>
            <span className="font-bold text-white">{utilizationRatio}%</span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-3 border border-zinc-800 overflow-hidden my-3">
            <div
              className={`h-full rounded-full transition-all ${
                utilizationRatio > 50 ? "bg-rose-500" : utilizationRatio > 30 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(utilizationRatio, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-500">
            ${totalCardBalance.toLocaleString("en-US")} de ${totalCardLimit.toLocaleString("en-US")} límite total
          </p>
        </div>
      </div>

      {/* Debt List Breakdown */}
      {debtAccounts.length === 0 ? (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto">
            <CreditCard className="w-6 h-6 text-rose-400" />
          </div>
          <h3 className="text-base font-semibold text-white">No tienes deudas ni tarjetas registradas</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Conecta tus tarjetas de crédito y préstamos para activar el simulador inteligente de pago.
          </p>
          <div className="pt-2">
            <PlaidLinkButton variant="primary" onSuccess={fetchDebts} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Debt Accounts Cards */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-white">Listado de Créditos y Pasivos</h3>

            <div className="space-y-3">
              {debtAccounts.map((acc: any) => {
                const debt = acc.debt;
                const isCard = acc.type === "CREDIT_CARD";
                const isAuto = acc.subtype?.includes("auto");
                const isHome = acc.type === "MORTGAGE" || acc.subtype?.includes("mortgage");

                return (
                  <div
                    key={acc.id}
                    className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
                        {isHome ? (
                          <Home className="w-5 h-5 text-indigo-400" />
                        ) : isAuto ? (
                          <Car className="w-5 h-5 text-amber-400" />
                        ) : (
                          <CreditCard className="w-5 h-5 text-rose-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{acc.name}</h4>
                        <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1">
                          <span>{acc.subtype || acc.type}</span>
                          {debt?.apr && (
                            <span className="text-rose-400 font-medium bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                              APR: {debt.apr}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800">
                      <div className="text-xs text-zinc-400">Saldo Pendiente</div>
                      <div className="text-lg font-bold text-rose-400">
                        ${Number(acc.currentBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                      {debt?.minimumPayment && (
                        <div className="text-[10px] text-zinc-500">Mínimo: ${Number(debt.minimumPayment).toFixed(2)}/mes</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Debt Payoff Simulator */}
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-6 h-fit">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Simulador de Pago Acelerado</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">Calcula en cuánto tiempo quedarás libre de deudas.</p>
            </div>

            {/* Strategy Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
              <button
                onClick={() => setStrategy("AVALANCHE")}
                className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  strategy === "AVALANCHE"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Avalancha</span>
              </button>

              <button
                onClick={() => setStrategy("SNOWBALL")}
                className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  strategy === "SNOWBALL"
                    ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Snowflake className="w-3.5 h-3.5" />
                <span>Bola de Nieve</span>
              </button>
            </div>

            {/* Extra Monthly Payment Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Pago Adicional Mensual:</span>
                <span className="font-bold text-emerald-400">${extraPayment}/mes</span>
              </div>
              <input
                type="range"
                min={0}
                max={2000}
                step={50}
                value={extraPayment}
                onChange={(e) => setExtraPayment(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-zinc-950 rounded-lg cursor-pointer"
              />
            </div>

            {/* Simulation Result */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-center">
              <div className="text-xs text-zinc-400">Tiempo Estimado Libre de Deuda</div>
              <div className="text-2xl font-black text-emerald-400">{monthsToPayoff} Meses</div>
              <p className="text-[10px] text-zinc-500">
                Pagando ${totalMinPayment + extraPayment}/mes en estrategia{" "}
                {strategy === "AVALANCHE" ? "Avalancha (mayor interés primero)" : "Bola de Nieve (menor saldo primero)"}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
