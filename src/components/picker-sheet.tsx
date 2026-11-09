"use client";

import { Check, X } from "lucide-react";

export type PickerOption = {
  key: string;
  label: string;
  count?: number;
};

/** 统一的分类选择器：顶上一个按钮，点开底部面板选 */
export default function PickerSheet({
  open,
  title,
  subtitle,
  options,
  value,
  onPick,
  onClose,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  options: PickerOption[];
  value: string;
  onPick: (key: string) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="backdrop-in absolute inset-0 bg-ink/35 backdrop-blur-[2px]" onClick={onClose} />

      <div className="sheet-in absolute inset-x-0 bottom-0 mx-auto flex max-h-[80vh] max-w-[430px] flex-col rounded-t-hero bg-canvas pb-[env(safe-area-inset-bottom)] shadow-float">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="text-title font-semibold tracking-tight">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-note text-ink-mute">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="关闭"
            className="hit grid h-8 w-8 place-items-center rounded-full bg-surface shadow-card"
          >
            <X size={15} strokeWidth={2.4} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-5">
          {options.map((o) => {
            const on = value === o.key;
            return (
              <button
                key={o.key}
                onClick={() => {
                  onPick(o.key);
                  onClose();
                }}
                className={`flex w-full items-center gap-2.5 rounded-card px-3 py-3 text-left ${
                  on ? "bg-brand-soft" : "active:bg-white/10"
                }`}
              >
                <span
                  className={`flex-1 text-body-lg ${
                    on ? "font-semibold text-accent" : "text-ink"
                  }`}
                >
                  {o.label}
                </span>
                {typeof o.count === "number" && (
                  <span className="text-cap text-ink-mute">{o.count}</span>
                )}
                {on && <Check size={15} strokeWidth={2.8} className="text-accent" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
