"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Search, X } from "lucide-react";
import { pets } from "@/lib/data";
import {
  COMMON_SPECIES,
  EXOTIC_SPECIES,
  SPECIES_EMOJI,
  SPECIES_LABEL,
  type Species,
} from "@/lib/types";
import { useAppStore } from "@/components/store";

/** 搜索时的同义词，方便用户不懂术语也能找到 */
const ALIASES: Record<Species, string> = {
  dog: "狗 小狗 犬 柯基 柴犬 金毛 边牧",
  cat: "猫 小猫 猫咪 英短 布偶 橘猫",
  rabbit: "兔 兔子 垂耳兔 侏儒兔",
  smallpet: "小宠 仓鼠 龙猫 豚鼠",
  bird: "鸟 鹦鹉 鸟类 虎皮 玄凤",
  reptile: "爬宠 蜥蜴 蛇 守宫 龟 鬃狮蜥",
  exotic: "异宠 蜜袋鼯 刺猬 狐獴 飞鼠",
};

export default function SpeciesPage() {
  const router = useRouter();
  const { species, setSpecies } = useAppStore();
  const [q, setQ] = useState("");

  const count = (s: Species) => pets.filter((p) => p.species === s).length;

  const groups = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    const match = (s: Species) =>
      !keyword ||
      SPECIES_LABEL[s].includes(keyword) ||
      ALIASES[s].toLowerCase().includes(keyword);

    return [
      { title: "常见宠物", items: COMMON_SPECIES.filter(match) },
      { title: "小众宠物", items: EXOTIC_SPECIES.filter(match) },
    ].filter((g) => g.items.length > 0);
  }, [q]);

  function pick(s: Species | "all") {
    setSpecies(s);
    router.back();
  }

  return (
    <div className="min-h-dvh bg-cream pb-10">
      <header className="sticky top-0 z-30 bg-cream/95 px-4 pt-5 pb-3 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.back()}
            aria-label="返回"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white shadow-[0_2px_10px_rgba(80,60,40,0.08)]"
          >
            <ArrowLeft size={17} strokeWidth={2.4} />
          </button>
          <div className="flex h-10 flex-1 items-center gap-2 rounded-full bg-white px-3.5 shadow-[0_2px_10px_rgba(80,60,40,0.06)]">
            <Search size={15} strokeWidth={2.4} className="shrink-0 text-ink-mute" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜物种，比如「鹦鹉」「爬宠」"
              className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-ink-mute/80"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="清空">
                <X size={14} strokeWidth={2.6} className="text-ink-mute" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="px-5 pt-2">
        <button
          onClick={() => pick("all")}
          className={`flex w-full items-center gap-3 rounded-[16px] px-4 py-3.5 ${
            species === "all" ? "bg-brand-soft" : "bg-white shadow-[0_2px_10px_rgba(80,60,40,0.05)]"
          }`}
        >
          <span className="text-[20px]">🐾</span>
          <span
            className={`flex-1 text-left text-[14px] font-semibold ${
              species === "all" ? "text-brand" : ""
            }`}
          >
            全部宠物
          </span>
          <span className="text-[11px] text-ink-mute">{pets.length}</span>
          {species === "all" && <Check size={16} strokeWidth={2.8} className="text-brand" />}
        </button>

        {groups.map((g) => (
          <section key={g.title} className="mt-5">
            <h2 className="mb-2 px-1 text-[12px] font-semibold text-ink-soft">
              {g.title}
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {g.items.map((s) => {
                const active = species === s;
                return (
                  <button
                    key={s}
                    onClick={() => pick(s)}
                    className={`flex items-center gap-2.5 rounded-[16px] px-3.5 py-3 text-left transition active:scale-[0.98] ${
                      active
                        ? "bg-brand-soft ring-1 ring-brand/30"
                        : "bg-white shadow-[0_2px_10px_rgba(80,60,40,0.05)]"
                    }`}
                  >
                    <span className="text-[20px]">{SPECIES_EMOJI[s]}</span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-[13.5px] font-semibold ${
                          active ? "text-brand" : ""
                        }`}
                      >
                        {SPECIES_LABEL[s]}
                      </span>
                      <span className="block text-[10.5px] text-ink-mute">
                        {count(s)} 只在等你
                      </span>
                    </span>
                    {active && (
                      <Check size={14} strokeWidth={2.8} className="shrink-0 text-brand" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {groups.length === 0 && (
          <div className="pt-16 text-center">
            <p className="text-[13px] text-ink-soft">没有找到「{q}」这个分类</p>
            <p className="mt-1 text-[11.5px] text-ink-mute">
              试试「鹦鹉」「爬宠」「兔子」
            </p>
          </div>
        )}

        <p className="mt-8 px-2 text-center text-[10.5px] leading-relaxed text-ink-mute">
          异宠同好很难在身边找到，
          <br />
          所以我们把圈子也按物种分了。
        </p>
      </div>
    </div>
  );
}
