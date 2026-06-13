"use client";

import { careIcons, careLabels } from "@/lib/game/constants";
import { useGameStore } from "@/lib/game/useGameStore";
import { Button } from "@/components/ui/Button";

const actions = ["feed", "bath", "play", "rest"];

export function CareActions() {
  const careForPet = useGameStore((state) => state.careForPet);

  return (
    <section className="care-actions" aria-label="Care actions">
      <div className="section-heading">
        <h2>Quick Care</h2>
        <span>Need changes save locally</span>
      </div>
      <div className="care-actions__grid">
        {actions.map((action) => (
          <Button key={action} variant="secondary" icon={careIcons[action]} onClick={() => careForPet(action)}>
            {careLabels[action]}
          </Button>
        ))}
      </div>
    </section>
  );
}
