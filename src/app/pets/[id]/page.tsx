"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Heart,
  MapPin,
  PawPrint,
  ShieldCheck,
  Syringe,
} from "lucide-react";
import { getPet, meetups, posts } from "@/lib/data";
import { likeCount } from "@/lib/pet";
import { DIMENSIONS, SIZE_LABEL, canWalk } from "@/lib/types";

/** 每个维度里「左边那个值」是什么 */
const LEFT_VALUE: Record<string, string> = {
  social: "friendly",
  peer: "social",
  energy: "active",
  bold: "bold",
  obey: "trained",
};
import { fmtMeetupShort } from "@/lib/date";
import { useAppStore } from "@/components/store";
import Avatar from "@/components/avatar";

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { greeted, greet, likedPets, likePet } = useAppStore();
  const pet = getPet(id);

  if (!pet) {
    return (
      <div className="px-5 pt-24 text-center">
        <p className="text-body-lg text-ink-soft">找不到这只小伙伴</p>
        <Link href="/" className="mt-3 inline-block text-body font-medium text-accent">
          返回首页
        </Link>
      </div>
    );
  }

  const done = greeted.includes(pet.id);
  const liked = likedPets.includes(pet.id);
  const likes = likeCount(pet) + (liked ? 1 : 0);
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
          className="hit absolute top-5 left-4 grid h-9 w-9 place-items-center rounded-full bg-surface-2/95 backdrop-blur tap"
        >
          <ArrowLeft size={17} strokeWidth={2.4} />
        </button>

        <button
          onClick={() => likePet(pet.id)}
          aria-label={liked ? "取消点赞" : "点赞"}
          className={`absolute top-5 right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur tap ${
            liked ? "bg-brand text-on-brand" : "bg-surface-2/95 text-ink-soft"
          }`}
        >
          <Heart
            size={15}
            strokeWidth={2.4}
            className={
              liked ? "heart-pop fill-on-brand text-ink" : "text-ink-soft"
            }
          />
          <span className="text-note font-semibold">{likes}</span>
        </button>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-end gap-2">
            <h1 className="text-page font-bold text-white">{pet.name}</h1>
            <span className="pb-1 text-lead text-white/70">
              {pet.gender === "boy" ? "♂" : "♀"}
            </span>
          </div>
          <p className="mt-0.5 text-body text-white/85">
            {pet.breed} · {pet.ageText} · {SIZE_LABEL[pet.size]} · {pet.weightKg}kg
          </p>
          <div className="mt-2 flex items-center gap-1 text-note text-white/75">
            <MapPin size={11} strokeWidth={2.4} />
            {pet.district} · 距离你 {pet.distanceKm} km
          </div>
        </div>
      </div>

      <div className="-mt-5 rounded-t-hero bg-canvas px-5 pt-5">
        {/* 性格图谱：五个互斥维度，一眼看出偏哪边 */}
        <div className="rounded-card bg-surface p-4 shadow-card">
          <div className="flex items-baseline justify-between">
            <h2 className="text-body font-semibold">性格图谱</h2>
            <span className="text-micro text-ink-mute">每项二选一</span>
          </div>

          <div className="mt-3 space-y-3">
            {DIMENSIONS.map((d) => {
              const value = (pet as unknown as Record<string, string>)[d.key];
              const leftActive = value === LEFT_VALUE[d.key];
              return (
                <div key={d.key} className="flex items-center gap-2">
                  <span className="w-9 shrink-0 text-micro text-ink-mute">
                    {d.label}
                  </span>
                  <span
                    className={`w-8 shrink-0 text-right text-cap ${
                      leftActive ? "font-semibold text-ink" : "text-ink-mute"
                    }`}
                  >
                    {d.left}
                  </span>
                  <span className="relative h-[3px] flex-1 rounded-full bg-line">
                    <span
                      className={`absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-brand ${
                        leftActive ? "left-0" : "right-0"
                      }`}
                    />
                  </span>
                  <span
                    className={`w-8 shrink-0 text-cap ${
                      !leftActive ? "font-semibold text-ink" : "text-ink-mute"
                    }`}
                  >
                    {d.right}
                  </span>
                </div>
              );
            })}
          </div>

          {pet.traits.length > 0 && (
            <>
              <p className="mt-4 mb-1.5 text-micro text-ink-mute">
                其他特点 · 可叠加
              </p>
              <div className="flex flex-wrap gap-1.5">
                {pet.traits.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-canvas px-2.5 py-1 text-cap font-medium text-ink-soft"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <p className="mt-3.5 text-body-lg leading-[1.85] text-ink-soft">{pet.bio}</p>

        {/* 健康信息 */}
        <div className="mt-4 flex gap-2">
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-cap font-medium ${
              pet.vaccinated ? "bg-mint-soft text-mint" : "bg-line text-ink-mute"
            }`}
          >
            <Syringe size={11} strokeWidth={2.4} />
            {pet.vaccinated ? "疫苗齐全" : "未接种"}
          </span>
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-cap font-medium ${
              pet.neutered ? "bg-mint-soft text-mint" : "bg-line text-ink-mute"
            }`}
          >
            <ShieldCheck size={11} strokeWidth={2.4} />
            {pet.neutered ? "已绝育" : "未绝育"}
          </span>
        </div>

        {/* 主人 */}
        <div className="mt-5 flex items-center gap-2.5 rounded-card bg-surface p-3.5 shadow-card">
          <Avatar name={pet.ownerName} tint="#ffd6a5" size={38} />
          <div className="flex-1">
            <p className="text-body font-semibold">{pet.ownerName}</p>
            <p className="text-cap text-ink-mute">同城 · 已实名认证</p>
          </div>
          <button
            onClick={() => greet(pet.id)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-body font-semibold tap ${
              done ? "bg-surface text-ink-mute shadow-inner" : "bg-brand text-on-brand shadow-[0_6px_18px_rgba(255,166,43,0.35)]"
            }`}
          >
            {done ? (
              <>
                <Check size={14} strokeWidth={2.6} /> 已打招呼
              </>
            ) : (
              <>
                <PawPrint size={14} strokeWidth={2.4} />{" "}
                {canWalk(pet.species) ? "约它遛弯" : "打个招呼"}
              </>
            )}
          </button>
        </div>

        {/* 常去的局 */}
        {related.length > 0 && (
          <div className="mt-5">
            <h2 className="text-body-lg font-semibold">常出没的局</h2>
            <div className="mt-2 space-y-3">
              {related.map((m) => (
                <Link
                  key={m.id}
                  href={`/meetups/${m.id}`}
                  className="flex items-center gap-3 rounded-card bg-surface p-2.5 shadow-card"
                >
                  <img src={m.cover} alt="" className="h-12 w-12 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-body font-medium">{m.title}</p>
                    <p className="mt-0.5 text-cap text-accent">{fmtMeetupShort(m.startAt)}</p>
                  </div>
                  <span className="shrink-0 text-cap text-ink-mute">
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
            <h2 className="text-body-lg font-semibold">主人的动态</h2>
            <div className="mt-2 space-y-3">
              {relatedPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/feed/${p.id}`}
                  className="block rounded-card bg-surface p-4 shadow-card active:opacity-90"
                >
                  <p className="line-clamp-2 text-note leading-relaxed text-ink-soft">
                    {p.content}
                  </p>
                  <p className="mt-1 flex items-center justify-between text-micro text-ink-mute">
                    {p.timeText}
                    <span className="text-accent">查看 →</span>
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
