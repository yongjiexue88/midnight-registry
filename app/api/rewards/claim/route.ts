import { NextResponse } from "next/server";
import { starterRewards } from "@/data/rewards";

export async function POST() {
  return NextResponse.json({
    ok: true,
    rewards: starterRewards,
  });
}
