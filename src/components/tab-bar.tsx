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
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-line/80 bg-cream/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
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
              className="relative flex flex-1 flex-col items-center justify-center gap-1"
            >
              <Icon
                size={21}
                strokeWidth={active ? 2.4 : 1.8}
                className={active ? "text-brand" : "text-ink-mute"}
              />
              <span
                className={`text-[10px] tracking-wide ${
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
