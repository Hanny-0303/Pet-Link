"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  MapPin,
  PawPrint,
  ShieldCheck,
  Syringe,
} from "lucide-react";
import { getPet, meetups, posts } from "@/lib/data";
import { SIZE_LABEL } from "@/lib/types";
import { fmtMeetupShort } from "@/lib/date";
import { useAppStore } from "@/components/store";
import Avatar from "@/components/avatar";

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { greeted, greet } = useAppStore();
  const pet = getPet(id);

  if (!pet) {
    return (
      <div className="px-5 pt-24 text-center">
        <p className="text-[14px] text-ink-soft">找不到这只小伙伴</p>
        <Link href="/" className="mt-3 inline-block text-[13px] font-medium text-brand">
          返回首页
        </Link>
      </div>
    );
  }

  const done = greeted.includes(pet.id);
  const related = meetups.filter((m) =>
    m.participants.some((p) => p.name === pet.ownerName)
  );
  const relatedPosts = posts.filter((p) => p.authorName === pet.ownerName).slice(0, 2);

  return (
    <div className="rise pb-16">
      <div className="relative aspect-[4/5] overflow-hidden bg-line">
        <img src={pet.photos[0]} alt={pet.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        <button
          onClick={() => router.back()}
          aria-label="返回"
          className="absolute top-5 left-4 grid h-9 w-9 place-items-center rounded-full bg-white/85 backdrop-blur active:scale-95"
        >
          <ArrowLeft size={17} strokeWidth={2.4} />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex items-end gap-2">
            <h1 className="text-[28px] font-bold text-white">{pet.name}</h1>
            <span className="pb-1 text-[15px] text-white/70">
              {pet.gender === "boy" ? "♂" : "♀"}
            </span>
          </div>
          <p className="mt-0.5 text-[13px] text-white/85">
            {pet.breed} · {pet.ageText} · {SIZE_LABEL[pet.size]}犬 · {pet.weightKg}kg
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11.5px] text-white/75">
            <MapPin size={11} strokeWidth={2.4} />
            {pet.district} · 距离你 {pet.distanceKm} km
          </div>
        </div>
      </div>

      <div className="-mt-5 rounded-t-[26px] bg-cream px-5 pt-5">
        {/* 性格 */}
        <div className="flex flex-wrap gap-1.5">
          {pet.personality.map((t) => (
            <span
              key={t}
              className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand"
            >
              {t}
            </span>
          ))}
        </div>

        <p className="mt-3.5 text-[13.5px] leading-[1.85] text-ink-soft">{pet.bio}</p>

        {/* 健康信息 */}
        <div className="mt-4 flex gap-2">
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium ${
              pet.vaccinated ? "bg-mint-soft text-mint" : "bg-line text-ink-mute"
            }`}
          >
            <Syringe size={11} strokeWidth={2.4} />
            {pet.vaccinated ? "疫苗齐全" : "未接种"}
          </span>
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium ${
              pet.neutered ? "bg-mint-soft text-mint" : "bg-line text-ink-mute"
            }`}
          >
            <ShieldCheck size={11} strokeWidth={2.4} />
            {pet.neutered ? "已绝育" : "未绝育"}
          </span>
        </div>

        {/* 主人 */}
        <div className="mt-5 flex items-center gap-2.5 rounded-[18px] bg-white p-3.5 shadow-[0_2px_12px_rgba(80,60,40,0.05)]">
          <Avatar name={pet.ownerName} tint="#ffd6a5" size={38} />
          <div className="flex-1">
            <p className="text-[13px] font-semibold">{pet.ownerName}</p>
            <p className="text-[10.5px] text-ink-mute">同城 · 已实名认证</p>
          </div>
          <button
            onClick={() => greet(pet.id)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold transition active:scale-95 ${
              done ? "bg-white text-ink-mute shadow-inner" : "bg-brand text-white shadow-[0_6px_18px_rgba(255,107,74,0.3)]"
            }`}
          >
            {done ? (
              <>
                <Check size={14} strokeWidth={2.6} /> 已打招呼
              </>
            ) : (
              <>
                <PawPrint size={14} strokeWidth={2.4} /> 约它遛弯
              </>
            )}
          </button>
        </div>

        {/* 常去的局 */}
        {related.length > 0 && (
          <div className="mt-5">
            <h2 className="text-[14px] font-semibold">常出没的局</h2>
            <div className="mt-2 space-y-2">
              {related.map((m) => (
                <Link
                  key={m.id}
                  href={`/meetups/${m.id}`}
                  className="flex items-center gap-3 rounded-[16px] bg-white p-2.5 shadow-[0_2px_10px_rgba(80,60,40,0.05)]"
                >
                  <img src={m.cover} alt="" className="h-12 w-12 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-[12.5px] font-medium">{m.title}</p>
                    <p className="mt-0.5 text-[10.5px] text-brand">{fmtMeetupShort(m.startAt)}</p>
                  </div>
                  <span className="shrink-0 text-[10.5px] text-ink-mute">
                    {m.participants.length}/{m.capacity}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 主人的动态 */}
        {relatedPosts.length > 0 && (
          <div className="mt-5">
            <h2 className="text-[14px] font-semibold">主人的动态</h2>
            <div className="mt-2 space-y-2">
              {relatedPosts.map((p) => (
                <div key={p.id} className="rounded-[16px] bg-white p-3 shadow-[0_2px_10px_rgba(80,60,40,0.05)]">
                  <p className="line-clamp-2 text-[12px] leading-relaxed text-ink-soft">
                    {p.content}
                  </p>
                  <p className="mt-1 text-[10px] text-ink-mute">{p.timeText}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
