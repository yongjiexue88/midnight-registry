import { NextResponse } from "next/server";
import { pets } from "@/data/pets";
import { tasks } from "@/data/tasks";
import { calculateTaskSuccess } from "@/lib/game/calculateTaskSuccess";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { petId?: string; taskId?: string };
  const pet = pets.find((candidate) => candidate.id === body.petId) ?? pets[0];
  const task = tasks.find((candidate) => candidate.id === body.taskId) ?? tasks[0];

  if (pet.needs.energy < task.energyCost) {
    return NextResponse.json({ ok: false, reason: "not_enough_energy" }, { status: 400 });
  }

  const successRate = calculateTaskSuccess(task, pet);
  return NextResponse.json({
    ok: true,
    taskId: task.id,
    petId: pet.id,
    successRate,
    success: successRate >= 50,
    rewards: task.rewards,
  });
}
