import React, { useEffect, useRef } from "react";

export const ParticleConstellationCanvas: React.FC = () => {
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

    // Resize handler
    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width || window.innerWidth;
      height = rect?.height || 600;
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

    // Particle class/interface
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseRadius: number;
      opacity: number;
      wobbleSpeed: number;
      wobbleOffset: number;
    }

    const isMobileDevice = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    const particleCount = isMobileDevice ? 22 : 75; // 3x+ fewer particles on mobile devices for exceptional performance
    const particles: Particle[] = [];

    const createParticle = (isInitial = false): Particle => {
      return {
        x: Math.random() * (width || window.innerWidth),
        y: isInitial ? Math.random() * (height || 600) : (height || 600) + 10,
        vx: 0,
        vy: -0.35 - Math.random() * 0.45, // -0.35 to -0.8
        baseRadius: Math.random() * 1.5 + 0.8, // 0.8 to 2.3px
        opacity: Math.random() * 0.6 + 0.3, // 0.3 to 0.9
        wobbleSpeed: Math.random() * 0.002 + 0.001,
        wobbleOffset: Math.random() * Math.PI * 2,
      };
    };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    const render = (time: number) => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw constellations (connections)
      const maxDistance = 130;
      ctx.lineWidth = 0.8;

      for (let i = 0; i < particleCount; i++) {
        const pi = particles[i];

        for (let j = i + 1; j < particleCount; j++) {
          const pj = particles[j];

          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistance * maxDistance) {
            const dist = Math.sqrt(distSq);
            // Alpha drops further apart
            const ratio = 1 - dist / maxDistance;
            const alpha = ratio * 0.18 * Math.min(pi.opacity, pj.opacity);

            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();
          }
        }
      }

      // 2. Draw and update individual particles
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // Wobble horizontally, drift vertically
        const horizontalWobble = Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * 0.22;
        p.x += horizontalWobble;
        p.y += p.vy;

        // Wrap or reset if particle leaves vertical top or boundaries
        if (p.y < -10) {
          particles[i] = createParticle(false);
          continue;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Visual design: glow halo + core
        // A. Glow Halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseRadius * 3.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity * 0.12})`;
        ctx.fill();

        // B. Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${p.opacity})`; // Brighter core tint
        ctx.fill();
      }

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
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      style={{ willChange: "transform", transform: "translate3d(0, 0, 0)" }}
      id="skills-ambient-canvas"
    />
  );
};
