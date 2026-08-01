import * as React from "react";
import { motion } from "framer-motion";
import { Github, Loader2, AlertCircle } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/motion-helpers";
import { fetchGitHubContributions, type ContribData } from "@/lib/github-contributions";

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

  // (Month/day labels removed per user request — the heatmap is
  //  self-explanatory with the legend and tooltip.)

  return (
    <section
      id="github"
      className="relative scroll-mt-24 py-20 sm:py-24"
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
          <div className="card-premium relative overflow-hidden rounded-3xl p-6 sm:p-8">
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
                <span className="text-sm">加载贡献数据中…</span>
              </div>
            ) : error || !data ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                <AlertCircle className="h-6 w-6 text-muted-foreground/60" />
                <span className="text-sm">贡献数据加载失败，可能是 GitHub 暂时不可达。</span>
                <a
                  href="https://github.com/qwq672"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                >
                  <Github className="h-4 w-4" />
                  直接去 GitHub 看 @qwq672
                </a>
              </div>
            ) : (
              <div>
                {/* Stats row */}
                <div className="mb-6 flex items-center justify-between gap-4">
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

                {/* Contribution grid — pure heatmap, no labels.
                    Horizontally scrollable on mobile. */}
                <div className="overflow-x-auto styled-scroll pb-1">
                  <div className="flex gap-[3px]">
                    {data.weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-[3px]">
                        {week.map((day, di) => (
                          <motion.div
                            key={day.date}
                            title={`${day.date}: ${day.count} 次贡献`}
                            className={`h-[11px] w-[11px] rounded-[3px] ${LEVEL_COLORS[day.level]}`}
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

                {/* Legend */}
                <div className="mt-5 flex items-center justify-end gap-1.5 text-[0.65rem] text-muted-foreground">
                  <span>少</span>
                  {LEVEL_COLORS.map((c, i) => (
                    <span
                      key={i}
                      className={`h-[11px] w-[11px] rounded-[3px] ${c}`}
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
