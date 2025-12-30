import { createContext, useContext, useState, type ReactNode } from 'react';

export type Move = 'bat' | 'ball' | 'wicket';
export type Result = 'win' | 'lose' | 'draw';

export interface GameHistoryItem {
    round: number;
    userMove: Move;
    cpuMove: Move;
    result: Result;
}

export type GameState = 'LOGIN' | 'PLAYING' | 'GAME_OVER';

interface GameContextType {
    userName: string;
    gameState: GameState;
    scores: { user: number; cpu: number };
    history: GameHistoryItem[];
    round: number;
    lastRoundResult: GameHistoryItem | null;
    login: (name: string) => void;
    playRound: (userMove: Move, cpuMove: Move) => GameHistoryItem | void;
    restart: () => void;
    quit: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

// Bat beats Ball (Shot)
// Ball beats Wicket (Bowled)
// Wicket beats Bat (Hit Wicket)
const WINNING_MOVES: Record<Move, Move> = {
    bat: 'ball',
    ball: 'wicket',
    wicket: 'bat',
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [userName, setUserName] = useState<string>('');
    const [gameState, setGameState] = useState<GameState>('LOGIN');
    const [scores, setScores] = useState({ user: 0, cpu: 0 });
    const [history, setHistory] = useState<GameHistoryItem[]>([]);
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const [lastRoundResult, setLastRoundResult] = useState<GameHistoryItem | null>(null);

    const login = (name: string) => {
        setUserName(name);
        setGameState('PLAYING');
    };

    const determineWinner = (p1: Move, p2: Move): Result => {
        if (p1 === p2) return 'draw';
        if (WINNING_MOVES[p1] === p2) return 'win';
        return 'lose';
    };

    const playRound = (userMove: Move, cpuMove: Move) => {
        if (history.length >= 10) return;

        const result = determineWinner(userMove, cpuMove);

        const newHistoryItem: GameHistoryItem = {
            round: history.length + 1,
            userMove,
            cpuMove,
            result,
        };

        setHistory((prev) => [...prev, newHistoryItem]);
        setLastRoundResult(newHistoryItem);

        if (result === 'win') {
            setScores((prev) => ({ ...prev, user: prev.user + 1 }));
        } else if (result === 'lose') {
            setScores((prev) => ({ ...prev, cpu: prev.cpu + 1 }));
        }

        if (history.length + 1 >= 10) {
            setTimeout(() => {
                setGameState('GAME_OVER');
            }, 2000); // Small delay to show final round result
        }

        return newHistoryItem;
    };

    const restart = () => {
        setScores({ user: 0, cpu: 0 });
        setHistory([]);
        setLastRoundResult(null);
        setGameState('PLAYING');
    };

    const quit = () => {
        setUserName('');
        setScores({ user: 0, cpu: 0 });
        setHistory([]);
        setLastRoundResult(null);
        setGameState('LOGIN');
    };

    return (
        <GameContext.Provider
            value={{
                userName,
                gameState,
                scores,
                history,
                round: history.length + 1,
                lastRoundResult,
                login,
                playRound,
                restart,
                quit,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};
