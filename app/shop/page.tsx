import { AppShell } from "@/components/layout/AppShell";
import { InventoryPanel } from "@/components/game/InventoryPanel";

export default function ShopPage() {
  return (
    <AppShell compact>
      <section className="page-panel">
        <div className="section-heading">
          <h1>Shop</h1>
          <span>Food, toys, furniture, and outfits</span>
        </div>
        <InventoryPanel mode="shop" />
      </section>
    </AppShell>
  );
}
