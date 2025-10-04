
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import * as authApi from "./client/authApi";
import * as blogApi from "./client/blogApi";
import * as categoryApi from "./client/categoryApi";
import * as tagApi from "./client/tagApi";
import * as normalize from "./utils/normalize"; // keep your helpers
import * as portfolioApi from "./client/portfolioApi";
import * as heroSlideApi from "./client/heroSlideApi";
import * as aboutApi from './client/aboutApi';

import {
  BlogPost,
  Category,
  Tag,
  PortfolioItem,
  HeroSlide,
  AboutContent,
  CurrentUser,
} from "./types";

// ---------- localStorage helpers ----------
const getLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

// ---------- Context types ----------
interface AppContextType {
  // Auth
  isLoggedIn: boolean;
  currentUser: CurrentUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;

  // Blog
  blogPosts: BlogPost[];
  listBlogPosts: () => Promise<void>;
  addBlogPost: (post: Omit<BlogPost, "id" | "slug" | "date">) => Promise<void>;
  updateBlogPost: (post: BlogPost) => Promise<void>;
  deleteBlogPost: (id: number) => Promise<void>;

  // Categories
  categories: Category[];
  listCategory: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;

  // Tags
  tags: Tag[];
  listTag: () => Promise<void>;
  addTag: (name: string) => Promise<void>;
  updateTag: (tag: Tag) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;

  // Portfolio/Hero/About (unchanged)
  portfolioItems: PortfolioItem[];
  addPortfolioItem: (item: Omit<PortfolioItem, "id">) => void;
  updatePortfolioItem: (item: PortfolioItem) => void;
  deletePortfolioItem: (id: number) => void;

  heroSlides: HeroSlide[];
  addHeroSlide: (input: Omit<HeroSlide, "id">) => void;
  deleteHeroSlide: (id: number) => void;
  updateHeroSlide: (id: number, input: Partial<HeroSlide>) => void;
  
  aboutContent: AboutContent;
  updateAboutContent: (content: AboutContent) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ---------- Normalizers (server -> client) ----------
const UNCATEGORIZED: Category = { id: 0, name: "Uncategorized" };

function normalizeServerPost(p: any): BlogPost {
  // Server returns tags as pivot rows: { tag: Tag }
  const flatTags: Tag[] = Array.isArray(p?.tags)
    ? p.tags.map((t: any) => t?.tag).filter(Boolean)
    : [];

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    author: p.author,
    date: new Date(p.date).toISOString(),
    imageUrl: p.imageUrl,
    content: p.content,
    // Ensure category object exists for the UI
    category: p.category ?? UNCATEGORIZED,
    // Ensure Tag[]
    tags: flatTags,
  };
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // ---------- State ----------
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => !!getLocalStorage("currentUser", null)
  );
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() =>
    getLocalStorage("currentUser", null)
  );

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() =>
    getLocalStorage<BlogPost[]>("blogPosts", [])
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    getLocalStorage<Category[]>("categories", [])
  );
  const [tags, setTags] = useState<Tag[]>(() =>
    getLocalStorage<Tag[]>("tags", [])
  );

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() =>
    getLocalStorage<PortfolioItem[]>("portfolioItems", [])
  );
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent>(() =>
    getLocalStorage<AboutContent>("aboutContent", {
      heading: "",
      subheading: "",
      body: "",
    } as any)
  );

  // ---------- Effects: initial fetch + persist ----------
  useEffect(() => {
    setLocalStorage("currentUser", currentUser);
  }, [currentUser]);

  useEffect(() => {
    listCategory();
    listTag();
    listBlogPosts();
    listPortfolio();
    listHeroSlides();
    listAboutContent();
  }, []); // fetch all once on mount

  useEffect(() => {
    setLocalStorage("categories", categories);
  }, [categories]);
  useEffect(() => {
    setLocalStorage("tags", tags);
  }, [tags]);
  useEffect(() => {
    setLocalStorage("blogPosts", blogPosts);
  }, [blogPosts]);
  useEffect(() => {
    setLocalStorage("portfolioItems", portfolioItems);
  }, [portfolioItems]);
  useEffect(() => {
    setLocalStorage("heroSlides", heroSlides);
  }, [heroSlides]);
  useEffect(() => {
    setLocalStorage("aboutContent", aboutContent);
  }, [aboutContent]);

  // ---------- Auth ----------
  const login = async (email: string, password: string): Promise<boolean> => {
    const user = await authApi.login(email, password);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!currentUser)
      return { success: false, message: "No user is logged in." };
    return authApi.changePassword(currentUser.email, oldPassword, newPassword);
  };

  // ---------- Blog ----------
  const listBlogPosts = async () => {
    const serverPosts = await blogApi.listBlogPosts();
    const normalized = Array.isArray(serverPosts)
      ? serverPosts.map(normalizeServerPost)
      : [];
    setBlogPosts(normalized);
  };

  const addBlogPost = async (post: Omit<BlogPost, "id" | "slug" | "date">) => {
    const payload = {
      slug: slugify(post.title),
      title: post.title,
      author: post.author,
      date: new Date().toISOString(),
      imageUrl: post.imageUrl,
      categoryId: normalize.extractCategoryId(post.category) ?? 0, // number
      tagIds: normalize.extractTagIds(post.tags), // number[]
      content: post.content,
    };

    const created = await blogApi.createBlogPost(payload);
    const normalized = normalizeServerPost(created);
    setBlogPosts((prev) => [normalized, ...prev]);
  };

  const updateBlogPost = async (updatedPost: BlogPost) => {
    const payload = normalize.cleanObject({
      slug: updatedPost.slug,
      title: updatedPost.title,
      author: updatedPost.author,
      dateISO: new Date(updatedPost.date).toISOString(),
      imageUrl: String(updatedPost.imageUrl ?? ""),
      content: updatedPost.content,
      categoryId: normalize.extractCategoryId(updatedPost.category),
      tagIds: normalize.extractTagIds(updatedPost.tags),
    });

    const updated = await blogApi.updateBlogPost(
      Number(updatedPost.id),
      payload as any
    );
    const normalized = normalizeServerPost(updated);

    setBlogPosts((prev) =>
      prev.map((p) => (p.id === normalized.id ? normalized : p))
    );
  };

  const deleteBlogPost = async (id: number) => {
    await blogApi.deleteBlogPost(id);
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // ---------- Categories ----------
  const listCategory = async () => {
    const cats = await categoryApi.listCategories();
    setCategories(Array.isArray(cats) ? cats : []);
  };

  const addCategory = async (name: string) => {
    const created = await categoryApi.createCategory(name);
    setCategories((prev) => [...prev, created]);
  };

  const updateCategory = async (category: Category) => {
    const updated = await categoryApi.updateCategory(
      category.id,
      category.name
    );
    setCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const deleteCategory = async (id: number) => {
    await categoryApi.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // ---------- Tags ----------
  const listTag = async () => {
    const t = await tagApi.listTags();
    setTags(Array.isArray(t) ? t : []);
  };

  const addTag = async (name: string) => {
    const created = await tagApi.createTag(name);
    setTags((prev) => [...prev, created]);
  };

  const updateTag = async (tag: Tag) => {
    const updated = await tagApi.updateTag(tag.id, tag.name);
    setTags((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const deleteTag = async (id: number) => {
    await tagApi.deleteTag(id);
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  // ---------- Portfolio / Hero / About (unchanged logic) ----------

  const normalizePortfolio = (p: any): PortfolioItem => ({
    id: p.id,
    title: p.title,
    imageUrl: p.imageUrl,
    description: p.description,
    category: p.category ?? UNCATEGORIZED,
  });

  const listPortfolio = async (params?: {
    categoryId?: number;
    search?: string;
  }) => {
    const items = await portfolioApi.listPortfolioItems(params);
    setPortfolioItems(
      Array.isArray(items) ? items.map(normalizePortfolio) : []
    );
  };
  const addPortfolioItem = async (item: Omit<PortfolioItem, "id">) => {
    // UI holds category object; send categoryId to API
    const created = await portfolioApi.createPortfolioItem({
      title: item.title,
      imageUrl: item.imageUrl,
      description: item.description,
      categoryId: item.category?.id ?? 0,
    });
    setPortfolioItems((prev) => [normalizePortfolio(created), ...prev]);
    listPortfolio(); // refresh to get updated category object
  };

  const updatePortfolioItem = async (item: PortfolioItem) => {
    const updated = await portfolioApi.updatePortfolioItem(item.id, {
      title: item.title,
      imageUrl: item.imageUrl,
      description: item.description,
      categoryId: item.category?.id, // optional in DTO
    });
    const normalized = normalizePortfolio(updated);
    setPortfolioItems((prev) =>
      prev.map((p) => (p.id === normalized.id ? normalized : p))
    );
    listPortfolio(); // refresh to get updated category object
  };

  const deletePortfolioItem = async (id: number) => {
    await portfolioApi.deletePortfolioItem(id);
    setPortfolioItems((prev) => prev.filter((p) => p.id !== id));
  };
  const listHeroSlides = async () => {
    const slides = await heroSlideApi.listHeroSlides();
    setHeroSlides(slides);
  };
  const addHeroSlide = async (input: Omit<HeroSlide, "id">) => {
    const created = await heroSlideApi.createHeroSlide(input);
    setHeroSlides((prev) => [created, ...prev]);
  };
  const deleteHeroSlide = async (id: number) => {
    await heroSlideApi.deleteHeroSlide(id);
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };
  const updateHeroSlide = async (id: number, input: Partial<HeroSlide>) => {
    const updated = await heroSlideApi.updateHeroSlide(id, input);
    setHeroSlides((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };
  const listAboutContent = async () => {
    const data = await aboutApi.getAbout();
    setAboutContent(data);
  };

  const updateAboutContent = async (content: AboutContent) => {
    const saved = await aboutApi.saveAbout(content); // upsert
    setAboutContent(saved);
    listAboutContent();
  };

  const value: AppContextType = {
    // auth
    isLoggedIn,
    currentUser,
    login,
    logout,
    changePassword,
    // blog
    blogPosts,
    listBlogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    // categories
    categories,
    listCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    // tags
    tags,
    listTag,
    addTag,
    updateTag,
    deleteTag,
    // other
    portfolioItems,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    heroSlides,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    aboutContent,
    updateAboutContent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within an AppProvider");
  return ctx;
};

