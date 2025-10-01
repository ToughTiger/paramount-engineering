import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from './services/authService';
import { 
    BlogPost, 
    Category, 
    Tag, 
    PortfolioItem, 
    HeroSlide, 
    AboutContent, 
    CurrentUser 
} from './types';
import { 
    initialBlogPosts, 
    initialCategories, 
    initialTags, 
    initialPortfolioItems, 
    initialHeroSlides, 
    initialAboutContent 
} from './services/initialData';

// --- Helper functions for localStorage ---
const getLocalStorage = (key: string, defaultValue: any) => {
    try {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
        console.error(`Error reading localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const setLocalStorage = (key: string, value: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
    }
};


interface AppContextType {
    // Auth
    isLoggedIn: boolean;
    currentUser: CurrentUser | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string; }>;

    // Blog
    blogPosts: BlogPost[];
    addBlogPost: (post: Omit<BlogPost, 'id' | 'slug' | 'date'>) => void;
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
    addPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => void;
    updatePortfolioItem: (item: PortfolioItem) => void;
    deletePortfolioItem: (id: number) => void;

    // Hero Slides
    heroSlides: HeroSlide[];
    updateHeroSlides: (slides: HeroSlide[]) => void;
    
    // About Content
    aboutContent: AboutContent;
    updateAboutContent: (content: AboutContent) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // --- STATE MANAGEMENT ---
    // Auth
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getLocalStorage('currentUser', null));
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => getLocalStorage('currentUser', null));

    // Content
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => getLocalStorage('blogPosts', initialBlogPosts));
    const [categories, setCategories] = useState<Category[]>(() => getLocalStorage('categories', initialCategories));
    const [tags, setTags] = useState<Tag[]>(() => getLocalStorage('tags', initialTags));
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => getLocalStorage('portfolioItems', initialPortfolioItems));
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => getLocalStorage('heroSlides', initialHeroSlides));
    const [aboutContent, setAboutContent] = useState<AboutContent>(() => getLocalStorage('aboutContent', initialAboutContent));

    // --- PERSISTENCE ---
    useEffect(() => { setLocalStorage('currentUser', currentUser); }, [currentUser]);
    useEffect(() => { setLocalStorage('blogPosts', blogPosts); }, [blogPosts]);
    useEffect(() => { setLocalStorage('categories', categories); }, [categories]);
    useEffect(() => { setLocalStorage('tags', tags); }, [tags]);
    useEffect(() => { setLocalStorage('portfolioItems', portfolioItems); }, [portfolioItems]);
    useEffect(() => { setLocalStorage('heroSlides', heroSlides); }, [heroSlides]);
    useEffect(() => { setLocalStorage('aboutContent', aboutContent); }, [aboutContent]);
    // useEffect(() => { authService.seed(); }, []);


    // --- AUTH METHODS ---
    const login = async (email: string, password: string): Promise<boolean> => {
        const user = await authService.login(email, password);
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
        if (!currentUser) return { success: false, message: 'No user is logged in.' };
        return authService.changePassword(currentUser.email, oldPassword, newPassword);
    };

    // --- BLOG POST METHODS ---
    const addBlogPost = (post: Omit<BlogPost, 'id' | 'slug' | 'date'>) => {
        const newPost: BlogPost = {
            ...post,
            id: Date.now(),
            date: new Date().toISOString(),
            slug: post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        };
        setBlogPosts(prev => [newPost, ...prev]);
    };

    const updateBlogPost = (updatedPost: BlogPost) => {
        setBlogPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    };

    const deleteBlogPost = (id: number) => {
        setBlogPosts(prev => prev.filter(p => p.id !== id));
    };

    // --- CATEGORY METHODS ---
    const addCategory = (name: string) => {
        const newCategory: Category = { id: Date.now(), name };
        setCategories(prev => [...prev, newCategory]);
    };

    const updateCategory = (updatedCategory: Category) => {
        setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
    };

    const deleteCategory = (id: number) => {
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    // --- TAG METHODS ---
    const addTag = (name: string) => {
        const newTag: Tag = { id: Date.now(), name };
        setTags(prev => [...prev, newTag]);
    };

    const updateTag = (updatedTag: Tag) => {
        setTags(prev => prev.map(t => t.id === updatedTag.id ? updatedTag : t));
    };

    const deleteTag = (id: number) => {
        setTags(prev => prev.filter(t => t.id !== id));
    };

    // --- PORTFOLIO METHODS ---
    const addPortfolioItem = (item: Omit<PortfolioItem, 'id'>) => {
        const newItem: PortfolioItem = { ...item, id: Date.now() };
        setPortfolioItems(prev => [newItem, ...prev]);
    };

    const updatePortfolioItem = (updatedItem: PortfolioItem) => {
        setPortfolioItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
    };

    const deletePortfolioItem = (id: number) => {
        setPortfolioItems(prev => prev.filter(i => i.id !== id));
    };
    
    // --- HERO SLIDER METHODS ---
    const updateHeroSlides = (slides: HeroSlide[]) => {
        setHeroSlides(slides);
    };

    // --- ABOUT CONTENT METHODS ---
    const updateAboutContent = (content: AboutContent) => {
        setAboutContent(content);
    };

    const value = {
        isLoggedIn, currentUser, login, logout, changePassword,
        blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
        categories, addCategory, updateCategory, deleteCategory,
        tags, addTag, updateTag, deleteTag,
        portfolioItems, addPortfolioItem, updatePortfolioItem, deletePortfolioItem,
        heroSlides, updateHeroSlides,
        aboutContent, updateAboutContent,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
