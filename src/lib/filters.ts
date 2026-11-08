import type { AgeBand, Size } from "./types";

export type Filters = {
  sizes: Size[];
  ages: AgeBand[];
  maxKm: number | null;
  traits: string[];
};

export const EMPTY_FILTERS: Filters = {
  sizes: [],
  ages: [],
  maxKm: null,
  traits: [],
};

/** 有几种条件生效（用于筛选按钮上的角标） */
export function countActive(f: Filters): number {
  return f.sizes.length + f.ages.length + f.traits.length + (f.maxKm ? 1 : 0);
}

export const DISTANCE_OPTIONS: { label: string; value: number | null }[] = [
  { label: "不限", value: null },
  { label: "3km 内", value: 3 },
  { label: "5km 内", value: 5 },
  { label: "10km 内", value: 10 },
];
