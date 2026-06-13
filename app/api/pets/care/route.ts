import { NextResponse } from "next/server";
import { pets } from "@/data/pets";
import { applyPetCare } from "@/lib/game/petCare";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { petId?: string; action?: string };
  const pet = pets.find((candidate) => candidate.id === body.petId) ?? pets[0];
  const nextPet = applyPetCare(pet, body.action ?? "feed");

  return NextResponse.json({ ok: true, pet: nextPet });
}
