import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Logo } from './Logo';

interface LoginProps {
    setIsAdminView: (isAdmin: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAdminView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAppContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const success = await login(email, password);
        if (!success) {
            setError('Invalid credentials. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-gray-100 z-40 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-2xl text-center">
                <div className="flex justify-center mb-6">
                    <Logo variant="dark" />
                </div>
                <h2 className="text-2xl font-bold text-slate-700 mb-2">Admin Access</h2>
                <p className="text-slate-500 mb-6">Please enter your credentials to manage the site.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full p-3 border border-slate-600 bg-slate-800 text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-slate-400"
                        aria-label="Email for admin access"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        placeholder="Password"
                        className="w-full p-3 border border-slate-600 bg-slate-800 text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-slate-400"
                        aria-label="Password for admin access"
                        required
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors font-semibold disabled:bg-indigo-300"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6">
                    <button
                        onClick={() => setIsAdminView(false)}
                        className="text-slate-500 hover:text-indigo-600 text-sm transition-colors"
                    >
                        &larr; Back to Site
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;