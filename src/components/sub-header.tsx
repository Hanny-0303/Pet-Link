"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function SubPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="flex items-start gap-3 px-5 pt-7 pb-2">
      <button
        onClick={() => router.back()}
        aria-label="返回"
        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white shadow-[0_2px_10px_rgba(80,60,40,0.08)] active:scale-95"
      >
        <ArrowLeft size={17} strokeWidth={2.4} />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="text-[19px] font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-[11.5px] text-ink-mute">{subtitle}</p>
        )}
      </div>
      {action}
    </header>
  );
}
