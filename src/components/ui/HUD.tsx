import { motion, AnimatePresence } from 'framer-motion';

import { useGame, type Move } from '../../context/GameContext';

const MOVE_EMOJIS: Record<Move, string> = {
    bat: '🏏',
    ball: '⚾',
    wicket: '🥅',
};

export const HUD: React.FC<{ onPlay: (move: Move) => void, isAnimating: boolean }> = ({ onPlay, isAnimating }) => {
    const { userName, scores, history, round } = useGame();

    // Determine what to show in the "Black Boxes"
    // If we have a result for this round, show it. Otherwise show just score/name.
    // Since history updates immediately, the last item in history is the current round result.
    const currentResult = history.length > 0 && history[history.length - 1].round === round - 1 ? history[history.length - 1] : null;

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">

            {/* Top Bar: Scores */}
            <div className="flex justify-between items-start pointer-events-auto">
                {/* PLAYER CARD */}
                <div className="flex flex-col items-center bg-black/40 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 shadow-lg min-w-[140px] transition-all">
                    <span className="text-sm text-gray-400 font-bold tracking-wider mb-1">PLAYER</span>
                    <span className="text-violet-400 font-bold text-xl mb-1">{userName}</span>
                    <span className="text-4xl font-black text-white">{scores.user}</span>
                    {/* Selected Option Display */}
                    {currentResult && !isAnimating && (
                        <div className="mt-2 text-2xl animate-fade-in flex flex-col items-center">
                            <span>{MOVE_EMOJIS[currentResult.userMove]}</span>
                            <span className="text-[10px] uppercase text-gray-400 tracking-widest">{currentResult.userMove}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center mt-2">
                    <div className="px-4 py-1 bg-white/10 rounded-full text-xs font-bold text-gray-300 tracking-widest backdrop-blur-sm border border-white/5">
                        ROUND {Math.min(round, 10)} / 10
                    </div>
                </div>

                {/* CPU CARD */}
                <div className="flex flex-col items-center bg-black/40 backdrop-blur-md px-6 py-3 rounded-xl border border-white/5 shadow-lg min-w-[140px] transition-all">
                    <span className="text-sm text-gray-400 font-bold tracking-wider mb-1">CPU</span>
                    <span className="text-rose-400 font-bold text-xl mb-1">Computer</span>
                    <span className="text-4xl font-black text-white">{scores.cpu}</span>
                    {/* Selected Option Display */}
                    {currentResult && !isAnimating && (
                        <div className="mt-2 text-2xl animate-fade-in flex flex-col items-center">
                            <span>{MOVE_EMOJIS[currentResult.cpuMove]}</span>
                            <span className="text-[10px] uppercase text-gray-400 tracking-widest">{currentResult.cpuMove}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* History Sidebar (Left) */}
            <div className="absolute top-32 left-6 bottom-32 w-64 pointer-events-auto overflow-hidden flex flex-col gap-2">
                <AnimatePresence mode='popLayout'>
                    {history.slice().reverse().map((item) => (
                        <motion.div
                            key={item.round}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex items-center justify-between px-4 py-2 rounded-lg border backdrop-blur-sm text-sm ${item.result === 'win' ? 'bg-green-500/20 border-green-500/30 text-green-200' :
                                item.result === 'lose' ? 'bg-red-500/20 border-red-500/30 text-red-200' :
                                    'bg-yellow-500/20 border-yellow-500/30 text-yellow-200'
                                }`}
                        >
                            <span className="font-bold opacity-60">#{item.round}</span>
                            <div className="flex gap-2 text-lg">
                                <span>{MOVE_EMOJIS[item.userMove]}</span>
                                <span className="text-xs flex items-center opacity-50">vs</span>
                                <span>{MOVE_EMOJIS[item.cpuMove]}</span>
                            </div>
                            <span className="font-bold uppercase text-xs tracking-wider">{item.result}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="flex justify-center items-end pb-8 pointer-events-auto">
                <div className="flex gap-6">
                    {!isAnimating ? (
                        <>
                            <GameButton emoji="🏏" label="BAT" color="from-amber-700 to-orange-900" onClick={() => onPlay('bat')} />
                            <GameButton emoji="⚾" label="BALL" color="from-red-600 to-rose-700" onClick={() => onPlay('ball')} />
                            <GameButton emoji="🥅" label="WICKET" color="from-yellow-500 to-amber-600" onClick={() => onPlay('wicket')} />
                        </>
                    ) : (
                        <div className="text-2xl font-bold italic text-white animate-pulse">
                            PLAYING...
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

const GameButton: React.FC<{ emoji: string; label: string; color: string; onClick: () => void }> = ({ emoji, label, color, onClick }) => (
    <button
        onClick={onClick}
        className={`group relative flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br ${color} shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all active:scale-95`}
    >
        <span className="text-4xl drop-shadow-md mb-1 transition-transform group-hover:scale-110">{emoji}</span>
        <span className="text-[10px] font-black tracking-widest text-white/90">{label}</span>
        <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
    </button>
);
