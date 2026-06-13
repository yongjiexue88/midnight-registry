"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/game/useGameStore";

export function GameRuntimeHooks() {
  useEffect(() => {
    window.render_game_to_text = () => {
      const state = useGameStore.getState();
      const pet = state.pets.find((candidate) => candidate.id === state.activePetId) ?? state.pets[0];
      return JSON.stringify({
        coordinate_system: "DOM layout; town hotspots use percent positions from top-left, x right and y down.",
        mode: state.rewardModal ? "reward-modal" : "game-ui",
        activePet: {
          id: pet.id,
          name: pet.displayName,
          level: pet.level,
          exp: pet.exp,
          needs: pet.needs,
          stats: pet.stats,
        },
        currencies: state.currencies,
        inventoryCount: Object.values(state.inventory).reduce((total, count) => total + count, 0),
        activeLocationId: state.activeLocationId,
        notice: state.notice,
        completedTasks: state.completedTasks,
      });
    };

    window.advanceTime = (ms = 1000) => {
      const steps = Math.max(1, Math.round(ms / 1000));
      for (let i = 0; i < steps; i += 1) {
        useGameStore.setState((current) => ({
          pets: current.pets.map((pet) =>
            pet.id === current.activePetId
              ? {
                  ...pet,
                  needs: {
                    ...pet.needs,
                    hunger: Math.max(0, pet.needs.hunger - 1),
                    mood: Math.max(0, pet.needs.mood - 1),
                    cleanliness: Math.max(0, pet.needs.cleanliness - 1),
                    energy: Math.max(0, pet.needs.energy - 0.5),
                  },
                }
              : pet,
          ),
        }));
      }
    };

    return () => {
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, []);

  return null;
}
