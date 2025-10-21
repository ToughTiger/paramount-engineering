import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Logo } from './Logo';
import { LogoutIcon, AiSparkleIcon, EditIcon, DeleteIcon } from './icons';
import ManagePortfolio from './ManagePortfolio';
import ManageCategoriesAndTags from './ManageCategoriesAndTags';
import ManageHeroSlider from './ManageHeroSlider';
import ManageAbout from './ManageAbout';
import ManageSettings from './ManageSettings';
import { BlogPost } from '../types';
// import { generateBlogPostContent } from '../services/geminiService';
import { ImageUpload } from './ImageUpload';

type AdminView = 'blog' | 'portfolio' | 'categories' | 'hero' | 'about' | 'settings';

// --- Blog Management Component (defined within AdminPanel.tsx) ---
const ManageBlog = () => {
    const { blogPosts, categories, tags, addBlogPost, updateBlogPost, deleteBlogPost } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

    const emptyFormState = {
        title: '',
        author: 'Admin',
        imageUrl: '',
        category: categories[0]?.id || 0,
        tags: [],
        content: '',
    };
    const [formData, setFormData] = useState<Omit<BlogPost, 'id' | 'slug' | 'date'>>(emptyFormState);
    const [aiTopic, setAiTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const openModal = (post: BlogPost | null = null) => {
        if (post) {
            setEditingPost(post);
            setFormData({
                title: post.title,
                author: post.author,
                imageUrl: post.imageUrl,
                category: post.category,
                tags: post.tags,
                content: post.content,
            });
        } else {
            setEditingPost(null);
            setFormData(emptyFormState);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
        setFormData(emptyFormState);
        setAiTopic('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'category' ? parseInt(value, 10) : value }));
    };
    
    const handleImageChange = (dataUrl: string) => {
        setFormData(prev => ({...prev, imageUrl: dataUrl}));
    };

    const handleTagChange = (tagId: number) => {
        setFormData(prev => {
            const newTags = prev.tags.includes(tagId)
                ? prev.tags.filter(t => t !== tagId)
                : [...prev.tags, tagId];
            return { ...prev, tags: newTags };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPost) {
            const updatedPost: BlogPost = {
                ...editingPost,
                ...formData,
                slug: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            };
            updateBlogPost(updatedPost);
        } else {
            addBlogPost(formData);
        }
        closeModal();
    };

    // const handleGenerateContent = async () => {
    //     if (!aiTopic) return;
    //     setIsGenerating(true);
    //     const content = await generateBlogPostContent(aiTopic);
    //     setFormData(prev => ({...prev, title: aiTopic, content: content}));
    //     setIsGenerating(false);
    // };

    const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || 'Uncategorized';
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Manage Blog Posts</h3>
                <button onClick={() => openModal()} className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Add New Post</button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogPosts.map(post => (
                        <div key={post.id} className="border rounded-lg overflow-hidden shadow">
                            <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
                           <div className="p-4">
                                <p className="text-sm text-lime-600 font-semibold">{getCategoryName(post.category)}</p>
                                <h4 className="font-bold text-lg my-1">{post.title}</h4>
                                <p className="text-xs text-slate-500 mb-2">by {post.author} on {new Date(post.date).toLocaleDateString()}</p>
                                <p className="text-sm text-slate-600 line-clamp-2">{post.content}</p>
                           </div>
                           <div className="p-2 bg-gray-50 border-t flex justify-end gap-2">
                                <button onClick={() => openModal(post)} className="text-blue-500 hover:text-blue-700 p-1"><EditIcon /></button>
                                <button onClick={() => deleteBlogPost(post.id)} className="text-red-500 hover:text-red-700 p-1"><DeleteIcon /></button>
                           </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                                <h4 className="text-xl font-bold mb-4">{editingPost ? 'Edit' : 'Add'} Blog Post</h4>
                                
                                <div className="p-3 mb-4 bg-slate-100 rounded-md border border-slate-200">
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Generate content with AI</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={aiTopic}
                                            onChange={(e) => setAiTopic(e.target.value)}
                                            placeholder="Enter a blog post topic..." 
                                            className="flex-grow p-2 border border-slate-600 bg-slate-800 text-white rounded-md placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {/* <button 
                                            type="button" 
                                            onClick={handleGenerateContent}
                                            disabled={isGenerating || !aiTopic}
                                            className="bg-lime-500 text-white p-2 rounded-md hover:bg-lime-600 disabled:bg-lime-300 flex items-center gap-2"
                                        >
                                            <AiSparkleIcon />
                                            {isGenerating ? 'Generating...' : 'Generate'} */}
                                        {/* </button> */}
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" required />
                                        <input type="text" name="author" placeholder="Author" value={formData.author} onChange={handleChange} className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" required />
                                    </div>
                                    <ImageUpload
                                        label="Featured Image"
                                        currentImage={formData.imageUrl}
                                        onImageChange={handleImageChange}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" required>
                                            <option value={0} disabled>Select a category</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                     <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Tags</label>
                                        <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                                            {tags.map(tag => (
                                                <button key={tag.id} type="button" onClick={() => handleTagChange(tag.id)} className={`px-3 py-1 text-sm rounded-full ${formData.tags.includes(tag.id) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                                    {tag.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <textarea name="content" placeholder="Blog content..." value={formData.content} onChange={handleChange} rows={10} className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" required />
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 flex justify-end gap-2">
                                <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">{editingPost ? 'Save Changes' : 'Publish Post'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Admin Panel Component ---
const AdminPanel = () => {
    const { logout, currentUser } = useAppContext();
    const [activeView, setActiveView] = useState<AdminView>('blog');

    const NavLink = ({ view, children }: { view: AdminView, children: React.ReactNode }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`w-full text-left px-4 py-2 rounded-md ${activeView === view ? 'bg-indigo-600 text-white' : 'hover:bg-gray-200'}`}
        >
            {children}
        </button>
    );

    const renderActiveView = () => {
        switch (activeView) {
            case 'blog': return <ManageBlog />;
            case 'portfolio': return <ManagePortfolio />;
            case 'categories': return <ManageCategoriesAndTags />;
            case 'hero': return <ManageHeroSlider />;
            case 'about': return <ManageAbout />;
            case 'settings': return <ManageSettings />;
            default: return <ManageBlog />;
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-100 z-40 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white p-4 flex flex-col shadow-lg">
                <div className="mb-8">
                    <Logo variant="dark" />
                </div>
                <nav className="flex-grow space-y-2">
                    <NavLink view="blog">Blog Posts</NavLink>
                    <NavLink view="portfolio">Portfolio</NavLink>
                    <NavLink view="categories">Categories & Tags</NavLink>
                    <NavLink view="hero">Hero Slider</NavLink>
                    <NavLink view="about">About Page</NavLink>
                    <NavLink view="settings">Settings</NavLink>
                </nav>
                <div className="mt-auto">
                    <div className="border-t pt-4 text-sm text-slate-600">
                        <p>Logged in as:</p>
                        <p className="font-semibold text-slate-800 truncate">{currentUser?.email}</p>
                    </div>
                    <button onClick={logout} className="w-full mt-4 flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
                        <LogoutIcon />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {renderActiveView()}
            </main>
        </div>
    );
};

export default AdminPanel;
