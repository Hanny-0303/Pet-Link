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
        className="hit mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface shadow-card tap"
      >
        <ArrowLeft size={17} strokeWidth={2.4} />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="text-title font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-note text-ink-mute">{subtitle}</p>
        )}
      </div>
      {action}
    </header>
  );
}
