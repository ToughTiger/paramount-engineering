export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  author: string;
  date: string; // ISO string format
  imageUrl: string;
  category: number; // category id
  tags: number[]; // tag ids
  content: string; // The full blog post content
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: number; // category id
  imageUrl: string;
  description: string;
}

export interface HeroSlide {
    id: number;
    imageUrl: string;
    title: string;
    subtitle: string;
}

export interface AboutContent {
    imageUrl: string;
    mission: string;
    bio: string;
}

export interface CurrentUser {
  id: number;
  email: string;
}
