import React from 'react';
import { useGame } from '../../context/GameContext';
import { RotateCcw, Trophy, Frown, LogOut } from 'lucide-react';

export const GameOverModal: React.FC = () => {
    const { scores, userName, restart, quit } = useGame();
    const userWon = scores.user > scores.cpu;

    return (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-10 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center max-w-lg text-center transform hover:scale-[1.01] transition-transform duration-500">

                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl ${userWon ? 'bg-gradient-to-tr from-yellow-300 to-amber-500' : 'bg-gray-700'
                    }`}>
                    {userWon ? <Trophy size={48} className="text-white drop-shadow-md" /> : <Frown size={48} className="text-gray-400" />}
                </div>

                <h2 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    {userWon ? `${userName} WINS!` : 'COMPUTER WINS'}
                </h2>

                <p className="text-gray-400 mb-8 text-lg font-medium">
                    {userWon
                        ? "Legendary victory! What a match!"
                        : "Better luck next time!"}
                </p>

                <div className="flex gap-4 mb-8 w-full justify-center">
                    <div className="flex flex-col items-center bg-black/30 p-4 rounded-xl min-w-[100px] border border-white/5">
                        <span className="text-sm text-gray-500 font-bold uppercase">You</span>
                        <span className="text-4xl font-bold text-white">{scores.user}</span>
                    </div>
                    <div className="text-2xl font-black text-gray-600 self-center">VS</div>
                    <div className="flex flex-col items-center bg-black/30 p-4 rounded-xl min-w-[100px] border border-white/5">
                        <span className="text-sm text-gray-500 font-bold uppercase">CPU</span>
                        <span className="text-4xl font-bold text-white">{scores.cpu}</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={restart}
                        className="flex items-center gap-2 px-6 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                    >
                        <RotateCcw size={20} />
                        Same Player
                    </button>
                    <button
                        onClick={quit}
                        className="flex items-center gap-2 px-6 py-4 rounded-xl bg-gray-700 text-white font-bold text-lg hover:bg-gray-600 transition-colors shadow-lg"
                    >
                        <LogOut size={20} />
                        New Player
                    </button>
                </div>
            </div>
        </div>
    );
};
