"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlaidLinkButton from "@/components/plaid/PlaidLinkButton";
import { LogOut, User as UserIcon, Shield, RefreshCw } from "lucide-react";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        }
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800/80 px-3 py-1.5 rounded-full">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium text-zinc-300">Sesión Encriptada Aislada</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <PlaidLinkButton variant="secondary" onSuccess={() => window.location.reload()} />

        {user ? (
          <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
              <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-xs font-medium text-zinc-200">{user.name || user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar Sesión"
              className="p-2 text-zinc-400 hover:text-rose-400 bg-zinc-900 border border-zinc-800 hover:border-rose-500/30 rounded-xl transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl transition"
          >
            Iniciar Sesión
          </a>
        )}
      </div>
    </header>
  );
}
