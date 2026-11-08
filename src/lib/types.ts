export type Species = "dog" | "cat" | "rabbit" | "smallpet";
export type Size = "small" | "medium" | "large";
export type Gender = "boy" | "girl";
export type AgeBand = "baby" | "adult" | "senior";
export type MeetupKind = "walk" | "market" | "cafe" | "adopt" | "indoor";

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
  personality: string[];
  vaccinated: boolean;
  neutered: boolean;
  photos: string[];
  bio: string;
  ownerName: string;
  district: string;
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
};

export const SPECIES_EMOJI: Record<Species, string> = {
  dog: "🐕",
  cat: "🐈",
  rabbit: "🐇",
  smallpet: "🐹",
};

export const AGE_LABEL: Record<AgeBand, string> = {
  baby: "幼年",
  adult: "成年",
  senior: "老年",
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
