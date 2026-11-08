"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { getMeetup, posts } from "@/lib/data";
import { useAppStore } from "@/components/store";
import Avatar from "@/components/avatar";

const TABS = ["推荐", "关注", "附近"] as const;

export default function FeedPage() {
  const { liked, like } = useAppStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>("推荐");

  const list = useMemo(() => {
    if (tab === "附近") {
      return posts.filter((p) => p.meetupId).slice(0, 6);
    }
    return posts;
  }, [tab]);

  return (
    <div className="rise">
      <header className="px-5 pt-7">
        <h1 className="text-[26px] font-bold tracking-tight">圈子</h1>
        <p className="mt-1 text-[12.5px] text-ink-mute">
          狗狗们的线下见面，都发生在这里
        </p>
      </header>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full px-3.5 py-[7px] text-[12.5px] font-medium transition ${
              tab === t
                ? "bg-ink text-cream"
                : "bg-white text-ink-soft shadow-[0_1px_6px_rgba(80,60,40,0.06)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3 px-5">
        {list.map((post) => {
          const isLiked = liked.includes(post.id);
          const meetup = post.meetupId ? getMeetup(post.meetupId) : undefined;

          return (
            <article
              key={post.id}
              className="overflow-hidden rounded-[22px] bg-white p-4 shadow-[0_2px_14px_rgba(80,60,40,0.06)]"
            >
              <div className="flex items-center gap-2.5">
                <Avatar name={post.authorName} tint={post.tint} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold">{post.authorName}</p>
                  <p className="text-[10.5px] text-ink-mute">
                    {post.petName}的主人 · {post.timeText}
                  </p>
                </div>
                {meetup && (
                  <Link
                    href={`/meetups/${meetup.id}`}
                    className="flex shrink-0 items-center gap-1 rounded-full bg-mint-soft px-2 py-1 text-[9.5px] font-medium text-mint"
                  >
                    <Sparkles size={9} strokeWidth={2.6} />
                    活动回顾
                  </Link>
                )}
              </div>

              <p className="mt-3 text-[13.5px] leading-[1.8] whitespace-pre-line text-ink-soft">
                {post.content}
              </p>

              <div
                className={`mt-3 grid gap-1 overflow-hidden rounded-[16px] ${
                  post.images.length === 1
                    ? "grid-cols-1"
                    : post.images.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-3"
                }`}
              >
                {post.images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className={`w-full object-cover ${
                      post.images.length === 1 ? "max-h-[320px] rounded-[16px]" : "aspect-square"
                    }`}
                  />
                ))}
              </div>

              {meetup && (
                <Link
                  href={`/meetups/${meetup.id}`}
                  className="mt-3 flex items-center justify-between rounded-[14px] bg-cream px-3 py-2.5"
                >
                  <span className="line-clamp-1 text-[11.5px] font-medium text-ink-soft">
                    #{meetup.title}
                  </span>
                  <span className="shrink-0 text-[10.5px] text-brand">去看看</span>
                </Link>
              )}

              <div className="mt-3 flex items-center gap-5 border-t border-line/70 pt-2.5">
                <button
                  onClick={() => like(post.id)}
                  className="flex items-center gap-1.5 text-[11.5px] active:scale-90"
                >
                  <Heart
                    size={15}
                    strokeWidth={2.2}
                    className={isLiked ? "fill-brand text-brand" : "text-ink-mute"}
                  />
                  <span className={isLiked ? "font-semibold text-brand" : "text-ink-mute"}>
                    {post.likes + (isLiked ? 1 : 0)}
                  </span>
                </button>
                <span className="flex items-center gap-1.5 text-[11.5px] text-ink-mute">
                  <MessageCircle size={15} strokeWidth={2.2} />
                  {post.comments}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="h-6" />
    </div>
  );
}
