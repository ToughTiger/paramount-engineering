

// "use client";

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   type ReactNode,
// } from "react";
// import {
//   BlogPost,
//   Category,
//   Tag,
//   PortfolioItem,
//   HeroSlide,
//   AboutContent,
//   CurrentUser,
// } from "@/types";
// import {
//   initialBlogPosts,
//   initialCategories,
//   initialTags,
//   initialPortfolioItems,
//   initialHeroSlides,
//   initialAboutContent,
// } from "./services/initialData";

// // ---- localStorage helpers ----
// const getLocalStorage = (key: string, def: any) => {
//   try {
//     const v = localStorage.getItem(key);
//     return v ? JSON.parse(v) : def;
//   } catch (e) {
//     console.error(`Error reading localStorage key "${key}"`, e);
//     return def;
//   }
// };
// const setLocalStorage = (key: string, value: any) => {
//   try {
//     localStorage.setItem(key, JSON.stringify(value));
//   } catch (e) {
//     console.error(`Error setting localStorage key "${key}"`, e);
//   }
// };

// interface AppContextType {
//   isLoggedIn: boolean;
//   currentUser: CurrentUser | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   changePassword: (
//     oldPassword: string,
//     newPassword: string
//   ) => Promise<{ success: boolean; message: string }>;

//   blogPosts: BlogPost[];
//   addBlogPost: (post: Omit<BlogPost, "id" | "slug" | "date">) => void;
//   updateBlogPost: (post: BlogPost) => void;
//   deleteBlogPost: (id: number) => void;

//   categories: Category[];
//   addCategory: (name: string) => void;
//   updateCategory: (category: Category) => void;
//   deleteCategory: (id: number) => void;

//   tags: Tag[];
//   addTag: (name: string) => void;
//   updateTag: (tag: Tag) => void;
//   deleteTag: (id: number) => void;

//   portfolioItems: PortfolioItem[];
//   addPortfolioItem: (item: Omit<PortfolioItem, "id">) => void;
//   updatePortfolioItem: (item: PortfolioItem) => void;
//   deletePortfolioItem: (id: number) => void;

//   heroSlides: HeroSlide[];
//   updateHeroSlides: (slides: HeroSlide[]) => void;

//   aboutContent: AboutContent;
//   updateAboutContent: (content: AboutContent) => void;
// }

// const AppContext = createContext<AppContextType | undefined>(undefined);

// export function AppProvider({ children }: { children: ReactNode }) {
//   // Auth
//   const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() =>
//     getLocalStorage("currentUser", null)
//   );
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
//     () => !!getLocalStorage("currentUser", null)
//   );

//   // Content
//   const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() =>
//     getLocalStorage("blogPosts", initialBlogPosts)
//   );
//   const [categories, setCategories] = useState<Category[]>(() =>
//     getLocalStorage("categories", initialCategories)
//   );
//   const [tags, setTags] = useState<Tag[]>(() =>
//     getLocalStorage("tags", initialTags)
//   );
//   const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() =>
//     getLocalStorage("portfolioItems", initialPortfolioItems)
//   );
//   const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() =>
//     getLocalStorage("heroSlides", initialHeroSlides)
//   );
//   const [aboutContent, setAboutContent] = useState<AboutContent>(() =>
//     getLocalStorage("aboutContent", initialAboutContent)
//   );

//   // persist
//   useEffect(() => setLocalStorage("currentUser", currentUser), [currentUser]);
//   useEffect(() => setLocalStorage("blogPosts", blogPosts), [blogPosts]);
//   useEffect(() => setLocalStorage("categories", categories), [categories]);
//   useEffect(() => setLocalStorage("tags", tags), [tags]);
//   useEffect(
//     () => setLocalStorage("portfolioItems", portfolioItems),
//     [portfolioItems]
//   );
//   useEffect(() => setLocalStorage("heroSlides", heroSlides), [heroSlides]);
//   useEffect(
//     () => setLocalStorage("aboutContent", aboutContent),
//     [aboutContent]
//   );

//   // ---- AUTH via API routes ----
//   const login = async (email: string, password: string) => {
//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });
//     if (!res.ok) return false;
//     const data = await res.json(); // { ok, user }
//     if (data.ok && data.user) {
//       setCurrentUser(data.user);
//       setIsLoggedIn(true);
//       return true;
//     }
//     return false;
//   };

//   const logout = () => {
//     setCurrentUser(null);
//     setIsLoggedIn(false);
//   };

//   const changePassword = async (oldPassword: string, newPassword: string) => {
//     if (!currentUser)
//       return { success: false, message: "No user is logged in." };
//     const res = await fetch("/api/auth/change-password", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email: currentUser.email,
//         oldPassword,
//         newPassword,
//       }),
//     });
//     const data = await res.json();
//     return data; // { success, message }
//   };

//   // ---- Content methods (unchanged) ----
//   const addBlogPost = (post: Omit<BlogPost, "id" | "slug" | "date">) => {
//     const newPost: BlogPost = {
//       ...post,
//       id: Date.now(),
//       date: new Date().toISOString(),
//       slug: post.title
//         .toLowerCase()
//         .replace(/\s+/g, "-")
//         .replace(/[^\w-]+/g, ""),
//     };
//     setBlogPosts((prev) => [newPost, ...prev]);
//   };
//   const updateBlogPost = (p: BlogPost) =>
//     setBlogPosts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
//   const deleteBlogPost = (id: number) =>
//     setBlogPosts((prev) => prev.filter((x) => x.id !== id));

//   const addCategory = (name: string) =>
//     setCategories((prev) => [...prev, { id: Date.now(), name }]);
//   const updateCategory = (c: Category) =>
//     setCategories((prev) => prev.map((x) => (x.id === c.id ? c : x)));
//   const deleteCategory = (id: number) =>
//     setCategories((prev) => prev.filter((x) => x.id !== id));

//   const addTag = (name: string) =>
//     setTags((prev) => [...prev, { id: Date.now(), name }]);
//   const updateTag = (t: Tag) =>
//     setTags((prev) => prev.map((x) => (x.id === t.id ? t : x)));
//   const deleteTag = (id: number) =>
//     setTags((prev) => prev.filter((x) => x.id !== id));

//   const addPortfolioItem = (item: Omit<PortfolioItem, "id">) =>
//     setPortfolioItems((prev) => [{ ...item, id: Date.now() }, ...prev]);
//   const updatePortfolioItem = (i: PortfolioItem) =>
//     setPortfolioItems((prev) => prev.map((x) => (x.id === i.id ? i : x)));
//   const deletePortfolioItem = (id: number) =>
//     setPortfolioItems((prev) => prev.filter((x) => x.id !== id));

//   const updateHeroSlides = (slides: HeroSlide[]) => setHeroSlides(slides);
//   const updateAboutContent = (content: AboutContent) =>
//     setAboutContent(content);

//   const value: AppContextType = {
//     isLoggedIn,
//     currentUser,
//     login,
//     logout,
//     changePassword,
//     blogPosts,
//     addBlogPost,
//     updateBlogPost,
//     deleteBlogPost,
//     categories,
//     addCategory,
//     updateCategory,
//     deleteCategory,
//     tags,
//     addTag,
//     updateTag,
//     deleteTag,
//     portfolioItems,
//     addPortfolioItem,
//     updatePortfolioItem,
//     deletePortfolioItem,
//     heroSlides,
//     updateHeroSlides,
//     aboutContent,
//     updateAboutContent,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// }

// export function useAppContext() {
//   const ctx = useContext(AppContext);
//   if (!ctx) throw new Error("useAppContext must be used within an AppProvider");
//   return ctx;
// }

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  BlogPost,
  Category,
  Tag,
  PortfolioItem,
  HeroSlide,
  AboutContent,
  CurrentUser,
} from "@/types";
import {
  initialBlogPosts,
  initialCategories,
  initialTags,
  initialPortfolioItems,
  initialHeroSlides,
  initialAboutContent,
} from "@/services/initialData";

/* ------------------------------------------
   LocalStorage helpers (safe & error-proof)
-------------------------------------------*/
function getLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem(key) : null;
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (e) {
    console.error(`LS read error for "${key}"`, e);
    return fallback;
  }
}

function setLocalStorage<T>(key: string, value: T) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.error(`LS write error for "${key}"`, e);
  }
}

/* ------------------------------------------
   Context types
-------------------------------------------*/
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
  addBlogPost: (post: Omit<BlogPost, "id" | "slug" | "date">) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: number) => void;

  // Categories
  categories: Category[];
  addCategory: (name: string) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: number) => void;

  // Tags
  tags: Tag[];
  addTag: (name: string) => void;
  updateTag: (tag: Tag) => void;
  deleteTag: (id: number) => void;

  // Portfolio
  portfolioItems: PortfolioItem[];
  addPortfolioItem: (item: Omit<PortfolioItem, "id">) => void;
  updatePortfolioItem: (item: PortfolioItem) => void;
  deletePortfolioItem: (id: number) => void;

  // Hero Slides
  heroSlides: HeroSlide[];
  updateHeroSlides: (slides: HeroSlide[]) => void;

  // About Content
  aboutContent: AboutContent;
  updateAboutContent: (content: AboutContent) => void;
}

/* ------------------------------------------
   Context setup
-------------------------------------------*/
const AppContext = createContext<AppContextType | undefined>(undefined);

/** Small helper to know when the component is mounted on the client */
function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/* ------------------------------------------
   Provider (SSR-safe & hydration-proof)
-------------------------------------------*/
export function AppProvider({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();

  // 1) SSR-safe defaults (MUST be deterministic to match server HTML)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(
    initialPortfolioItems
  );
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(initialHeroSlides);
  const [aboutContent, setAboutContent] =
    useState<AboutContent>(initialAboutContent);

  // 2) After mount, hydrate state from localStorage (client only)
  useEffect(() => {
    const cu = getLocalStorage<CurrentUser | null>("currentUser", null);
    setCurrentUser(cu);
    setIsLoggedIn(!!cu);

    setBlogPosts(getLocalStorage("blogPosts", initialBlogPosts));
    setCategories(getLocalStorage("categories", initialCategories));
    setTags(getLocalStorage("tags", initialTags));
    setPortfolioItems(getLocalStorage("portfolioItems", initialPortfolioItems));
    setHeroSlides(getLocalStorage("heroSlides", initialHeroSlides));
    setAboutContent(getLocalStorage("aboutContent", initialAboutContent));
  }, []);

  // 3) Persist changes to localStorage
  useEffect(() => setLocalStorage("currentUser", currentUser), [currentUser]);
  useEffect(() => setLocalStorage("blogPosts", blogPosts), [blogPosts]);
  useEffect(() => setLocalStorage("categories", categories), [categories]);
  useEffect(() => setLocalStorage("tags", tags), [tags]);
  useEffect(
    () => setLocalStorage("portfolioItems", portfolioItems),
    [portfolioItems]
  );
  useEffect(() => setLocalStorage("heroSlides", heroSlides), [heroSlides]);
  useEffect(
    () => setLocalStorage("aboutContent", aboutContent),
    [aboutContent]
  );

  // ---- AUTH (via API routes; server does Prisma/bcrypt) ----
  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { ok: boolean; user?: CurrentUser };
    if (data.ok && data.user) {
      setCurrentUser(data.user);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser)
      return { success: false, message: "No user is logged in." };

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: currentUser.email,
        oldPassword,
        newPassword,
      }),
    });
    return (await res.json()) as { success: boolean; message: string };
  };

  // ---- Blog methods ----
  const addBlogPost = (post: Omit<BlogPost, "id" | "slug" | "date">) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now(),
      date: new Date().toISOString(),
      slug: post.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, ""),
    };
    setBlogPosts((prev) => [newPost, ...prev]);
  };
  const updateBlogPost = (updated: BlogPost) =>
    setBlogPosts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  const deleteBlogPost = (id: number) =>
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));

  // ---- Category methods ----
  const addCategory = (name: string) =>
    setCategories((prev) => [...prev, { id: Date.now(), name }]);
  const updateCategory = (updated: Category) =>
    setCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  const deleteCategory = (id: number) =>
    setCategories((prev) => prev.filter((c) => c.id !== id));

  // ---- Tag methods ----
  const addTag = (name: string) =>
    setTags((prev) => [...prev, { id: Date.now(), name }]);
  const updateTag = (updated: Tag) =>
    setTags((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  const deleteTag = (id: number) =>
    setTags((prev) => prev.filter((t) => t.id !== id));

  // ---- Portfolio methods ----
  const addPortfolioItem = (item: Omit<PortfolioItem, "id">) =>
    setPortfolioItems((prev) => [{ ...item, id: Date.now() }, ...prev]);
  const updatePortfolioItem = (updated: PortfolioItem) =>
    setPortfolioItems((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i))
    );
  const deletePortfolioItem = (id: number) =>
    setPortfolioItems((prev) => prev.filter((i) => i.id !== id));

  // ---- Hero / About methods ----
  const updateHeroSlides = (slides: HeroSlide[]) => setHeroSlides(slides);
  const updateAboutContent = (content: AboutContent) =>
    setAboutContent(content);

  // (Optional) If you want to avoid any flicker while LS loads, uncomment:
  // if (!hydrated) return null;

  const value: AppContextType = {
    isLoggedIn,
    currentUser,
    login,
    logout,
    changePassword,
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    tags,
    addTag,
    updateTag,
    deleteTag,
    portfolioItems,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    heroSlides,
    updateHeroSlides,
    aboutContent,
    updateAboutContent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* ------------------------------------------
   Hook
-------------------------------------------*/
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within an AppProvider");
  return ctx;
}
