import React, { useRef } from 'react';

interface ImageUploadProps {
    label: string;
    currentImage: string;
    onImageChange: (dataUrl: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, currentImage, onImageChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    onImageChange(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
            <div className="mt-1 flex items-center gap-4">
                {currentImage ? (
                    <img src={currentImage} alt="Preview" className="w-20 h-20 object-cover rounded-md bg-slate-200 shadow-inner" />
                ) : (
                    <div className="w-20 h-20 rounded-md bg-slate-200 flex items-center justify-center text-slate-400 text-xs text-center p-1">No Image</div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
                <button
                    type="button"
                    onClick={triggerFileInput}
                    className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Upload Image
                </button>
            </div>
        </div>
    );
};
