import { NextResponse } from "next/server";

/**
 * Fetches GitHub contribution data by scraping the user's contributions
 * page (https://github.com/users/<user>/contributions). No auth token needed.
 *
 * GitHub's HTML uses <td> cells with data-date/data-level, and <tool-tip>
 * elements with the count text. We match them by id ↔ for.
 *
 * Returns: { total, weeks: [{ days: [{ date, count, level }] }] }
 */
export const dynamic = "force-dynamic";
export const revalidate = 3600; // cache 1h

interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export async function GET() {
  const username = "qwq672";
  try {
    const res = await fetch(
      `https://github.com/users/${username}/contributions`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; qwq672-site/1.0)",
          Accept: "text/html",
        },
      }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub responded ${res.status}` },
        { status: 502 }
      );
    }
    const html = await res.text();

    // 1. Parse <td> cells: data-date, id, data-level (in actual HTML order)
    const tdRegex =
      /data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-\d+-\d+)"[^>]*data-level="(\d)"/g;
    const cellMap = new Map<string, { date: string; level: number }>();
    let m: RegExpExecArray | null;
    while ((m = tdRegex.exec(html))) {
      const [, date, id, levelStr] = m;
      cellMap.set(id, { date, level: parseInt(levelStr, 10) });
    }

    // 2. Parse <tool-tip> elements: for="id" and text content
    // Text format: "No contributions on July 20th." or "3 contributions on ..."
    const tipRegex =
      /for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*(?:contributions|No contributions)[^<]*)/g;
    const countMap = new Map<string, number>();
    while ((m = tipRegex.exec(html))) {
      const [, id, text] = m;
      const countMatch = text.match(/(\d+) contributions/);
      countMap.set(id, countMatch ? parseInt(countMatch[1], 10) : 0);
    }

    // 3. Merge: for each cell (in document order), get date/level/count
    const days: Day[] = [];
    for (const [id, cell] of cellMap) {
      const count = countMap.get(id) ?? 0;
      const level = Math.max(0, Math.min(4, cell.level)) as 0 | 1 | 2 | 3 | 4;
      days.push({ date: cell.date, count, level });
    }

    if (days.length === 0) {
      return NextResponse.json(
        { error: "No contribution data found" },
        { status: 404 }
      );
    }

    // Group into weeks (columns of 7 days). GitHub's HTML starts on a Sunday.
    const weeks: Day[][] = [];
    for (let j = 0; j < days.length; j += 7) {
      weeks.push(days.slice(j, j + 7));
    }

    const total = days.reduce((sum, d) => sum + d.count, 0);

    return NextResponse.json({
      username,
      total,
      weeks,
      fetchedAt: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "fetch failed" },
      { status: 500 }
    );
  }
}
