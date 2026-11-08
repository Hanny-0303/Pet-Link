"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Meetup } from "@/lib/types";

/**
 * 极简"全局状态"。
 * 这一版没有后端，报名 / 打招呼 / 点赞 都只存在内存里，刷新页面会重置。
 * 第二期接 Supabase 时，把这些方法换成接口调用即可，页面代码几乎不用改。
 */

type Store = {
  joined: string[];
  greeted: string[];
  liked: string[];
  extraMeetups: Meetup[];
  /** 当前选中的区域，null 表示全部区域 */
  district: string | null;
  join: (id: string) => void;
  greet: (id: string) => void;
  like: (id: string) => void;
  addMeetup: (m: Meetup) => void;
  setDistrict: (d: string | null) => void;
};

const Ctx = createContext<Store | null>(null);

function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [joined, setJoined] = useState<string[]>([]);
  const [greeted, setGreeted] = useState<string[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [extraMeetups, setExtraMeetups] = useState<Meetup[]>([]);
  const [district, setDistrict] = useState<string | null>(null);

  return (
    <Ctx.Provider
      value={{
        joined,
        greeted,
        liked,
        extraMeetups,
        district,
        setDistrict,
        join: (id) => setJoined((s) => toggle(s, id)),
        greet: (id) => setGreeted((s) => toggle(s, id)),
        like: (id) => setLiked((s) => toggle(s, id)),
        addMeetup: (m) => setExtraMeetups((s) => [m, ...s]),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppStore 必须在 AppStoreProvider 内使用");
  return ctx;
}
