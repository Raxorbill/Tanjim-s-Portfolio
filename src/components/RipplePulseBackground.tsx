import React, { useState } from "react";

export const RipplePulseBackground: React.FC = () => {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  let burstId = 0;

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // We can allow users to click or hover to emit high-frequency burst pulses
  };

  const triggerBurst = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = Date.now() + Math.random();
    setBursts((prev) => [...prev, { id, x, y }]);
    
    // Clear burst after animation finishes (1.2s)
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 1200);
  };

  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-auto cursor-pointer select-none overflow-hidden"
      style={{ zIndex: 0 }}
      onClick={triggerBurst}
    >
      {/* Concentric ambient steady pulse rings centered in the middle of contact section */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
        <div className="custom-ring-pulse ring-1" />
        <div className="custom-ring-pulse ring-2" />
        <div className="custom-ring-pulse ring-3" />
      </div>

      {/* Dynamic interactive ripple bursts on user click */}
      {bursts.map((b) => (
        <div
          key={b.id}
          className="absolute pointer-events-none custom-ring-burst"
          style={{
            left: b.x,
            top: b.y,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      <style>{`
        .custom-ring-pulse {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(99, 102, 241, 0.15);
          width: 250px;
          height: 250px;
          will-change: transform, opacity;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.03);
        }

        @keyframes pulse-expand {
          0% {
            transform: scale(0.6);
            opacity: 0.8;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: scale(3.2);
            opacity: 0;
          }
        }

        .custom-ring-pulse.ring-1 {
          animation: pulse-expand 6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        .custom-ring-pulse.ring-2 {
          animation: pulse-expand 6s cubic-bezier(0.16, 1, 0.3, 1) infinite 2s;
        }

        .custom-ring-pulse.ring-3 {
          animation: pulse-expand 6s cubic-bezier(0.16, 1, 0.3, 1) infinite 4s;
        }

        @keyframes burst-expand {
          0% {
            width: 10px;
            height: 10px;
            border: 2px solid rgba(139, 92, 246, 0.61);
            opacity: 0.9;
            box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
          }
          100% {
            width: 320px;
            height: 320px;
            border: 1px solid rgba(99, 102, 241, 0);
            opacity: 0;
            box-shadow: 0 0 30px rgba(99, 102, 241, 0);
          }
        }

        .custom-ring-burst {
          border-radius: 50%;
          animation: burst-expand 1.1s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
          will-change: width, height, opacity;
        }
      `}</style>
    </div>
  );
};
