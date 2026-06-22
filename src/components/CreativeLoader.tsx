import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

interface CreativeLoaderProps {
  progress: number;
}

export const CreativeLoader: React.FC<CreativeLoaderProps> = ({ progress }) => {
  const [telemetry, setTelemetry] = useState<string[]>([]);

  useEffect(() => {
    const logs: string[] = [];
    if (progress >= 10 && telemetry.length < 1) {
      logs.push("CORE // INITIALIZING_QUANTUM_PORTAL... [OK]");
      setTelemetry([...logs]);
    }
    if (progress >= 35 && telemetry.length < 2) {
      logs.push("CORE // BUFFERING_VECTOR_CANVASES... [OK]");
      setTelemetry([...telemetry, "CORE // INITIALIZING_QUANTUM_PORTAL... [OK]", ...logs]);
    }
    if (progress >= 60 && telemetry.length < 3) {
      logs.push("CORE // INTENSITY_SHADERS_OPTIMIZED... [OK]");
      setTelemetry([
        "CORE // INITIALIZING_QUANTUM_PORTAL... [OK]",
        "CORE // BUFFERING_VECTOR_CANVASES... [OK]",
        "CORE // INTENSITY_SHADERS_OPTIMIZED... [OK]"
      ]);
    }
    if (progress >= 85 && telemetry.length < 4) {
      logs.push("CORE // CALIBRATING_PARTICLE_ARRAYS... [READY]");
      setTelemetry([
        "CORE // INITIALIZING_QUANTUM_PORTAL... [OK]",
        "CORE // BUFFERING_VECTOR_CANVASES... [OK]",
        "CORE // INTENSITY_SHADERS_OPTIMIZED... [OK]",
        "CORE // CALIBRATING_PARTICLE_ARRAYS... [READY]"
      ]);
    }
  }, [progress]);

  // Create subtle particle trail background inside loader using pure CSS stars
  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center p-6 text-white select-none overflow-hidden">
      {/* Background ambient glow in monochrome style */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-neutral-800/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid details */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', 
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(circle at center, black, transparent)'
        }} 
      />

      {/* Main loading capsule */}
      <div className="flex flex-col items-center max-w-md w-full text-center relative z-10 z-index-[2]">
        
        {/* Futuristic Orbital Concentric Spinner */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-8">
          
          {/* Inner pulsating core */}
          <motion.div 
            animate={{ 
              scale: [0.95, 1.1, 0.95],
              opacity: [0.7, 1, 0.7],
              boxShadow: ["0 0 15px rgba(255,255,255,0.15)", "0 0 35px rgba(255,255,255,0.4)", "0 0 15px rgba(255,255,255,0.15)"]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-neutral-400 to-white flex items-center justify-center relative"
          >
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <Cpu className="w-4.5 h-4.5 text-white animate-pulse" />
            </div>
          </motion.div>

          {/* Orbiting ring 1 - Clockwise */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute inset-2 border-t-2 border-b-2 border-white/20 rounded-full"
          />

          {/* Orbiting ring 2 - Counterclockwise */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="absolute inset-6 border-l border-r border-white/25 border-dashed rounded-full"
          />

          {/* Orbiting ring 3 - Fine Dots & Star Orbitals */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
            className="absolute inset-0 border border-white/5 rounded-full"
          >
            {/* Real aesthetic orbital satellite node */}
            <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <div className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 rounded-full bg-neutral-400 shadow-[0_0_8px_rgba(200,200,200,0.8)]" />
          </motion.div>
        </div>

        {/* Progress Text Meter */}
        <div className="relative mb-6">
          <motion.span 
            className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-white block select-none drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {String(progress).padStart(3, '0')}%
          </motion.span>
          <span className="font-mono text-[8px] sm:text-[9px] text-white/50 uppercase tracking-[0.3em] font-medium block mt-1.5 animate-pulse">
            SYSTEM_SYNC_ACTIVE
          </span>
        </div>

        {/* Loading Progress Bar Container */}
        <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden mb-6 relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-neutral-700 via-neutral-300 to-white shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            style={{ width: `${progress}%` }}
            transition={{ type: "tween", ease: "easeInOut" }}
          />
        </div>

        {/* Quantum Telemetry logs */}
        <div className="w-full text-left bg-black/40 border border-white/5 rounded-xl p-4 min-h-[90px] font-mono text-[8px] sm:text-[9.5px] leading-relaxed text-white/40 space-y-1">
          <div className="flex gap-1.5 items-center pb-1.5 mb-2 border-b border-white/5 text-white/60">
            <Terminal className="w-3.5 h-3.5 text-white" />
            <span className="uppercase tracking-widest font-bold text-[8.5px] sm:text-[9.5px]">QUANTUM//BOOT_LOG</span>
          </div>

          <div className="space-y-1 font-mono">
            {telemetry.map((log, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-white/80 tracking-wide font-medium"
              >
                {log}
              </motion.div>
            ))}

            {progress < 100 ? (
              <div className="flex items-center gap-1 mt-1 font-semibold text-white/20 animate-pulse">
                <span>[ CALIBRATING SYSTEM MATRIX PARAMETERS... ]</span>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white font-bold block mt-1"
              >
                DISPERSAL_SYSTEM_ARMED // LAUNCH SUCCESS
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
