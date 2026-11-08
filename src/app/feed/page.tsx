"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { getMeetup, posts } from "@/lib/data";
import { TOPIC_EMOJI, TOPIC_LABEL, type Topic } from "@/lib/types";
import { useAppStore } from "@/components/store";
import Avatar from "@/components/avatar";

const TOPICS: (Topic | "all")[] = ["all", "daily", "care", "medical", "adopt", "recap"];

export default function FeedPage() {
  const { liked, like } = useAppStore();
  const [topic, setTopic] = useState<Topic | "all">("all");

  const list = useMemo(
    () => (topic === "all" ? posts : posts.filter((p) => p.topic === topic)),
    [topic]
  );

  return (
    <div className="rise">
      <header className="px-5 pt-7">
        <h1 className="text-[26px] font-bold tracking-tight">圈子</h1>
        <p className="mt-1 text-[12.5px] text-ink-mute">
          养宠人的经验、求助和日常，都在这里
        </p>
      </header>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5">
        {TOPICS.map((t) => {
          const active = topic === t;
          const label = t === "all" ? "全部" : TOPIC_LABEL[t];
          const count =
            t === "all" ? posts.length : posts.filter((p) => p.topic === t).length;
          return (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`shrink-0 rounded-full px-3.5 py-[7px] text-[12.5px] font-medium transition ${
                active
                  ? "bg-ink text-cream"
                  : "bg-white text-ink-soft shadow-[0_1px_6px_rgba(80,60,40,0.06)]"
              }`}
            >
              {t !== "all" && <span className="mr-0.5">{TOPIC_EMOJI[t]}</span>}
              {label}
              <span className={active ? "ml-1 text-cream/55" : "ml-1 text-ink-mute"}>
                {count}
              </span>
            </button>
          );
        })}
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
                    {post.topic !== "daily" && !meetup && (
                      <span className="ml-1.5 rounded-full bg-cream px-1.5 py-[1px] text-[9.5px] font-medium text-ink-soft">
                        {TOPIC_LABEL[post.topic]}
                      </span>
                    )}
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
