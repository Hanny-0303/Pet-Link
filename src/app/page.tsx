"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  GalleryVerticalEnd,
  Heart,
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
import { EMPTY_FILTERS, countActive, filterPets, type Filters } from "@/lib/filters";
import { buildRecommendations, likeCount } from "@/lib/pet";
import { locationLabel } from "@/lib/location";

type ViewMode = "swipe" | "grid";

export default function HomePage() {
  const {
    greeted,
    greet,
    location,
    showToast,
    prefs,
    species,
    setSpecies,
    likedPets,
    likePet,
  } = useAppStore();

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [mode, setMode] = useState<ViewMode>("swipe");

  // 首次进入提示一次"双击点赞"，不然没人会发现这个隐藏操作
  useEffect(() => {
    if (sessionStorage.getItem("likeHintSeen")) return;
    sessionStorage.setItem("likeHintSeen", "1");
    const t = window.setTimeout(() => showToast("双击图片，给它点个赞 ❤️"), 700);
    return () => window.clearTimeout(t);
  }, [showToast]);

  // 基于「我的宠物豆豆」算出的推荐名单：id -> 推荐理由
  const me = getPet("p1");
  const recommendations = useMemo(
    () => (me ? buildRecommendations(me) : {}),
    [me]
  );

  const list = useMemo(
    () => filterPets(pets, filters, species, location, recommendations),
    [species, location, filters, recommendations]
  );

  function handleGreet(pet: Pet) {
    const done = greeted.includes(pet.id);
    greet(pet.id);
    showToast(done ? "已取消打招呼" : `已向 ${pet.name} 的主人发出打招呼 👋`);
  }

  return (
    <>
      <div className="rise flex h-[calc(100dvh-5rem)] flex-col overflow-hidden">
        {/* 顶栏 */}
        <header className="shrink-0 px-5 pt-6">
          <div className="flex items-center justify-between">
            <Link
              href="/location"
              className="flex items-center gap-1 text-body font-medium text-ink-soft active:opacity-60"
            >
              <MapPin size={13} strokeWidth={2.4} className="text-accent" />
              {locationLabel(location)}
              <ChevronDown size={13} strokeWidth={2.4} />
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMode(mode === "swipe" ? "grid" : "swipe")}
                aria-label={mode === "swipe" ? "切换到网格" : "切换到单张"}
                className="hit grid h-9 w-9 place-items-center rounded-full bg-white shadow-card tap"
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
                className={`hit relative grid h-9 w-9 place-items-center rounded-full shadow-card tap ${
                  countActive(filters) > 0 ? "bg-brand text-ink" : "bg-white"
                }`}
              >
                <SlidersHorizontal size={16} strokeWidth={2.2} />
                {countActive(filters) > 0 && (
                  <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-white px-1 text-micro font-bold text-accent shadow">
                    {countActive(filters)}
                  </span>
                )}
              </button>
              <Link
                href="/search"
                aria-label="搜索"
                className="hit grid h-9 w-9 place-items-center rounded-full bg-white shadow-card tap"
              >
                <Search size={16} strokeWidth={2.2} />
              </Link>
            </div>
          </div>

          {mode === "grid" && (
            <div className="mt-4">
              <h1 className="text-page leading-tight font-bold tracking-tight">
                今天想认识
                <br />
                哪个小家伙？
              </h1>
              <p className="mt-1 text-note text-ink-mute">
                {location ? `${locationLabel(location)} 有 ${list.length} 只小伙伴` : `附近有 ${list.length} 只小伙伴`}
              </p>
            </div>
          )}
        </header>

        {/* 分类：收进一个入口，点开再选 */}
      <div className="mt-3 flex shrink-0 items-center px-5 pb-2">
        <Link
          href="/species"
          className="tap flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-body font-medium shadow-card"
        >
          <PawPrint size={13} strokeWidth={2.2} className="text-accent" />
          {species === "all" ? "全部宠物" : SPECIES_LABEL[species as Species]}
          <span className="text-cap text-ink-mute">{list.length}</span>
          <ChevronDown size={13} strokeWidth={2.6} className="text-ink-mute" />
        </Link>
      </div>

        {/* 内容 */}
        {list.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <PawPrint size={26} strokeWidth={1.6} className="text-ink-mute/70" />
            <p className="mt-3 text-body-lg font-medium text-ink-soft">
              {location ? "这里还没有小伙伴" : "这个条件下还没有小伙伴"}
            </p>
            <p className="mt-1 px-4 text-cap leading-relaxed text-ink-mute">
              {location
                ? "产品刚起步，先从有人的城市看起吧"
                : "试试放宽筛选条件"}
            </p>
            <div className="mt-4 flex gap-2">
              {location && (
                <Link
                  href="/location"
                  className="rounded-full bg-brand px-4 py-2 text-note font-medium text-white shadow-[0_4px_14px_rgba(255,166,43,0.32)]"
                >
                  换个地区
                </Link>
              )}
              <button
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="rounded-full bg-white px-4 py-2 text-note font-medium text-ink-soft shadow-card"
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
                liked={likedPets.includes(pet.id)}
                likes={likeCount(pet) + (likedPets.includes(pet.id) ? 1 : 0)}
                showDistance={prefs.showDistance}
                onGreet={() => handleGreet(pet)}
                onLike={() => likePet(pet.id)}
              />
            ))}
          </div>
        ) : (
          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          <div className="columns-2 gap-2">
            {list.map((pet, i) => (
              <PetTile
                key={pet.id}
                pet={pet}
                reason={recommendations[pet.id]}
                liked={likedPets.includes(pet.id)}
                likes={likeCount(pet) + (likedPets.includes(pet.id) ? 1 : 0)}
                showDistance={prefs.showDistance}
                onLike={() => likePet(pet.id)}
                delay={Math.min(i, 6) * 45}
              />
            ))}
          </div>
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
  liked,
  likes,
  showDistance,
  onGreet,
  onLike,
}: {
  pet: Pet;
  reason?: string;
  greeted: boolean;
  liked: boolean;
  likes: number;
  showDistance: boolean;
  onGreet: () => void;
  onLike: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [burst, setBurst] = useState(false);
  const router = useRouter();
  const tap = useRef({ x: 0, y: 0 });
  const clickTimer = useRef<number | null>(null);

  // 单击进主页，双击点赞（等 280ms 判断是不是第二下）
  function onTap() {
    if (clickTimer.current !== null) {
      window.clearTimeout(clickTimer.current);
      clickTimer.current = null;
      if (!liked) onLike();
      setBurst(true);
      window.setTimeout(() => setBurst(false), 700);
      return;
    }
    clickTimer.current = window.setTimeout(() => {
      clickTimer.current = null;
      router.push(`/pets/${pet.id}`);
    }, 280);
  }

  return (
    <article className="h-full w-full snap-start px-4 pb-2">
      <div className="relative h-full overflow-hidden rounded-hero bg-line">
        {/* 横向图集 */}
        <div
          className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== idx) setIdx(i);
          }}
          onPointerDown={(e) => {
            tap.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerUp={(e) => {
            // 轻点：进主页 / 双击：点赞；横向拖动翻照片时不触发
            const dx = Math.abs(e.clientX - tap.current.x);
            const dy = Math.abs(e.clientY - tap.current.y);
            if (dx < 8 && dy < 8) onTap();
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

        {burst && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <Heart
              size={110}
              strokeWidth={0}
              className="fill-white/90 text-white/90 [animation:pop_0.7s_ease-out]"
            />
          </div>
        )}

        {/* 顶部：距离 / 推荐 / 图集指示点 */}
        {showDistance && (
          <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/85 px-2 py-1 text-cap font-medium backdrop-blur">
            <MapPin size={10} strokeWidth={2.6} className="text-accent" />
            {pet.distanceKm} km
          </div>
        )}

        {reason && (
          <div className="pointer-events-none absolute top-3 right-3 flex items-center gap-1 rounded-full bg-brand px-2 py-1 text-micro font-semibold text-white shadow-lg">
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
              <h2 className="text-page font-bold text-white">{pet.name}</h2>
              <span className="text-body-lg text-white/60">
                {pet.gender === "boy" ? "♂" : "♀"}
              </span>
            </div>
            <p className="mt-1 text-body text-white/85">
              {pet.breed} · {pet.ageText} · {SIZE_LABEL[pet.size]}
            </p>
            <p className="mt-1 flex items-center gap-1 text-cap text-white/70">
              <Heart
                size={11}
                strokeWidth={2.4}
                className={liked ? "heart-pop fill-ink text-ink" : ""}
              />
              {likes} 人喜欢
              {reason && <span className="text-white/45">· {reason}</span>}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5 pr-16">
              {pet.personality.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/20 px-2 py-[3px] text-cap text-white backdrop-blur-sm"
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
              greeted ? "bg-white text-ink-mute" : "bg-brand text-ink"
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

function PetTile({
  pet,
  reason,
  liked,
  likes,
  showDistance,
  onLike,
  delay = 0,
}: {
  pet: Pet;
  reason?: string;
  liked: boolean;
  likes: number;
  showDistance: boolean;
  onLike: () => void;
  delay?: number;
}) {
  const router = useRouter();
  const timer = useRef<number | null>(null);
  const [burst, setBurst] = useState(false);

  function onTap() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
      if (!liked) onLike();
      setBurst(true);
      window.setTimeout(() => setBurst(false), 700);
      return;
    }
    timer.current = window.setTimeout(() => {
      timer.current = null;
      router.push(`/pets/${pet.id}`);
    }, 280);
  }

  return (
    <div
      onClick={onTap}
      className="stagger tap mb-2 block cursor-pointer break-inside-avoid overflow-hidden rounded-card bg-white shadow-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative w-full" style={{ paddingBottom: "118%" }}>
        <img
          src={pet.photos[0]}
          alt={pet.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {burst && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <Heart
              size={64}
              strokeWidth={0}
              className="fill-white/90 text-white/90 [animation:pop_0.7s_ease-out]"
            />
          </div>
        )}
        {reason && (
          <span className="absolute top-2 left-2 flex items-center gap-0.5 rounded-full bg-brand px-1.5 py-[3px] text-micro font-semibold text-white shadow">
            <Sparkles size={8} strokeWidth={3} /> 推荐
          </span>
        )}
        {showDistance && (
          <span className="absolute right-2 bottom-2 rounded-full bg-black/45 px-1.5 py-[2px] text-micro text-white backdrop-blur">
            {pet.distanceKm}km
          </span>
        )}
      </div>
      <div className="px-2.5 py-2">
        <div className="flex items-center gap-1">
          <p className="truncate text-body font-semibold">{pet.name}</p>
          <span className="text-micro text-ink-mute">
            {pet.gender === "boy" ? "♂" : "♀"}
          </span>
        </div>
        <p className="mt-0.5 truncate text-cap text-ink-mute">
          {pet.breed} · {pet.ageText} · {SIZE_LABEL[pet.size]}
        </p>
        <div className="mt-1.5 flex items-center gap-1">
          <Heart
            size={9}
            strokeWidth={2.6}
            className={
              liked ? "heart-pop fill-brand text-accent" : "text-ink-mute"
            }
          />
          <span className="text-micro text-ink-mute">{likes}</span>
          {pet.personality.slice(0, 1).map((t) => (
            <span
              key={t}
              className="ml-1 rounded-full bg-cream px-1.5 py-[2px] text-micro text-ink-soft"
            >
              {t}
            </span>
          ))}
        </div>
        {reason && (
          <p className="mt-1 truncate text-micro text-accent">{reason}</p>
        )}
      </div>
    </div>
  );
}
