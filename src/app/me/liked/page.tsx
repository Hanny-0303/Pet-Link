"use client";

import Link from "next/link";
import { ChevronRight, MapPin, PawPrint } from "lucide-react";
import { pets } from "@/lib/data";
import { SIZE_LABEL } from "@/lib/types";
import { useAppStore } from "@/components/store";
import SubPageHeader from "@/components/sub-header";

export default function GreetedPetsPage() {
  const { greeted } = useAppStore();
  const list = pets.filter((p) => greeted.includes(p.id));

  return (
    <div className="min-h-dvh bg-cream pb-16">
      <SubPageHeader
        title="打过招呼的宠物"
        subtitle={list.length ? `共 ${list.length} 只` : "还没有打招呼"}
      />

      {list.length === 0 ? (
        <div className="mt-16 px-8 text-center">
          <PawPrint size={26} strokeWidth={1.6} className="mx-auto text-ink-mute/70" />
          <p className="mt-3 text-[13.5px] font-medium text-ink-soft">
            你还没跟谁打过招呼
          </p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-ink-mute">
            在首页刷到喜欢的小伙伴，点右下角那个爪印按钮
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-brand px-5 py-2.5 text-[12.5px] font-semibold text-white shadow-[0_6px_18px_rgba(255,107,74,0.28)]"
          >
            去首页看看
          </Link>
        </div>
      ) : (
        <div className="mt-2 px-5">
          {list.map((p) => (
            <Link
              key={p.id}
              href={`/pets/${p.id}`}
              className="flex items-center gap-3 border-b border-line/70 py-3 last:border-0"
            >
              <img
                src={p.photos[0]}
                alt={p.name}
                className="h-14 w-14 shrink-0 rounded-[14px] object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold">
                  {p.name}
                  <span className="ml-1 text-[11px] font-normal text-ink-mute">
                    {p.gender === "boy" ? "♂" : "♀"}
                  </span>
                </p>
                <p className="mt-0.5 text-[11px] text-ink-mute">
                  {p.breed} · {p.ageText} · {SIZE_LABEL[p.size]}
                </p>
                <p className="mt-0.5 flex items-center gap-0.5 text-[10.5px] text-ink-mute">
                  <MapPin size={9} strokeWidth={2.4} />
                  {p.district} · {p.distanceKm} km
                </p>
              </div>
              <ChevronRight size={15} className="shrink-0 text-ink-mute" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
