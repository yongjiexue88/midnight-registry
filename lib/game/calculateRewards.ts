import type { CurrencyState, InventoryItem, Reward } from "./types";

export function applyRewards(
  currencies: CurrencyState,
  inventory: Record<string, number>,
  rewards: Reward[],
) {
  const nextCurrencies = { ...currencies };
  const nextInventory = { ...inventory };

  for (const reward of rewards) {
    if (reward.type === "coins") nextCurrencies.coins += reward.amount;
    if (reward.type === "stars") nextCurrencies.stars += reward.amount;
    if (reward.itemId) nextInventory[reward.itemId] = (nextInventory[reward.itemId] ?? 0) + reward.amount;
  }

  return { currencies: nextCurrencies, inventory: nextInventory };
}

export function canAffordItem(currencies: CurrencyState, item: InventoryItem) {
  return currencies.coins >= item.price;
}
