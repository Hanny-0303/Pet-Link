"use client";

import { useState } from "react";
import { Check, X, Sparkles } from "lucide-react";
import { getPet, pets } from "@/lib/data";
import {
  AGE_LABEL,
  BOLD_LABEL,
  ENERGY_LABEL,
  OBEY_LABEL,
  PEER_LABEL,
  SIZE_LABEL,
  SOCIAL_LABEL,
  SPECIES_LABEL,
  TRAITS,
  type AgeBand,
  type Boldness,
  type Energy,
  type Gender,
  type Obedience,
  type Peer,
  type Size,
  type Species,
  type Sociability,
  type Trait,
} from "@/lib/types";
import {
  DISTANCE_OPTIONS,
  EMPTY_FILTERS,
  countActive,
  matchPet,
  type Filters,
} from "@/lib/filters";
import { buildRecommendations } from "@/lib/pet";
import { useAppStore } from "@/components/store";
import BreedSheet from "@/components/breed-sheet";

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
  const { location } = useAppStore();
  const [draft, setDraft] = useState<Filters>(value);
  const [lastOpen, setLastOpen] = useState(open);
  const [breedOpen, setBreedOpen] = useState(false);

  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setDraft(value);
    }
  }

  if (!open) return null;

  function toggleIn<T extends string>(list: T[], v: T): T[] {
    return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
  }

  const active = countActive(draft);

  // 实时预览：按当前草稿条件能筛出几只
  const me = getPet("p1");
  const recs = me ? buildRecommendations(me) : {};
  const preview = pets.filter(
    (p) =>
      (!draft.onlyRecommended || p.id in recs) &&
      matchPet(p, draft, species, location)
  ).length;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="backdrop-in absolute inset-0 bg-ink/35 backdrop-blur-[2px]" onClick={onClose} />

      <div className="sheet-in absolute inset-x-0 bottom-0 mx-auto flex max-h-[88vh] max-w-[430px] flex-col rounded-t-hero bg-canvas pb-[env(safe-area-inset-bottom)] shadow-float">
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <h2 className="text-title font-semibold tracking-tight">筛选</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDraft(EMPTY_FILTERS)}
              className="text-note font-medium text-ink-mute active:opacity-60"
            >
              重置
            </button>
            <button
              onClick={onClose}
              aria-label="关闭"
              className="hit grid h-8 w-8 place-items-center rounded-full bg-surface shadow-card"
            >
              <X size={15} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-3">
          <button
            onClick={() => setDraft({ ...draft, onlyRecommended: !draft.onlyRecommended })}
            className={`mt-2 flex w-full items-center gap-2.5 rounded-card px-3.5 py-3 text-left transition ${
              draft.onlyRecommended
                ? "bg-brand-soft ring-1 ring-brand/30"
                : "bg-surface shadow-card"
            }`}
          >
            <Sparkles
              size={15}
              strokeWidth={2.4}
              className={draft.onlyRecommended ? "text-accent" : "text-ink-mute"}
            />
            <span className="min-w-0 flex-1">
              <span
                className={`block text-body font-semibold ${
                  draft.onlyRecommended ? "text-accent" : ""
                }`}
              >
                只看为我推荐的
              </span>
              <span className="block text-cap text-ink-mute">
                按你宠物的品种、体型、性格和距离算出来的
              </span>
            </span>
            <span
              className={`relative h-[24px] w-[40px] shrink-0 rounded-full transition-colors ${
                draft.onlyRecommended ? "bg-brand" : "bg-line"
              }`}
            >
              <span
                className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-surface shadow-sm transition-all ${
                  draft.onlyRecommended ? "left-[19px]" : "left-[3px]"
                }`}
              />
            </span>
          </button>

          <div className="mt-2.5 flex items-start gap-2">
            <h3 className="w-[52px] shrink-0 pt-[7px] text-note font-semibold text-ink-soft">
              距离
            </h3>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between">
                <span className="text-note font-semibold text-brand">
                  {draft.maxKm === null ? "不限" : `${draft.maxKm} km 内`}
                </span>
                <span className="text-micro text-ink-mute">拖到最右 = 不限</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={draft.maxKm ?? 20}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setDraft({ ...draft, maxKm: v >= 20 ? null : v });
                }}
                aria-label="距离范围"
                className="slider mt-1 w-full"
              />
            </div>
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
          <Section title="对人">
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
          <Section title="对同类">
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

          <div className="mt-2.5 flex items-start gap-2">
            <h3 className="w-[52px] shrink-0 pt-[7px] text-note font-semibold text-ink-soft">
              品种
            </h3>
            <button
              onClick={() => setBreedOpen(true)}
              className="tap flex min-w-0 flex-1 items-center gap-2 rounded-full bg-surface px-3 py-[7px] text-left text-note shadow-soft"
            >
              <span className={`min-w-0 flex-1 truncate ${draft.breeds.length ? "text-ink" : "text-ink-mute"}`}>
                {draft.breeds.length ? draft.breeds.join("、") : "不限"}
              </span>
              {draft.breeds.length > 0 && (
                <span className="shrink-0 text-micro text-brand">{draft.breeds.length}</span>
              )}
              <span className="shrink-0 text-ink-mute">›</span>
            </button>
          </div>

          <Section title="其他特点">
            {TRAITS.map((t) => (
              <Chip
                key={t}
                on={draft.traits.includes(t)}
                onClick={() => setDraft({ ...draft, traits: toggleIn(draft.traits, t as Trait) })}
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
            className="h-[50px] w-full rounded-full bg-brand text-lead font-semibold text-white shadow-[0_8px_24px_rgba(255,166,43,0.32)] tap-soft"
          >
            {active > 0
              ? `应用筛选 · 剩 ${preview} 只`
              : `应用筛选 · 共 ${preview} 只`}
          </button>
        </div>
      </div>

      <BreedSheet
        open={breedOpen}
        selected={draft.breeds}
        onApply={(breeds) => setDraft({ ...draft, breeds })}
        onClose={() => setBreedOpen(false)}
      />
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
    <div className="mt-2.5 flex items-start gap-2">
      <h3 className="w-[52px] shrink-0 pt-[7px] text-note font-semibold text-ink-soft">
        {title}
        {hint && <span className="block text-micro font-normal text-ink-mute">{hint}</span>}
      </h3>
      <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">{children}</div>
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
      className={`flex items-center gap-1 rounded-full px-3 py-[7px] text-note font-medium tap ${
        on ? "bg-brand text-on-brand" : "bg-surface text-ink-soft shadow-soft"
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
      {options.map((o) =>
        // 「不限」是默认值，不能和"已选条件"长得一样，否则看不出自己选了什么
        o.v === "all" ? (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            className={`tap flex items-center gap-1 rounded-full px-3 py-[7px] text-note font-medium ${
              value === o.v
                ? "border border-line bg-surface text-ink-mute"
                : "border border-transparent bg-white/10 text-ink-mute"
            }`}
          >
            {value === o.v && <Check size={11} strokeWidth={3} className="text-ink-mute" />}
            {o.label}
          </button>
        ) : (
          <Chip key={o.v} on={value === o.v} onClick={() => onChange(o.v)}>
            {o.label}
          </Chip>
        )
      )}
    </>
  );
}
