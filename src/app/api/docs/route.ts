import { NextResponse } from "next/server";
import { getAllDocs } from "@/lib/docs";

export const dynamic = "force-static";

export async function GET() {
  const docs = await getAllDocs();
  return NextResponse.json({ docs });
}
