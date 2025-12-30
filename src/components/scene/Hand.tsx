import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Group } from 'three';
import type { Move } from '../../context/GameContext';
import * as THREE from 'three';

interface HandProps {
    move: Move | null;
    selectedMove?: Move | null; // Move selected during shake phase
    position: [number, number, number];
    isLeft: boolean; // true for player, false for cpu
    isShaking: boolean;
    outcome?: 'winner' | 'loser' | 'draw' | null;
    winningMove?: Move; // To know what to react to
}

export const Hand: React.FC<HandProps> = ({ move, selectedMove, position, isLeft, isShaking, outcome, winningMove }) => {
    const groupRef = useRef<Group>(null);
    const batRef = useRef<Group>(null);
    const ballRef = useRef<Group>(null);
    const wicketRef = useRef<Group>(null);

    const base = import.meta.env.BASE_URL;
    console.log("Vite Base URL:", base);
    console.log("Loading texture from:", `${base}textures/wicket-texture.png`);

    // Load Textures
    const wicketTexture = useTexture(`${base}textures/wicket-texture.png`);
    wicketTexture.wrapS = THREE.RepeatWrapping;
    wicketTexture.wrapT = THREE.RepeatWrapping;

    // Load icon textures for mystery box display (user's custom images)
    const batIconTexture = useTexture(`${base}textures/bat.png`);
    const ballIconTexture = useTexture(`${base}textures/ball.png`);
    const wicketIconTexture = useTexture(`${base}textures/wicket.png`);

    // Animation refs
    const reactionTime = useRef(0);

    // Reset usage
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.rotation.set(0, 0, 0);
            groupRef.current.position.set(...position);
            reactionTime.current = 0;
        }
    }, [isLeft, position, move, outcome]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Shake animation (Mystery Box State)
        if (isShaking) {
            const time = state.clock.getElapsedTime();
            const yOffset = Math.sin(time * 20) * 0.2;
            groupRef.current.position.y = position[1] + yOffset;
            groupRef.current.rotation.z = Math.sin(time * 20) * 0.1 * (isLeft ? 1 : -1);

            // Box spin
            groupRef.current.rotation.x = Math.sin(time * 5) * 0.1;
        } else if (move) {
            // REVEALED STATE ANIMATIONS
            const time = state.clock.getElapsedTime();

            // Idle Loop for revealed items
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position[1] + Math.sin(time * 2) * 0.1, 0.1);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);

            // --- INTERACTION ANIMATIONS ---
            // If this hand is the WINNER (Bat vs Ball) -> Swing Bat
            if (outcome === 'winner' && move === 'bat' && winningMove === 'bat') {
                // Swing bat
                if (batRef.current) {
                    reactionTime.current += delta * 5;
                    const swing = Math.sin(Math.min(reactionTime.current, Math.PI));
                    batRef.current.rotation.z = isLeft ? -swing * 1.5 : swing * 1.5; // Swing forward
                    batRef.current.rotation.y = swing * 2 * (isLeft ? 1 : -1);
                }
            }

            // If this hand is the LOSER (Ball vs Bat) -> Ball flies away
            if (outcome === 'loser' && move === 'ball' && winningMove === 'bat') {
                // Wait a split second for impact then fly
                if (reactionTime.current < 0.2) {
                    reactionTime.current += delta;
                } else {
                    // Fly away
                    groupRef.current.position.x += (isLeft ? -1 : 1) * delta * 15; // Fly OUTWARDS
                    groupRef.current.position.y += delta * 10; // UP
                    groupRef.current.rotation.x += delta * 10; // Spin wild
                }
            }

            // If winner is Ball vs Wicket -> Spin Ball aggressively
            if (outcome === 'winner' && move === 'ball' && winningMove === 'ball') {
                if (ballRef.current) {
                    reactionTime.current += delta;
                    ballRef.current.position.x += (isLeft ? 1 : -1) * delta * 8; // Move towards wicket
                }
            }

            // If loser is Wicket vs Ball -> Wickets fly apart ('Bowled')
            if (outcome === 'loser' && move === 'wicket' && winningMove === 'ball') {
                // Delay slightly for 'impact'
                if (reactionTime.current < 0.3) {
                    reactionTime.current += delta;
                } else {
                    // Explode stumps
                    if (wicketRef.current) {
                        wicketRef.current.children.forEach((child) => {
                            child.position.x += (Math.random() - 0.5) * delta * 5;
                            child.position.y += Math.random() * delta * 5;
                            child.rotation.z += (Math.random() - 0.5) * delta * 10;
                        });
                    }
                }
            }

            // NEW: If winner is Wicket vs Bat -> Wicket falls onto bat (Hit Wicket)
            if (outcome === 'winner' && move === 'wicket' && winningMove === 'wicket') {
                // Wicket tips over
                if (wicketRef.current) {
                    reactionTime.current += delta * 3;
                    const fallAngle = Math.min(reactionTime.current, Math.PI / 2);
                    wicketRef.current.rotation.z = isLeft ? fallAngle : -fallAngle;
                    wicketRef.current.position.y -= delta * 2; // Fall down
                }
            }

            // NEW: If loser is Bat vs Wicket -> Bat recoils from hit
            if (outcome === 'loser' && move === 'bat' && winningMove === 'wicket') {
                if (batRef.current) {
                    reactionTime.current += delta * 4;
                    const recoil = Math.sin(Math.min(reactionTime.current, Math.PI));
                    batRef.current.rotation.z = isLeft ? recoil * 0.5 : -recoil * 0.5;
                    batRef.current.position.x += (isLeft ? -1 : 1) * delta * 2; // Slight push back
                }
            }

            // Generic rotation for standard display
            if (move === 'ball' && ballRef.current) {
                ballRef.current.rotation.x += 0.02;
            }
        }
    });

    // Materials
    const batMaterial = new THREE.MeshStandardMaterial({ color: '#8B4513', roughness: 0.3 });
    const handleMaterial = new THREE.MeshStandardMaterial({ color: '#222', roughness: 0.5 });
    const ballMaterial = new THREE.MeshStandardMaterial({ color: '#DC143C', roughness: 0.4, metalness: 0.1 });
    const stumpMaterial = new THREE.MeshStandardMaterial({ map: wicketTexture, color: '#FFFFFF' });
    const stumpMaterialNoTex = new THREE.MeshStandardMaterial({ color: '#DAA520', roughness: 0.4 }); // Fallback/Ends
    const seamMaterial = new THREE.MeshStandardMaterial({ color: '#FFF' });
    const boxMaterial = new THREE.MeshStandardMaterial({ color: '#333', roughness: 0.2, metalness: 0.5 }); // Dark box

    return (
        <group ref={groupRef} position={position}>
            {/* MYSTERY BOX (Idle/Shaking State) */}
            {(!move || isShaking) && (
                <group>
                    <mesh castShadow receiveShadow material={boxMaterial}>
                        <boxGeometry args={[1.5, 1.5, 1.5]} />
                    </mesh>
                    {/* Display selected icon on the box if move is selected */}
                    {selectedMove && (
                        <mesh position={[0, 0, 0.76]}>
                            <planeGeometry args={[1.2, 1.2]} />
                            <meshBasicMaterial
                                map={selectedMove === 'bat' ? batIconTexture : selectedMove === 'ball' ? ballIconTexture : wicketIconTexture}
                                transparent={true}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                    )}
                </group>
            )}

            {/* BAT MODEL */}
            {(!isShaking && move === 'bat') && (
                <group ref={batRef} rotation={[0, 0, isLeft ? -Math.PI / 4 : Math.PI / 4]}>
                    <mesh position={[0, 1, 0]} castShadow receiveShadow material={batMaterial}><boxGeometry args={[0.8, 2.5, 0.2]} /></mesh>
                    <mesh position={[0, 2.5, 0]} castShadow receiveShadow material={handleMaterial}><cylinderGeometry args={[0.1, 0.1, 1]} /></mesh>
                    <mesh position={[0, 1, 0.1]} castShadow receiveShadow material={batMaterial}><boxGeometry args={[0.5, 2.2, 0.1]} /></mesh>
                </group>
            )}

            {/* BALL MODEL */}
            {(!isShaking && move === 'ball') && (
                <group ref={ballRef}>
                    <mesh castShadow receiveShadow material={ballMaterial}><sphereGeometry args={[0.7, 32, 32]} /></mesh>
                    <mesh rotation={[Math.PI / 2, 0, 0]} material={seamMaterial}><torusGeometry args={[0.7, 0.02, 16, 100]} /></mesh>
                </group>
            )}

            {/* WICKET MODEL */}
            {(!isShaking && move === 'wicket') && (
                <group ref={wicketRef}>
                    <mesh position={[-0.3, 0.5, 0]} castShadow receiveShadow material={stumpMaterial}><cylinderGeometry args={[0.1, 2.5, 32]} /></mesh>
                    <mesh position={[0, 0.5, 0]} castShadow receiveShadow material={stumpMaterial}><cylinderGeometry args={[0.1, 2.5, 32]} /></mesh>
                    <mesh position={[0.3, 0.5, 0]} castShadow receiveShadow material={stumpMaterial}><cylinderGeometry args={[0.1, 2.5, 32]} /></mesh>
                    <mesh position={[-0.15, 1.8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={stumpMaterialNoTex}><cylinderGeometry args={[0.05, 0.3, 16]} /></mesh>
                    <mesh position={[0.15, 1.8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={stumpMaterialNoTex}><cylinderGeometry args={[0.05, 0.3, 16]} /></mesh>
                </group>
            )}
        </group>
    );
};
