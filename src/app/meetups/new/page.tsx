"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "@/components/store";
import { todayInSH } from "@/lib/date";
import { KIND_LABEL, SIZE_LABEL, type MeetupKind, type Size } from "@/lib/types";

const COVERS = ["/img/dog-6.jpg", "/img/dog-1.jpg", "/img/dog-16.jpg", "/img/dog-14.jpg"];

export default function NewMeetupPage() {
  const router = useRouter();
  const { addMeetup } = useAppStore();

  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<MeetupKind>("walk");
  const [date, setDate] = useState(todayInSH(1));
  const [time, setTime] = useState("19:00");
  const [venue, setVenue] = useState("");
  const [sizes, setSizes] = useState<Size[]>(["small", "medium"]);
  const [capacity, setCapacity] = useState(10);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  function toggleSize(s: Size) {
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("给你的局起个名字吧");
    if (!venue.trim()) return setError("写一下在哪儿见面");
    if (sizes.length === 0) return setError("至少选一种适合的体型");

    const id = `m-new-${Date.now()}`;
    addMeetup({
      id,
      type: "personal",
      kind,
      title: title.trim(),
      cover: COVERS[Math.floor(Math.random() * COVERS.length)],
      hostName: "小鹿",
      verified: false,
      startAt: `${date}T${time}:00+08:00`,
      venueName: venue.trim(),
      district: "浦东 · 花木",
      distanceKm: 1.2,
      sizeLimit: sizes,
      capacity,
      participants: [],
      description: description.trim() || "还没写说明，见面再聊吧。",
      tags: ["新发起"],
      fee: 0,
    });
    router.push(`/meetups/${id}`);
  }

  return (
    <form onSubmit={submit} className="rise pb-16">
      <header className="flex items-center gap-3 px-5 pt-7">
        <button
          type="button"
          onClick={() => router.back()}
          className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-card"
        >
          <ArrowLeft size={17} strokeWidth={2.4} />
        </button>
        <h1 className="text-title font-bold tracking-tight">发起一个局</h1>
      </header>

      <p className="mt-2 px-5 text-note text-ink-mute">
        不用先认识谁，把时间地点写清楚就有人来。
      </p>

      <div className="mt-5 space-y-4 px-5">
        <div>
          <label className="mb-2 block text-note font-medium text-ink-soft">
            活动类型
          </label>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {(["walk", "market", "cafe", "adopt", "indoor"] as const).map((k) => {
              const on = kind === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-note font-medium transition ${
                    on
                      ? "bg-brand text-white"
                      : "bg-white text-ink-soft shadow-soft"
                  }`}
                >
                  {KIND_LABEL[k]}
                </button>
              );
            })}
          </div>
        </div>

        <Field label="活动名称">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：周六早晨 · 世纪公园遛狗团"
            className="w-full bg-transparent text-body-lg outline-none placeholder:text-ink-mute/70"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="日期">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-body-lg outline-none"
            />
          </Field>
          <Field label="时间">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-transparent text-body-lg outline-none"
            />
          </Field>
        </div>

        <Field label="在哪儿见面">
          <input
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="例：世纪公园 3 号门"
            className="w-full bg-transparent text-body-lg outline-none placeholder:text-ink-mute/70"
          />
        </Field>

        <div>
          <label className="mb-2 block text-note font-medium text-ink-soft">
            适合的体型
          </label>
          <div className="flex gap-2">
            {(["small", "medium", "large"] as const).map((s) => {
              const on = sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`flex-1 rounded-full py-2.5 text-body font-medium transition ${
                    on
                      ? "bg-brand text-white"
                      : "bg-white text-ink-soft shadow-soft"
                  }`}
                >
                  {SIZE_LABEL[s]}犬
                </button>
              );
            })}
          </div>
        </div>

        <Field label="人数上限">
          <div className="flex items-center justify-between">
            <span className="text-body-lg font-medium">{capacity} 人</span>
            <input
              type="range"
              min={2}
              max={30}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-[60%] accent-[#ff6b4a]"
            />
          </div>
        </Field>

        <Field label="活动说明">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="路线怎么走、要不要带什么、下雨怎么办…"
            className="w-full resize-none bg-transparent text-body-lg leading-relaxed outline-none placeholder:text-ink-mute/70"
          />
        </Field>

        {error && (
          <p className="rounded-xl bg-brand-soft px-3 py-2 text-note font-medium text-brand">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-2 h-[52px] w-full rounded-full bg-brand text-lead font-semibold text-white shadow-[0_8px_24px_rgba(255,107,74,0.3)] active:scale-[0.98]"
        >
          发布这个局
        </button>
        <p className="pb-4 text-center text-cap text-ink-mute">
          演示版：发布的局只保存在当前页面，刷新后会消失
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-card bg-white px-4 py-3 shadow-card">
      <span className="mb-1.5 block text-cap font-medium text-ink-mute">
        {label}
      </span>
      {children}
    </label>
  );
}
