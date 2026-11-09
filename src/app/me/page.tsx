"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Heart,
  MapPin,
  PawPrint,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { meetups as seedMeetups, pets } from "@/lib/data";
import { fmtMeetupShort } from "@/lib/date";
import { SIZE_LABEL } from "@/lib/types";
import { useAppStore } from "@/components/store";
import Avatar from "@/components/avatar";
import SettingsSheet from "@/components/settings-sheet";

export default function MePage() {
  const { joined, extraMeetups, greeted, profile } = useAppStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const myPets = pets.filter((p) => p.ownerName === "小鹿");
  const myPet = myPets[0];
  const all = [...extraMeetups, ...seedMeetups];
  const myMeetups = all.filter((m) => joined.includes(m.id));

  return (
    <>
      <div className="rise pb-16">
        <header className="px-5 pt-7">
          <div className="flex items-center justify-between">
            <h1 className="text-page font-bold tracking-tight">我的</h1>
            <button
              onClick={() => setSettingsOpen(true)}
              aria-label="设置"
              className="hit grid h-9 w-9 place-items-center rounded-full bg-white shadow-card tap"
            >
              <Settings size={16} strokeWidth={2.2} />
            </button>
          </div>
        </header>

        {/* 个人信息 */}
        <div className="mx-5 mt-4 flex items-center gap-3 rounded-block bg-white p-4 shadow-card">
          <Avatar name={profile.name} tint="#CFE0FF" size={52} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-title font-semibold">{profile.name}</p>
              <span className="flex items-center gap-0.5 rounded-full bg-mint-soft px-1.5 py-[2px] text-micro font-medium text-mint">
                <ShieldCheck size={9} strokeWidth={3} /> 已实名
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1 text-cap text-ink-mute">
              <MapPin size={10} strokeWidth={2.4} /> {profile.district}
            </p>
          </div>
          <Link
            href="/me/edit"
            className="shrink-0 rounded-full border border-line px-3 py-1.5 text-cap font-medium text-ink-soft tap"
          >
            编辑
          </Link>
        </div>

        <p className="mx-5 mt-2 line-clamp-2 px-1 text-cap leading-relaxed text-ink-mute">
          {profile.bio}
        </p>

        {/* 数据 */}
        <div className="mx-5 mt-3 grid grid-cols-3 divide-x divide-line rounded-card bg-white py-3.5 shadow-card">
          <Stat label="我报名的" value={myMeetups.length} />
          <Stat label="我发起的" value={extraMeetups.length} />
          <Stat label="打过招呼" value={greeted.length} />
        </div>

        {/* 我的宠物 */}
        {myPet && (
          <div className="mt-5 px-5">
            <div className="flex items-center justify-between">
              <h2 className="text-body-lg font-semibold">我的宠物</h2>
              <Link href="/me/pets" className="text-note text-accent">
                管理
              </Link>
            </div>
            <Link
              href={`/pets/${myPet.id}`}
              className="mt-2 flex items-center gap-3 rounded-block bg-white p-3 shadow-card"
            >
              <img
                src={myPet.photos[0]}
                alt={myPet.name}
                className="h-16 w-16 rounded-card object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-lead font-semibold">{myPet.name}</p>
                  <span className="text-cap text-ink-mute">
                    {myPet.gender === "boy" ? "♂" : "♀"}
                  </span>
                </div>
                <p className="mt-0.5 text-note text-ink-soft">
                  {myPet.breed} · {myPet.ageText} · {SIZE_LABEL[myPet.size]}
                </p>
                <div className="mt-1.5 flex gap-1">
                  {myPet.personality.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-brand-soft px-2 py-[2px] text-micro font-medium text-accent"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight size={16} className="shrink-0 text-ink-mute" />
            </Link>
          </div>
        )}

        {/* 我报名的局 */}
        <div className="mt-5 px-5">
          <h2 className="text-body-lg font-semibold">我报名的局</h2>
          {myMeetups.length === 0 ? (
            <Link
              href="/meetups"
              className="mt-2 flex items-center justify-center gap-1.5 rounded-card border border-dashed border-line py-6 text-note text-ink-mute"
            >
              <PawPrint size={13} /> 还没报名，去找一个局 →
            </Link>
          ) : (
            <div className="mt-2 space-y-2">
              {myMeetups.map((m) => (
                <Link
                  key={m.id}
                  href={`/meetups/${m.id}`}
                  className="flex items-center gap-3 rounded-card bg-white p-2.5 shadow-card"
                >
                  <img src={m.cover} alt="" className="h-12 w-12 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-body font-medium">{m.title}</p>
                    <p className="mt-0.5 text-cap text-accent">
                      {fmtMeetupShort(m.startAt)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-mint-soft px-2 py-[3px] text-micro font-medium text-mint">
                    已报名
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 菜单 */}
        <div className="mt-5 px-5">
          <div className="divide-y divide-line overflow-hidden rounded-card bg-white shadow-card">
            <MenuRow
              href="/me/pets"
              icon={<PawPrint size={15} />}
              label="我的宠物档案"
              hint={`${myPets.length} 只已收录`}
            />
            <MenuRow
              href="/me/liked"
              icon={<Heart size={15} />}
              label="打过招呼的宠物"
              hint={`${greeted.length} 只`}
            />
            <MenuRow
              href="/me/health"
              icon={<ShieldCheck size={15} />}
              label="疫苗与健康记录"
              hint="已完善"
            />
          </div>
          <p className="mt-4 pb-2 text-center text-micro text-ink-mute">
            遛遛 · 演示版本 v0.1
          </p>
        </div>
      </div>

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-title font-semibold tracking-tight">{value}</p>
      <p className="mt-0.5 text-cap text-ink-mute">{label}</p>
    </div>
  );
}

function MenuRow({
  href,
  icon,
  label,
  hint,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="tap flex items-center gap-3 px-4 py-3.5 active:bg-canvas/60"
    >
      <span className="text-ink-mute">{icon}</span>
      <span className="flex-1 text-body font-medium">{label}</span>
      <span className="text-cap text-ink-mute">{hint}</span>
      <ChevronRight size={14} className="text-ink-mute" />
    </Link>
  );
}
