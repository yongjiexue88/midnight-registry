"use client";

import { needLabels, statLabels } from "@/lib/game/constants";
import { selectActivePet, useGameStore } from "@/lib/game/useGameStore";
import type { NeedKey, StatKey } from "@/lib/game/types";
import { StatBar } from "@/components/ui/StatBar";
import { Badge } from "@/components/ui/Badge";

const needIcons: Record<NeedKey, string> = {
  hunger: "fa-burger",
  mood: "fa-face-smile",
  cleanliness: "fa-shower",
  energy: "fa-bolt",
  bond: "fa-heart",
};

const needTones: Record<NeedKey, string> = {
  hunger: "orange",
  mood: "lime",
  cleanliness: "cyan",
  energy: "gold",
  bond: "pink",
};

export function PetStatusPanel() {
  const pet = useGameStore(selectActivePet);
  const statEntries = Object.entries(pet.stats) as [StatKey, number][];

  return (
    <section className="pet-status-panel">
      <div className="panel-title">
        <span>Active companion</span>
        <h2>{pet.displayName}</h2>
      </div>
      <div className="status-portrait">
        <img src={pet.assets.avatar} alt={`${pet.displayName} portrait`} />
        <div>
          <Badge tone={pet.rarity} icon="fa-gem">{pet.rarity}</Badge>
          <Badge tone="neutral" icon="fa-seedling">{pet.stage}</Badge>
        </div>
      </div>
      <div className="care-meter-list">
        {(Object.entries(pet.needs) as [NeedKey, number][]).map(([key, value]) => (
          <StatBar key={key} label={needLabels[key]} value={value} icon={needIcons[key]} tone={needTones[key]} />
        ))}
      </div>
      <div className="stat-chip-grid">
        {statEntries.map(([key, value]) => (
          <span key={key} className="stat-chip">
            <i className={`fa-solid ${key === "charm" ? "fa-star" : key === "strength" ? "fa-dumbbell" : key === "intelligence" ? "fa-book" : "fa-clover"}`} aria-hidden="true" />
            <strong>{value}</strong>
            <small>{statLabels[key]}</small>
          </span>
        ))}
      </div>
    </section>
  );
}
