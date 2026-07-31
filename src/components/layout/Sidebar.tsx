"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, CreditCard, ReceiptText, ShieldCheck } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Resumen General",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Ahorros y Débito",
      href: "/accounts",
      icon: Wallet,
    },
    {
      name: "Deudas y Créditos",
      href: "/debt-payoff",
      icon: CreditCard,
    },
    {
      name: "Transacciones",
      href: "/transactions",
      icon: ReceiptText,
    },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800/80 flex flex-col justify-between p-4 sticky top-0 h-screen select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-zinc-800/60">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px]">
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-zinc-100">Family Finance</h1>
            <p className="text-[10px] text-zinc-400 font-mono tracking-wider">MODO PRIVADO v1.0</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-zinc-500"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Security Footer */}
      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60 text-center">
        <p className="text-[10px] text-zinc-400">Tus datos bancarios y personales nunca se comparten con terceros.</p>
      </div>
    </aside>
  );
}
