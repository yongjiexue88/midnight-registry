"use client";

import { items } from "@/data/items";
import { useGameStore } from "@/lib/game/useGameStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function InventoryPanel({ mode = "use" }: { mode?: "use" | "shop" }) {
  const inventory = useGameStore((state) => state.inventory);
  const useItem = useGameStore((state) => state.useItem);
  const buyItem = useGameStore((state) => state.buyItem);

  return (
    <section className="inventory-panel">
      <div className="inventory-grid">
        {items.map((item) => {
          const count = inventory[item.id] ?? 0;
          return (
            <article key={item.id} className="inventory-card">
              <span className="inventory-card__icon">
                <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
              </span>
              <div>
                <strong>{item.name}</strong>
                <Badge tone={item.rarity}>{item.rarity}</Badge>
              </div>
              <p>{Object.entries(item.effect).map(([key, value]) => `${key} ${value && value > 0 ? "+" : ""}${value}`).join(" · ")}</p>
              <small>{mode === "shop" ? `${item.price} coins` : `Owned ${count}`}</small>
              <Button
                variant={mode === "shop" ? "primary" : count > 0 ? "secondary" : "ghost"}
                icon={mode === "shop" ? "fa-cart-plus" : "fa-wand-magic-sparkles"}
                onClick={() => (mode === "shop" ? buyItem(item.id) : useItem(item.id))}
              >
                {mode === "shop" ? "Buy" : "Use"}
              </Button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
