"use client";

import { locations } from "@/data/locations";
import { useGameStore } from "@/lib/game/useGameStore";

export function LocationMap() {
  const activeLocationId = useGameStore((state) => state.activeLocationId);
  const setActiveLocation = useGameStore((state) => state.setActiveLocation);

  return (
    <section className="location-map">
      <div className="section-heading">
        <h2>Pocket Town</h2>
        <span>{locations.length} areas</span>
      </div>
      <div className="mini-map">
        <img src="/assets/locations/town-plaza-scene.png" alt="Pocket Town mini map" />
        {locations.map((location) => (
          <button
            key={location.id}
            type="button"
            className={location.id === activeLocationId ? "is-active" : ""}
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
            onClick={() => setActiveLocation(location.id)}
            aria-label={`Select ${location.name}`}
          >
            <i className={`fa-solid ${location.icon}`} aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
