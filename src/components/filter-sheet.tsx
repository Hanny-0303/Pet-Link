"use client";

import { useMemo, useState } from "react";
import { Check, X, Sparkles } from "lucide-react";
import { pets } from "@/lib/data";
import {
  AGE_LABEL,
  BOLD_LABEL,
  ENERGY_LABEL,
  OBEY_LABEL,
  PEER_LABEL,
  SIZE_LABEL,
  SOCIAL_LABEL,
  SPECIES_LABEL,
  type AgeBand,
  type Boldness,
  type Energy,
  type Gender,
  type Obedience,
  type Peer,
  type Size,
  type Species,
  type Sociability,
} from "@/lib/types";
import { DISTANCE_OPTIONS, EMPTY_FILTERS, countActive, type Filters } from "@/lib/filters";

/** 自由标签：从数据里按出现次数取前 12 个 */
const TRAITS = (() => {
  const c = new Map<string, number>();
  for (const p of pets) for (const t of p.traits) c.set(t, (c.get(t) ?? 0) + 1);
  return [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t]) => t);
})();

/** 品种首字母，用于按拼音分组 */
const BREED_LETTER: Record<string, string> = {
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

const SCOPE: (Species | "all")[] = [
  "all",
  "dog",
  "cat",
  "rabbit",
  "smallpet",
  "bird",
  "reptile",
  "exotic",
];

export default function FilterSheet({
  open,
  value,
  species,
  onApply,
  onClose,
}: {
  open: boolean;
  value: Filters;
  species: Species | "all";
  onApply: (f: Filters) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Filters>(value);
  const [lastOpen, setLastOpen] = useState(open);
  const [scope, setScope] = useState<Species | "all">(species);

  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setDraft(value);
      setScope(species);
    }
  }
  if (!open) return null;

  // 先大类，再小类：品种列表跟着 scope 走
  const scoped = scope === "all" ? pets : pets.filter((p) => p.species === scope);

  const breedGroups = useMemo(() => {
    const count = new Map<string, number>();
    for (const p of scoped) count.set(p.breed, (count.get(p.breed) ?? 0) + 1);
    const byLetter = new Map<string, { breed: string; n: number }[]>();
    for (const [breed, n] of count) {
      const letter = BREED_LETTER[breed] ?? "#";
      if (!byLetter.has(letter)) byLetter.set(letter, []);
      byLetter.get(letter)!.push({ breed, n });
    }
    return [...byLetter.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([letter, items]) => ({
        letter,
        items: items.sort((a, b) => a.breed.localeCompare(b.breed, "zh")),
      }));
  }, [scoped]);

  function toggleIn<T extends string>(list: T[], v: T): T[] {
    return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
  }

  const active = countActive(draft);

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]" onClick={onClose} />

      <div className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[88vh] max-w-[430px] flex-col rounded-t-[26px] bg-cream pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_40px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <h2 className="text-[17px] font-semibold tracking-tight">筛选</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDraft(EMPTY_FILTERS)}
              className="text-[12px] font-medium text-ink-mute active:opacity-60"
            >
              重置
            </button>
            <button
              onClick={onClose}
              aria-label="关闭"
              className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-[0_2px_8px_rgba(80,60,40,0.08)]"
            >
              <X size={15} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-3">
          <button
            onClick={() => setDraft({ ...draft, onlyRecommended: !draft.onlyRecommended })}
            className={`mt-2 flex w-full items-center gap-2.5 rounded-[16px] px-3.5 py-3 text-left transition ${
              draft.onlyRecommended
                ? "bg-brand-soft ring-1 ring-brand/30"
                : "bg-white shadow-[0_2px_10px_rgba(80,60,40,0.05)]"
            }`}
          >
            <Sparkles
              size={15}
              strokeWidth={2.4}
              className={draft.onlyRecommended ? "text-brand" : "text-ink-mute"}
            />
            <span className="min-w-0 flex-1">
              <span
                className={`block text-[13px] font-semibold ${
                  draft.onlyRecommended ? "text-brand" : ""
                }`}
              >
                只看为我推荐的
              </span>
              <span className="block text-[10.5px] text-ink-mute">
                按你宠物的品种、体型、性格和距离算出来的
              </span>
            </span>
            <span
              className={`relative h-[24px] w-[40px] shrink-0 rounded-full transition-colors ${
                draft.onlyRecommended ? "bg-brand" : "bg-line"
              }`}
            >
              <span
                className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all ${
                  draft.onlyRecommended ? "left-[19px]" : "left-[3px]"
                }`}
              />
            </span>
          </button>

          {/* 品种：先大类，再按首字母排的小类 */}
          <div className="mt-4">
            <div className="mb-2 flex items-baseline gap-1.5">
              <h3 className="text-[12px] font-semibold text-ink-soft">品种</h3>
              <span className="text-[10px] text-ink-mute">先选大类，再选品种</span>
            </div>

            <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2">
              {SCOPE.map((s) => {
                const on = scope === s;
                return (
                  <button
                    key={s}
                    onClick={() => setScope(s)}
                    className={`shrink-0 rounded-full px-2.5 py-[5px] text-[11px] font-medium transition ${
                      on ? "bg-ink text-cream" : "bg-white text-ink-soft"
                    }`}
                  >
                    {s === "all" ? "全部" : SPECIES_LABEL[s]}
                  </button>
                );
              })}
            </div>

            {breedGroups.map((g) => (
              <div key={g.letter} className="mb-2">
                <p className="mb-1 px-0.5 text-[10px] font-semibold text-ink-mute">
                  {g.letter}
                </p>
                <div className="flex flex-wrap gap-2">
                  {g.items.map(({ breed, n }) => (
                    <Chip
                      key={breed}
                      on={draft.breeds.includes(breed)}
                      onClick={() =>
                        setDraft({ ...draft, breeds: toggleIn(draft.breeds, breed) })
                      }
                    >
                      {breed}
                      <span className="text-[10px] opacity-60">{n}</span>
                    </Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Section title="体型">
            {(["small", "medium", "large"] as const).map((s) => (
              <Chip
                key={s}
                on={draft.sizes.includes(s)}
                onClick={() => setDraft({ ...draft, sizes: toggleIn(draft.sizes, s) })}
              >
                {SIZE_LABEL[s]}
              </Chip>
            ))}
          </Section>

          <Section title="年龄">
            {(["baby", "adult", "senior"] as const).map((a) => (
              <Chip
                key={a}
                on={draft.ages.includes(a)}
                onClick={() => setDraft({ ...draft, ages: toggleIn(draft.ages, a) })}
              >
                {AGE_LABEL[a]}
              </Chip>
            ))}
          </Section>

          <Section title="性别">
            <SingleChips
              options={[
                { v: "all", label: "不限" },
                { v: "boy", label: "弟弟" },
                { v: "girl", label: "妹妹" },
              ]}
              value={draft.gender}
              onChange={(v) => setDraft({ ...draft, gender: v as Gender | "all" })}
            />
          </Section>

          <Section title="绝育">
            <SingleChips
              options={[
                { v: "all", label: "不限" },
                { v: "yes", label: "已绝育" },
                { v: "no", label: "未绝育" },
              ]}
              value={draft.neutered}
              onChange={(v) => setDraft({ ...draft, neutered: v as "all" | "yes" | "no" })}
            />
          </Section>

          <Section title="对人" hint="二选一">
            <SingleChips
              options={[
                { v: "all", label: "不限" },
                { v: "friendly", label: SOCIAL_LABEL.friendly },
                { v: "reserved", label: SOCIAL_LABEL.reserved },
              ]}
              value={draft.social}
              onChange={(v) => setDraft({ ...draft, social: v as Sociability | "all" })}
            />
          </Section>

          <Section title="对同类" hint="一起玩最关键的一项">
            <SingleChips
              options={[
                { v: "all", label: "不限" },
                { v: "social", label: PEER_LABEL.social },
                { v: "guarded", label: PEER_LABEL.guarded },
              ]}
              value={draft.peer}
              onChange={(v) => setDraft({ ...draft, peer: v as Peer | "all" })}
            />
          </Section>

          <Section title="活力">
            <SingleChips
              options={[
                { v: "all", label: "不限" },
                { v: "active", label: ENERGY_LABEL.active },
                { v: "calm", label: ENERGY_LABEL.calm },
              ]}
              value={draft.energy}
              onChange={(v) => setDraft({ ...draft, energy: v as Energy | "all" })}
            />
          </Section>

          <Section title="胆子">
            <SingleChips
              options={[
                { v: "all", label: "不限" },
                { v: "bold", label: BOLD_LABEL.bold },
                { v: "timid", label: BOLD_LABEL.timid },
              ]}
              value={draft.bold}
              onChange={(v) => setDraft({ ...draft, bold: v as Boldness | "all" })}
            />
          </Section>

          <Section title="服从">
            <SingleChips
              options={[
                { v: "all", label: "不限" },
                { v: "trained", label: OBEY_LABEL.trained },
                { v: "free", label: OBEY_LABEL.free },
              ]}
              value={draft.obey}
              onChange={(v) => setDraft({ ...draft, obey: v as Obedience | "all" })}
            />
          </Section>

          <Section title="距离">
            {DISTANCE_OPTIONS.map((o) => (
              <Chip
                key={o.label}
                on={draft.maxKm === o.value}
                onClick={() => setDraft({ ...draft, maxKm: o.value })}
              >
                {o.label}
              </Chip>
            ))}
          </Section>

          <Section title="其他特点" hint="可以多选">
            {TRAITS.map((t) => (
              <Chip
                key={t}
                on={draft.traits.includes(t)}
                onClick={() => setDraft({ ...draft, traits: toggleIn(draft.traits, t) })}
              >
                {t}
              </Chip>
            ))}
          </Section>
        </div>

        <div className="border-t border-line/70 px-5 pt-3 pb-4">
          <button
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="h-[50px] w-full rounded-full bg-brand text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(255,107,74,0.28)] active:scale-[0.98]"
          >
            {active > 0 ? `应用筛选 · ${active} 个条件` : "应用筛选"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-baseline gap-1.5">
        <h3 className="text-[12px] font-semibold text-ink-soft">{title}</h3>
        {hint && <span className="text-[10px] text-ink-mute">{hint}</span>}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 rounded-full px-3 py-[7px] text-[12px] font-medium transition active:scale-95 ${
        on ? "bg-brand text-white" : "bg-white text-ink-soft shadow-[0_1px_6px_rgba(80,60,40,0.06)]"
      }`}
    >
      {on && <Check size={11} strokeWidth={3} />}
      {children}
    </button>
  );
}

function SingleChips({
  options,
  value,
  onChange,
}: {
  options: { v: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <>
      {options.map((o) => (
        <Chip key={o.v} on={value === o.v} onClick={() => onChange(o.v)}>
          {o.label}
        </Chip>
      ))}
    </>
  );
}
