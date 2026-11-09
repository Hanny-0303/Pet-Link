"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, MapPin, PawPrint, Search, X } from "lucide-react";
import { meetups, pets } from "@/lib/data";
import { fmtMeetupShort } from "@/lib/date";
import {
  AGE_LABEL,
  ENERGY_LABEL,
  KIND_LABEL,
  SIZE_LABEL,
  SOCIAL_LABEL,
  SPECIES_LABEL,
} from "@/lib/types";

const HOT = ["柯基", "兔子", "猫猫", "市集", "活泼", "世纪公园"];

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 支持 /search?q=柯基 直接带关键词进来（可分享的搜索链接）
    const preset = new URLSearchParams(window.location.search).get("q");
    if (preset) setQuery(preset);
    // 进入页面直接聚焦，手机上会弹出键盘
    const t = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(t);
  }, []);

  const q = query.trim().toLowerCase();

  const petHits = useMemo(() => {
    if (!q) return [];
    return pets.filter((p) =>
      [p.name, p.breed, p.ownerName, p.bio, SPECIES_LABEL[p.species],
       SIZE_LABEL[p.size], AGE_LABEL[p.ageBand], SOCIAL_LABEL[p.social],
       ENERGY_LABEL[p.energy], ...p.traits]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [q]);

  const meetupHits = useMemo(() => {
    if (!q) return [];
    return meetups.filter((m) =>
      [m.title, m.venueName, m.district, m.hostName, KIND_LABEL[m.kind], ...m.tags]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [q]);

  const total = petHits.length + meetupHits.length;

  return (
    <div className="min-h-dvh bg-canvas">
      {/* 搜索栏 */}
      <div className="sticky top-0 z-30 bg-canvas/95 px-4 pt-5 pb-3 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.back()}
            aria-label="返回"
            className="hit grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white shadow-card"
          >
            <ArrowLeft size={17} strokeWidth={2.4} />
          </button>

          <div className="flex h-10 flex-1 items-center gap-2 rounded-full bg-white px-3.5 shadow-card">
            <Search size={15} strokeWidth={2.4} className="shrink-0 text-ink-mute" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜宠物、品种、活动、地点"
              className="w-full bg-transparent text-body-lg outline-none placeholder:text-ink-mute/80"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="清空">
                <X size={14} strokeWidth={2.6} className="text-ink-mute" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 还没输入 */}
      {!q && (
        <div className="px-5 pt-4">
          <h2 className="text-body font-semibold text-ink-soft">大家都在搜</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {HOT.map((t) => (
              <button
                key={t}
                onClick={() => setQuery(t)}
                className="rounded-full bg-white px-3.5 py-[7px] text-body font-medium text-ink-soft shadow-soft tap"
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-card border border-dashed border-line px-4 py-6 text-center">
            <PawPrint size={20} strokeWidth={1.8} className="mx-auto text-ink-mute" />
            <p className="mt-2 text-note leading-relaxed text-ink-mute">
              可以搜宠物名字、品种、性格，
              <br />
              也可以搜活动名称和公园
            </p>
          </div>
        </div>
      )}

      {/* 有结果 */}
      {q && total > 0 && (
        <div className="pb-24">
          {petHits.length > 0 && (
            <section className="mt-2">
              <h2 className="px-5 pb-1 text-note font-semibold text-ink-mute">
                宠物 · {petHits.length}
              </h2>
              {petHits.map((p) => (
                <Link
                  key={p.id}
                  href={`/pets/${p.id}`}
                  className="flex items-center gap-3 px-5 py-2.5 active:bg-white/70"
                >
                  <img
                    src={p.photos[0]}
                    alt={p.name}
                    className="h-14 w-14 shrink-0 rounded-card object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-body-lg font-semibold">
                      {p.name}
                      <span className="ml-1 text-cap font-normal text-ink-mute">
                        {p.gender === "boy" ? "♂" : "♀"}
                      </span>
                    </p>
                    <p className="mt-0.5 text-cap text-ink-mute">
                      {p.breed} · {p.ageText} · {SIZE_LABEL[p.size]}
                    </p>
                    <p className="mt-0.5 flex items-center gap-0.5 text-cap text-ink-mute">
                      <MapPin size={9} strokeWidth={2.4} />
                      {p.district} · {p.distanceKm} km
                    </p>
                  </div>
                  <ChevronRight size={15} className="shrink-0 text-ink-mute" />
                </Link>
              ))}
            </section>
          )}

          {meetupHits.length > 0 && (
            <section className="mt-4">
              <h2 className="px-5 pb-1 text-note font-semibold text-ink-mute">
                活动 · {meetupHits.length}
              </h2>
              {meetupHits.map((m) => (
                <Link
                  key={m.id}
                  href={`/meetups/${m.id}`}
                  className="flex items-center gap-3 px-5 py-2.5 active:bg-white/70"
                >
                  <img
                    src={m.cover}
                    alt={m.title}
                    className="h-14 w-14 shrink-0 rounded-card object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-body-lg font-semibold">
                      {m.title}
                    </p>
                    <p className="mt-0.5 text-cap text-accent">
                      {fmtMeetupShort(m.startAt)}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-cap text-ink-mute">
                      {m.venueName}
                    </p>
                  </div>
                  <ChevronRight size={15} className="shrink-0 text-ink-mute" />
                </Link>
              ))}
            </section>
          )}
        </div>
      )}

      {/* 没结果 */}
      {q && total === 0 && (
        <div className="px-5 pt-16 text-center">
          <PawPrint size={26} strokeWidth={1.6} className="mx-auto text-ink-mute/70" />
          <p className="mt-3 text-body-lg font-medium text-ink-soft">
            没有找到「{query}」
          </p>
          <p className="mt-1 text-note text-ink-mute">换个词试试看</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {HOT.slice(0, 4).map((t) => (
              <button
                key={t}
                onClick={() => setQuery(t)}
                className="rounded-full bg-white px-3.5 py-[7px] text-note font-medium text-ink-soft shadow-soft"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
