import { NextResponse } from "next/server";
import { getDocSets } from "@/lib/docs";

export const dynamic = "force-static";

export async function GET() {
  const sets = await getDocSets();
  return NextResponse.json({ sets });
}
