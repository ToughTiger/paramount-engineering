import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { AboutContent } from '../types';
import { ImageUpload } from './ImageUpload';

const ManageAbout = () => {
    const { aboutContent, updateAboutContent } = useAppContext();
    const [formData, setFormData] = useState<AboutContent>(aboutContent);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setFormData(aboutContent);
    }, [aboutContent]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageChange = (dataUrl: string) => {
        setFormData(prev => ({ ...prev, imageUrl: dataUrl }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');
        updateAboutContent(formData);
        
        setTimeout(() => {
            setIsSaving(false);
            setMessage('About page content updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        }, 1000);
    };

    return (
        <div>
            <h3 className="text-2xl font-bold mb-6">Manage About Page</h3>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <ImageUpload
                    label="About Section Image"
                    currentImage={formData.imageUrl}
                    onImageChange={handleImageChange}
                />
                <div>
                    <label htmlFor="mission" className="block text-sm font-medium text-slate-600 mb-1">Our Mission</label>
                    <textarea
                        id="mission"
                        name="mission"
                        value={formData.mission}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Describe your company's mission..."
                    />
                </div>
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-slate-600 mb-1">Our Story / Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={6}
                        className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Tell your company's story..."
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {message && <p className="text-green-600 text-sm">{message}</p>}
                </div>
            </form>
        </div>
    );
};

export default ManageAbout;
