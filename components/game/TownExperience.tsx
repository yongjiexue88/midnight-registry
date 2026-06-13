"use client";

import { CareActions } from "./CareActions";
import { LocationMap } from "./LocationMap";
import { PetCarousel } from "./PetCarousel";
import { PetStage } from "./PetStage";
import { PetStatusPanel } from "./PetStatusPanel";
import { TaskBoard } from "./TaskBoard";
import { TownScene } from "./TownScene";

export function TownExperience() {
  return (
    <div className="town-layout">
      <PetStatusPanel />
      <div className="town-layout__center">
        <PetStage />
        <TownScene />
      </div>
      <div className="town-layout__right">
        <TaskBoard compact />
        <LocationMap />
      </div>
      <div className="town-layout__bottom">
        <PetCarousel />
        <CareActions />
      </div>
    </div>
  );
}
