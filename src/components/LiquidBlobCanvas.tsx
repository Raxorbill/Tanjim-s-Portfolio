import React, { useEffect, useRef } from "react";

export const LiquidBlobCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    // Blob parameters
    interface Blob {
      x: number;
      y: number;
      baseRadius: number;
      radiusVariation: number;
      numPoints: number;
      speedX: number;
      speedY: number;
      morphSpeed: number;
      color: string;
      phaseOffsets: number[];
      angle: number;
    }

    const blobs: Blob[] = [
      {
        x: 0,
        y: 0,
        baseRadius: 220,
        radiusVariation: 50,
        numPoints: 8,
        speedX: 0.25,
        speedY: 0.18,
        morphSpeed: 0.0008,
        color: "rgba(99, 102, 241, 0.12)", // Semi-transparent Indigo
        phaseOffsets: Array.from({ length: 8 }, (_, i) => i * 1.2),
        angle: 0,
      },
      {
        x: 0,
        y: 0,
        baseRadius: 180,
        radiusVariation: 45,
        numPoints: 7,
        speedX: -0.2,
        speedY: 0.22,
        morphSpeed: 0.0012,
        color: "rgba(139, 92, 246, 0.09)", // Violet
        phaseOffsets: Array.from({ length: 7 }, (_, i) => i * 0.9),
        angle: Math.PI / 3,
      },
      {
        x: 0,
        y: 0,
        baseRadius: 150,
        radiusVariation: 35,
        numPoints: 6,
        speedX: 0.15,
        speedY: -0.25,
        morphSpeed: 0.001,
        color: "rgba(59, 130, 246, 0.07)", // Blue
        phaseOffsets: Array.from({ length: 6 }, (_, i) => i * 1.5),
        angle: Math.PI / 1.5,
      },
    ];

    // Resize handler
    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width || window.innerWidth;
      height = rect?.height || 800;
      canvas.width = width;
      canvas.height = height;

      // Dynamically reposition and size blobs according to mobile vs desktop screens
      const isMobile = width < 768;
      
      blobs[0].x = isMobile ? width * 0.5 : width * 0.3;
      blobs[0].y = isMobile ? height * 0.3 : height * 0.4;
      blobs[0].baseRadius = isMobile ? 120 : 220;
      blobs[0].radiusVariation = isMobile ? 30 : 50;
      blobs[0].speedX = isMobile ? 0.08 : 0.25;
      blobs[0].speedY = isMobile ? 0.05 : 0.18;

      blobs[1].x = isMobile ? width * 0.5 : width * 0.7;
      blobs[1].y = isMobile ? height * 0.55 : height * 0.6;
      blobs[1].baseRadius = isMobile ? 100 : 180;
      blobs[1].radiusVariation = isMobile ? 25 : 45;
      blobs[1].speedX = isMobile ? -0.06 : -0.2;
      blobs[1].speedY = isMobile ? 0.07 : 0.22;

      blobs[2].x = isMobile ? width * 0.5 : width * 0.5;
      blobs[2].y = isMobile ? height * 0.75 : height * 0.3;
      blobs[2].baseRadius = isMobile ? 80 : 150;
      blobs[2].radiusVariation = isMobile ? 20 : 35;
      blobs[2].speedX = isMobile ? 0.05 : 0.15;
      blobs[2].speedY = isMobile ? -0.06 : -0.25;
    };

    resizeCanvas();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 200);
    };
    window.addEventListener("resize", handleResize);

    // Setup IntersectionObserver to pause rendering when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    let lastTime = 0;

    const render = (time: number) => {
      // If ofscreen flag triggers, skip execution/repaints
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // We use hardware-accelerated CSS blur styles on the canvas CSS node instead of high CPU context-level software filters
      ctx.globalCompositeOperation = "screen";

      blobs.forEach((blob) => {
        // Drifting motion within boundaries with soft bounce
        blob.x += blob.speedX;
        blob.y += blob.speedY;

        const maxOffset = blob.baseRadius * 1.2;
        if (blob.x < -maxOffset) blob.x = width + maxOffset;
        if (blob.x > width + maxOffset) blob.x = -maxOffset;
        if (blob.y < -maxOffset) blob.y = height + maxOffset;
        if (blob.y > height + maxOffset) blob.y = -maxOffset;

        blob.angle += 0.0004; // Gentle rotation

        const points: { x: number; y: number }[] = [];
        for (let i = 0; i < blob.numPoints; i++) {
          const pointAngle = (i * (2 * Math.PI)) / blob.numPoints + blob.angle;
          const currentRadius =
            blob.baseRadius +
            Math.sin(time * blob.morphSpeed + blob.phaseOffsets[i]) * blob.radiusVariation;

          points.push({
            x: blob.x + Math.cos(pointAngle) * currentRadius,
            y: blob.y + Math.sin(pointAngle) * currentRadius,
          });
        }

        ctx.fillStyle = blob.color;
        ctx.beginPath();

        const numPts = points.length;
        if (numPts > 0) {
          const xc1 = (points[0].x + points[numPts - 1].x) / 2;
          const yc1 = (points[0].y + points[numPts - 1].y) / 2;
          ctx.moveTo(xc1, yc1);

          for (let i = 0; i < numPts; i++) {
            const nextIdx = (i + 1) % numPts;
            const pCurrent = points[i];
            const pNext = points[nextIdx];
            const xc = (pCurrent.x + pNext.x) / 2;
            const yc = (pCurrent.y + pNext.y) / 2;
            ctx.quadraticCurveTo(pCurrent.x, pCurrent.y, xc, yc);
          }
        }
        ctx.closePath();
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    // Pause on tab inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(render);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-70"
      style={{ willChange: "transform", filter: "blur(70px)", transform: "translate3d(0, 0, 0)" }}
      id="about-ambient-canvas"
    />
  );
};
