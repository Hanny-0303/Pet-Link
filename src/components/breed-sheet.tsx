"use client";

import { useState } from "react";
import { Check, Search, X } from "lucide-react";
import { SPECIES_LABEL, type Species } from "@/lib/types";
import { breedGroups } from "@/lib/breeds";

const SCOPES: (Species | "all")[] = [
  "all", "dog", "cat", "rabbit", "smallpet", "bird", "reptile", "exotic",
];

/** 品种二级面板：高基数维度不适合直接铺在筛选面板里 */
export default function BreedSheet({
  open,
  selected,
  onApply,
  onClose,
}: {
  open: boolean;
  selected: string[];
  onApply: (breeds: string[]) => void;
  onClose: () => void;
}) {
  const [scope, setScope] = useState<Species | "all">("all");
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string[]>(selected);

  if (!open) return null;

  const groups = breedGroups(scope, q);

  function toggle(breed: string) {
    setPicked((p) => (p.includes(breed) ? p.filter((x) => x !== breed) : [...p, breed]));
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="backdrop-in absolute inset-0 bg-ink/45" onClick={onClose} />

      <div className="sheet-in absolute inset-x-0 bottom-0 mx-auto flex max-h-[82vh] max-w-[430px] flex-col rounded-t-hero bg-canvas pb-[env(safe-area-inset-bottom)] shadow-float">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="text-title font-semibold tracking-tight">选择品种</h2>
            <p className="mt-0.5 text-note text-ink-mute">可以多选，不选就是不限</p>
          </div>
          <button
            onClick={onClose}
            aria-label="关闭"
            className="hit grid h-8 w-8 place-items-center rounded-full bg-surface shadow-card"
          >
            <X size={15} strokeWidth={2.4} />
          </button>
        </div>

        {/* 搜索 */}
        <div className="px-5 pb-2">
          <div className="flex items-center gap-2 rounded-full bg-surface px-3.5 py-2.5 shadow-soft">
            <Search size={14} strokeWidth={2.6} className="shrink-0 text-ink-mute" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜品种，比如「柯基」"
              className="w-full bg-transparent text-body outline-none placeholder:text-ink-mute"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="清空" className="text-ink-mute">
                <X size={14} strokeWidth={2.6} />
              </button>
            )}
          </div>
        </div>

        {/* 大类 */}
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 pb-3">
          {SCOPES.map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`tap shrink-0 rounded-full px-3 py-[7px] text-note font-medium ${
                scope === s ? "bg-brand text-on-brand" : "bg-surface text-ink-soft shadow-soft"
              }`}
            >
              {s === "all" ? "全部" : SPECIES_LABEL[s]}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto border-t border-line/60 px-5 pt-3 pb-4">
          {groups.length === 0 && (
            <p className="py-8 text-center text-note text-ink-mute">没有匹配的品种</p>
          )}
          {groups.map((g) => (
            <div key={g.letter} className="mb-2.5">
              <p className="mb-1.5 text-micro font-semibold text-ink-mute">{g.letter}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map(({ breed, n }) => {
                  const on = picked.includes(breed);
                  return (
                    <button
                      key={breed}
                      onClick={() => toggle(breed)}
                      className={`tap flex items-center gap-1 rounded-full px-3 py-[7px] text-note font-medium ${
                        on ? "bg-brand text-on-brand" : "bg-surface text-ink-soft shadow-soft"
                      }`}
                    >
                      {on && <Check size={11} strokeWidth={3} />}
                      {breed}
                      <span className={`text-micro ${on ? "opacity-60" : "text-ink-mute"}`}>{n}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 border-t border-line/70 px-5 pt-3 pb-4">
          <button
            onClick={() => setPicked([])}
            className="tap h-11 rounded-full border border-line px-5 text-body font-medium text-ink-soft"
          >
            清除
          </button>
          <button
            onClick={() => {
              onApply(picked);
              onClose();
            }}
            className="tap h-11 flex-1 rounded-full bg-brand text-body font-semibold text-on-brand"
          >
            {picked.length ? `选了 ${picked.length} 个品种` : "不限品种"}
          </button>
        </div>
      </div>
    </div>
  );
}
