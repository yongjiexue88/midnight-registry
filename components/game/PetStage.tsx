"use client";

import { locations } from "@/data/locations";
import { selectActivePet, useGameStore } from "@/lib/game/useGameStore";

export function PetStage() {
  const pet = useGameStore(selectActivePet);
  const notice = useGameStore((state) => state.notice);
  const activeLocationId = useGameStore((state) => state.activeLocationId);
  const activeLocation = locations.find((location) => location.id === activeLocationId) ?? locations[0];

  return (
    <section className="pet-stage" aria-label="Current pet stage">
      <img src={pet.assets.idle} alt={`${pet.displayName} idle pose`} />
      <div>
        <span>{activeLocation.name}</span>
        <strong>{notice}</strong>
      </div>
    </section>
  );
}
