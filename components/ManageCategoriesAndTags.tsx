import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Category, Tag } from '../types';
import { EditIcon, DeleteIcon } from './icons';

const ManageCategoriesAndTags = () => {
    // Category state and handlers
    const { categories, addCategory, updateCategory, deleteCategory } = useAppContext();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            if (editingCategory.name.trim()) {
                updateCategory(editingCategory);
                setEditingCategory(null);
            }
        } else {
            if (newCategoryName.trim()) {
                addCategory(newCategoryName.trim());
                setNewCategoryName('');
            }
        }
    };
    
    // Tag state and handlers
    const { tags, addTag, updateTag, deleteTag } = useAppContext();
    const [newTagName, setNewTagName] = useState('');
    const [editingTag, setEditingTag] = useState<Tag | null>(null);

    const handleTagSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTag) {
            if (editingTag.name.trim()) {
                updateTag(editingTag);
                setEditingTag(null);
            }
        } else {
            if (newTagName.trim()) {
                addTag(newTagName.trim());
                setNewTagName('');
            }
        }
    };

    return (
        <div>
            <h3 className="text-2xl font-bold mb-6">Manage Categories & Tags</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Categories Section */}
                <div>
                    <h4 className="text-xl font-bold mb-4 text-slate-700">Categories</h4>
                    <form onSubmit={handleCategorySubmit} className="bg-white p-4 rounded-lg shadow-md mb-6 flex gap-2">
                        <input
                            type="text"
                            placeholder={editingCategory ? "Edit category name..." : "New category name..."}
                            value={editingCategory ? editingCategory.name : newCategoryName}
                            onChange={e => editingCategory ? setEditingCategory({...editingCategory, name: e.target.value}) : setNewCategoryName(e.target.value)}
                            className="flex-grow p-2 border border-slate-600 bg-slate-800 text-white rounded-md placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">{editingCategory ? 'Update' : 'Add'}</button>
                        {editingCategory && <button type="button" onClick={() => setEditingCategory(null)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>}
                    </form>
                    <div className="space-y-2">
                        {categories.map(cat => (
                            <div key={cat.id} className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
                                <span className="text-slate-800">{cat.name}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingCategory(cat)} className="text-blue-500 hover:text-blue-700 p-1"><EditIcon /></button>
                                    <button onClick={() => deleteCategory(cat.id)} className="text-red-500 hover:text-red-700 p-1"><DeleteIcon /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tags Section */}
                <div>
                    <h4 className="text-xl font-bold mb-4 text-slate-700">Tags</h4>
                     <form onSubmit={handleTagSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6 flex gap-2">
                        <input
                            type="text"
                            placeholder={editingTag ? "Edit tag name..." : "New tag name..."}
                            value={editingTag ? editingTag.name : newTagName}
                            onChange={e => editingTag ? setEditingTag({...editingTag, name: e.target.value}) : setNewTagName(e.target.value)}
                            className="flex-grow p-2 border border-slate-600 bg-slate-800 text-white rounded-md placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">{editingTag ? 'Update' : 'Add'}</button>
                        {editingTag && <button type="button" onClick={() => setEditingTag(null)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>}
                    </form>
                    <div className="space-y-2">
                        {tags.map(tag => (
                            <div key={tag.id} className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
                                <span className="text-slate-800">{tag.name}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingTag(tag)} className="text-blue-500 hover:text-blue-700 p-1"><EditIcon /></button>
                                    <button onClick={() => deleteTag(tag.id)} className="text-red-500 hover:text-red-700 p-1"><DeleteIcon /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCategoriesAndTags;