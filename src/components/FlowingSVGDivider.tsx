import React, { useEffect, useRef, useState } from "react";

export const FlowingSVGDivider: React.FC<{ index?: number }> = ({ index = 1 }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Gracefully staggered curves based on index
  const paths = index % 2 === 0
    ? [
        "M0,30 C360,110 720,10 1080,95 1280,45 1440,65",
        "M0,80 C400,10 800,100 1150,25 1300,75 1440,40",
        "M0,15 C280,85 700,5 1020,95 1240,35 1440,75",
        "M0,95 C320,15 760,105 1100,50 1280,90 1440,55",
      ]
    : [
        "M0,60 C360,10 720,110 1080,40 1280,85 1440,55",
        "M0,35 C300,95 680,15 1020,95 1250,30 1440,70",
        "M0,85 C420,15 820,105 1180,30 1320,85 1440,45",
        "M0,20 C340,115 740,10 1120,80 1290,35 1440,60",
      ];

  const uniqueId = `divider-grad-${index}`;

  return (
    <div 
      ref={containerRef}
      className="w-full h-24 relative overflow-hidden bg-brand-black select-none pointer-events-none"
      id={`flowing-divider-${index}`}
    >
      <svg 
        viewBox="0 0 1440 120" 
        width="100%" 
        height="100%" 
        preserveAspectRatio="none" 
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id={uniqueId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.03" />
            <stop offset="35%" stopColor="#8b5cf6" stopOpacity="0.16" />
            <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {paths.map((p, i) => (
          <path
            key={i}
            d={p}
            fill="none"
            stroke={`url(#${uniqueId})`}
            className={`flow-line line-id-${i} ${inView ? "animate-draw" : ""}`}
            style={{
              strokeDasharray: "2000",
              strokeDashoffset: "2000",
              animationDelay: `${i * 0.45}s`,
            }}
          />
        ))}
      </svg>

      <style>{`
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }

        .flow-line {
          stroke-width: 1.1px;
          opacity: 0.85;
          will-change: stroke-dashoffset;
        }

        .flow-line.animate-draw {
          animation: drawLine 4.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Subtly different motion rates for staggered organic waving depth */
        .flow-line.line-id-0 { stroke-width: 1.2px; }
        .flow-line.line-id-1 { stroke-width: 0.95px; }
        .flow-line.line-id-2 { stroke-width: 1.1px; }
        .flow-line.line-id-3 { stroke-width: 0.8px; }
      `}</style>
    </div>
  );
};
