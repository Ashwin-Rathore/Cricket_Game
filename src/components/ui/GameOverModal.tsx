import React from 'react';
import { useGame } from '../../context/GameContext';
import { RotateCcw, Trophy, Frown, LogOut } from 'lucide-react';

export const GameOverModal: React.FC = () => {
    const { scores, userName, restart, quit } = useGame();
    const userWon = scores.user > scores.cpu;

    return (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md animate-fade-in p-4">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center w-full max-w-lg text-center transform hover:scale-[1.01] transition-transform duration-500">

                <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-xl ${userWon ? 'bg-gradient-to-tr from-yellow-300 to-amber-500' : 'bg-gray-700'
                    }`}>
                    {userWon ? <Trophy size={32} className="sm:size-[48px] text-white drop-shadow-md" /> : <Frown size={32} className="sm:size-[48px] text-gray-400" />}
                </div>

                <h2 className="text-3xl sm:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    {userWon ? `${userName} WINS!` : 'COMPUTER WINS'}
                </h2>

                <p className="text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg font-medium">
                    {userWon
                        ? "Legendary victory! What a match!"
                        : "Better luck next time!"}
                </p>

                <div className="flex gap-4 mb-6 sm:mb-8 w-full justify-center">
                    <div className="flex flex-col items-center bg-black/30 p-3 sm:p-4 rounded-xl min-w-[80px] sm:min-w-[100px] border border-white/5">
                        <span className="text-[10px] sm:text-sm text-gray-500 font-bold uppercase">You</span>
                        <span className="text-2xl sm:text-4xl font-bold text-white">{scores.user}</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-gray-600 self-center">VS</div>
                    <div className="flex flex-col items-center bg-black/30 p-3 sm:p-4 rounded-xl min-w-[80px] sm:min-w-[100px] border border-white/5">
                        <span className="text-[10px] sm:text-sm text-gray-500 font-bold uppercase">CPU</span>
                        <span className="text-2xl sm:text-4xl font-bold text-white">{scores.cpu}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                    <button
                        onClick={restart}
                        className="flex items-center justify-center gap-2 px-6 py-3 sm:py-4 rounded-xl bg-white text-black font-bold text-base sm:text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 w-full sm:w-auto"
                    >
                        <RotateCcw size={18} />
                        Same Player
                    </button>
                    <button
                        onClick={quit}
                        className="flex items-center justify-center gap-2 px-6 py-3 sm:py-4 rounded-xl bg-gray-700 text-white font-bold text-base sm:text-lg hover:bg-gray-600 transition-colors shadow-lg w-full sm:w-auto"
                    >
                        <LogOut size={18} />
                        New Player
                    </button>
                </div>
            </div>
        </div>
    );
};
