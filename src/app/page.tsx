"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  GalleryVerticalEnd,
  LayoutGrid,
  MapPin,
  PawPrint,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { getPet, pets } from "@/lib/data";
import {
  COMMON_SPECIES,
  SIZE_LABEL,
  SPECIES_LABEL,
  isExotic,
  type Pet,
  type Species,
} from "@/lib/types";
import { useAppStore } from "@/components/store";
import FilterSheet from "@/components/filter-sheet";
import { EMPTY_FILTERS, countActive, type Filters } from "@/lib/filters";
import { buildRecommendations } from "@/lib/pet";
import { locationLabel } from "@/lib/location";

const QUICK_SPECIES: (Species | "all")[] = ["all", ...COMMON_SPECIES];

type ViewMode = "swipe" | "grid";

export default function HomePage() {
  const { greeted, greet, location, showToast, prefs, species, setSpecies } =
    useAppStore();

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [mode, setMode] = useState<ViewMode>("swipe");

  // 基于「我的宠物豆豆」算出的推荐名单：id -> 推荐理由
  const me = getPet("p1");
  const recommendations = useMemo(
    () => (me ? buildRecommendations(me) : {}),
    [me]
  );

  const list = useMemo(() => {
    return pets.filter((p) => {
      if (
        location &&
        (p.province !== location.province ||
          p.city !== location.city ||
          (location.area !== null && p.area !== location.area))
      )
        return false;
      if (species !== "all" && p.species !== species) return false;
      if (filters.sizes.length && !filters.sizes.includes(p.size)) return false;
      if (filters.ages.length && !filters.ages.includes(p.ageBand)) return false;
      if (filters.breeds.length && !filters.breeds.includes(p.breed)) return false;
      if (filters.gender !== "all" && p.gender !== filters.gender) return false;
      if (filters.neutered !== "all" && (filters.neutered === "yes") !== p.neutered)
        return false;
      if (filters.social !== "all" && p.social !== filters.social) return false;
      if (filters.energy !== "all" && p.energy !== filters.energy) return false;
      if (filters.maxKm !== null && p.distanceKm > filters.maxKm) return false;
      if (filters.traits.length && !filters.traits.some((t) => p.traits.includes(t)))
        return false;
      if (filters.onlyRecommended && !(p.id in recommendations)) return false;
      return true;
    });
  }, [species, location, filters, recommendations]);

  function handleGreet(pet: Pet) {
    const done = greeted.includes(pet.id);
    greet(pet.id);
    showToast(done ? "已取消打招呼" : `已向 ${pet.name} 的主人发出打招呼 👋`);
  }

  return (
    <>
      <div className="flex h-[calc(100dvh-5rem)] flex-col overflow-hidden">
        {/* 顶栏 */}
        <header className="shrink-0 px-5 pt-6">
          <div className="flex items-center justify-between">
            <Link
              href="/location"
              className="flex items-center gap-1 text-[13px] font-medium text-ink-soft active:opacity-60"
            >
              <MapPin size={13} strokeWidth={2.4} className="text-brand" />
              {locationLabel(location)}
              <ChevronDown size={13} strokeWidth={2.4} />
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMode(mode === "swipe" ? "grid" : "swipe")}
                aria-label={mode === "swipe" ? "切换到网格" : "切换到单张"}
                className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-[0_2px_10px_rgba(80,60,40,0.08)] active:scale-95"
              >
                {mode === "swipe" ? (
                  <LayoutGrid size={16} strokeWidth={2.2} />
                ) : (
                  <GalleryVerticalEnd size={16} strokeWidth={2.2} />
                )}
              </button>
              <button
                onClick={() => setFilterOpen(true)}
                aria-label="筛选"
                className={`relative grid h-9 w-9 place-items-center rounded-full shadow-[0_2px_10px_rgba(80,60,40,0.08)] active:scale-95 ${
                  countActive(filters) > 0 ? "bg-brand text-white" : "bg-white"
                }`}
              >
                <SlidersHorizontal size={16} strokeWidth={2.2} />
                {countActive(filters) > 0 && (
                  <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-white px-1 text-[9px] font-bold text-brand shadow">
                    {countActive(filters)}
                  </span>
                )}
              </button>
              <Link
                href="/search"
                aria-label="搜索"
                className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-[0_2px_10px_rgba(80,60,40,0.08)] active:scale-95"
              >
                <Search size={16} strokeWidth={2.2} />
              </Link>
            </div>
          </div>

          {mode === "grid" && (
            <div className="mt-4">
              <h1 className="text-[24px] leading-tight font-bold tracking-tight">
                今天想认识
                <br />
                哪个小家伙？
              </h1>
              <p className="mt-1 text-[12px] text-ink-mute">
                {location ? `${locationLabel(location)} 有 ${list.length} 只小伙伴` : `附近有 ${list.length} 只小伙伴`}
              </p>
            </div>
          )}
        </header>

        {/* 物种分类 */}
        <div className="no-scrollbar mt-3 flex shrink-0 gap-2 overflow-x-auto px-5 pb-2">
          {QUICK_SPECIES.map((t) => {
            const active = species === t;
            const count =
              t === "all" ? pets.length : pets.filter((p) => p.species === t).length;
            return (
              <button
                key={t}
                onClick={() => setSpecies(t)}
                className={`flex shrink-0 items-center gap-1 rounded-full px-3.5 py-[7px] text-[12.5px] font-medium transition ${
                  active
                    ? "bg-ink text-cream"
                    : "bg-white text-ink-soft shadow-[0_1px_6px_rgba(80,60,40,0.06)]"
                }`}
              >
                {t === "all" ? "全部" : SPECIES_LABEL[t as Species]}
                <span className={active ? "text-cream/55" : "text-ink-mute"}>{count}</span>
              </button>
            );
          })}
          <Link
            href="/species"
            className={`flex shrink-0 items-center gap-1 rounded-full px-3.5 py-[7px] text-[12.5px] font-medium transition ${
              isExotic(species as Species)
                ? "bg-ink text-cream"
                : "bg-white text-ink-soft shadow-[0_1px_6px_rgba(80,60,40,0.06)]"
            }`}
          >
            {isExotic(species as Species) ? SPECIES_LABEL[species as Species] : "更多"}
            <ChevronDown size={12} strokeWidth={2.6} />
          </Link>
        </div>

        {/* 内容 */}
        {list.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <PawPrint size={26} strokeWidth={1.6} className="text-ink-mute/70" />
            <p className="mt-3 text-[13.5px] font-medium text-ink-soft">
              {location ? "这里还没有小伙伴" : "这个条件下还没有小伙伴"}
            </p>
            <p className="mt-1 px-4 text-[11px] leading-relaxed text-ink-mute">
              {location
                ? "产品刚起步，先从有人的城市看起吧"
                : "试试放宽筛选条件"}
            </p>
            <div className="mt-4 flex gap-2">
              {location && (
                <Link
                  href="/location"
                  className="rounded-full bg-brand px-4 py-2 text-[12px] font-medium text-white shadow-[0_4px_14px_rgba(255,107,74,0.28)]"
                >
                  换个地区
                </Link>
              )}
              <button
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="rounded-full bg-white px-4 py-2 text-[12px] font-medium text-ink-soft shadow-[0_2px_10px_rgba(80,60,40,0.06)]"
              >
                清空筛选
              </button>
            </div>
          </div>
        ) : mode === "swipe" ? (
          <div className="no-scrollbar min-h-0 flex-1 snap-y snap-mandatory overflow-y-auto">
            {list.map((pet) => (
              <PetSlide
                key={pet.id}
                pet={pet}
                reason={recommendations[pet.id]}
                greeted={greeted.includes(pet.id)}
                showDistance={prefs.showDistance}
                onGreet={() => handleGreet(pet)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-wrap content-start gap-1.5 overflow-y-auto px-3 pb-4">
            {list.map((pet) => (
              <div
                key={pet.id}
                className="relative overflow-hidden rounded-[12px] bg-line"
                style={{
                  width: "calc((100% - 12px) / 3)",
                  paddingBottom: "calc((100% - 12px) / 3)",
                }}
              >
                <Link href={`/pets/${pet.id}`} className="absolute inset-0">
                  <img
                    src={pet.photos[0]}
                    alt={pet.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent px-1.5 pt-6 pb-1.5">
                    <p className="truncate text-[11px] font-semibold text-white">
                      {pet.name}
                    </p>
                  </div>
                  {recommendations[pet.id] && (
                    <span className="absolute top-1.5 right-1.5 grid h-4 w-4 place-items-center rounded-full bg-brand text-white shadow">
                      <Sparkles size={9} strokeWidth={3} />
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <FilterSheet
        open={filterOpen}
        species={species}
        value={filters}
        onApply={setFilters}
        onClose={() => setFilterOpen(false)}
      />
    </>
  );
}

function PetSlide({
  pet,
  reason,
  greeted,
  showDistance,
  onGreet,
}: {
  pet: Pet;
  reason?: string;
  greeted: boolean;
  showDistance: boolean;
  onGreet: () => void;
}) {
  const [idx, setIdx] = useState(0);

  return (
    <article className="h-full w-full snap-start px-4 pb-2">
      <div className="relative h-full overflow-hidden rounded-[26px] bg-line">
        {/* 横向图集 */}
        <div
          className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== idx) setIdx(i);
          }}
        >
          {pet.photos.map((src, i) => (
            <div key={i} className="h-full w-full shrink-0 snap-center">
              <img
                src={src}
                alt={`${pet.name} 照片 ${i + 1}`}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/10" />

        {/* 顶部：距离 / 推荐 / 图集指示点 */}
        {showDistance && (
          <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/85 px-2 py-1 text-[10.5px] font-medium backdrop-blur">
            <MapPin size={10} strokeWidth={2.6} className="text-brand" />
            {pet.distanceKm} km
          </div>
        )}

        {reason && (
          <div className="pointer-events-none absolute top-3 right-3 flex items-center gap-1 rounded-full bg-brand px-2 py-1 text-[10px] font-semibold text-white shadow-lg">
            <Sparkles size={10} strokeWidth={2.8} />
            推荐
          </div>
        )}

        {pet.photos.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center gap-1.5">
            {pet.photos.map((_, i) => (
              <span
                key={i}
                className={`h-[5px] rounded-full transition-all ${
                  i === idx ? "w-4 bg-white" : "w-[5px] bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* 底部信息 */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <Link href={`/pets/${pet.id}`} className="block">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[26px] font-bold text-white">{pet.name}</h2>
              <span className="text-[14px] text-white/60">
                {pet.gender === "boy" ? "♂" : "♀"}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-white/85">
              {pet.breed} · {pet.ageText} · {SIZE_LABEL[pet.size]}
            </p>
            {reason && (
              <p className="mt-1 text-[11px] text-white/60">{reason}</p>
            )}
            <div className="mt-2.5 flex flex-wrap gap-1.5 pr-16">
              {pet.personality.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/20 px-2 py-[3px] text-[10.5px] text-white backdrop-blur-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </Link>

          <button
            onClick={onGreet}
            aria-label="打招呼"
            className={`absolute right-5 bottom-5 grid h-12 w-12 place-items-center rounded-full shadow-lg transition active:scale-90 ${
              greeted ? "bg-white text-ink-mute" : "bg-brand text-white"
            }`}
          >
            {greeted ? (
              <Check size={19} strokeWidth={2.6} />
            ) : (
              <PawPrint size={19} strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
