# Pocket Town Companions Game Design

Pocket Town Companions is a cozy pet town care game inspired by classic desktop companion loops. The first prototype focuses on durable systems rather than one-off screens: pets, care actions, task runs, inventory rewards, and reusable UI components.

## Core Loop

1. Pick an active pet.
2. Keep needs healthy with Feed, Bath, Play, and Rest.
3. Start tasks from town locations.
4. Spend energy, calculate success, earn rewards, and gain EXP.
5. Level up every 100 EXP, gain stats, and restore energy.
6. Use inventory rewards to improve needs and stats.

## Stats

- Charm supports social and event tasks.
- Strength supports work and delivery tasks.
- Intelligence supports training and puzzle tasks.
- Luck supports care discoveries and adventures.

## Needs

- Hunger, mood, cleanliness, energy, and bond are capped from 0 to 100.
- Energy gates task starts.
- Mood contributes directly to task success.

## Extensibility

Add new pets in `data/pets.ts`, tasks in `data/tasks.ts`, items in `data/items.ts`, and locations in `data/locations.ts`. The UI routes and store use those data files directly.
