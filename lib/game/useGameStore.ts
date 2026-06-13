"use client";

import { create } from "zustand";
import { initialInventory, items } from "@/data/items";
import { pets as seedPets } from "@/data/pets";
import { tasks } from "@/data/tasks";
import { applyRewards } from "./calculateRewards";
import { calculateTaskSuccess } from "./calculateTaskSuccess";
import { careLabels } from "./constants";
import { addExpAndLevel } from "./levelSystem";
import { applyItemEffect, applyPetCare } from "./petCare";
import type { CurrencyState, Pet, Reward, RewardResult, Task } from "./types";

type Toast = { id: number; message: string };
type RewardModalState = {
  title: string;
  subtitle?: string;
  rewards: Reward[];
  success?: boolean;
  levelUp?: RewardResult["levelUp"];
};

type GameState = {
  activePetId: string;
  activeLocationId: string;
  pets: Pet[];
  currencies: CurrencyState;
  inventory: Record<string, number>;
  rewardModal: RewardModalState | null;
  toast: Toast | null;
  completedTasks: Record<string, number>;
  notice: string;
  setActivePet: (petId: string) => void;
  setActiveLocation: (locationId: string) => void;
  careForPet: (action: string) => void;
  completeTask: (taskId: string) => void;
  useItem: (itemId: string) => void;
  buyItem: (itemId: string) => void;
  closeRewardModal: () => void;
  clearToast: () => void;
};

const findActivePet = (state: Pick<GameState, "pets" | "activePetId">) =>
  state.pets.find((pet) => pet.id === state.activePetId) ?? state.pets[0];

const expReward = (rewards: Reward[]) =>
  rewards.filter((reward) => reward.type === "exp").reduce((total, reward) => total + reward.amount, 0);

const inventoryRewards = (rewards: Reward[]) => rewards.filter((reward) => reward.type !== "exp");

export const useGameStore = create<GameState>((set, get) => ({
  activePetId: seedPets[0].id,
  activeLocationId: "town_plaza",
  pets: seedPets,
  currencies: { coins: 500, stars: 20 },
  inventory: initialInventory,
  rewardModal: null,
  toast: null,
  completedTasks: {},
  notice: `${seedPets[0].displayName} is waiting in Town Plaza.`,

  setActivePet: (petId) =>
    set((state) => {
      const pet = state.pets.find((candidate) => candidate.id === petId);
      return pet
        ? {
            activePetId: petId,
            notice: `${pet.displayName} joined the plaza.`,
            toast: { id: Date.now(), message: `${pet.displayName} selected` },
          }
        : state;
    }),

  setActiveLocation: (locationId) => set({ activeLocationId: locationId }),

  careForPet: (action) =>
    set((state) => {
      const activePet = findActivePet(state);
      const nextPet = applyPetCare(activePet, action);
      const label = careLabels[action] ?? "Care";

      return {
        pets: state.pets.map((pet) => (pet.id === activePet.id ? nextPet : pet)),
        notice: `${activePet.displayName}: ${label} complete.`,
        toast: { id: Date.now(), message: `${label} complete` },
      };
    }),

  completeTask: (taskId) =>
    set((state) => {
      const task = tasks.find((candidate) => candidate.id === taskId);
      const activePet = findActivePet(state);
      if (!task) return state;

      if (activePet.level < task.unlockLevel) {
        return {
          toast: { id: Date.now(), message: `Unlocks at level ${task.unlockLevel}` },
          notice: `${task.name} needs pet level ${task.unlockLevel}.`,
        };
      }

      if (activePet.needs.energy < task.energyCost) {
        return {
          toast: { id: Date.now(), message: "Not enough energy" },
          notice: `${activePet.displayName} needs more energy before ${task.name}.`,
        };
      }

      const fatiguePenalty = Math.max(0, 45 - activePet.needs.energy) * 0.4;
      const successRate = calculateTaskSuccess(task, activePet, fatiguePenalty);
      const success = successRate >= 50;
      const taskRewards = success ? task.rewards : task.rewards.filter((reward) => reward.type === "exp").map((reward) => ({ ...reward, amount: Math.max(5, Math.floor(reward.amount / 3)) }));
      const visibleRewards = inventoryRewards(taskRewards);
      const rewardUpdates = applyRewards(state.currencies, state.inventory, visibleRewards);
      const leveled = addExpAndLevel(
        {
          ...activePet,
          needs: { ...activePet.needs, energy: Math.max(0, activePet.needs.energy - task.energyCost) },
        },
        expReward(taskRewards),
      );

      return {
        pets: state.pets.map((pet) => (pet.id === activePet.id ? leveled.pet : pet)),
        currencies: rewardUpdates.currencies,
        inventory: rewardUpdates.inventory,
        completedTasks: { ...state.completedTasks, [taskId]: (state.completedTasks[taskId] ?? 0) + 1 },
        activeLocationId: task.locationId,
        rewardModal: {
          title: leveled.levelUp ? "Level Up!" : success ? `${task.name} Complete` : `${task.name} Attempted`,
          subtitle: success ? `${activePet.displayName} succeeded at ${successRate}%.` : `${activePet.displayName} still earned practice EXP.`,
          rewards: taskRewards,
          success,
          levelUp: leveled.levelUp,
        },
        notice: `${task.name}: ${success ? "success" : "practice run"} at ${successRate}%.`,
        toast: { id: Date.now(), message: success ? "Task complete" : "Practice EXP earned" },
      };
    }),

  useItem: (itemId) =>
    set((state) => {
      const item = items.find((candidate) => candidate.id === itemId);
      const count = state.inventory[itemId] ?? 0;
      if (!item || count <= 0) return { toast: { id: Date.now(), message: "Item unavailable" } };

      const activePet = findActivePet(state);
      const nextPet = applyItemEffect(activePet, item.effect as Record<string, number>);

      return {
        pets: state.pets.map((pet) => (pet.id === activePet.id ? nextPet : pet)),
        inventory: { ...state.inventory, [itemId]: count - 1 },
        notice: `${activePet.displayName} used ${item.name}.`,
        toast: { id: Date.now(), message: `${item.name} used` },
      };
    }),

  buyItem: (itemId) =>
    set((state) => {
      const item = items.find((candidate) => candidate.id === itemId);
      if (!item) return state;
      if (state.currencies.coins < item.price) {
        return { toast: { id: Date.now(), message: "Not enough coins" } };
      }
      return {
        currencies: { ...state.currencies, coins: state.currencies.coins - item.price },
        inventory: { ...state.inventory, [itemId]: (state.inventory[itemId] ?? 0) + 1 },
        toast: { id: Date.now(), message: `${item.name} bought` },
      };
    }),

  closeRewardModal: () => set({ rewardModal: null }),
  clearToast: () => set({ toast: null }),
}));

export function selectActivePet(state: GameState) {
  return findActivePet(state);
}

export function getTaskById(taskId: string): Task | undefined {
  return tasks.find((task) => task.id === taskId);
}
