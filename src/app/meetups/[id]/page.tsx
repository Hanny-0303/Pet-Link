"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Share2,
  Users,
  Wallet,
} from "lucide-react";
import { meetups as seedMeetups, getPet } from "@/lib/data";
import { fmtMeetup } from "@/lib/date";
import { SIZE_LABEL } from "@/lib/types";
import { useAppStore } from "@/components/store";
import Avatar from "@/components/avatar";

export default function MeetupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { joined, join, extraMeetups, showToast } = useAppStore();

  const meetup =
    extraMeetups.find((m) => m.id === id) ?? seedMeetups.find((m) => m.id === id);

  if (!meetup) {
    return (
      <div className="px-5 pt-24 text-center">
        <p className="text-body-lg text-ink-soft">这个活动不存在或已结束</p>
        <Link href="/meetups" className="mt-3 inline-block text-body font-medium text-brand">
          返回活动列表
        </Link>
      </div>
    );
  }

  const isJoined = joined.includes(meetup.id);
  const people = meetup.participants.length + (isJoined ? 1 : 0);
  const full = people >= meetup.capacity;
  const me = getPet("p1");
  const pct = Math.min(100, Math.round((people / meetup.capacity) * 100));

  async function share() {
    const url = `${window.location.origin}/meetups/${meetup!.id}`;
    const title = meetup!.title;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: `${title} · 一起遛狗吗？`, url });
        return;
      } catch {
        /* 用户取消，继续走复制 */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("链接已复制，发给朋友吧");
    } catch {
      showToast("复制失败，可以手动复制地址栏链接");
    }
  }

  return (
    <div className="rise pb-44">
      {/* 封面 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-line">
        <img src={meetup.cover} alt={meetup.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 pt-5">
          <button
            onClick={() => router.back()}
            aria-label="返回"
            className="hit grid h-9 w-9 place-items-center rounded-full bg-white/85 backdrop-blur tap"
          >
            <ArrowLeft size={17} strokeWidth={2.4} />
          </button>
          <button
            onClick={share}
            aria-label="分享"
            className="hit grid h-9 w-9 place-items-center rounded-full bg-white/85 backdrop-blur tap"
          >
            <Share2 size={16} strokeWidth={2.2} />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="mb-2 flex items-center gap-1.5">
            {meetup.type === "brand" ? (
              <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-[3px] text-micro font-semibold">
                <BadgeCheck size={11} strokeWidth={2.6} className="text-mint" />
                品牌活动
              </span>
            ) : (
              <span className="rounded-full bg-white/90 px-2 py-[3px] text-micro font-semibold">
                遛狗局
              </span>
            )}
            <span className="rounded-full bg-white/90 px-2 py-[3px] text-micro font-semibold">
              {meetup.fee > 0 ? `¥${meetup.fee}/人` : "免费"}
            </span>
          </div>
          <h1 className="text-stat leading-snug font-bold text-white">
            {meetup.title}
          </h1>
        </div>
      </div>

      <div className="-mt-4 rounded-t-hero bg-cream px-5 pt-5">
        {/* 主办方 */}
        <div className="flex items-center gap-2.5">
          <Avatar name={meetup.hostName} tint={meetup.type === "brand" ? "#caffbf" : "#ffd6a5"} size={38} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="text-body-lg font-semibold">{meetup.hostName}</p>
              {meetup.verified && (
                <BadgeCheck size={13} strokeWidth={2.6} className="text-mint" />
              )}
            </div>
            <p className="text-cap text-ink-mute">
              {meetup.type === "brand" ? "认证商家" : "发起人"}
            </p>
          </div>
          <p className="text-note text-ink-mute">{meetup.district}</p>
        </div>

        {/* 关键信息 */}
        <div className="mt-4 space-y-3 rounded-card bg-white p-4 shadow-card">
          <Row icon={<CalendarDays size={15} />} label="时间" value={fmtMeetup(meetup.startAt)} />
          <Row
            icon={<MapPin size={15} />}
            label="地点"
            value={`${meetup.venueName}（${meetup.distanceKm} km）`}
          />
          <Row
            icon={<Wallet size={15} />}
            label="费用"
            value={meetup.fee > 0 ? `¥${meetup.fee} / 人` : "免费"}
          />
          <Row
            icon={<Users size={15} />}
            label="人数"
            value={`${people} / ${meetup.capacity} 人`}
          />
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className={`h-full rounded-full ${full ? "bg-ink-mute" : "bg-brand"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* 适合体型 */}
        <div className="mt-4">
          <h2 className="text-body-lg font-semibold">适合的体型</h2>
          <div className="mt-2 flex gap-2">
            {(["small", "medium", "large"] as const).map((s) => {
              const ok = meetup.sizeLimit.includes(s);
              return (
                <span
                  key={s}
                  className={`rounded-full px-3 py-1.5 text-note font-medium ${
                    ok
                      ? "bg-brand-soft text-brand"
                      : "bg-line/50 text-ink-mute"
                  }`}
                >
                  {SIZE_LABEL[s]}犬
                </span>
              );
            })}
          </div>
        </div>

        {/* 已报名 */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-body-lg font-semibold">已报名</h2>
            <span className="text-cap text-ink-mute">{people} 位主人 · {people} 只狗</span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-3 rounded-card bg-white p-4 shadow-card">
            {isJoined && (
              <Person name="我" petName={me?.name ?? "我的狗"} tint="#ffb4a2" highlight />
            )}
            {meetup.participants.map((p, i) => (
              <Person
                key={`${p.name}-${i}`}
                name={p.name}
                petName={p.petName}
                tint={["#ffd6a5", "#caffbf", "#9bf6ff", "#bdb2ff", "#ffadad", "#b8e0d2"][i % 6]}
              />
            ))}
            {Array.from({ length: Math.max(0, meetup.capacity - people) }).slice(0, 3).map((_, i) => (
              <span key={i} className="flex w-10 flex-col items-center gap-1">
                <span className="hit grid h-9 w-9 place-items-center rounded-full border border-dashed border-line text-body text-ink-mute">
                  +
                </span>
                <span className="text-micro text-ink-mute">待加入</span>
              </span>
            ))}
          </div>
        </div>

        {/* 说明 */}
        <div className="mt-5">
          <h2 className="text-body-lg font-semibold">活动说明</h2>
          <p className="mt-2 text-body leading-[1.85] whitespace-pre-line text-ink-soft">
            {meetup.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {meetup.tags.map((t) => (
              <span key={t} className="rounded-full bg-white px-2.5 py-1 text-cap text-ink-soft shadow-soft">
                #{t}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-5 flex items-center gap-1 text-cap text-ink-mute">
          <Clock size={10} /> 活动开始前 2 小时可免费取消
        </p>
      </div>

      {/* 底部操作 */}
      <div className="fixed inset-x-0 bottom-[62px] z-40 mx-auto max-w-[430px] bg-gradient-to-t from-cream via-cream/95 to-transparent px-4 pt-10 pb-3">
        <button
          onClick={() => join(meetup.id)}
          disabled={full && !isJoined}
          className={`flex h-[52px] w-full items-center justify-center gap-2 rounded-full text-lead font-semibold shadow-[0_8px_24px_rgba(255,107,74,0.32)] tap-soft ${
            isJoined
              ? "bg-white text-ink shadow-card"
              : full
                ? "cursor-not-allowed bg-line text-ink-mute shadow-none"
                : "bg-brand text-white"
          }`}
        >
          {isJoined ? (
            <>
              <CheckCircle2 size={18} strokeWidth={2.4} className="text-mint" />
              已报名 · 点击取消
            </>
          ) : full ? (
            "名额已满"
          ) : (
            `报名参加${meetup.fee > 0 ? ` · ¥${meetup.fee}` : ""}`
          )}
        </button>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-[1px] text-ink-mute">{icon}</span>
      <span className="w-9 shrink-0 text-note text-ink-mute">{label}</span>
      <span className="flex-1 text-body font-medium">{value}</span>
    </div>
  );
}

function Person({
  name,
  petName,
  tint,
  highlight,
}: {
  name: string;
  petName: string;
  tint: string;
  highlight?: boolean;
}) {
  return (
    <span className="flex w-10 flex-col items-center gap-1">
      <span className={highlight ? "rounded-full ring-2 ring-brand ring-offset-2 ring-offset-white" : ""}>
        <Avatar name={name} tint={tint} size={36} />
      </span>
      <span className="max-w-[44px] truncate text-micro text-ink-soft">
        {petName}
      </span>
    </span>
  );
}
