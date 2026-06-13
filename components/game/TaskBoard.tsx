"use client";

import { useMemo, useState } from "react";
import { locations } from "@/data/locations";
import { tasks } from "@/data/tasks";
import { calculateTaskSuccess } from "@/lib/game/calculateTaskSuccess";
import { selectActivePet, useGameStore } from "@/lib/game/useGameStore";
import type { TaskType } from "@/lib/game/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";

const tabs = ["daily", "care", "training", "work", "adventure", "event"] as TaskType[];

export function TaskBoard({ compact = false }: { compact?: boolean }) {
  const [activeTab, setActiveTab] = useState<TaskType>("daily");
  const pet = useGameStore(selectActivePet);
  const completeTask = useGameStore((state) => state.completeTask);
  const completedTasks = useGameStore((state) => state.completedTasks);

  const visibleTasks = useMemo(
    () => tasks.filter((task) => (compact ? ["daily", "care", "event"].includes(task.type) : task.type === activeTab)),
    [activeTab, compact],
  );

  return (
    <section className="task-board">
      <div className="section-heading">
        <h2>Tasks & Events</h2>
        <span>{pet.displayName} success odds</span>
      </div>
      {!compact ? <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} /> : null}
      <div className="task-list">
        {visibleTasks.map((task) => {
          const location = locations.find((item) => item.id === task.locationId);
          const successRate = calculateTaskSuccess(task, pet);
          const locked = pet.level < task.unlockLevel;
          const tired = pet.needs.energy < task.energyCost;

          return (
            <article key={task.id} className="task-card">
              <span className="task-card__icon">
                <i className={`fa-solid ${location?.icon ?? "fa-clipboard-list"}`} aria-hidden="true" />
              </span>
              <div>
                <div className="task-card__title">
                  <strong>{task.name}</strong>
                  <Badge tone={task.type}>{task.type}</Badge>
                </div>
                <p>
                  {location?.name} · {task.durationMinutes} min · Energy {task.energyCost}
                </p>
                <div className="reward-row">
                  {task.rewards.slice(0, 4).map((reward) => (
                    <span key={`${task.id}-${reward.type}-${reward.itemId ?? "currency"}`}>
                      {reward.amount} {reward.itemId ?? reward.type}
                    </span>
                  ))}
                </div>
                <small>
                  {completedTasks[task.id] ?? 0} complete · {successRate}% success · recommended {task.recommendedStat}
                </small>
              </div>
              <Button
                variant={locked || tired ? "ghost" : "primary"}
                icon={locked ? "fa-lock" : tired ? "fa-bolt" : "fa-play"}
                onClick={() => completeTask(task.id)}
              >
                {locked ? `Lv ${task.unlockLevel}` : tired ? "Rest" : "Start"}
              </Button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
