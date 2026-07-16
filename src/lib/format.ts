/** Format a YYYY-MM-DD or YYYY-MM-DD HH:mm:ss +/-HHMM date into zh-CN display. */
export function formatDate(raw: string): string {
  if (!raw) return "";
  // Take the leading date part, ignore time/timezone for display.
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (!m) return raw;
  const [, y, mo, d] = m;
  return `${y} 年 ${parseInt(mo, 10)} 月 ${parseInt(d, 10)} 日`;
}

export function shortDate(raw: string): string {
  if (!raw) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (!m) return raw;
  return `${m[1]}.${m[2]}.${m[3]}`;
}
