"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Github, Loader2, AlertCircle } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion-helpers";

interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}
interface ContribData {
  username: string;
  total: number;
  weeks: Day[][];
  fetchedAt: string;
}

const MONTH_LABELS = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
];

// Color levels using our accent (amber) — from subtle to saturated
const LEVEL_COLORS = [
  "bg-muted",                          // 0 — no contributions
  "bg-accent/25",                      // 1
  "bg-accent/45",                      // 2
  "bg-accent/70",                      // 3
  "bg-accent",                         // 4
];

export function GitHubContributionsSection() {
  const [data, setData] = React.useState<ContribData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/github-contributions")
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((d: ContribData) => {
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

  // Compute month labels positions (first week of each month)
  const monthLabels = React.useMemo(() => {
    if (!data) return [];
    const labels: { text: string; weekIdx: number }[] = [];
    let lastMonth = -1;
    data.weeks.forEach((week, wi) => {
      const firstDay = week[0];
      if (!firstDay) return;
      const month = parseInt(firstDay.date.split("-")[1], 10) - 1;
      if (month !== lastMonth) {
        labels.push({ text: MONTH_LABELS[month], weekIdx: wi });
        lastMonth = month;
      }
    });
    return labels;
  }, [data]);

  return (
    <section
      id="github"
      className="relative scroll-mt-24 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="GitHub"
          title={
            <>
              贡献热力图<span className="text-accent">.</span>
            </>
          }
          description="过去一年在 GitHub 上的提交记录——颜色越深提交越多。"
        />

        <Reveal className="mt-10">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm sm:p-8">
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
                <span className="text-sm">加载贡献数据中…</span>
              </div>
            ) : error || !data ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                <AlertCircle className="h-6 w-6 text-muted-foreground/60" />
                <span className="text-sm">贡献数据加载失败，可能是 GitHub 暂时不可达。</span>
              </div>
            ) : (
              <div>
                {/* Stats row */}
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

                {/* Contribution grid — horizontally scrollable on mobile */}
                <div className="overflow-x-auto styled-scroll pb-2">
                  <div className="inline-block min-w-full">
                    {/* Month labels */}
                    <div
                      className="mb-1.5 flex gap-[3px] pl-[22px]"
                      style={{ minWidth: `${data.weeks.length * 13}px` }}
                    >
                      {monthLabels.map((ml, i) => (
                        <span
                          key={i}
                          className="text-[0.6rem] font-medium text-muted-foreground/70"
                          style={{
                            position: "absolute",
                            transform: `translateX(${ml.weekIdx * 13}px)`,
                          }}
                        >
                          {ml.text}
                        </span>
                      ))}
                      {/* spacer to set height */}
                      <span className="text-[0.6rem] opacity-0">1月</span>
                    </div>

                    {/* Grid: weekday labels + cells */}
                    <div className="flex gap-[3px]">
                      {/* Day labels */}
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

                      {/* Cells */}
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

                {/* Legend */}
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
