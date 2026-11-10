import { pets } from "./data";
import type { Species } from "./types";

/** 品种首字母，用于按拼音分组 */
export const BREED_LETTER: Record<string, string> = {
  阿拉斯加: "A",
  边牧: "B", 比熊: "B", 博美: "B", 布偶猫: "B",
  垂耳兔: "C", 柴犬: "C",
  法斗: "F", 非洲迷你刺猬: "F",
  哈士奇: "H", 虎皮鹦鹉: "H",
  金毛: "J", 金丝熊仓鼠: "J", 橘猫: "J",
  柯基: "K",
  拉布拉多: "L", 龙猫: "L",
  蜜袋鼯: "M",
  萨摩耶: "S",
  泰迪: "T", 田园犬: "T",
  暹罗猫: "X", 玄凤鹦鹉: "X",
  银渐层: "Y", 英国短毛猫: "Y", 玉米蛇: "Y",
  鬃狮蜥: "Z", 侏儒兔: "Z",
};

export type BreedGroup = { letter: string; items: { breed: string; n: number }[] };

/** 按物种列出品种，并按首字母分组 */
export function breedGroups(species: Species | "all", query = ""): BreedGroup[] {
  const scoped = species === "all" ? pets : pets.filter((p) => p.species === species);
  const count = new Map<string, number>();
  for (const p of scoped) count.set(p.breed, (count.get(p.breed) ?? 0) + 1);

  const q = query.trim();
  const items = [...count.entries()]
    .filter(([breed]) => !q || breed.includes(q))
    .map(([breed, n]) => ({ breed, n, letter: BREED_LETTER[breed] ?? "#" }))
    .sort((a, b) => a.letter.localeCompare(b.letter) || b.n - a.n);

  const map = new Map<string, { breed: string; n: number }[]>();
  for (const it of items) {
    if (!map.has(it.letter)) map.set(it.letter, []);
    map.get(it.letter)!.push({ breed: it.breed, n: it.n });
  }
  return [...map.entries()].map(([letter, items]) => ({ letter, items }));
}
