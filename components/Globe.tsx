"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;

    // Use window width to scale the globe
    const width = typeof window !== 'undefined' ? window.innerWidth : 1000;
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 30000,
      mapBrightness: 6,
      baseColor: [0.05, 0.05, 0.08],
      markerColor: [0.3, 0.6, 1],
      glowColor: [0.05, 0.05, 0.1],
      markers: [
        { location: [35.6762, 139.6503], size: 0.08 },
        { location: [40.7128, -74.0060], size: 0.08 },
        { location: [51.5074, -0.1278], size: 0.08 },
        { location: [48.8566, 2.3522], size: 0.08 },
        { location: [-33.8688, 151.2093], size: 0.08 },
      ],
      onRender: (state: any) => {
        state.phi = phi;
        phi += 0.002;
      },
    } as any);

    return () => globe.destroy();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 translate-x-[20%] translate-y-[20%] opacity-80 mix-blend-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '1200px',
          maxHeight: '1200px',
          aspectRatio: "1/1",
        }}
      />
    </div>
  );
}