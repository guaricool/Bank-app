"use client";

import { useEffect, useState } from "react";
import PlaidLinkButton from "@/components/plaid/PlaidLinkButton";
import { Wallet, Landmark, ArrowUpRight, Loader2, Plus, Building2 } from "lucide-react";

export default function SavingsAndCheckingPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
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
    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-xs text-zinc-400">Cargando cuentas líquidas...</p>
      </div>
    );
  }

  const liquidAccounts = data?.liquidAccounts || [];
  const totalLiquid = liquidAccounts.reduce((acc: number, item: any) => acc + Number(item.currentBalance), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <span>Cuentas de Ahorro y Débito</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Gestión exclusiva de tus fondos disponibles y depósitos a la vista
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PlaidLinkButton variant="primary" onSuccess={fetchAccounts} />
        </div>
      </div>

      {/* Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs text-emerald-400 font-medium uppercase tracking-wider mb-1">
            Total en Efectivo y Fondos Disponibles
          </div>
          <div className="text-4xl font-extrabold text-white tracking-tight">
            ${totalLiquid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-zinc-400 mt-1">Suma de cuentas de cheques y ahorros vinculadas</p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl">
            <div className="text-zinc-500">Cuentas Vinculadas</div>
            <div className="text-lg font-bold text-white mt-0.5">{liquidAccounts.length}</div>
          </div>
        </div>
      </div>

      {/* Account List Grid */}
      {liquidAccounts.length === 0 ? (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <Landmark className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-base font-semibold text-white">No tienes cuentas de ahorro o débito conectadas</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Conecta tus bancos con Plaid para importar automáticamente tus cuentas de cheques y ahorros.
          </p>
          <div className="pt-2">
            <PlaidLinkButton variant="primary" onSuccess={fetchAccounts} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liquidAccounts.map((acc: any) => {
            const isSavings = acc.type === "SAVINGS" || acc.subtype === "savings";
            return (
              <div
                key={acc.id}
                className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-emerald-500/30 transition-all shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span
                      className={`text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isSavings
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                      }`}
                    >
                      {isSavings ? "Ahorros" : "Cheques / Débito"}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition">
                    {acc.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{acc.officialName || acc.subtype || "Cuenta Débito"}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/60">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Saldo Disponible</div>
                  <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                    ${Number(acc.currentBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
