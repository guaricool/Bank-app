"use client";

import { useState, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Landmark, Loader2 } from "lucide-react";

interface PlaidLinkButtonProps {
  onSuccess?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "hero";
}

export default function PlaidLinkButton({ onSuccess, className = "", variant = "primary" }: PlaidLinkButtonProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLinkToken = async () => {
    if (token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/plaid/create-link-token", { method: "POST" });
      if (!res.ok) {
        console.warn("Plaid token request returned status:", res.status);
        return;
      }
      const data = await res.json();
      if (data.link_token) {
        setToken(data.link_token);
      }
    } catch (err) {
      console.error("Failed to get Plaid link token:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaidSuccess = useCallback(
    async (public_token: string, metadata: any) => {
      setLoading(true);
      try {
        const res = await fetch("/api/plaid/exchange-public-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token, metadata }),
        });
        if (res.ok && onSuccess) {
          onSuccess();
        }
      } catch (err) {
        console.error("Failed to exchange Plaid token:", err);
      } finally {
        setLoading(false);
      }
    },
    [onSuccess]
  );

  const { open, ready } = usePlaidLink({
    token: token || "",
    onSuccess: handlePlaidSuccess,
  });

  const handleClick = async () => {
    if (!token) {
      setLoading(true);
      try {
        const res = await fetch("/api/plaid/create-link-token", { method: "POST" });
        if (!res.ok) {
          console.warn("Plaid token request returned status:", res.status);
          return;
        }
        const data = await res.json();
        if (data.link_token) {
          setToken(data.link_token);
          // Wait a tick for hook update
          setTimeout(() => {
            if (open) open();
          }, 200);
        }
      } catch (err) {
        console.error("Error creating Plaid token:", err);
      } finally {
        setLoading(false);
      }
    } else if (ready) {
      open();
    }
  };

  if (variant === "hero") {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 ${className}`}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Landmark className="w-4 h-4" />}
        <span>Conectar Banco con Plaid</span>
      </button>
    );
  }

  if (variant === "secondary") {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl text-xs transition flex items-center justify-center gap-2 border border-zinc-700 disabled:opacity-50 ${className}`}
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <Landmark className="w-3.5 h-3.5 text-emerald-400" />}
        <span>Vincular Cuenta (Plaid)</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-medium rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-50 ${className}`}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Landmark className="w-3.5 h-3.5" />}
      <span>Vincular con Plaid</span>
    </button>
  );
}
