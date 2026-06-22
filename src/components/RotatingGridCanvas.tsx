import React, { useEffect, useRef } from "react";

export const RotatingGridCanvas: React.FC = () => {
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

    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width || window.innerWidth;
      height = rect?.height || 700;
      canvas.width = width;
      canvas.height = height;
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

    let angle = 0;

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const diagonal = Math.sqrt(width * width + height * height);
      const gridSize = diagonal * 1.25; // Exceed diagonal size to prevent rotation crop
      const step = 60; // Grid line spacing

      ctx.save();
      // Translate to center point first
      ctx.translate(cx, cy);
      // Continuous slow rotation (~1 RPM is approx 0.0005 - 0.001 rad per frame)
      angle += 0.00035; 
      ctx.rotate(angle);

      // Create a majestic radial gradient centered at (0, 0)
      // to make the grid lines naturally dissolve into black edges
      const radialGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, diagonal / 2);
      radialGrad.addColorStop(0, "rgba(99, 102, 241, 0.08)");
      radialGrad.addColorStop(0.3, "rgba(99, 102, 241, 0.05)");
      radialGrad.addColorStop(0.7, "rgba(139, 92, 246, 0.02)");
      radialGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.strokeStyle = radialGrad;
      ctx.lineWidth = 1.0;

      // Draw horizontal, vertical, and diag holographic grid lines
      const halfSize = gridSize / 2;

      ctx.beginPath();
      for (let x = -halfSize; x <= halfSize; x += step) {
        ctx.moveTo(x, -halfSize);
        ctx.lineTo(x, halfSize);
      }
      for (let y = -halfSize; y <= halfSize; y += step) {
        ctx.moveTo(-halfSize, y);
        ctx.lineTo(halfSize, y);
      }
      ctx.stroke();

      // Add architectural holographic grid nodes/crosshairs for extra sci-fi vibe
      ctx.fillStyle = radialGrad;
      const pointStep = step * 2;
      for (let x = -halfSize; x <= halfSize; x += pointStep) {
        for (let y = -halfSize; y <= halfSize; y += pointStep) {
          // Micro dots at intersections
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

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
      className="absolute inset-0 w-full h-full pointer-events-none opacity-45 select-none"
      style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}
      id="projects-ambient-canvas"
    />
  );
};
