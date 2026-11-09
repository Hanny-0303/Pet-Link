import type {
  AgeBand,
  Boldness,
  Energy,
  Gender,
  Obedience,
  Peer,
  Size,
  Sociability,
} from "./types";

export type Filters = {
  sizes: Size[];
  ages: AgeBand[];
  maxKm: number | null;
  /** 品种多选，空数组 = 不限 */
  breeds: string[];
  /** 以下四个都是互斥维度，只能选一个 */
  gender: Gender | "all";
  neutered: "all" | "yes" | "no";
  social: Sociability | "all";
  energy: Energy | "all";
  peer: Peer | "all";
  bold: Boldness | "all";
  obey: Obedience | "all";
  /** 自由标签，可多选 */
  traits: string[];
  /** 只看为我推荐的 */
  onlyRecommended: boolean;
};

export const EMPTY_FILTERS: Filters = {
  sizes: [],
  ages: [],
  maxKm: null,
  breeds: [],
  gender: "all",
  neutered: "all",
  social: "all",
  energy: "all",
  peer: "all",
  bold: "all",
  obey: "all",
  traits: [],
  onlyRecommended: false,
};

/** 有几种条件生效（用于筛选按钮上的角标） */
export function countActive(f: Filters): number {
  return (
    f.sizes.length +
    f.ages.length +
    f.breeds.length +
    f.traits.length +
    (f.maxKm !== null ? 1 : 0) +
    (f.gender !== "all" ? 1 : 0) +
    (f.neutered !== "all" ? 1 : 0) +
    (f.social !== "all" ? 1 : 0) +
    (f.energy !== "all" ? 1 : 0) +
    (f.peer !== "all" ? 1 : 0) +
    (f.bold !== "all" ? 1 : 0) +
    (f.obey !== "all" ? 1 : 0) +
    (f.onlyRecommended ? 1 : 0)
  );
}

export const DISTANCE_OPTIONS: { label: string; value: number | null }[] = [
  { label: "不限", value: null },
  { label: "3km 内", value: 3 },
  { label: "5km 内", value: 5 },
  { label: "10km 内", value: 10 },
];
