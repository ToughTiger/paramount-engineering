import React, { useState } from 'react';
import { useAppContext } from '../AppContext';

const ManageSettings = () => {
    const { changePassword, currentUser } = useAppContext();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
            return;
        }
        
        setIsLoading(true);
        const result = await changePassword(oldPassword, newPassword);
        setIsLoading(false);

        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };

    return (
        <div>
            <h3 className="text-2xl font-bold mb-6">Account Settings</h3>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg space-y-4">
                <h4 className="text-xl font-semibold text-slate-700">Change Password</h4>
                <p className="text-sm text-slate-500">
                    You are logged in as <span className="font-semibold text-indigo-600">{currentUser?.email}</span>.
                </p>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Old Password</label>
                    <input 
                        type="password" 
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">New Password</label>
                    <input 
                        type="password" 
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Confirm New Password</label>
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border border-slate-600 bg-slate-800 text-white rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" 
                        required 
                    />
                </div>
                {message && (
                    <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message.text}
                    </p>
                )}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                    {isLoading ? 'Updating...' : 'Change Password'}
                </button>
            </form>
        </div>
    );
};

export default ManageSettings;