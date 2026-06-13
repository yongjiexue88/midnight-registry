export type Rarity = "common" | "good" | "rare" | "epic" | "legendary";
export type PetStage = "baby" | "teen" | "adult";
export type StatKey = "charm" | "strength" | "intelligence" | "luck";
export type NeedKey = "hunger" | "mood" | "cleanliness" | "energy" | "bond";
export type TaskType = "daily" | "care" | "training" | "work" | "adventure" | "event";
export type RewardType =
  | "coins"
  | "stars"
  | "exp"
  | "food"
  | "toy"
  | "furniture"
  | "outfit"
  | "pet_shard";

export type Reward = {
  type: RewardType;
  itemId?: string;
  amount: number;
  rarity?: Rarity;
};

export type Pet = {
  id: string;
  name: string;
  displayName: string;
  species: string;
  rarity: Rarity;
  level: number;
  exp: number;
  stage: PetStage;
  mainStat: StatKey;
  stats: Record<StatKey, number>;
  needs: Record<NeedKey, number>;
  assets: {
    avatar: string;
    idle: string;
    happy?: string;
    hungry?: string;
    sleep?: string;
    sick?: string;
  };
};

export type Task = {
  id: string;
  name: string;
  type: TaskType;
  locationId: string;
  recommendedStat: StatKey;
  energyCost: number;
  durationMinutes: number;
  baseSuccessRate: number;
  rewards: Reward[];
  unlockLevel: number;
};

export type InventoryItem = {
  id: string;
  name: string;
  type: "food" | "toy" | "furniture" | "outfit" | "material";
  rarity: Rarity;
  effect: Partial<Record<NeedKey | StatKey, number>>;
  assetPath?: string;
  icon: string;
  price: number;
};

export type Location = {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  icon: string;
  assetPath?: string;
};

export type CurrencyState = {
  coins: number;
  stars: number;
};

export type RewardResult = {
  success: boolean;
  successRate: number;
  rewards: Reward[];
  levelUp?: {
    level: number;
    statGains: Record<StatKey, number>;
  };
};
