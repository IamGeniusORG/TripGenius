"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useSpring } from "framer-motion";

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  
  // Use framer-motion's useSpring since it is already installed in the project
  const r = useSpring(0, {
    stiffness: 280,
    damping: 40,
    mass: 1,
  });

  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;

    const width = typeof window !== "undefined" ? window.innerWidth : 1000;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.2,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 25000,
      mapBrightness: 4,
      // Make it a beautiful glowing Earth: deep blue oceans, subtle blue glow
      baseColor: [0.02, 0.08, 0.2],
      markerColor: [0.2, 0.8, 1],
      glowColor: [0.05, 0.15, 0.3],
      markers: [
        { location: [35.6762, 139.6503], size: 0.08 },
        { location: [40.7128, -74.006], size: 0.08 },
        { location: [51.5074, -0.1278], size: 0.08 },
        { location: [48.8566, 2.3522], size: 0.08 },
        { location: [-33.8688, 151.2093], size: 0.08 },
      ],
      onRender: (state: Record<string, any>) => {
        // Auto-rotate slowly, but add the user's drag rotation (r.get())
        state.phi = phi + r.get();
        phi += 0.002;
      },
    } as any);

    return () => globe.destroy();
  }, [r]);

  return (
    <div className="w-full h-full flex items-center justify-center z-0 translate-y-[20%] lg:translate-y-[15%] opacity-90 mix-blend-screen relative">
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            r.set(delta / 200);
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            r.set(delta / 100);
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "1100px",
          maxHeight: "1100px",
          aspectRatio: "1/1",
          objectFit: "contain",
          cursor: "grab",
        }}
      />
    </div>
  );
}