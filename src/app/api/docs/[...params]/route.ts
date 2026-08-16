import { NextResponse } from "next/server";
import { getDoc } from "@/lib/docs";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ params: string[] }> }
) {
  const { params: seg } = await params;
  // /api/docs/<project>/<slug>
  const project = seg[0];
  const slug = seg[1];
  if (!project || !slug) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const doc = await getDoc(project, slug);
  if (!doc) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ doc });
}
