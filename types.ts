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
  date: string; 
  imageUrl: string;
  category: Category; 
  tags: Tag[]; 
  content: string; 
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: Category; // category id
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
