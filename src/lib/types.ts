export type Species =
  | "dog"
  | "cat"
  | "rabbit"
  | "smallpet"
  | "bird"
  | "reptile"
  | "exotic";
export type Size = "small" | "medium" | "large";
export type Gender = "boy" | "girl";
export type AgeBand = "baby" | "adult" | "senior";
/** 互斥维度：只能二选一 */
export type Sociability = "friendly" | "reserved";
export type Energy = "active" | "calm";
export type MeetupKind = "walk" | "market" | "cafe" | "adopt" | "indoor";
export type Topic = "daily" | "care" | "medical" | "adopt" | "recap";

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  gender: Gender;
  ageText: string;
  ageBand: AgeBand;
  size: Size;
  weightKg: number;
  /** 互斥维度：亲人 / 慢热 —— 用户只能选一边 */
  social: Sociability;
  /** 互斥维度：活泼 / 安静 */
  energy: Energy;
  /** 自由标签：吃货、运动狂、爱游泳… 可以多选 */
  traits: string[];
  /** 展示用：由上面三项拼出来的标签串（如 ["亲人","活泼","吃货"]） */
  personality: string[];
  vaccinated: boolean;
  neutered: boolean;
  photos: string[];
  bio: string;
  ownerName: string;
  /** 展示用短标签，如「浦东 · 花木」 */
  district: string;
  province: string;
  city: string;
  /** 区/县，用于按地区筛选 */
  area: string;
  distanceKm: number;
}

export interface Participant {
  name: string;
  petName: string;
}

export interface Meetup {
  id: string;
  type: "personal" | "brand";
  kind: MeetupKind;
  title: string;
  cover: string;
  hostName: string;
  verified: boolean;
  startAt: string;
  venueName: string;
  district: string;
  distanceKm: number;
  sizeLimit: Size[];
  capacity: number;
  participants: Participant[];
  description: string;
  tags: string[];
  fee: number;
}

export interface Post {
  id: string;
  authorName: string;
  petName: string;
  tint: string;
  images: string[];
  content: string;
  meetupId?: string;
  likes: number;
  comments: number;
  timeText: string;
  topic: Topic;
}

/* ── 中文标签 ─────────────────────────────────────────────── */

export const SIZE_LABEL: Record<Size, string> = {
  small: "小型",
  medium: "中型",
  large: "大型",
};

export const SPECIES_LABEL: Record<Species, string> = {
  dog: "狗狗",
  cat: "猫猫",
  rabbit: "兔子",
  smallpet: "小宠",
  bird: "鸟类",
  reptile: "爬宠",
  exotic: "异宠",
};

export const SPECIES_EMOJI: Record<Species, string> = {
  dog: "🐕",
  cat: "🐈",
  rabbit: "🐇",
  smallpet: "🐹",
  bird: "🦜",
  reptile: "🦎",
  exotic: "🦔",
};

/** 异宠分组：这一组的需求和猫狗完全不同——他们要的是"懂的人"，不是"一起遛" */
export const EXOTIC_SPECIES: Species[] = ["bird", "reptile", "exotic"];
export const COMMON_SPECIES: Species[] = ["dog", "cat", "rabbit", "smallpet"];

export function isExotic(s: Species): boolean {
  return EXOTIC_SPECIES.includes(s);
}

export const TOPIC_LABEL: Record<Topic, string> = {
  daily: "日常",
  care: "饲养经验",
  medical: "就医经历",
  adopt: "领养",
  recap: "活动回顾",
};

export const TOPIC_EMOJI: Record<Topic, string> = {
  daily: "☀️",
  care: "📖",
  medical: "🩺",
  adopt: "🏠",
  recap: "📸",
};

export const AGE_LABEL: Record<AgeBand, string> = {
  baby: "幼年",
  adult: "成年",
  senior: "老年",
};

export const SOCIAL_LABEL: Record<Sociability, string> = {
  friendly: "亲人",
  reserved: "慢热",
};

export const ENERGY_LABEL: Record<Energy, string> = {
  active: "活泼",
  calm: "安静",
};

export const KIND_LABEL: Record<MeetupKind, string> = {
  walk: "遛弯局",
  market: "市集",
  cafe: "咖啡店",
  adopt: "领养日",
  indoor: "室内场",
};

export const KIND_EMOJI: Record<MeetupKind, string> = {
  walk: "🦮",
  market: "🛍️",
  cafe: "☕",
  adopt: "🏠",
  indoor: "🏡",
};

/** 只有狗和部分兔子会戴牵引出门，「约遛弯」这个动作对它们才成立 */
export function canWalk(species: Species): boolean {
  return species === "dog" || species === "rabbit";
}
