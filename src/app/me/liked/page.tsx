"use client";

import Link from "next/link";
import { ChevronRight, MapPin, PawPrint } from "lucide-react";
import { pets } from "@/lib/data";
import { SIZE_LABEL } from "@/lib/types";
import { useAppStore } from "@/components/store";
import SubPageHeader from "@/components/sub-header";
import EmptyState from "@/components/empty-state";

export default function GreetedPetsPage() {
  const { greeted } = useAppStore();
  const list = pets.filter((p) => greeted.includes(p.id));

  return (
    <div className="min-h-dvh bg-canvas pb-16">
      <SubPageHeader
        title="打过招呼的宠物"
        subtitle={list.length ? `共 ${list.length} 只` : "还没有打招呼"}
      />

      {list.length === 0 ? (
        <EmptyState
          icon={<PawPrint size={20} strokeWidth={1.8} />}
          title="你还没跟谁打过招呼"
          description="在首页刷到喜欢的小伙伴，点右下角那个爪印按钮"
        >
          <Link
            href="/"
            className="tap rounded-full bg-brand px-4 py-2 text-body font-semibold text-on-brand"
          >
            去首页逛逛
          </Link>
        </EmptyState>
      ) : (
        <div className="mt-2 px-5">
          {list.map((p) => (
            <Link
              key={p.id}
              href={`/pets/${p.id}`}
              className="flex items-center gap-3 border-b border-line/70 py-3 last:border-0"
            >
              <img loading="lazy" decoding="async"
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
        </div>
      )}
    </div>
  );
}
