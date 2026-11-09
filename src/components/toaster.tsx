"use client";

import { useAppStore } from "@/components/store";

/** 全局轻提示，挂在 layout 上，任何页面调用 showToast 都能弹 */
export default function Toaster() {
  const { toast } = useAppStore();
  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-[70] w-max max-w-[80vw] -translate-x-1/2 rounded-full bg-ink/88 px-4 py-2 text-center text-note font-medium text-cream shadow-xl backdrop-blur">
      {toast}
    </div>
  );
}
