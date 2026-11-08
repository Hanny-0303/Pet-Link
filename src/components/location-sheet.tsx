"use client";

import { Check, MapPin, X } from "lucide-react";
import { pets } from "@/lib/data";
import { useAppStore } from "@/components/store";

/**
 * 区域选择弹层。从 data.ts 里已有的区域去重生成，
 * 所以加/改宠物数据时，这里会自动跟着变。
 */
export default function LocationSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { district, setDistrict } = useAppStore();
  const districts = Array.from(new Set(pets.map((p) => p.district)));

  if (!open) return null;

  function pick(d: string | null) {
    setDistrict(d);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[430px] rounded-t-[26px] bg-cream pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_40px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="text-[17px] font-semibold tracking-tight">选择区域</h2>
            <p className="mt-0.5 text-[11.5px] text-ink-mute">
              只看看这个区域里的小伙伴
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="关闭"
            className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-[0_2px_8px_rgba(80,60,40,0.08)]"
          >
            <X size={15} strokeWidth={2.4} />
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto px-3 pb-4">
          <Option
            active={district === null}
            label="全部区域"
            count={pets.length}
            onClick={() => pick(null)}
          />
          {districts.map((d) => (
            <Option
              key={d}
              active={district === d}
              label={d}
              count={pets.filter((p) => p.district === d).length}
              onClick={() => pick(d)}
            />
          ))}
        </div>

        <p className="px-5 pb-4 text-center text-[10.5px] text-ink-mute">
          演示版：地址只精确到商圈，不会获取你的真实定位
        </p>
      </div>
    </div>
  );
}

function Option({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-[14px] px-3 py-3 text-left transition active:scale-[0.99] ${
        active ? "bg-brand-soft" : "hover:bg-white/60"
      }`}
    >
      <MapPin
        size={14}
        strokeWidth={2.2}
        className={active ? "text-brand" : "text-ink-mute"}
      />
      <span
        className={`flex-1 text-[13.5px] ${active ? "font-semibold text-brand" : "text-ink"}`}
      >
        {label}
      </span>
      <span className="text-[11px] text-ink-mute">{count}</span>
      {active && <Check size={15} strokeWidth={2.8} className="text-brand" />}
    </button>
  );
}
