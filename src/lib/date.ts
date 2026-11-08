/**
 * 日期工具：全部按 Asia/Shanghai 计算，避免服务器（UTC）和浏览器显示不一致。
 * 数据里的时间都是"今天+n 天"，所以演示永远有即将开始的活动。
 */

const TZ = "Asia/Shanghai";
const WEEK = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

/** 返回上海时区的 YYYY-MM-DD */
export function todayInSH(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** 生成 "2026-11-11T19:30:00+08:00" 这样的字符串 */
export function isoAt(offsetDays: number, hhmm: string): string {
  return `${todayInSH(offsetDays)}T${hhmm}:00+08:00`;
}

/** "11月11日 周三 19:30" */
export function fmtMeetup(iso: string): string {
  const y = Number(iso.slice(0, 4));
  const mo = Number(iso.slice(5, 7));
  const d = Number(iso.slice(8, 10));
  const hh = iso.slice(11, 16);
  const wd = WEEK[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()];
  return `${mo}月${d}日 ${wd} ${hh}`;
}

/** "周三 19:30" */
export function fmtMeetupShort(iso: string): string {
  const y = Number(iso.slice(0, 4));
  const mo = Number(iso.slice(5, 7));
  const d = Number(iso.slice(8, 10));
  const hh = iso.slice(11, 16);
  const wd = WEEK[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()];
  return `${wd} ${hh}`;
}
