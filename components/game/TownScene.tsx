"use client";

import { locations } from "@/data/locations";
import { useGameStore } from "@/lib/game/useGameStore";

export function TownScene() {
  const activeLocationId = useGameStore((state) => state.activeLocationId);
  const setActiveLocation = useGameStore((state) => state.setActiveLocation);

  return (
    <section className="town-scene" aria-label="Interactive Pocket Town map">
      <img src="/assets/locations/town-plaza-scene.png" alt="Pocket Town plaza" />
      {locations.map((location) => (
        <button
          key={location.id}
          type="button"
          className={`location-hotspot ${activeLocationId === location.id ? "is-active" : ""}`}
          style={{ left: `${location.x}%`, top: `${location.y}%` }}
          onClick={() => setActiveLocation(location.id)}
        >
          <i className={`fa-solid ${location.icon}`} aria-hidden="true" />
          <span>{location.name}</span>
        </button>
      ))}
    </section>
  );
}
