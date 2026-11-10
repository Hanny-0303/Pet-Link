"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { getMeetup, posts } from "@/lib/data";
import { TOPIC_EMOJI, TOPIC_LABEL, type Topic } from "@/lib/types";
import { useAppStore } from "@/components/store";
import PickerSheet from "@/components/picker-sheet";
import { ChevronDown } from "lucide-react";
import Avatar from "@/components/avatar";

const TOPICS: (Topic | "all")[] = ["all", "daily", "care", "medical", "adopt", "recap"];

export default function FeedPage() {
  const { liked, like } = useAppStore();
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [pickerOpen, setPickerOpen] = useState(false);

  const list = useMemo(
    () => (topic === "all" ? posts : posts.filter((p) => p.topic === topic)),
    [topic]
  );

  return (
    <>
    <div className="rise">
      <header className="px-5 pt-7">
        <h1 className="text-page font-bold tracking-tight">圈子</h1>
        <p className="mt-1 text-body text-ink-mute">
          养宠人的经验、求助和日常，都在这里
        </p>
      </header>

      <div className="sticky top-0 z-20 -mb-1 bg-canvas/95 px-5 pt-3 pb-2 backdrop-blur-xl">
        <button
          onClick={() => setPickerOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-2 text-body font-medium shadow-soft tap"
        >
          {topic === "all" ? "全部话题" : TOPIC_LABEL[topic]}
          <span className="text-cap text-ink-mute">
            {topic === "all" ? posts.length : posts.filter((p) => p.topic === topic).length}
          </span>
          <ChevronDown size={13} strokeWidth={2.6} className="text-ink-mute" />
        </button>
      </div>

      <div className="mt-4 space-y-3 px-5">
        {list.map((post, i) => {
          const isLiked = liked.includes(post.id);
          const meetup = post.meetupId ? getMeetup(post.meetupId) : undefined;

          return (
            <article
              key={post.id}
              className="stagger select-none overflow-hidden rounded-block bg-surface p-4 shadow-card"
              style={{ animationDelay: `${Math.min(i, 6) * 45}ms` }}
            >
              <Link href={`/feed/${post.id}`} className="tap block">
              <div className="flex items-center gap-2.5">
                <Avatar name={post.authorName} tint={post.tint} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="text-body font-semibold">{post.authorName}</p>
                  <p className="text-cap text-ink-mute">
                    {post.petName}的主人 · {post.timeText}
                    {post.topic !== "daily" && !meetup && (
                      <span className="ml-1.5 rounded-full bg-canvas px-1.5 py-[1px] text-micro font-medium text-ink-soft">
                        {TOPIC_LABEL[post.topic]}
                      </span>
                    )}
                  </p>
                </div>
                {meetup && (
                  <Link
                    href={`/meetups/${meetup.id}`}
                    className="flex shrink-0 items-center gap-1 rounded-full bg-mint-soft px-2 py-1 text-micro font-medium text-mint"
                  >
                    <Sparkles size={9} strokeWidth={2.6} />
                    活动回顾
                  </Link>
                )}
              </div>

              <p className="mt-3 text-body-lg leading-[1.8] whitespace-pre-line text-ink-soft">
                {post.content}
              </p>

              <div
                className={`mt-3 grid gap-1 overflow-hidden rounded-card ${
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
                      post.images.length === 1 ? "max-h-[320px] rounded-card" : "aspect-square"
                    }`}
                  />
                ))}
              </div>

              {meetup && (
                <Link
                  href={`/meetups/${meetup.id}`}
                  className="mt-3 flex items-center justify-between rounded-card bg-canvas px-3 py-2.5"
                >
                  <span className="line-clamp-1 text-note font-medium text-ink-soft">
                    #{meetup.title}
                  </span>
                  <span className="shrink-0 text-cap text-accent">去看看</span>
                </Link>
              )}

              </Link>

              <div className="mt-3 flex items-center gap-5 border-t border-line/70 pt-2.5">
                <button
                  onClick={() => like(post.id)}
                  className="flex items-center gap-1.5 text-note active:scale-90"
                >
                  <Heart
                    size={15}
                    strokeWidth={2.2}
                    className={
                      isLiked ? "heart-pop fill-brand text-accent" : "text-ink-mute"
                    }
                  />
                  <span className={isLiked ? "font-semibold text-accent" : "text-ink-mute"}>
                    {post.likes + (isLiked ? 1 : 0)}
                  </span>
                </button>
                <Link
                  href={`/feed/${post.id}`}
                  className="flex items-center gap-1.5 text-note text-ink-mute"
                >
                  <MessageCircle size={15} strokeWidth={2.2} />
                  {post.comments}
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="h-6" />
      </div>

      <PickerSheet
        open={pickerOpen}
        title="话题"
        subtitle="选一个方向，看相关的经验"
        value={topic}
        onPick={(k) => setTopic(k as Topic | "all")}
        onClose={() => setPickerOpen(false)}
        options={[
          { key: "all", label: "全部话题", count: posts.length },
          ...(["daily", "care", "medical", "adopt", "recap"] as const).map((t) => ({
            key: t,
            label: TOPIC_LABEL[t],
            count: posts.filter((p) => p.topic === t).length,
          })),
        ]}
      />
    </>
  );
}
