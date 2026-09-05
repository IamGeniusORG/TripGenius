"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.15],
      markerColor: [0.25, 0.55, 1],
      glowColor: [0.1, 0.1, 0.2],
      markers: [
        { location: [35.6762, 139.6503], size: 0.05 },
        { location: [40.7128, -74.0060], size: 0.05 },
        { location: [51.5074, -0.1278], size: 0.05 },
        { location: [48.8566, 2.3522], size: 0.05 },
        { location: [-33.8688, 151.2093], size: 0.05 },
        { location: [-22.9068, -43.1729], size: 0.05 },
      ],
      onRender: (state: any) => {
        state.phi = phi;
        phi += 0.003;
      },
    } as any);

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-40 mix-blend-screen">
      <canvas
        ref={canvasRef}
        style={{
          width: 500,
          height: 500,
          maxWidth: "100%",
          aspectRatio: "1/1",
        }}
      />
    </div>
  );
}