import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { HeroSlide } from '../types';
import { DeleteIcon } from './icons';
import { ImageUpload } from './ImageUpload';

const ManageHeroSlider = () => {
    const { heroSlides, updateHeroSlides } = useAppContext();
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Deep copy to avoid direct mutation of context state
        setSlides(JSON.parse(JSON.stringify(heroSlides)));
    }, [heroSlides]);

    const handleSlideChange = (index: number, field: keyof Omit<HeroSlide, 'id'>, value: string) => {
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], [field]: value };
        setSlides(newSlides);
    };

    const addSlide = () => {
        const newSlide: HeroSlide = {
            id: Date.now(),
            imageUrl: '',
            title: 'New Slide Title',
            subtitle: 'New slide subtitle.',
        };
        setSlides([...slides, newSlide]);
    };

    const deleteSlide = (id: number) => {
        setSlides(slides.filter(slide => slide.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');
        updateHeroSlides(slides);
        
        setTimeout(() => {
            setIsSaving(false);
            setMessage('Hero slides updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        }, 1000);
    };

    return (
        <div>
            <h3 className="text-2xl font-bold mb-6">Manage Hero Slider</h3>
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {slides.map((slide, index) => (
                        <div key={slide.id} className="bg-white p-4 rounded-lg shadow-md relative">
                            <button
                                type="button"
                                onClick={() => deleteSlide(slide.id)}
                                className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
                                aria-label="Delete slide"
                            >
                                <DeleteIcon />
                            </button>
                            <div className="space-y-4">
                                <ImageUpload
                                    label={`Slide ${index + 1} Image`}
                                    currentImage={slide.imageUrl}
                                    onImageChange={(dataUrl) => handleSlideChange(index, 'imageUrl', dataUrl)}
                                />
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={slide.title}
                                        onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
                                        className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Slide Title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Subtitle</label>
                                    <input
                                        type="text"
                                        value={slide.subtitle}
                                        onChange={(e) => handleSlideChange(index, 'subtitle', e.target.value)}
                                        className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Slide Subtitle"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={addSlide}
                        className="bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700"
                    >
                        Add New Slide
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        {isSaving ? 'Saving...' : 'Save All Changes'}
                    </button>
                     {message && <p className="text-green-600 text-sm">{message}</p>}
                </div>
            </form>
        </div>
    );
};

export default ManageHeroSlider;
