import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Stars } from '@react-three/drei';
import { Hand } from './Hand';
import type { Move } from '../../context/GameContext';

interface GameSceneProps {
    userMove: Move | null;
    cpuMove: Move | null;
    selectedUserMove: Move | null;
    selectedCpuMove: Move | null;
    isShaking: boolean;
}

const WINNING_MOVES: Record<Move, Move> = {
    bat: 'ball',
    ball: 'wicket',
    wicket: 'bat',
};

export const GameScene: React.FC<GameSceneProps> = ({ userMove, cpuMove, selectedUserMove, selectedCpuMove, isShaking }) => {

    // Determine winner purely for visual passing
    // Logic duped from Context, but purely for stateless render if needed, or we could pass result
    // But passing just moves is enough to derive:
    let playerOutcome: 'winner' | 'loser' | 'draw' | null = null;
    let victoryMove: Move | undefined;

    if (userMove && cpuMove) {
        if (userMove === cpuMove) playerOutcome = 'draw';
        else if (WINNING_MOVES[userMove] === cpuMove) {
            playerOutcome = 'winner';
            victoryMove = userMove;
        } else {
            playerOutcome = 'loser';
            victoryMove = cpuMove;
        }
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const handXPosition = isMobile ? 1.5 : 2.5;
    const cameraZ = isMobile ? 12 : 8;

    return (
        <div className="w-full h-full absolute top-0 left-0 -z-10">
            <Canvas camera={{ position: [0, 0, cameraZ], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <Suspense fallback={null}>
                    {/* Player (Left) */}
                    <Hand
                        move={userMove}
                        selectedMove={selectedUserMove}
                        position={[-handXPosition, 0, 0]}
                        isLeft={true}
                        isShaking={isShaking}
                        outcome={playerOutcome}
                        winningMove={victoryMove}
                    />

                    {/* CPU (Right) */}
                    <Hand
                        move={cpuMove}
                        selectedMove={selectedCpuMove}
                        position={[handXPosition, 0, 0]}
                        isLeft={false}
                        isShaking={isShaking}
                        outcome={playerOutcome === 'winner' ? 'loser' : playerOutcome === 'loser' ? 'winner' : playerOutcome}
                        winningMove={victoryMove}
                    />

                    <Environment preset="city" />
                </Suspense>

                <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={2 * Math.PI / 3} />
            </Canvas>
        </div>
    );
};
