import { EXP_PER_LEVEL } from "./constants";
import type { Pet, StatKey } from "./types";

const statOrder: StatKey[] = ["charm", "strength", "intelligence", "luck"];

export function addExpAndLevel(pet: Pet, exp: number): { pet: Pet; levelUp?: { level: number; statGains: Record<StatKey, number> } } {
  let nextExp = pet.exp + exp;
  let level = pet.level;
  const statGains: Record<StatKey, number> = { charm: 0, strength: 0, intelligence: 0, luck: 0 };

  while (nextExp >= EXP_PER_LEVEL) {
    nextExp -= EXP_PER_LEVEL;
    level += 1;
    for (const stat of statOrder) {
      const deterministicGain = ((level + stat.length) % 3) + 1;
      statGains[stat] += deterministicGain;
    }
  }

  if (level === pet.level) return { pet: { ...pet, exp: nextExp } };

  return {
    pet: {
      ...pet,
      level,
      exp: nextExp,
      stats: {
        charm: pet.stats.charm + statGains.charm,
        strength: pet.stats.strength + statGains.strength,
        intelligence: pet.stats.intelligence + statGains.intelligence,
        luck: pet.stats.luck + statGains.luck,
      },
      needs: { ...pet.needs, energy: 100 },
    },
    levelUp: { level, statGains },
  };
}
