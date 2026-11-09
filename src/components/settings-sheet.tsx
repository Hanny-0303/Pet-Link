"use client";

import { Bell, Eye, RotateCcw, ShieldCheck, X } from "lucide-react";
import { useAppStore, type Prefs } from "@/components/store";

const ROWS: { key: keyof Prefs; label: string; desc: string; Icon: typeof Bell }[] = [
  {
    key: "notify",
    label: "活动提醒",
    desc: "报名的局开始前提醒我",
    Icon: Bell,
  },
  {
    key: "allowGreet",
    label: "允许陌生人打招呼",
    desc: "关闭后只有互相打招呼才看得到我",
    Icon: ShieldCheck,
  },
  {
    key: "showDistance",
    label: "在列表里显示距离",
    desc: "关掉后只显示区域，不显示公里数",
    Icon: Eye,
  },
];

export default function SettingsSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { prefs, togglePref, resetAll, showToast } = useAppStore();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="backdrop-in absolute inset-0 bg-ink/35 backdrop-blur-[2px]" onClick={onClose} />

      <div className="sheet-in absolute inset-x-0 bottom-0 mx-auto max-w-[430px] rounded-t-hero bg-canvas pb-[env(safe-area-inset-bottom)] shadow-float">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-title font-semibold tracking-tight">设置</h2>
          <button
            onClick={onClose}
            aria-label="关闭"
            className="hit grid h-8 w-8 place-items-center rounded-full bg-white shadow-card"
          >
            <X size={15} strokeWidth={2.4} />
          </button>
        </div>

        <div className="px-3">
          {ROWS.map(({ key, label, desc, Icon }) => {
            const on = prefs[key];
            return (
              <button
                key={key}
                onClick={() => {
                  togglePref(key);
                  showToast(`${label}已${on ? "关闭" : "开启"}`);
                }}
                className="flex w-full items-center gap-3 rounded-card px-2 py-3 text-left active:bg-white/70"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-ink-soft shadow-soft">
                  <Icon size={14} strokeWidth={2.2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-body-lg font-medium">{label}</span>
                  <span className="mt-0.5 block text-cap text-ink-mute">{desc}</span>
                </span>
                <span
                  className={`relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors ${
                    on ? "bg-brand" : "bg-line"
                  }`}
                >
                  <span
                    className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                      on ? "left-[21px]" : "left-[3px]"
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-2 px-5 pb-6">
          <button
            onClick={() => {
              resetAll();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-full border border-line bg-white py-3 text-body font-medium text-ink-soft active:scale-[0.99]"
          >
            <RotateCcw size={13} strokeWidth={2.2} />
            清除演示数据
          </button>
          <p className="mt-2 text-center text-cap text-ink-mute">
            报名、打招呼、发起的活动都会回到初始状态
          </p>
        </div>
      </div>
    </div>
  );
}
