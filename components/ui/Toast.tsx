"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/game/useGameStore";

export function Toast() {
  const toast = useGameStore((state) => state.toast);
  const clearToast = useGameStore((state) => state.clearToast);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(clearToast, 2200);
    return () => window.clearTimeout(timer);
  }, [clearToast, toast]);

  if (!toast) return null;
  return <div className="toast" role="status">{toast.message}</div>;
}
