import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { PortfolioItem } from '../types';
import { EditIcon, DeleteIcon } from './icons';
import { ImageUpload } from './ImageUpload';

const emptyFormState: Omit<PortfolioItem, 'id'> = {
    title: '',
    category: 0,
    imageUrl: '',
    description: '',
};

const ManagePortfolio = () => {
    const { portfolioItems, categories, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
    const [formData, setFormData] = useState<Omit<PortfolioItem, 'id'>>(emptyFormState);

    const openModal = (item: PortfolioItem | null = null) => {
        if (item) {
            setEditingItem(item);
            setFormData(item);
        } else {
            setEditingItem(null);
            setFormData({ ...emptyFormState, category: categories[0]?.id || 0 });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData(emptyFormState);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'category' ? parseInt(value, 10) : value }));
    };

    const handleImageChange = (dataUrl: string) => {
        setFormData(prev => ({ ...prev, imageUrl: dataUrl }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            updatePortfolioItem({ ...editingItem, ...formData });
        } else {
            addPortfolioItem(formData);
        }
        closeModal();
    };

    const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || 'Uncategorized';
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Manage Portfolio</h3>
                <button onClick={() => openModal()} className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Add New Item</button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolioItems.map(item => (
                        <div key={item.id} className="border rounded-lg overflow-hidden shadow">
                           <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                           <div className="p-4">
                                <h4 className="font-bold text-lg">{item.title}</h4>
                                <p className="text-sm text-slate-500 mb-2">{getCategoryName(item.category)}</p>
                                <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                           </div>
                           <div className="p-2 bg-gray-50 border-t flex justify-end gap-2">
                                <button onClick={() => openModal(item)} className="text-blue-500 hover:text-blue-700 p-1"><EditIcon /></button>
                                <button onClick={() => deletePortfolioItem(item.id)} className="text-red-500 hover:text-red-700 p-1"><DeleteIcon /></button>
                           </div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                                <h4 className="text-xl font-bold mb-4">{editingItem ? 'Edit' : 'Add'} Portfolio Item</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" required>
                                            <option value={0} disabled>Select a category</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                    <ImageUpload
                                        label="Image"
                                        currentImage={formData.imageUrl}
                                        onImageChange={handleImageChange}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" required />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 flex justify-end gap-2">
                                <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">{editingItem ? 'Save Changes' : 'Add Item'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePortfolio;
