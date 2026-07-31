"use client";

import { useState, useCallback, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Landmark, Loader2, AlertCircle } from "lucide-react";

interface PlaidLinkButtonProps {
  onSuccess?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "hero";
}

export default function PlaidLinkButton({ onSuccess, className = "", variant = "primary" }: PlaidLinkButtonProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Open Plaid modal ONLY when token exists AND Plaid SDK is ready
  useEffect(() => {
    if (token && ready) {
      open();
      setLoading(false);
    }
  }, [token, ready, open]);

  const handleClick = async () => {
    setErrorMessage(null);
    if (token && ready) {
      open();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/plaid/create-link-token", { method: "POST" });
      const data = await res.json();

      if (!res.ok || data.error || !data.link_token) {
        setErrorMessage(
          data.error || "Plaid requiere configurar PLAID_CLIENT_ID y PLAID_SECRET en las variables de entorno de Coolify."
        );
        setLoading(false);
        return;
      }

      setToken(data.link_token);
    } catch (err) {
      console.error("Error creating Plaid token:", err);
      setErrorMessage("Error de conexión al obtener token de Plaid");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      {variant === "hero" ? (
        <button
          onClick={handleClick}
          disabled={loading}
          className={`px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 ${className}`}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Landmark className="w-4 h-4" />}
          <span>Conectar Banco con Plaid</span>
        </button>
      ) : variant === "secondary" ? (
        <button
          onClick={handleClick}
          disabled={loading}
          className={`px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl text-xs transition flex items-center justify-center gap-2 border border-zinc-700 disabled:opacity-50 ${className}`}
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <Landmark className="w-3.5 h-3.5 text-emerald-400" />}
          <span>Vincular Cuenta (Plaid)</span>
        </button>
      ) : (
        <button
          onClick={handleClick}
          disabled={loading}
          className={`px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-medium rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-50 ${className}`}
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Landmark className="w-3.5 h-3.5" />}
          <span>Vincular con Plaid</span>
        </button>
      )}

      {errorMessage && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-start gap-2 max-w-md">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
