/**
 * GitHub contributions fetcher — client-side only.
 *
 * The main Next.js project fetches `github.com/users/<user>/contributions`
 * server-side (to dodge CORS) and parses the HTML. Cloudflare Pages /
 * GitHub Pages are static hosts with no server runtime, so we attempt the
 * fetch directly from the browser.
 *
 * Strategy:
 *   (a) Try fetching the GitHub contributions page directly. GitHub sets
 *       `Access-Control-Allow-Origin: *` on the contributions page, so
 *       browsers can usually read the response. If it works, parse the
 *       `<td>` cells (data-date / data-level) and `<tool-tip>` count text
 *       out of the HTML — same regex approach as the server route.
 *   (b) If the fetch is blocked (CORS / network / 4xx), fall back to a
 *       friendly placeholder + a link to the user's GitHub profile, so
 *       the section degrades gracefully instead of erroring out.
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

export const GITHUB_USERNAME = "qwq672";

/**
 * Fetch + parse GitHub contributions. Returns null on any failure so the
 * caller can render the fallback UI.
 */
export async function fetchGitHubContributions(
  username: string = GITHUB_USERNAME
): Promise<ContribData | null> {
  try {
    const res = await fetch(
      `https://github.com/users/${username}/contributions`,
      {
        headers: {
          Accept: "text/html,application/xhtml+xml",
        },
        // Don't send credentials — keeps the request simple-CORS eligible.
        credentials: "omit",
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const html = await res.text();

    // 1. <td> cells: data-date + id + data-level (in document order).
    const tdRegex =
      /data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-\d+-\d+)"[^>]*data-level="(\d)"/g;
    const cellMap = new Map<string, { date: string; level: number }>();
    let m: RegExpExecArray | null;
    while ((m = tdRegex.exec(html))) {
      const [, date, id, levelStr] = m;
      cellMap.set(id, { date, level: parseInt(levelStr, 10) });
    }

    // 2. <tool-tip> elements: for="id" + text content with count.
    const tipRegex =
      /for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*(?:contributions|No contributions)[^<]*)/g;
    const countMap = new Map<string, number>();
    while ((m = tipRegex.exec(html))) {
      const [, id, text] = m;
      const countMatch = text.match(/(\d+) contributions/);
      countMap.set(id, countMatch ? parseInt(countMatch[1], 10) : 0);
    }

    if (cellMap.size === 0) return null;

    // 3. Merge in document order.
    const days: Day[] = [];
    for (const [id, cell] of cellMap) {
      const count = countMap.get(id) ?? 0;
      const level = Math.max(0, Math.min(4, cell.level)) as 0 | 1 | 2 | 3 | 4;
      days.push({ date: cell.date, count, level });
    }

    // 4. Group into 7-day weeks (GitHub's HTML starts on a Sunday).
    const weeks: Day[][] = [];
    for (let j = 0; j < days.length; j += 7) {
      weeks.push(days.slice(j, j + 7));
    }

    return {
      username,
      total: days.reduce((sum, d) => sum + d.count, 0),
      weeks,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
