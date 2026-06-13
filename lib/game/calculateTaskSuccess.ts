import type { Pet, Task } from "./types";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function calculateTaskSuccess(task: Task, pet: Pet, fatiguePenalty = 0) {
  const raw =
    task.baseSuccessRate +
    pet.stats[task.recommendedStat] * 1.5 +
    pet.needs.mood * 0.15 -
    fatiguePenalty;

  return Math.round(clamp(raw, 5, 95));
}
