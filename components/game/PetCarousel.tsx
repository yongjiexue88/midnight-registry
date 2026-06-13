"use client";

import { useGameStore } from "@/lib/game/useGameStore";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function PetCarousel() {
  const activePetId = useGameStore((state) => state.activePetId);
  const pets = useGameStore((state) => state.pets);
  const setActivePet = useGameStore((state) => state.setActivePet);

  return (
    <section className="pet-carousel" aria-label="Pet carousel">
      <div className="section-heading">
        <h2>Companions</h2>
        <span>{pets.length} / 12</span>
      </div>
      <div className="pet-carousel__track">
        {pets.map((pet) => (
          <button
            key={pet.id}
            type="button"
            className={`pet-card ${pet.id === activePetId ? "is-active" : ""}`}
            onClick={() => setActivePet(pet.id)}
          >
            <img src={pet.assets.avatar} alt={`${pet.displayName} avatar`} />
            <strong>{pet.displayName}</strong>
            <span>
              Lv. {pet.level} · {pet.rarity}
            </span>
            <ProgressBar value={pet.exp} max={100} />
          </button>
        ))}
      </div>
    </section>
  );
}
