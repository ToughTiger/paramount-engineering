import { BlogPost, Category, Tag, PortfolioItem, HeroSlide, AboutContent } from '../types';

export const initialCategories: Category[] = [
  { id: 1, name: 'Residential Design' },
  { id: 2, name: 'Commercial Design' },
  { id: 3, name: 'Hospitality Design' },
];

export const initialTags: Tag[] = [
  { id: 1, name: 'Minimalist' },
  { id: 2, name: 'Modern' },
  { id: 3, name: 'Scandinavian' },
  { id: 4, name: 'Bohemian' },
  { id: 5, name: 'Industrial' },
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'the-art-of-minimalist-living',
    title: 'The Art of Minimalist Living',
    author: 'Admin',
    date: '2023-10-26T10:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    category: 1,
    tags: [1, 2],
    content: 'Discover the beauty of simplicity. Minimalist design is not just about what you remove, but about what you leave behind. It emphasizes clean lines, neutral color palettes, and uncluttered spaces, creating a sense of calm and order in your home. This post explores key principles of minimalism and how you can apply them to create a serene and functional living environment.',
  },
  {
    id: 2,
    slug: 'biophilic-design-bringing-the-outdoors-in',
    title: 'Biophilic Design: Bringing the Outdoors In',
    author: 'Admin',
    date: '2023-11-15T14:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1680&q=80',
    category: 1,
    tags: [2, 4],
    content: 'Connect with nature without leaving your home. Biophilic design incorporates natural elements like plants, wood, stone, and natural light to improve well-being and create a healthier living space. Learn how to integrate these elements into your decor to foster a stronger connection to the natural world and enhance your daily life.',
  },
];

export const initialPortfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: 'Downtown Loft Redesign',
    category: 1,
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41fa2247?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
    description: 'A complete overhaul of a downtown loft, focusing on industrial-chic aesthetics and maximizing natural light.',
  },
  {
    id: 2,
    title: 'Boutique Hotel Lobby',
    category: 3,
    imageUrl: 'https://images.unsplash.com/photo-1611095210925-99522b9b69b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    description: 'Designing a welcoming and luxurious lobby space for a modern boutique hotel, blending comfort with high-end design.',
  },
  {
    id: 3,
    title: 'Modern Office Space',
    category: 2,
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1768&q=80',
    description: 'Creating a collaborative and inspiring office environment for a tech startup, featuring open-plan layouts and breakout zones.',
  },
];

export const initialHeroSlides: HeroSlide[] = [
    {
        id: 1,
        imageUrl: 'https://images.unsplash.com/photo-1556702585-2e4734c445ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
        title: 'Designing Spaces, Inspiring Lives',
        subtitle: 'We craft bespoke interiors that reflect your unique personality and lifestyle.',
    },
    {
        id: 2,
        imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
        title: 'Timeless Elegance, Modern Function',
        subtitle: 'Our design philosophy merges classic aesthetics with contemporary functionality for spaces that endure.',
    },
];

export const initialAboutContent: AboutContent = {
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
    mission: 'Our mission is to create beautiful, functional, and personal spaces that enhance our clients\' quality of life. We believe that great design is a collaborative process, and we work closely with you to bring your vision to life.',
    bio: 'Founded in 2010, PARAMOUNT Engineering began as a small studio with a big passion for design. Over the years, we\'ve grown into a full-service firm known for our attention to detail, commitment to quality, and a client-first approach. Our team of talented designers brings a wealth of experience and creativity to every project, ensuring exceptional results from concept to completion.',
};
