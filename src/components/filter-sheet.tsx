"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { pets } from "@/lib/data";
import { AGE_LABEL, SIZE_LABEL } from "@/lib/types";
import { DISTANCE_OPTIONS, EMPTY_FILTERS, countActive, type Filters } from "@/lib/filters";

/** 性格标签：从宠物数据里按出现次数取前 10 个 */
const TRAITS = (() => {
  const count = new Map<string, number>();
  for (const p of pets) {
    for (const t of p.personality) count.set(t, (count.get(t) ?? 0) + 1);
  }
  return [...count.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([t]) => t);
})();

export default function FilterSheet({
  open,
  value,
  onApply,
  onClose,
}: {
  open: boolean;
  value: Filters;
  onApply: (f: Filters) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Filters>(value);
  // 每次打开时同步一次外部值
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) setDraft(value);
  }

  if (!open) return null;

  function toggleIn<T extends string>(list: T[], v: T): T[] {
    return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
  }

  const active = countActive(draft);

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]" onClick={onClose} />

      <div className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[82vh] max-w-[430px] flex-col rounded-t-[26px] bg-cream pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_40px_rgba(0,0,0,0.15)]">
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

          <Section title="性格">
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-[12px] font-semibold text-ink-soft">{title}</h3>
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
