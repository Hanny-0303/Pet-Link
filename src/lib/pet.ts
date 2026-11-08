import { pets } from "./data";
import { ENERGY_LABEL, SPECIES_LABEL, type Pet } from "./types";

const SIZE_IDX: Record<Pet["size"], number> = { small: 0, medium: 1, large: 2 };

/**
 * 配对打分：只推荐同物种。
 * 体型、年龄段、活力越接近越好；距离越近越好；共同爱好加分。
 * 这不是"最优解"，是一个可解释的启发式——首页要把理由写出来，
 * 所以每一项都必须对应一句人话。
 */
export function matchScore(me: Pet, p: Pet): number {
  if (p.id === me.id) return -1;
  if (p.species !== me.species) return -1;

  let s = 40;
  if (p.size === me.size) s += 16;
  else if (Math.abs(SIZE_IDX[p.size] - SIZE_IDX[me.size]) === 1) s += 8;

  if (p.ageBand === me.ageBand) s += 10;
  if (p.energy === me.energy) s += 12;
  if (p.social === me.social) s += 6;

  const shared = p.traits.filter((t) => me.traits.includes(t)).length;
  s += Math.min(12, shared * 6);

  s += Math.max(0, 12 - p.distanceKm);
  return s;
}

/** 一句人话的推荐理由，最多三段 */
export function matchReason(me: Pet, p: Pet): string {
  const bits: string[] = [];

  if (p.breed === me.breed) bits.push(`同是${me.breed}`);
  else bits.push(`同为${SPECIES_LABEL[me.species]}`);

  if (p.energy === me.energy) bits.push(`都${ENERGY_LABEL[p.energy]}`);

  const shared = p.traits.filter((t) => me.traits.includes(t));
  if (shared.length >= 2) bits.push("爱好很像");

  bits.push(`${p.distanceKm}km`);

  return bits.slice(0, 3).join(" · ");
}

/** 为我推荐的宠物 id → 推荐理由 */
export function buildRecommendations(me: Pet, top = 4): Record<string, string> {
  return Object.fromEntries(
    pets
      .filter((p) => p.id !== me.id)
      .map((p) => [p, matchScore(me, p)] as const)
      .filter(([, s]) => s > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, top)
      .map(([p]) => [p.id, matchReason(me, p)])
  );
}
