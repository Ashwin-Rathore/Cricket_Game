import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Play } from 'lucide-react';

export const LoginScreen: React.FC = () => {
    const { login } = useGame();
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            login(name.trim());
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
            <div className="bg-white/10 p-8 rounded-2xl border border-white/20 shadow-2xl w-full max-w-md backdrop-blur-md animate-fade-in">
                <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                    RPS 3D Arena
                </h1>
                <p className="text-gray-300 text-center mb-8">Enter the arena, challenger.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-6 py-4 bg-black/30 rounded-xl border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-lg text-center"
                        autoFocus
                    />

                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl font-bold text-white text-lg hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
                    >
                        Play Game
                        <Play size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};
