"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PetCarousel } from "@/components/game/PetCarousel";
import { PetStatusPanel } from "@/components/game/PetStatusPanel";
import { selectActivePet, useGameStore } from "@/lib/game/useGameStore";
import { Badge } from "@/components/ui/Badge";

export default function PetsPage() {
  const pet = useGameStore(selectActivePet);
  return (
    <AppShell compact>
      <div className="route-grid route-grid--pets">
        <PetStatusPanel />
        <section className="page-panel">
          <div className="section-heading">
            <h1>Pet Growth</h1>
            <span>{pet.displayName} profile</span>
          </div>
          <div className="growth-card">
            <img src={pet.assets.avatar} alt={`${pet.displayName} growth portrait`} />
            <div>
              <h2>{pet.displayName}</h2>
              <p>{pet.species} companion focused on {pet.mainStat}. Level every 100 EXP to gain stats and restore energy.</p>
              <div className="badge-row">
                <Badge tone={pet.rarity}>{pet.rarity}</Badge>
                <Badge tone="neutral">{pet.stage}</Badge>
                <Badge tone="training">{pet.mainStat}</Badge>
              </div>
            </div>
          </div>
          <PetCarousel />
        </section>
      </div>
    </AppShell>
  );
}
