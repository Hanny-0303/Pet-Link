"use client";

import { getPet } from "@/lib/data";
import { CheckCircle2, Syringe, Bug, Stethoscope } from "lucide-react";
import SubPageHeader from "@/components/sub-header";

type Record = {
  label: string;
  detail: string;
  date: string;
  Icon: typeof Syringe;
  valid?: string;
};

const RECORDS: Record[] = [
  {
    label: "狂犬疫苗",
    detail: "卫佳五 · 第三针",
    date: "2026-03-12",
    valid: "有效至 2027-03-12",
    Icon: Syringe,
  },
  {
    label: "犬八联疫苗",
    detail: "英特威 · 年度加强",
    date: "2026-01-08",
    valid: "有效至 2027-01-08",
    Icon: Syringe,
  },
  {
    label: "体内驱虫",
    detail: "拜宠清",
    date: "2026-10-20",
    valid: "下次 2027-01-20",
    Icon: Bug,
  },
  {
    label: "体外驱虫",
    detail: "福来恩滴剂",
    date: "2026-10-20",
    valid: "下次 2026-11-20",
    Icon: Bug,
  },
  {
    label: "年度体检",
    detail: "血常规 + 生化 + 心脏彩超",
    date: "2026-09-02",
    valid: "一切正常",
    Icon: Stethoscope,
  },
];

export default function HealthPage() {
  const pet = getPet("p1");

  return (
    <div className="min-h-dvh bg-canvas pb-16">
      <SubPageHeader
        title="疫苗与健康记录"
        subtitle={pet ? `${pet.name} · ${pet.ageText}` : undefined}
      />

      <div className="mt-2 px-5">
        <div className="flex items-center gap-2 rounded-card bg-mint-soft px-3.5 py-3">
          <CheckCircle2 size={16} strokeWidth={2.4} className="shrink-0 text-mint" />
          <p className="text-note leading-relaxed text-mint">
            疫苗齐全，最近一次驱虫在 30 天内
          </p>
        </div>

        <div className="mt-3 overflow-hidden rounded-block bg-surface shadow-card">
          {RECORDS.map((r, i) => (
            <div
              key={r.label}
              className={`flex items-start gap-3 px-4 py-3.5 ${
                i > 0 ? "border-t border-line/70" : ""
              }`}
            >
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-canvas text-ink-soft">
                <r.Icon size={14} strokeWidth={2.2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body font-medium">{r.label}</p>
                <p className="mt-0.5 text-cap text-ink-mute">{r.detail}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-cap text-ink-soft">{r.date}</p>
                {r.valid && (
                  <p className="mt-0.5 text-micro text-mint">{r.valid}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-cap leading-relaxed text-ink-mute">
          参加活动前，主办方可以查看这份记录
          <br />
          真实产品里会由宠物医院开具并签名
        </p>
      </div>
    </div>
  );
}
