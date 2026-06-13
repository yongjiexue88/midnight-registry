import type { Location } from "@/lib/game/types";

export const locations: Location[] = [
  {
    id: "town_plaza",
    name: "Town Plaza",
    description: "Main hangout for quick play, visits, and daily care.",
    x: 66,
    y: 66,
    icon: "fa-location-dot",
    assetPath: "/assets/locations/town-plaza-scene.png",
  },
  {
    id: "snack_stall",
    name: "Snack Stall",
    description: "Buy cozy food and complete hunger care tasks.",
    x: 20,
    y: 43,
    icon: "fa-burger",
  },
  {
    id: "pet_clinic",
    name: "Pet Clinic",
    description: "Bath, checkups, and recovery events.",
    x: 72,
    y: 34,
    icon: "fa-kit-medical",
  },
  {
    id: "study_corner",
    name: "Study Corner",
    description: "Train intelligence and unlock puzzle tasks.",
    x: 44,
    y: 25,
    icon: "fa-book",
  },
  {
    id: "job_board",
    name: "Job Board",
    description: "Part-time work and town errands.",
    x: 29,
    y: 70,
    icon: "fa-clipboard-list",
  },
  {
    id: "forest_gate",
    name: "Forest Gate",
    description: "Adventure tasks with higher rewards.",
    x: 82,
    y: 71,
    icon: "fa-tree",
  },
];
