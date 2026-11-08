"use client";

import { useState } from "react";
import { Check, X, Sparkles } from "lucide-react";
import { pets } from "@/lib/data";
import {
  AGE_LABEL,
  ENERGY_LABEL,
  SIZE_LABEL,
  SOCIAL_LABEL,
  type AgeBand,
  type Energy,
  type Gender,
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
  const [showAllBreeds, setShowAllBreeds] = useState(false);

  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) setDraft(value);
  }
  if (!open) return null;

  // 品种候选：跟着当前物种走
  const scoped = species === "all" ? pets : pets.filter((p) => p.species === species);
  const breedCount = new Map<string, number>();
  for (const p of scoped) breedCount.set(p.breed, (breedCount.get(p.breed) ?? 0) + 1);
  const allBreeds = [...breedCount.entries()].sort((a, b) => b[1] - a[1]);
  const breeds = showAllBreeds ? allBreeds : allBreeds.slice(0, 8);

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
          {/* 推荐开关 */}
          <button
            onClick={() =>
              setDraft({ ...draft, onlyRecommended: !draft.onlyRecommended })
            }
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

          {allBreeds.length > 1 && (
            <Section title="品种">
              {breeds.map(([b, n]) => (
                <Chip
                  key={b}
                  on={draft.breeds.includes(b)}
                  onClick={() =>
                    setDraft({ ...draft, breeds: toggleIn(draft.breeds, b) })
                  }
                >
                  {b}
                  <span className="text-[10px] opacity-60">{n}</span>
                </Chip>
              ))}
              {allBreeds.length > 8 && (
                <button
                  onClick={() => setShowAllBreeds((v) => !v)}
                  className="rounded-full px-2 py-[7px] text-[11.5px] font-medium text-brand"
                >
                  {showAllBreeds ? "收起" : `+${allBreeds.length - 8} 个`}
                </button>
              )}
            </Section>
          )}

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
              onChange={(v) =>
                setDraft({ ...draft, neutered: v as "all" | "yes" | "no" })
              }
            />
          </Section>

          <Section title="亲人度" hint="必选其一，不会同时成立">
            <SingleChips
              options={[
                { v: "all", label: "不限" },
                { v: "friendly", label: SOCIAL_LABEL.friendly },
                { v: "reserved", label: SOCIAL_LABEL.reserved },
              ]}
              value={draft.social}
              onChange={(v) =>
                setDraft({ ...draft, social: v as Sociability | "all" })
              }
            />
          </Section>

          <Section title="活力" hint="必选其一，不会同时成立">
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

          <Section title="特点" hint="可以多选">
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
        on
          ? "bg-brand text-white"
          : "bg-white text-ink-soft shadow-[0_1px_6px_rgba(80,60,40,0.06)]"
      }`}
    >
      {on && <Check size={11} strokeWidth={3} />}
      {children}
    </button>
  );
}

/** 互斥选择：一组里只能亮一个 */
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
