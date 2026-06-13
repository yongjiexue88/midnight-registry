"use client";

import { useEffect } from "react";
import { CareActions } from "./CareActions";
import { LocationMap } from "./LocationMap";
import { PetCarousel } from "./PetCarousel";
import { PetStage } from "./PetStage";
import { PetStatusPanel } from "./PetStatusPanel";
import { TaskBoard } from "./TaskBoard";
import { TownScene } from "./TownScene";
import { selectActivePet, useGameStore } from "@/lib/game/useGameStore";

export function TownExperience() {
  const state = useGameStore();
  const activePet = useGameStore(selectActivePet);

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        coordinate_system: "DOM layout; town hotspots use percent positions from top-left, x right and y down.",
        mode: state.rewardModal ? "reward-modal" : "town",
        activePet: {
          id: activePet.id,
          name: activePet.displayName,
          level: activePet.level,
          exp: activePet.exp,
          needs: activePet.needs,
          stats: activePet.stats,
        },
        currencies: state.currencies,
        inventoryCount: Object.values(state.inventory).reduce((total, count) => total + count, 0),
        activeLocationId: state.activeLocationId,
        notice: state.notice,
        completedTasks: state.completedTasks,
      });

    window.advanceTime = (ms = 1000) => {
      const steps = Math.max(1, Math.round(ms / 1000));
      for (let i = 0; i < steps; i += 1) {
        useGameStore.setState((current) => {
          const pet = current.pets.find((candidate) => candidate.id === current.activePetId);
          if (!pet) return current;
          return {
            pets: current.pets.map((candidate) =>
              candidate.id === pet.id
                ? {
                    ...candidate,
                    needs: {
                      ...candidate.needs,
                      hunger: Math.max(0, candidate.needs.hunger - 1),
                      mood: Math.max(0, candidate.needs.mood - 1),
                      cleanliness: Math.max(0, candidate.needs.cleanliness - 1),
                      energy: Math.max(0, candidate.needs.energy - 0.5),
                    },
                  }
                : candidate,
            ),
          };
        });
      }
    };

    return () => {
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, [activePet, state]);

  return (
    <div className="town-layout">
      <PetStatusPanel />
      <div className="town-layout__center">
        <PetStage />
        <TownScene />
      </div>
      <div className="town-layout__right">
        <TaskBoard compact />
        <LocationMap />
      </div>
      <div className="town-layout__bottom">
        <PetCarousel />
        <CareActions />
      </div>
    </div>
  );
}
