"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { getMeetup, posts } from "@/lib/data";
import { TOPIC_EMOJI, TOPIC_LABEL } from "@/lib/types";
import { fmtMeetup } from "@/lib/date";
import { useAppStore } from "@/components/store";
import Avatar from "@/components/avatar";
import SubPageHeader from "@/components/sub-header";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { liked, like } = useAppStore();

  const post = posts.find((p) => p.id === id);
  if (!post) {
    return (
      <div className="min-h-dvh bg-cream">
        <SubPageHeader title="帖子" />
        <p className="px-5 pt-16 text-center text-[13px] text-ink-soft">
          这条帖子不存在或已被删除
        </p>
      </div>
    );
  }

  const isLiked = liked.includes(post.id);
  const meetup = post.meetupId ? getMeetup(post.meetupId) : undefined;

  return (
    <div className="min-h-dvh bg-cream pb-10">
      <SubPageHeader title="帖子" />

      <article className="mt-2 px-5">
        <div className="rounded-[20px] bg-white p-4 shadow-[0_2px_14px_rgba(80,60,40,0.06)]">
          <div className="flex items-center gap-2.5">
            <Avatar name={post.authorName} tint={post.tint} size={40} />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold">{post.authorName}</p>
              <p className="text-[10.5px] text-ink-mute">
                {post.petName}的主人 · {post.timeText}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-cream px-2 py-1 text-[10px] font-medium text-ink-soft">
              {TOPIC_EMOJI[post.topic]} {TOPIC_LABEL[post.topic]}
            </span>
          </div>

          <p className="mt-3 text-[14px] leading-[1.85] whitespace-pre-line text-ink-soft">
            {post.content}
          </p>

          <div
            className={`mt-3 grid gap-1 overflow-hidden rounded-[16px] ${
              post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {post.images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className={`w-full object-cover ${
                  post.images.length === 1 ? "max-h-[380px] rounded-[16px]" : "aspect-square"
                }`}
              />
            ))}
          </div>

          {meetup && (
            <Link
              href={`/meetups/${meetup.id}`}
              className="mt-3 block rounded-[14px] bg-cream px-3 py-3"
            >
              <p className="flex items-center gap-1 text-[10px] text-brand">
                <Sparkles size={10} strokeWidth={2.6} /> 相关活动
              </p>
              <p className="mt-1 line-clamp-1 text-[12.5px] font-medium">{meetup.title}</p>
              <p className="mt-0.5 text-[10.5px] text-ink-mute">
                {fmtMeetup(meetup.startAt)} · {meetup.venueName}
              </p>
            </Link>
          )}

          <div className="mt-4 flex items-center gap-5 border-t border-line/70 pt-3">
            <button
              onClick={() => like(post.id)}
              className="flex items-center gap-1.5 text-[12px] active:scale-90"
            >
              <Heart
                size={17}
                strokeWidth={2.2}
                className={
                  isLiked ? "heart-pop fill-brand text-brand" : "text-ink-mute"
                }
              />
              <span className={isLiked ? "font-semibold text-brand" : "text-ink-mute"}>
                {post.likes + (isLiked ? 1 : 0)}
              </span>
            </button>
            <span className="flex items-center gap-1.5 text-[12px] text-ink-mute">
              <MessageCircle size={17} strokeWidth={2.2} />
              {post.comments}
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}
