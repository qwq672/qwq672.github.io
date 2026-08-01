/**
 * Client-side GitHub contributions fetcher for the static site.
 *
 * The main (Next.js) version uses a server-side API route to scrape
 * github.com/users/<user>/contributions (server-side to avoid CORS and
 * to cache). Here we have no server, so we fetch directly from the
 * browser. GitHub's contributions page does NOT send CORS headers, so
 * a direct fetch will usually be blocked — we try anyway, and on
 * failure we fall back to a graceful "unavailable" state with a link
 * to the user's GitHub profile.
 *
 * Parsing logic mirrors the main project's API route:
 *  - <td> cells carry data-date, id, data-level
 *  - <tool-tip> elements carry the contribution count text
 */

export interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContribData {
  username: string;
  total: number;
  weeks: Day[][];
  fetchedAt: string;
}

const USERNAME = "qwq672";

/**
 * Attempt to fetch + parse GitHub contributions. Throws on any failure
 * (CORS, network, parse) so the caller can show the fallback UI.
 */
export async function fetchGitHubContributions(): Promise<ContribData> {
  const res = await fetch(
    `https://github.com/users/${USERNAME}/contributions`,
    {
      headers: {
        Accept: "text/html,application/xhtml+xml",
      },
      mode: "cors",
    }
  );
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

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

  if (days.length === 0) throw new Error("No contribution data found");

  // Group into weeks (columns of 7 days). GitHub's HTML starts on a Sunday.
  const weeks: Day[][] = [];
  for (let j = 0; j < days.length; j += 7) {
    weeks.push(days.slice(j, j + 7));
  }

  const total = days.reduce((sum, d) => sum + d.count, 0);

  return {
    username: USERNAME,
    total,
    weeks,
    fetchedAt: new Date().toISOString(),
  };
}
