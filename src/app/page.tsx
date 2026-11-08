"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  MapPin,
  PawPrint,
  Search,
  Users,
} from "lucide-react";
import { meetups, pets } from "@/lib/data";
import { SIZE_LABEL, type Pet } from "@/lib/types";
import { fmtMeetupShort } from "@/lib/date";
import { useAppStore } from "@/components/store";
import LocationSheet from "@/components/location-sheet";

const FILTERS = [
  { key: "all", label: "全部" },
  { key: "dog", label: "狗狗" },
  { key: "cat", label: "猫猫" },
  { key: "near", label: "3km 内" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function HomePage() {
  const { greeted, greet, district } = useAppStore();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [toast, setToast] = useState<string | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);

  const list = useMemo(() => {
    return pets.filter((p) => {
      if (district && p.district !== district) return false;
      if (filter === "dog" || filter === "cat") return p.species === filter;
      if (filter === "near") return p.distanceKm <= 3;
      return true;
    });
  }, [filter, district]);

  const upcoming = useMemo(
    () => meetups.slice().sort((a, b) => a.startAt.localeCompare(b.startAt)).slice(0, 4),
    []
  );

  function handleGreet(pet: Pet) {
    const done = greeted.includes(pet.id);
    greet(pet.id);
    setToast(done ? "已取消打招呼" : `已向 ${pet.name} 的主人发出打招呼 👋`);
    window.setTimeout(() => setToast(null), 1800);
  }

  return (
    <>
      <div className="rise">
      {/* 顶部 */}
      <header className="px-5 pt-7">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setLocationOpen(true)}
            className="flex items-center gap-1 text-[13px] font-medium text-ink-soft active:opacity-60"
          >
            <MapPin size={13} strokeWidth={2.4} className="text-brand" />
            上海 · {district ?? "全部区域"}
            <ChevronDown size={13} strokeWidth={2.4} />
          </button>
          <Link
            href="/search"
            aria-label="搜索"
            className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-[0_2px_10px_rgba(80,60,40,0.08)] active:scale-95"
          >
            <Search size={16} strokeWidth={2.2} />
          </Link>
        </div>

        <h1 className="mt-4 text-[27px] leading-[1.25] font-bold tracking-tight">
          今天想和谁
          <br />
          一起遛弯？
        </h1>
        <p className="mt-1.5 text-[12.5px] text-ink-mute">
          {district
            ? `这个区域有 ${list.length} 只小伙伴`
            : `附近有 ${list.length} 只小伙伴在等你`}
        </p>
      </header>

      {/* 筛选 */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full px-3.5 py-[7px] text-[12.5px] font-medium transition ${
                active
                  ? "bg-ink text-cream"
                  : "bg-white text-ink-soft shadow-[0_1px_6px_rgba(80,60,40,0.06)]"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* 宠物卡片横滑 */}
      <div className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
        {list.map((pet) => {
          const done = greeted.includes(pet.id);
          return (
            <div
              key={pet.id}
              className="relative w-[74vw] max-w-[300px] shrink-0 snap-center"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[26px] bg-line">
                <Link href={`/pets/${pet.id}`} className="block h-full w-full">
                  <img
                    src={pet.photos[0]}
                    alt={pet.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/5" />

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[22px] font-semibold text-white">
                        {pet.name}
                      </h3>
                      <span className="text-[13px] text-white/60">
                        {pet.gender === "boy" ? "♂" : "♀"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-white/85">
                      {pet.breed} · {pet.ageText} · {SIZE_LABEL[pet.size]}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5 pr-14">
                      {pet.personality.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-white/20 px-2 py-[3px] text-[10.5px] text-white backdrop-blur-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>

                <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/85 px-2 py-1 text-[10.5px] font-medium backdrop-blur">
                  <MapPin size={10} strokeWidth={2.6} className="text-brand" />
                  {pet.distanceKm} km
                </div>

                <button
                  onClick={() => handleGreet(pet)}
                  aria-label="打招呼"
                  className={`absolute right-3 bottom-4 grid h-11 w-11 place-items-center rounded-full shadow-lg transition active:scale-90 ${
                    done ? "bg-white text-ink-mute" : "bg-brand text-white"
                  }`}
                >
                  {done ? (
                    <Check size={18} strokeWidth={2.6} />
                  ) : (
                    <PawPrint size={18} strokeWidth={2.2} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <p className="py-10 pl-1 text-[13px] text-ink-mute">
            这个范围暂时还没有小伙伴，换个筛选试试。
          </p>
        )}
      </div>

      {/* 附近的活动 */}
      <section className="mt-6">
        <div className="flex items-end justify-between px-5">
          <div>
            <h2 className="text-[17px] font-semibold tracking-tight">
              今晚附近的局
            </h2>
            <p className="mt-0.5 text-[11.5px] text-ink-mute">
              报名就能去，不用先聊天
            </p>
          </div>
          <Link
            href="/meetups"
            className="flex items-center gap-0.5 text-[12px] font-medium text-brand"
          >
            全部 <ArrowRight size={13} strokeWidth={2.4} />
          </Link>
        </div>

        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-5 pb-2">
          {upcoming.map((m) => (
            <Link
              key={m.id}
              href={`/meetups/${m.id}`}
              className="w-[210px] shrink-0 overflow-hidden rounded-[20px] bg-white shadow-[0_2px_12px_rgba(80,60,40,0.07)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={m.cover}
                  alt={m.title}
                  className="h-full w-full object-cover"
                />
                {m.type === "brand" && (
                  <span className="absolute top-2 left-2 rounded-full bg-ink/80 px-2 py-[3px] text-[9.5px] font-medium text-white backdrop-blur">
                    品牌活动
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-[11px] font-semibold text-brand">
                  {fmtMeetupShort(m.startAt)}
                </p>
                <h3 className="mt-1 line-clamp-1 text-[13.5px] font-semibold">
                  {m.title}
                </h3>
                <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-ink-mute">
                  <span className="line-clamp-1">{m.venueName}</span>
                  <span className="flex shrink-0 items-center gap-0.5">
                    <Users size={10} strokeWidth={2.4} />
                    {m.participants.length}/{m.capacity}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 底部留白 */}
      <div className="h-6" />
      </div>

      {/* 弹层放在动画容器外面，否则会被它的层叠上下文困住，盖不住底部 Tab */}
      <LocationSheet open={locationOpen} onClose={() => setLocationOpen(false)} />

      {/* 轻提示 */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink/85 px-4 py-2 text-[12px] font-medium text-cream shadow-xl backdrop-blur">
          {toast}
        </div>
      )}
    </>
  );
}
