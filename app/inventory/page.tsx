import { AppShell } from "@/components/layout/AppShell";
import { InventoryPanel } from "@/components/game/InventoryPanel";

export default function InventoryPage() {
  return (
    <AppShell compact>
      <section className="page-panel">
        <div className="section-heading">
          <h1>Inventory</h1>
          <span>Use items on the active pet</span>
        </div>
        <InventoryPanel />
      </section>
    </AppShell>
  );
}
