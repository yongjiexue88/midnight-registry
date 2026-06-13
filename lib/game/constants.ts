import type { NeedKey, StatKey } from "./types";

export const MAX_NEED = 100;
export const MIN_NEED = 0;
export const EXP_PER_LEVEL = 100;

export const statLabels: Record<StatKey, string> = {
  charm: "Charm",
  strength: "Strength",
  intelligence: "Intelligence",
  luck: "Luck",
};

export const needLabels: Record<NeedKey, string> = {
  hunger: "Hunger",
  mood: "Mood",
  cleanliness: "Cleanliness",
  energy: "Energy",
  bond: "Bond",
};

export const careDeltas: Record<string, Partial<Record<NeedKey, number>>> = {
  feed: { hunger: 20, energy: 5 },
  bath: { cleanliness: 25, mood: 5 },
  play: { mood: 20, energy: -10, bond: 5 },
  rest: { energy: 30, mood: 5 },
};

export const careLabels: Record<string, string> = {
  feed: "Feed",
  bath: "Bath",
  play: "Play",
  rest: "Rest",
};

export const careIcons: Record<string, string> = {
  feed: "fa-burger",
  bath: "fa-shower",
  play: "fa-baseball",
  rest: "fa-bed",
};
