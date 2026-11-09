"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ChevronRight, MapPin, Search, X } from "lucide-react";
import { pets } from "@/lib/data";
import {
  DIVISIONS,
  groupByLetter,
  searchLocations,
  type FlatEntry,
  type Location,
} from "@/lib/location";
import { useAppStore } from "@/components/store";

/** 每个市 / 每个区县各有多少只宠物 */
const CITY_COUNT = new Map<string, number>();
const AREA_COUNT = new Map<string, number>();
for (const p of pets) {
  CITY_COUNT.set(p.city, (CITY_COUNT.get(p.city) ?? 0) + 1);
  AREA_COUNT.set(p.area, (AREA_COUNT.get(p.area) ?? 0) + 1);
}

/** 去掉「省 / 市 / 自治区 / 维吾尔」等后缀，只留简称 */
function shortProvince(name: string): string {
  return name.replace(/(维吾尔|壮族|回族|特别行政区|自治区|省|市)+$/g, "");
}

export default function LocationPage() {
  const router = useRouter();
  const { location, setLocation } = useAppStore();

  const [q, setQ] = useState("");
  const [province, setProvince] = useState<string | null>(location?.province ?? null);
  const [city, setCity] = useState<string | null>(location?.city ?? null);

  const currentProvince = DIVISIONS.find((p) => p.name === province);
  const currentCity = currentProvince?.cities.find((c) => c.name === city);

  const results = useMemo(() => (q.trim() ? searchLocations(q) : []), [q]);

  function pick(loc: Location | null) {
    setLocation(loc);
    router.back();
  }

  function pickEntry(e: FlatEntry) {
    pick({ province: e.province, city: e.city, area: e.area });
  }

  const title = currentCity
    ? currentCity.name
    : currentProvince
      ? currentProvince.name
      : "选择地区";

  return (
    <div className="min-h-dvh bg-cream pb-10">
      {/* 顶栏 */}
      <header className="sticky top-0 z-30 bg-cream/95 px-4 pt-5 pb-3 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (q) return setQ("");
              if (currentCity) return setCity(null);
              if (currentProvince) return setProvince(null);
              router.back();
            }}
            aria-label="返回"
            className="hit grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white shadow-card"
          >
            <ArrowLeft size={17} strokeWidth={2.4} />
          </button>
          <div className="flex h-10 flex-1 items-center gap-2 rounded-full bg-white px-3.5 shadow-card">
            <Search size={15} strokeWidth={2.4} className="shrink-0 text-ink-mute" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜城市或区县，比如「朝阳」「昆山」"
              className="w-full bg-transparent text-body-lg outline-none placeholder:text-ink-mute/80"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="清空">
                <X size={14} strokeWidth={2.6} className="text-ink-mute" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-2.5 px-1 text-note text-ink-mute">
          {q ? `搜索「${q}」` : title}
        </p>
      </header>

      {/* 搜索结果 */}
      {q ? (
        <div className="px-3">
          {results.length === 0 ? (
            <p className="pt-12 text-center text-body text-ink-mute">
              没有找到「{q}」
            </p>
          ) : (
            results.map((e, i) => (
              <button
                key={`${e.text}-${i}`}
                onClick={() => pickEntry(e)}
                className="flex w-full items-center gap-2.5 rounded-chip px-3 py-3 text-left active:bg-white/70"
              >
                <MapPin size={14} strokeWidth={2.2} className="shrink-0 text-ink-mute" />
                <span className="min-w-0 flex-1">
                  <span className="block text-body-lg font-medium">{e.text}</span>
                  <span className="block text-cap text-ink-mute">
                    {e.area
                      ? `${AREA_COUNT.get(e.area) ?? 0} 位小伙伴`
                      : `${CITY_COUNT.get(e.city) ?? 0} 位小伙伴`}
                  </span>
                </span>
                <ChevronRight size={14} className="shrink-0 text-ink-mute" />
              </button>
            ))
          )}
        </div>
      ) : !currentProvince ? (
        /* 省级 */
        <div className="px-5 pt-1">
          <button
            onClick={() => pick(null)}
            className={`mb-3 flex w-full items-center gap-3 rounded-card px-4 py-3.5 ${
              !location ? "bg-brand-soft" : "bg-white shadow-card"
            }`}
          >
            <span className="text-title">🇨🇳</span>
            <span
              className={`flex-1 text-left text-body-lg font-semibold ${
                !location ? "text-accent" : ""
              }`}
            >
              全国
            </span>
            <span className="text-cap text-ink-mute">{pets.length}</span>
            {!location && <Check size={15} strokeWidth={2.8} className="text-accent" />}
          </button>

          {groupByLetter(DIVISIONS, (p) => p.name).map((g) => (
            <div key={g.letter} className="mb-3">
              <p className="mb-1.5 px-1 text-cap font-semibold text-ink-mute">
                {g.letter}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {g.list.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setProvince(p.name)}
                    className="rounded-chip bg-white px-2 py-2.5 text-body font-medium shadow-soft tap"
                  >
                    {shortProvince(p.name)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : !currentCity ? (
        /* 市级 */
        <div className="px-5 pt-1">
          <button
            onClick={() => pick({ province: currentProvince.name, city: currentProvince.name, area: null })}
            className="mb-3 flex w-full items-center gap-2 rounded-card bg-white px-4 py-3 text-left shadow-soft"
          >
            <span className="flex-1 text-body font-medium">
              整个{currentProvince.name}
            </span>
            <ChevronRight size={14} className="text-ink-mute" />
          </button>
          {groupByLetter(currentProvince.cities, (c) => c.name).map((g) => (
            <div key={g.letter} className="mb-3">
              <p className="mb-1.5 px-1 text-cap font-semibold text-ink-mute">
                {g.letter}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {g.list.map((c) => {
                  const n = CITY_COUNT.get(c.name) ?? 0;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setCity(c.name)}
                      className="flex items-center gap-2 rounded-chip bg-white px-3 py-2.5 text-left shadow-soft tap-soft"
                    >
                      <span className="min-w-0 flex-1 truncate text-body font-medium">
                        {c.name}
                      </span>
                      {n > 0 && (
                        <span className="shrink-0 rounded-full bg-brand-soft px-1.5 text-micro font-semibold text-accent">
                          {n}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 区县级 */
        <div className="px-5 pt-1">
          <button
            onClick={() =>
              pick({ province: currentProvince.name, city: currentCity.name, area: null })
            }
            className="mb-3 flex w-full items-center gap-2 rounded-card bg-white px-4 py-3 text-left shadow-soft"
          >
            <span className="flex-1 text-body font-medium">
              整个{currentCity.name}
            </span>
            <ChevronRight size={14} className="text-ink-mute" />
          </button>
          {groupByLetter(currentCity.areas, (a) => a).map((g) => (
            <div key={g.letter} className="mb-3">
              <p className="mb-1.5 px-1 text-cap font-semibold text-ink-mute">
                {g.letter}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {g.list.map((a) => {
              const n = AREA_COUNT.get(a) ?? 0;
              return (
                <button
                  key={a}
                  onClick={() =>
                    pick({ province: currentProvince.name, city: currentCity.name, area: a })
                  }
                  className={`flex items-center gap-2 rounded-chip px-3 py-2.5 text-left tap-soft ${
                    n > 0
                      ? "bg-white shadow-card"
                      : "bg-white/60"
                  }`}
                >
                  <span
                    className={`min-w-0 flex-1 truncate text-body ${
                      n > 0 ? "font-medium text-ink" : "text-ink-soft"
                    }`}
                  >
                    {a}
                  </span>
                  {n > 0 && (
                    <span className="shrink-0 rounded-full bg-brand px-1.5 text-micro font-semibold text-white">
                      {n}
                    </span>
                  )}
                </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
