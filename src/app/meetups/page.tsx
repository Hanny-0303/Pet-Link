"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Clock, MapPin, Plus, Users } from "lucide-react";
import { meetups as seedMeetups } from "@/lib/data";
import { fmtMeetup } from "@/lib/date";
import { useAppStore } from "@/components/store";
import { KIND_LABEL, type MeetupKind } from "@/lib/types";

const KIND_TABS: { key: MeetupKind | "all"; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "walk", label: KIND_LABEL.walk },
  { key: "market", label: KIND_LABEL.market },
  { key: "cafe", label: KIND_LABEL.cafe },
  { key: "adopt", label: KIND_LABEL.adopt },
  { key: "indoor", label: KIND_LABEL.indoor },
];

const WEEK_MS = 7 * 86_400_000;

export default function MeetupsPage() {
  const { joined, extraMeetups } = useAppStore();
  const [kind, setKind] = useState<MeetupKind | "all">("all");
  const [freeOnly, setFreeOnly] = useState(false);
  const [brandOnly, setBrandOnly] = useState(false);
  const [thisWeek, setThisWeek] = useState(false);
  const [todayOnly, setTodayOnly] = useState(false);

  const all = useMemo(
    () =>
      [...extraMeetups, ...seedMeetups].sort((a, b) =>
        a.startAt.localeCompare(b.startAt)
      ),
    [extraMeetups]
  );

  const list = all.filter((m) => {
    if (kind !== "all" && m.kind !== kind) return false;
    if (freeOnly && m.fee > 0) return false;
    if (brandOnly && m.type !== "brand") return false;
    if (thisWeek && new Date(m.startAt).getTime() > Date.now() + WEEK_MS) return false;
    if (todayOnly) {
      const start = new Date(m.startAt).getTime();
      if (start > Date.now() + 86_400_000) return false;
    }
    return true;
  });

  return (
    <div className="rise">
      <header className="flex items-start justify-between px-5 pt-7">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight">活动</h1>
          <p className="mt-1 text-[12.5px] text-ink-mute">
            {all.length} 个局正在组队，报名就能去
          </p>
        </div>
        <Link
          href="/meetups/new"
          className="mt-1 grid h-9 w-9 place-items-center rounded-full bg-ink text-cream shadow-md active:scale-95"
          aria-label="发起活动"
        >
          <Plus size={18} strokeWidth={2.6} />
        </Link>
      </header>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5">
        {KIND_TABS.map((t) => {
          const active = kind === t.key;
          const count =
            t.key === "all"
              ? all.length
              : all.filter((m) => m.kind === t.key).length;
          return (
            <button
              key={t.key}
              onClick={() => setKind(t.key)}
              className={`shrink-0 rounded-full px-3.5 py-[7px] text-[12.5px] font-medium transition ${
                active
                  ? "bg-ink text-cream"
                  : "bg-white text-ink-soft shadow-[0_1px_6px_rgba(80,60,40,0.06)]"
              }`}
            >
              {t.label}
              <span className={active ? "ml-1 text-cream/60" : "ml-1 text-ink-mute"}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 快捷筛选 */}
      <div className="mt-2 flex gap-2 px-5">
        {[
          { on: todayOnly, set: setTodayOnly, label: "今天" },
          { on: freeOnly, set: setFreeOnly, label: "免费" },
          { on: thisWeek, set: setThisWeek, label: "本周" },
          { on: brandOnly, set: setBrandOnly, label: "品牌主办" },
        ].map((f) => (
          <button
            key={f.label}
            onClick={() => f.set(!f.on)}
            className={`rounded-full border px-3 py-[5px] text-[11px] font-medium transition ${
              f.on
                ? "border-brand bg-brand-soft text-brand"
                : "border-line bg-transparent text-ink-soft"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3.5 px-5">
        {list.map((m) => {
          const isJoined = joined.includes(m.id);
          const people = m.participants.length + (isJoined ? 1 : 0);
          const pct = Math.min(100, Math.round((people / m.capacity) * 100));
          const full = people >= m.capacity;

          return (
            <Link
              key={m.id}
              href={`/meetups/${m.id}`}
              className="block overflow-hidden rounded-[22px] bg-white shadow-[0_2px_14px_rgba(80,60,40,0.07)] active:scale-[0.995]"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-line">
                <img
                  src={m.cover}
                  alt={m.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-white/88 px-2 py-[3px] text-[9.5px] font-medium backdrop-blur">
                  {KIND_LABEL[m.kind]}
                  {m.type === "brand" && (
                    <BadgeCheck size={10} strokeWidth={2.6} className="text-mint" />
                  )}
                </span>
                <span className="absolute right-2.5 bottom-2.5 rounded-full bg-white/90 px-2 py-[3px] text-[9.5px] font-semibold backdrop-blur">
                  {m.fee > 0 ? `¥${m.fee}` : "免费"}
                </span>
                {isJoined && (
                  <span className="absolute bottom-2.5 left-2.5 rounded-full bg-mint px-2 py-[3px] text-[9.5px] font-semibold text-white">
                    已报名
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-brand">
                  <Clock size={11} strokeWidth={2.6} />
                  {fmtMeetup(m.startAt)}
                </div>
                <h3 className="mt-1.5 text-[15.5px] font-semibold tracking-tight">
                  {m.title}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-[11.5px] text-ink-mute">
                  <MapPin size={11} strokeWidth={2.2} />
                  {m.venueName}
                  <span className="text-line">|</span>
                  {m.distanceKm} km
                </p>

                <div className="mt-3.5">
                  <div className="h-1.5 overflow-hidden rounded-full bg-line">
                    <div
                      className={`h-full rounded-full ${full ? "bg-ink-mute" : "bg-brand"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10.5px]">
                    <span className="flex items-center gap-1 text-ink-soft">
                      <Users size={10} strokeWidth={2.4} />
                      {people}/{m.capacity} 人
                    </span>
                    <span className={full ? "text-ink-mute" : "text-ink-mute"}>
                      {full ? "已满员" : `还差 ${m.capacity - people} 人`}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {list.length === 0 && (
          <div className="rounded-[22px] border border-dashed border-line py-14 text-center">
            <p className="text-[13px] text-ink-mute">这一类暂时还没有局</p>
            <Link href="/meetups/new" className="mt-2 inline-block text-[12.5px] font-medium text-brand">
              发起一个 →
            </Link>
          </div>
        )}
      </div>

      <div className="h-6" />
    </div>
  );
}
