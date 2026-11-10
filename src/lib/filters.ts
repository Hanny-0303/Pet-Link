import type {
  AgeBand,
  Boldness,
  Energy,
  Gender,
  Obedience,
  Peer,
  Size,
  Sociability,
  Pet,
  Species,
  Trait,
} from "./types";
import type { Location } from "./location";

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
  traits: Trait[];
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

/** 单只宠物是否命中当前条件（首页和筛选面板共用同一套判断） */
export function matchPet(
  p: Pet,
  f: Filters,
  species: Species | "all",
  location: Location | null
): boolean {
  if (
    location &&
    (p.province !== location.province ||
      p.city !== location.city ||
      (location.area !== null && p.area !== location.area))
  )
    return false;

  if (species !== "all" && p.species !== species) return false;
  if (f.sizes.length && !f.sizes.includes(p.size)) return false;
  if (f.ages.length && !f.ages.includes(p.ageBand)) return false;
  if (f.breeds.length && !f.breeds.includes(p.breed)) return false;
  if (f.gender !== "all" && p.gender !== f.gender) return false;
  if (f.neutered !== "all" && (f.neutered === "yes") !== p.neutered) return false;
  if (f.social !== "all" && p.social !== f.social) return false;
  if (f.energy !== "all" && p.energy !== f.energy) return false;
  if (f.peer !== "all" && p.peer !== f.peer) return false;
  if (f.bold !== "all" && p.bold !== f.bold) return false;
  if (f.obey !== "all" && p.obey !== f.obey) return false;
  if (f.maxKm !== null && p.distanceKm > f.maxKm) return false;
  if (f.traits.length && !f.traits.some((t) => p.traits.includes(t))) return false;
  return true;
}

export function filterPets(
  list: Pet[],
  f: Filters,
  species: Species | "all",
  location: Location | null,
  onlyRecommended: Record<string, string>
): Pet[] {
  return list.filter((p) => {
    if (f.onlyRecommended && !(p.id in onlyRecommended)) return false;
    return matchPet(p, f, species, location);
  });
}
