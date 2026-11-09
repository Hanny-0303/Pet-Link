"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Calendar, Heart, User } from "lucide-react";

const TABS = [
  { href: "/", label: "交友", Icon: Heart },
  { href: "/meetups", label: "活动", Icon: Calendar },
  { href: "/feed", label: "圈子", Icon: Camera },
  { href: "/me", label: "我的", Icon: User },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-line/70 bg-cream/88 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_24px_rgba(80,60,40,0.06)] backdrop-blur-xl">
      <div className="flex h-[62px] items-stretch">
        {TABS.map(({ href, label, Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className="tap relative flex flex-1 flex-col items-center justify-center gap-1"
            >
              <span
                className={`absolute top-1.5 h-8 w-12 rounded-full transition-all duration-200 ${
                  active ? "bg-brand-soft opacity-100" : "opacity-0"
                }`}
              />
              <Icon
                size={21}
                strokeWidth={active ? 2.5 : 1.8}
                className={`relative transition-transform duration-200 ${
                  active ? "-translate-y-[1px] text-brand" : "text-ink-mute"
                }`}
              />
              <span
                className={`relative text-[10px] tracking-wide transition-colors ${
                  active ? "font-semibold text-brand" : "text-ink-mute"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
