import raw from "./china-divisions.json";
import letters from "./china-letters.json";

export type City = { name: string; areas: string[] };
export type Province = { name: string; cities: City[] };
/** area 为 null 表示选了整个市 */
export type Location = { province: string; city: string; area: string | null };

export const DIVISIONS = raw as Province[];

/** 扁平索引，用于搜索：3400 条，一条包含省/市/区县 */
export type FlatEntry = {
  province: string;
  city: string;
  area: string | null;
  text: string;
};

export const FLAT: FlatEntry[] = DIVISIONS.flatMap((p) =>
  p.cities.flatMap((c) => {
    const base: FlatEntry[] = [
      { province: p.name, city: c.name, area: null, text: `${p.name} ${c.name}` },
    ];
    return base.concat(
      c.areas.map((a) => ({
        province: p.name,
        city: c.name,
        area: a,
        text: `${p.name} ${c.name} ${a}`,
      }))
    );
  })
);

export function searchLocations(q: string, limit = 30): FlatEntry[] {
  const k = q.trim();
  if (!k) return [];
  // 先匹配区县名，再匹配市/省
  const exact: FlatEntry[] = [];
  const fuzzy: FlatEntry[] = [];
  for (const e of FLAT) {
    if (e.area && e.area.includes(k)) exact.push(e);
    else if (e.text.includes(k)) fuzzy.push(e);
    if (exact.length >= limit) break;
  }
  return [...exact, ...fuzzy].slice(0, limit);
}

/** 去掉「市」后缀，避免「上海市 · 浦东新区」读起来重复 */
function short(name: string): string {
  return name.replace(/(市|省|自治区|特别行政区)$/, "");
}

export function locationLabel(loc: Location | null): string {
  if (!loc) return "全国";
  if (!loc.area) return short(loc.city);
  return `${short(loc.city)} · ${loc.area}`;
}

export function fullLabel(loc: Location | null): string {
  if (!loc) return "全国";
  return loc.area ? `${loc.province} ${loc.city} ${loc.area}` : `${loc.province} ${loc.city}`;
}

const LETTERS = letters as Record<string, string>;

/** 名称的拼音首字母（构建时预计算，运行时不依赖拼音库） */
export function letterOf(name: string): string {
  return LETTERS[name] ?? "#";
}

/** 按首字母分组，组内按拼音排序 */
export function groupByLetter<T>(
  items: T[],
  nameOf: (t: T) => string
): { letter: string; list: T[] }[] {
  const map = new Map<string, T[]>();
  for (const it of items) {
    const l = letterOf(nameOf(it));
    if (!map.has(l)) map.set(l, []);
    map.get(l)!.push(it);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([letter, list]) => ({
      letter,
      list: list.sort((x, y) => nameOf(x).localeCompare(nameOf(y), "zh")),
    }));
}
