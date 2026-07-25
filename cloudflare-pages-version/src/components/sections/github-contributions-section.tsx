import * as React from "react";
import { motion } from "framer-motion";
import { Github, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion-helpers";
import {
  fetchGitHubContributions,
  GITHUB_USERNAME,
  type ContribData,
} from "@/lib/github-contributions";

const MONTH_LABELS = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
];

// Color levels using our accent (amber) — from subtle to saturated
const LEVEL_COLORS = [
  "bg-muted",
  "bg-accent/25",
  "bg-accent/45",
  "bg-accent/70",
  "bg-accent",
];

/**
 * GitHub contributions heatmap.
 *
 * Static-host adaptation: the main Next.js project fetches GitHub's
 * contributions HTML on the server (to dodge CORS) and caches it for 1h.
 * Here we fetch it directly from the browser at runtime — GitHub sends
 * `Access-Control-Allow-Origin: *` on the contributions page so this
 * usually works. If it's blocked (rare network/CORS issue), we fall back
 * to a friendly placeholder + a link to the profile.
 */
export function GitHubContributionsSection() {
  const [data, setData] = React.useState<ContribData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    fetchGitHubContributions()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const monthLabels = React.useMemo(() => {
    if (!data) return [];
    const raw: { text: string; weekIdx: number }[] = [];
    let lastMonth = -1;
    data.weeks.forEach((week, wi) => {
      const firstDay = week[0];
      if (!firstDay) return;
      const month = parseInt(firstDay.date.split("-")[1], 10) - 1;
      if (month !== lastMonth) {
        raw.push({ text: MONTH_LABELS[month], weekIdx: wi });
        lastMonth = month;
      }
    });
    const result: { text: string; weekIdx: number }[] = [];
    for (const l of raw) {
      if (result.length === 0 || l.weekIdx - result[result.length - 1].weekIdx >= 4) {
        result.push(l);
      }
    }
    return result;
  }, [data]);

  const CELL = 10;
  const GAP = 3;
  const weekPx = CELL + GAP;

  return (
    <section id="github" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="GitHub"
          title={
            <>
              贡献热力图<span className="text-accent">.</span>
            </>
          }
          description="过去一年在 GitHub 上的提交记录——颜色越深提交越多。客户端直接拉取 GitHub 页面解析，无需服务端。"
        />

        <Reveal className="mt-10">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm sm:p-8">
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
                <span className="text-sm">正在客户端拉取 GitHub 贡献数据…</span>
              </div>
            ) : error || !data ? (
              // Graceful fallback — GitHub fetch was blocked (CORS / network /
              // rate-limit). Show a static placeholder with a profile link so
              // the section still communicates the intent.
              <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <AlertCircle className="h-7 w-7 text-muted-foreground/60" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    GitHub 贡献数据暂时无法在客户端拉取（可能是浏览器拦截了跨域请求）。
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    可以直接去 GitHub 主页查看完整的提交记录。
                  </p>
                </div>
                <a
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
                >
                  <Github className="h-4 w-4 transition-colors group-hover:text-accent" />
                  @{GITHUB_USERNAME}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ) : (
              <div>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <a
                    href={`https://github.com/${data.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Github className="h-4 w-4 transition-colors group-hover:text-accent" />
                    @{data.username}
                  </a>
                  <span className="text-sm text-muted-foreground">
                    过去一年共{" "}
                    <span className="font-display font-bold text-accent">
                      {data.total}
                    </span>{" "}
                    次贡献
                  </span>
                </div>

                <div className="overflow-x-auto styled-scroll pb-2">
                  <div className="inline-block min-w-full">
                    <div
                      className="relative mb-1.5 h-4 pl-[22px]"
                      style={{ minWidth: `${data.weeks.length * weekPx}px` }}
                    >
                      {monthLabels.map((ml, i) => (
                        <span
                          key={i}
                          className="absolute top-0 whitespace-nowrap text-[0.6rem] font-medium text-muted-foreground/70"
                          style={{ left: `${ml.weekIdx * weekPx}px` }}
                        >
                          {ml.text}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-[3px]">
                      <div className="flex flex-col gap-[3px] pr-1">
                        {["", "一", "", "三", "", "五", ""].map((d, i) => (
                          <span
                            key={i}
                            className="flex h-[10px] items-center text-[0.6rem] font-medium text-muted-foreground/50"
                          >
                            {d}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-[3px]">
                        {data.weeks.map((week, wi) => (
                          <div key={wi} className="flex flex-col gap-[3px]">
                            {week.map((day, di) => (
                              <motion.div
                                key={day.date}
                                title={`${day.date}: ${day.count} 次贡献`}
                                className={`h-[10px] w-[10px] rounded-[2px] ${LEVEL_COLORS[day.level]}`}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  duration: 0.3,
                                  delay: Math.min((wi * 7 + di) * 0.002, 0.5),
                                  ease: "easeOut",
                                }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-1.5 text-[0.65rem] text-muted-foreground">
                  <span>少</span>
                  {LEVEL_COLORS.map((c, i) => (
                    <span
                      key={i}
                      className={`h-[10px] w-[10px] rounded-[2px] ${c}`}
                    />
                  ))}
                  <span>多</span>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
