"use client";

import Link from "next/link";
import { selectActivePet, useGameStore } from "@/lib/game/useGameStore";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function TopResourceBar() {
  const pet = useGameStore(selectActivePet);
  const currencies = useGameStore((state) => state.currencies);
  const inventory = useGameStore((state) => state.inventory);

  return (
    <header className="top-resource-bar" aria-label="Pocket Town resources">
      <Link className="pet-profile-pill" href="/pets">
        <img src={pet.assets.avatar} alt={`${pet.displayName} avatar`} />
        <span>
          <strong>{pet.displayName}</strong>
          <small>
            {pet.species} · Lv. {pet.level}
          </small>
          <ProgressBar value={pet.exp} max={100} label="Pet EXP" />
        </span>
      </Link>

      <nav className="resource-pills" aria-label="Currencies">
        <Link href="/shop" className="resource-pill" data-tone="gold">
          <i className="fa-solid fa-coins" aria-hidden="true" />
          <strong>{currencies.coins.toLocaleString()}</strong>
        </Link>
        <Link href="/tasks" className="resource-pill" data-tone="star">
          <i className="fa-solid fa-star" aria-hidden="true" />
          <strong>{currencies.stars.toLocaleString()}</strong>
        </Link>
        <Link href="/inventory" className="resource-pill" data-tone="pink">
          <i className="fa-solid fa-box-open" aria-hidden="true" />
          <strong>{Object.values(inventory).reduce((total, count) => total + count, 0)}</strong>
        </Link>
      </nav>

      <nav className="utility-nav" aria-label="Utility">
        <Link href="/friends" aria-label="Friends">
          <i className="fa-solid fa-user-group" aria-hidden="true" />
        </Link>
        <Link href="/design-system" aria-label="Design system">
          <i className="fa-solid fa-swatchbook" aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}
