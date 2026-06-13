import type { ReactNode } from "react";
import { GameRuntimeHooks } from "@/components/game/GameRuntimeHooks";
import { RewardModal } from "@/components/game/RewardModal";
import { Toast } from "@/components/ui/Toast";
import { BottomNav } from "./BottomNav";
import { TopResourceBar } from "./TopResourceBar";

type AppShellProps = {
  children: ReactNode;
  compact?: boolean;
};

export function AppShell({ children, compact = false }: AppShellProps) {
  return (
    <main className={`app-shell ${compact ? "app-shell--compact" : ""}`}>
      <TopResourceBar />
      {children}
      <BottomNav />
      <RewardModal />
      <Toast />
      <GameRuntimeHooks />
    </main>
  );
}
