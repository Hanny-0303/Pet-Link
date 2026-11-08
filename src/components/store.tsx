"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Meetup, Species } from "@/lib/types";

/**
 * 极简"全局状态"。
 * 这一版没有后端，所有数据都只存在内存里，刷新页面会重置。
 * 第二期接 Supabase 时，把这些方法换成接口调用即可，页面代码几乎不用改。
 */

export type Profile = {
  name: string;
  bio: string;
  district: string;
};

export type Prefs = {
  notify: boolean;
  allowGreet: boolean;
  showDistance: boolean;
};

type Store = {
  joined: string[];
  greeted: string[];
  liked: string[];
  extraMeetups: Meetup[];
  /** 当前选中的区域，null 表示全部区域 */
  district: string | null;
  /** 当前选中的物种，all 表示全部 */
  species: Species | "all";
  profile: Profile;
  prefs: Prefs;
  toast: string | null;

  join: (id: string) => void;
  greet: (id: string) => void;
  like: (id: string) => void;
  addMeetup: (m: Meetup) => void;
  setDistrict: (d: string | null) => void;
  setSpecies: (s: Species | "all") => void;
  setProfile: (p: Profile) => void;
  togglePref: (k: keyof Prefs) => void;
  resetAll: () => void;
  showToast: (msg: string) => void;
};

const DEFAULT_PROFILE: Profile = {
  name: "小鹿",
  bio: "养了一只柯基，每天傍晚在小区门口遛。想找同城的朋友一起。",
  district: "浦东 · 花木",
};

const DEFAULT_PREFS: Prefs = {
  notify: true,
  allowGreet: true,
  showDistance: true,
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
  const [species, setSpecies] = useState<Species | "all">("all");
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 1900);
  }, []);

  const resetAll = useCallback(() => {
    setJoined([]);
    setGreeted([]);
    setLiked([]);
    setExtraMeetups([]);
    setDistrict(null);
    setSpecies("all");
    setProfile(DEFAULT_PROFILE);
    setPrefs(DEFAULT_PREFS);
    showToast("演示数据已重置");
  }, [showToast]);

  return (
    <Ctx.Provider
      value={{
        joined,
        greeted,
        liked,
        extraMeetups,
        district,
        species,
        profile,
        prefs,
        toast,
        setDistrict,
        setSpecies,
        setProfile,
        resetAll,
        showToast,
        join: (id) => setJoined((s) => toggle(s, id)),
        greet: (id) => setGreeted((s) => toggle(s, id)),
        like: (id) => setLiked((s) => toggle(s, id)),
        addMeetup: (m) => setExtraMeetups((s) => [m, ...s]),
        togglePref: (k) => setPrefs((p) => ({ ...p, [k]: !p[k] })),
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
