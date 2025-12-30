import React, { useState, useEffect } from 'react';
import { GameProvider, useGame, type Move } from './context/GameContext';
import { GameScene } from './components/scene/GameScene';
import { LoginScreen } from './components/ui/LoginScreen';
import { HUD } from './components/ui/HUD';
import { GameOverModal } from './components/ui/GameOverModal';
import confetti from 'canvas-confetti';

const GameContent: React.FC = () => {
  const { gameState, playRound, lastRoundResult, scores } = useGame();
  const [isShaking, setIsShaking] = useState(false);
  const [displayedMoves, setDisplayedMoves] = useState<{ user: Move | null, cpu: Move | null }>({ user: null, cpu: null });
  const [selectedMoves, setSelectedMoves] = useState<{ user: Move | null, cpu: Move | null }>({ user: null, cpu: null });

  // Handle Confetti on Win or Game Over
  useEffect(() => {
    if (gameState === 'GAME_OVER' && scores.user > scores.cpu) {
      const duration = 5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [gameState, scores.user, scores.cpu]);

  // Handle Round Win Confetti/Feedback
  useEffect(() => {
    if (lastRoundResult?.result === 'win' && !isShaking) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [lastRoundResult, isShaking]);

  const handlePlay = async (move: Move) => {
    if (isShaking) return;

    // 1. Generate CPU move immediately (ONLY ONCE per round)
    const moves: Move[] = ['bat', 'ball', 'wicket'];
    const cpuMove = moves[Math.floor(Math.random() * 3)];

    // 2. Set selected moves for mystery box display
    setSelectedMoves({ user: move, cpu: cpuMove });

    // 3. Start shaking (mystery boxes will show the selected images)
    setDisplayedMoves({ user: null, cpu: null });
    setIsShaking(true);

    // 4. Shake duration
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 5. Stop shaking
    setIsShaking(false);

    // 6. Play round AFTER shake completes (pass the SAME cpuMove)
    const result = playRound(move, cpuMove);

    // 7. Reveal the models
    if (result) {
      setDisplayedMoves({ user: result.userMove, cpu: result.cpuMove });
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* 3D Background */}
      <GameScene
        userMove={displayedMoves.user}
        cpuMove={displayedMoves.cpu}
        selectedUserMove={selectedMoves.user}
        selectedCpuMove={selectedMoves.cpu}
        isShaking={isShaking}
      />

      {/* UI Overlays */}
      {gameState === 'LOGIN' && <LoginScreen />}

      {/* Show HUD during PLAYING and GAME_OVER (so you can see final score) */}
      {(gameState === 'PLAYING' || gameState === 'GAME_OVER') && (
        <>
          {/* Hide HUD controls if game over, but keep score/history */}
          <HUD onPlay={handlePlay} isAnimating={isShaking} />

          {/* If Game Over, overlay the modal */}
          {gameState === 'GAME_OVER' && <GameOverModal />}

          {/* Action Feedback Toast */}
          {!isShaking && lastRoundResult && gameState === 'PLAYING' && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-4xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] pointer-events-none animate-bounce">
              {/* WIN MESSAGES */}
              {lastRoundResult.result === 'win' && lastRoundResult.userMove === 'bat' && "GREAT SHOT! 🏏"}
              {lastRoundResult.result === 'win' && lastRoundResult.userMove === 'ball' && "BOWLED 'EM! ⚾"}
              {lastRoundResult.result === 'win' && lastRoundResult.userMove === 'wicket' && "HIT WICKET! 🥅"}

              {/* LOSS MESSAGES - Specific scenarios */}
              {lastRoundResult.result === 'lose' && lastRoundResult.userMove === 'wicket' && lastRoundResult.cpuMove === 'ball' && "YOU GOT BOWLED OUT! ❌"}
              {lastRoundResult.result === 'lose' && lastRoundResult.userMove === 'bat' && lastRoundResult.cpuMove === 'wicket' && "HIT WICKET OUT! ❌"}
              {lastRoundResult.result === 'lose' && lastRoundResult.userMove === 'ball' && lastRoundResult.cpuMove === 'bat' && "YOU GOT SHOT! 😢"}

              {/* DRAW MESSAGE */}
              {lastRoundResult.result === 'draw' && "IT'S A DRAW! 🤝"}
            </div>
          )}

          {/* YOU LOSE MATCH ANIMATION (Banner Only, No Confetti) */}
          {gameState === 'GAME_OVER' && scores.cpu > scores.user && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
              <div className="bg-red-600/90 text-white font-black text-8xl px-20 py-10 transform -rotate-6 animate-pulse drop-shadow-2xl border-4 border-white backdrop-blur-sm">
                YOU LOSE
              </div>
            </div>
          )}

          {/* YOU WIN MATCH ANIMATION (Banner + Confetti handled by effect) */}
          {gameState === 'GAME_OVER' && scores.user > scores.cpu && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 flex-col gap-4">
              <div className="bg-yellow-500/90 text-white font-black text-8xl px-20 py-10 transform -rotate-6 animate-pulse drop-shadow-2xl border-4 border-white backdrop-blur-sm">
                VICTORY!
              </div>
            </div>
          )}

          {/* DRAW MATCH ANIMATION */}
          {gameState === 'GAME_OVER' && scores.user === scores.cpu && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
              <div className="bg-blue-500/90 text-white font-black text-8xl px-20 py-10 transform -rotate-6 animate-pulse drop-shadow-2xl border-4 border-white backdrop-blur-sm">
                IT'S A DRAW!
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
