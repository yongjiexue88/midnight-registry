import { MAX_NEED, MIN_NEED, careDeltas } from "./constants";
import type { NeedKey, Pet } from "./types";

const clamp = (value: number) => Math.min(MAX_NEED, Math.max(MIN_NEED, value));

export function applyPetCare(pet: Pet, action: keyof typeof careDeltas): Pet {
  const deltas = careDeltas[action];
  return {
    ...pet,
    needs: Object.entries(deltas).reduce(
      (needs, [key, value]) => ({
        ...needs,
        [key]: clamp((needs[key as NeedKey] ?? 0) + (value ?? 0)),
      }),
      pet.needs,
    ),
  };
}

export function applyItemEffect(pet: Pet, effect: Record<string, number>): Pet {
  const next = { ...pet, needs: { ...pet.needs }, stats: { ...pet.stats } };
  for (const [key, value] of Object.entries(effect)) {
    if (key in next.needs) next.needs[key as NeedKey] = clamp(next.needs[key as NeedKey] + value);
    if (key in next.stats) next.stats[key as keyof typeof next.stats] += value;
  }
  return next;
}
