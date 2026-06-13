import type { Reward } from "@/lib/game/types";

export const starterRewards: Reward[] = [
  { type: "coins", amount: 500 },
  { type: "stars", amount: 20 },
  { type: "food", itemId: "town_burger", amount: 3, rarity: "common" },
  { type: "toy", itemId: "bounce_ball", amount: 1, rarity: "common" },
];

export const levelUpRewards: Reward[] = [
  { type: "coins", amount: 100 },
  { type: "stars", amount: 10 },
  { type: "food", itemId: "lucky_carrot", amount: 1, rarity: "epic" },
];
