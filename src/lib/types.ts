export type Species = "dog" | "cat";
export type Size = "small" | "medium" | "large";
export type Gender = "boy" | "girl";

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  gender: Gender;
  ageText: string;
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

export const SIZE_LABEL: Record<Size, string> = {
  small: "小型",
  medium: "中型",
  large: "大型",
};
