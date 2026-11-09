"use client";

import Link from "next/link";
import { ChevronRight, Plus, ShieldCheck, Syringe } from "lucide-react";
import { pets } from "@/lib/data";
import { SIZE_LABEL } from "@/lib/types";
import { useAppStore } from "@/components/store";
import SubPageHeader from "@/components/sub-header";

export default function MyPetsPage() {
  const { showToast } = useAppStore();
  const mine = pets.filter((p) => p.ownerName === "小鹿");

  return (
    <div className="min-h-dvh bg-canvas pb-16">
      <SubPageHeader
        title="我的宠物档案"
        subtitle={`${mine.length} 只已收录`}
        action={
          <button
            onClick={() => showToast("演示版：暂只支持一只宠物")}
            aria-label="添加宠物"
            className="hit mt-0.5 grid h-9 w-9 place-items-center rounded-full bg-ink text-canvas shadow-md tap"
          >
            <Plus size={17} strokeWidth={2.6} />
          </button>
        }
      />

      <div className="mt-3 space-y-3 px-5">
        {mine.map((p) => (
          <Link
            key={p.id}
            href={`/pets/${p.id}`}
            className="flex items-center gap-3 rounded-block bg-white p-3 shadow-card"
          >
            <img
              src={p.photos[0]}
              alt={p.name}
              className="h-20 w-20 shrink-0 rounded-card object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-lead font-semibold">{p.name}</p>
                <span className="text-cap text-ink-mute">
                  {p.gender === "boy" ? "♂" : "♀"}
                </span>
              </div>
              <p className="mt-0.5 text-note text-ink-soft">
                {p.breed} · {p.ageText} · {SIZE_LABEL[p.size]} · {p.weightKg}kg
              </p>
              <div className="mt-2 flex gap-1.5">
                <span className="flex items-center gap-1 rounded-full bg-mint-soft px-2 py-[3px] text-micro font-medium text-mint">
                  <Syringe size={9} strokeWidth={2.6} /> 疫苗齐全
                </span>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-[3px] text-micro font-medium ${
                    p.neutered ? "bg-mint-soft text-mint" : "bg-line/70 text-ink-mute"
                  }`}
                >
                  <ShieldCheck size={9} strokeWidth={2.6} />
                  {p.neutered ? "已绝育" : "未绝育"}
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="shrink-0 text-ink-mute" />
          </Link>
        ))}

        <Link
          href="/me/health"
          className="flex items-center justify-between rounded-card bg-white px-4 py-3.5 shadow-card"
        >
          <span className="text-body font-medium">查看疫苗与健康记录</span>
          <ChevronRight size={15} className="text-ink-mute" />
        </Link>

        <p className="pt-2 text-center text-cap leading-relaxed text-ink-mute">
          真实产品里这里可以添加多只宠物，
          <br />
          演示版固定一只，方便你快速看懂流程。
        </p>
      </div>
    </div>
  );
}
