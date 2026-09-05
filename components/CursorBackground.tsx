"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

function Starfield() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Smoothly interpolate the group rotation based on pointer position (parallax effect)
    const targetX = (state.pointer.x * Math.PI) / 8;
    const targetY = (state.pointer.y * Math.PI) / 8;
    
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.03;
    groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <Stars radius={50} depth={50} count={2500} factor={4} saturation={0} fade speed={1.5} />
    </group>
  );
}

export default function CursorBackground() {
  return (
    <div className="fixed inset-0 z-[-30] pointer-events-none overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* 
        The stars are white by default. 
        In light mode, we use CSS invert to make them dark, keeping Three.js rendering cheap.
        In dark mode, invert-0 keeps them white.
      */}
      <div className="w-full h-full opacity-60 invert dark:invert-0 transition-all duration-1000">
        <Canvas camera={{ position: [0, 0, 1] }} gl={{ alpha: true }}>
          <ambientLight intensity={0.5} />
          <Starfield />
        </Canvas>
      </div>
      
      {/* Overlay gradient to blend it perfectly with the glassmorphism UI */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-transparent to-zinc-50/90 dark:from-indigo-950/20 dark:via-transparent dark:to-zinc-950/90" />
    </div>
  );
}