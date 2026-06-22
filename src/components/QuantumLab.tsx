import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sliders, Sparkles, Zap, RotateCcw, Ship, Activity, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const QuantumLab = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Choose between 'ocean' (Mode 1: Cyber Boat) and 'tesseract' (Mode 2: Quantum Toroidal Knot)
  const [activeMode, setActiveMode] = useState<"ocean" | "tesseract">("tesseract");
  const [showControls, setShowControls] = useState(true);

  // Mode 1: Cyber Ocean params
  const [chaos, setChaos] = useState(2.5);
  const [load, setLoad] = useState(1.2);

  // Mode 2: Tesseract params
  const [macroRadius, setMacroRadius] = useState(45);
  const [microRadius, setMicroRadius] = useState(14);
  const [pLoops, setPLoops] = useState(2);
  const [qTwists, setQTwists] = useState(5);
  const [energyFlow, setEnergyFlow] = useState(0.45);

  const [simSpeed, setSimSpeed] = useState(1.0);

  // Capture mutable references for real-time WebGL render loop performance without React re-trigger
  const paramsRef = useRef({
    activeMode: "tesseract",
    chaos: 2.5,
    load: 1.2,
    macroRadius: 45,
    microRadius: 14,
    pLoops: 2,
    qTwists: 5,
    energyFlow: 0.45,
    simSpeed: 1.0,
  });

  useEffect(() => {
    paramsRef.current = {
      activeMode,
      chaos,
      load,
      macroRadius,
      microRadius,
      pLoops,
      qTwists,
      energyFlow,
      simSpeed,
    };
  }, [activeMode, chaos, load, macroRadius, microRadius, pLoops, qTwists, energyFlow, simSpeed]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 480; // Elegant standard responsive nested sandbox height

    const isMobileDevice = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    const COUNT = isMobileDevice ? 10000 : 16000; // Ensure extremely solid density for both modes on all displays

    // Setup Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.006);

    // Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 20, 85);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 180;
    controls.minDistance = 25;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    // Swarm Instanced Mesh Instantiation
    const geometry = new THREE.TetrahedronGeometry(0.24);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const instancedMesh = new THREE.InstancedMesh(geometry, material, COUNT);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);

    // Initialize random particle origins and colors to trigger nice entry morphing effect
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const target = new THREE.Vector3();
    const positions: THREE.Vector3[] = [];

    for (let i = 0; i < COUNT; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 150,
          (Math.random() - 0.5) * 150,
          (Math.random() - 0.5) * 150
        )
      );
      instancedMesh.setColorAt(i, color.setHex(0x00d2ff));
    }

    const clock = new THREE.Clock();
    let animationFrameId: number;

    let isInteracting = false;
    let interactionTimeout: NodeJS.Timeout | null = null;

    const handleInteractionStart = () => {
      isInteracting = true;
      if (interactionTimeout) clearTimeout(interactionTimeout);
    };

    const handleInteractionEnd = () => {
      if (interactionTimeout) clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        isInteracting = false;
      }, 150);
    };

    window.addEventListener("touchstart", handleInteractionStart, { passive: true });
    window.addEventListener("touchmove", handleInteractionStart, { passive: true });
    window.addEventListener("touchend", handleInteractionEnd, { passive: true });
    window.addEventListener("scroll", handleInteractionStart, { capture: true, passive: true });

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      
      const config = paramsRef.current;
      const speedMult = config.simSpeed;
      const time = clock.getElapsedTime() * speedMult;

      controls.update();

      // MORPH-LERP CALCULATOR FOR ALL 16,000 PARTICLES
      for (let i = 0; i < COUNT; i++) {
        if (config.activeMode === "ocean") {
          // --- MODE 1: CYBER OCEAN SYSTEM ---
          const currentChaos = config.chaos;
          const currentLoad = config.load;
          
          const boatCount = Math.floor(COUNT * 0.16);
          const isBoat = i < boatCount;

          if (isBoat) {
            // Cyber Ship geometry rendering logic
            const t = i / boatCount;
            const tSlow = time * 0.5;

            const pitch = Math.sin(tSlow) * (0.05 + currentChaos * 0.015);
            const roll = Math.cos(tSlow * 0.8) * (0.03 + currentChaos * 0.008);
            const bobbing = Math.sin(tSlow * 1.8) * 0.5;

            let x = 0, y = 0, z = 0;

            if (t < 0.4) {
              // Ship Hull
              const hullT = t / 0.4;
              const zRatio = Math.floor(hullT * 55) / 55;
              const hCol = (hullT * 25) % 1;

              z = (zRatio - 0.5) * 40;
              const maxWidth = Math.sin(zRatio * Math.PI) * 6;
              x = (hCol - 0.5) * 2 * maxWidth;

              const floor = Math.pow(x / (maxWidth + 0.1), 2) * 3.0 - 3.0;
              const bowLift = zRatio > 0.65 ? Math.pow(zRatio - 0.65, 2) * 100 : 0;
              y = floor + bowLift;
            } else {
              // Ship Sails & Mast
              const sailT = (t - 0.4) / 0.6;
              const isFore = sailT < 0.5;
              const sSubT = isFore ? sailT * 2 : (sailT - 0.5) * 2;

              const row = Math.floor(sSubT * 48) / 48;
              const col = (sSubT * 25) % 1;

              const mastZ = isFore ? 7 : -9;
              const h = row * 30 * currentLoad;
              const lean = h * -0.12;

              const currentMastZ = mastZ + lean;
              const sWidth = (1 - row) * 20 * currentLoad;

              x = (col - 0.5) * sWidth;
              y = h + 2.0;
              z = currentMastZ + Math.sin(col * Math.PI) * 2.5;
            }

            // World relative transformations with sea bobbing & rotation pitch/roll coords
            const worldX = x;
            const worldY = y * Math.cos(pitch) - z * Math.sin(pitch) + bobbing;
            const worldZ = y * Math.sin(pitch) + z * Math.cos(pitch);

            const finalX = worldX * Math.cos(roll) - worldY * Math.sin(roll);
            const finalY = worldX * Math.sin(roll) + worldY * Math.cos(roll);

            // Positioning vectors centering around the coordinates
            target.set(finalX, finalY + 4, worldZ);
            
            // Bright neon Cyber Ship color theme
            color.setHSL(0.08 + (Math.sin(time + i * 0.05) * 0.03), 0.95, 0.63);
          } else {
            // Data Ambient Ocean Waves
            const oceanIdx = (i - boatCount) / (COUNT - boatCount);
            const gridX = ((oceanIdx * 1537) % 1) * 180 - 90;
            const gridZ = ((oceanIdx * 723) % 1) * 180 - 90;

            const wave1 = Math.sin(gridX * 0.09 + time * 1.3) * 1.8;
            const wave2 = Math.cos(gridZ * 0.12 - time * 0.9) * 1.8;
            const interference = Math.sin((gridX + gridZ) * 0.04 + time) * currentChaos;
            const ripple = Math.sin(Math.sqrt(gridX * gridX + gridZ * gridZ) * 0.18 - time * 2.5) * (currentChaos * 0.18);

            const waveY = wave1 + wave2 + interference + ripple - 10;
            target.set(gridX, waveY, gridZ);

            // HSL depth coloring logic (deep teals/blues mirroring waves depth)
            const depth = Math.max(0, Math.min(1, (waveY + 14) / 18));
            color.setHSL(0.51 + depth * 0.12, 0.88, 0.12 + depth * 0.38);
          }
        } else {
          // --- MODE 2: QUANTUM TESSERACT TOROIDAL KNOT ---
          const R = config.macroRadius;
          const r = config.microRadius;
          const P = Math.floor(config.pLoops);
          const Q = Math.floor(config.qTwists);
          const numBlocks = 290;
          const pLen = 6.2;
          const pSize = 2.2;
          const stagger = 3.6;
          const extraTwist = 1.3;
          const flow = config.energyFlow;

          const stardustRatio = 0.06;
          const numStardust = COUNT * stardustRatio;

          const gRx = time * 0.07;
          const gRy = time * 0.12;
          const cgx = Math.cos(gRx), sgx = Math.sin(gRx);
          const cgy = Math.cos(gRy), sgy = Math.sin(gRy);

          if (i < numStardust) {
            // Knot Space dust surrounding particles drift
            const raw1 = Math.sin(i * 11.11) * 43758.54;
            const sd1 = raw1 - Math.floor(raw1);
            const raw2 = Math.cos(i * 22.22) * 43758.54;
            const sd2 = raw2 - Math.floor(raw2);
            const raw3 = Math.sin(i * 33.33) * 43758.54;
            const sd3 = raw3 - Math.floor(raw3);

            const radiusDist = R * 1.25 + sd1 * 60.0;
            const theta = sd2 * Math.PI * 2.0;
            const phi = Math.acos(sd3 * 2.0 - 1.0);

            const driftX = Math.sin(time * 0.18 + i * 0.04) * 8.0;
            const driftY = Math.cos(time * 0.22 + i * 0.04) * 8.0;
            const driftZ = Math.sin(time * 0.12 + i * 0.08) * 8.0;

            const sx = radiusDist * Math.sin(phi) * Math.cos(theta) + driftX;
            const sy = radiusDist * Math.sin(phi) * Math.sin(theta) + driftY;
            const sz = radiusDist * Math.cos(phi) + driftZ;

            // Perspective Rotate spatial projections
            const y1 = sy * cgx - sz * sgx;
            const z1 = sy * sgx + sz * cgx;
            const x2 = sx * cgy + z1 * sgy;
            const y2 = y1;
            const z2 = -sx * sgy + z1 * cgy;

            target.set(x2, y2, z2);

            const twinkle = Math.pow((Math.sin(time * 2.8 + i) + 1.0) * 0.5, 7.0);
            color.setHSL(0.53 + sd1 * 0.08, 0.9, 0.05 + twinkle * 0.7);
          } else {
            // Main Holographic Tesseract torus fibers
            const remainingCount = COUNT - numStardust;
            const iRem = i - numStardust;

            const blocksSafe = Math.max(1, numBlocks);
            const ppb = remainingCount / blocksSafe;
            const blockId = Math.floor(iRem / ppb);
            const localId = iRem - blockId * ppb;

            const wireRatio = 0.84;
            const numWire = ppb * wireRatio;
            const isWire = localId < numWire;

            const tBase = (blockId / blocksSafe) * Math.PI * 2.0;
            const t = tBase + time * flow * 0.15;

            const cosQt = Math.cos(Q * t);
            const sinQt = Math.sin(Q * t);
            const cosPt = Math.cos(P * t);
            const sinPt = Math.sin(P * t);

            // Knot equations
            const px = (R + r * cosQt) * cosPt;
            const py = (R + r * cosQt) * sinPt;
            const pz = r * sinQt;

            // Normal, Tangent, and Binormal vectors
            let tx = -P * (R + r * cosQt) * sinPt - Q * r * sinQt * cosPt;
            let ty = P * (R + r * cosQt) * cosPt - Q * r * sinQt * sinPt;
            let tz = Q * r * cosQt;
            const tLen = Math.sqrt(tx * tx + ty * ty + tz * tz) + 0.0001;
            tx /= tLen;
            ty /= tLen;
            tz /= tLen;

            const nx_torus = cosPt;
            const ny_torus = sinPt;
            const nz_torus = 0.0;

            let bx = ty * nz_torus - tz * ny_torus;
            let by = tz * nx_torus - tx * nz_torus;
            let bz = tx * ny_torus - ty * nx_torus;
            const bLen = Math.sqrt(bx * bx + by * by + bz * bz) + 0.0001;
            bx /= bLen;
            by /= bLen;
            bz /= bLen;

            let nx = by * tz - bz * ty;
            let ny = bz * tx - bx * tz;
            let nz = bx * ty - by * tx;

            const twistAngle = tBase * extraTwist + time * flow * 0.45;
            const cosTw = Math.cos(twistAngle);
            const sinTw = Math.sin(twistAngle);

            const fnx = nx * cosTw - bx * sinTw;
            const fny = ny * cosTw - by * sinTw;
            const fnz = nz * cosTw - bz * sinTw;

            const fbx = nx * sinTw + bx * cosTw;
            const fby = ny * sinTw + by * cosTw;
            const fbz = nz * sinTw + bz * cosTw;

            const track = blockId % 4;
            const c1 = track % 2 === 0 ? 1.0 : -1.0;
            const c2 = Math.floor(track / 2) === 0 ? 1.0 : -1.0;

            const cx = px + fnx * c1 * stagger + fbx * c2 * stagger;
            const cy = py + fny * c1 * stagger + fby * c2 * stagger;
            const cz = pz + fnz * c1 * stagger + fbz * c2 * stagger;

            let lx = 0.0, ly = 0.0, lz = 0.0;
            let u = 0.0;

            if (isWire) {
              const edgePosRaw = (localId / numWire) * 12.0;
              const edgeId = Math.min(11, Math.floor(edgePosRaw));
              u = (edgePosRaw - edgeId) * 2.0 - 1.0;

              const axis = edgeId % 3;
              const corner = Math.floor(edgeId / 3);
              const e1 = corner % 2 === 0 ? -1.0 : 1.0;
              const e2 = Math.floor(corner / 2) === 0 ? -1.0 : 1.0;

              if (axis === 0) {
                lx = u; ly = e1; lz = e2;
              } else if (axis === 1) {
                lx = e1; ly = u; lz = e2;
              } else {
                lx = e1; ly = e2; lz = u;
              }
            } else {
              const rawS1 = Math.sin(localId * 12.989 + blockId * 78.233) * 43758.545;
              const rawS2 = Math.cos(localId * 39.346 + blockId * 53.211) * 43758.545;
              const rawS3 = Math.sin(localId * 73.156 + blockId * 12.742) * 43758.545;
              const rawS4 = Math.cos(localId * 23.456 + blockId * 89.123) * 43758.545;

              const s1 = rawS1 - Math.floor(rawS1);
              const s2 = rawS2 - Math.floor(rawS2);
              const s3 = rawS3 - Math.floor(rawS3);
              const s4 = rawS4 - Math.floor(rawS4);

              const faceAxis = Math.min(2, Math.floor(s1 * 3.0));
              const signFace = s2 > 0.5 ? 1.0 : -1.0;
              const u2 = s3 * 2.0 - 1.0;
              const v2 = s4 * 2.0 - 1.0;

              u = 0.0;

              if (faceAxis === 0) { lx = signFace; ly = u2; lz = v2; }
              else if (faceAxis === 1) { lx = u2; ly = signFace; lz = v2; }
              else { lx = u2; ly = v2; lz = signFace; }
            }

            lx *= pLen;
            ly *= pSize;
            lz *= pSize;

            const fx = cx + lx * tx + ly * fnx + lz * fbx;
            const fy = cy + lx * ty + ly * fny + lz * fby;
            const fz = cz + lx * tz + ly * fnz + lz * fbz;

            // Global spatial project mapping
            const y1 = fy * cgx - fz * sgx;
            const z1 = fy * sgx + fz * cgx;
            const x2 = fx * cgy + z1 * sgy;
            const y2 = y1;
            const z2 = -fx * sgy + z1 * cgy;

            target.set(x2, y2, z2);

            const trackOffset = (track / 4.0) * 0.08;
            // High-contrast synthwave neon loop theme
            const hue = 0.54 + trackOffset + Math.sin(tBase * P * 1.5 + time * 0.3) * 0.03;

            let sat = isWire ? 0.95 : 0.55;
            let lit = isWire ? 0.28 : 0.025;

            if (isWire) {
              const pulseEnv = Math.sin(tBase * P * 10.0 - time * 3.5);
              if (pulseEnv > 0.8) {
                lit += (pulseEnv - 0.8) * 2.4;
              }
              const isCorner = Math.abs(u) > 0.9 ? 1.0 : 0.0;
              lit += isCorner * 0.45;
            }

            color.setHSL(hue % 1.0, sat, Math.min(1.0, Math.max(0.015, lit)));
          }
        }

        // LERP morphing transition vector values
        positions[i].lerp(target, 0.07); // Easing factor
        dummy.position.copy(positions[i]);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
        instancedMesh.setColorAt(i, color);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) {
        instancedMesh.instanceColor.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }

    animate();

    // Responsive element resizing
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current || !camera || !renderer) return;
      const w = containerRef.current.clientWidth || 800;
      const h = containerRef.current.clientHeight || 480;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      scene.remove(instancedMesh);

      window.removeEventListener("touchstart", handleInteractionStart);
      window.removeEventListener("touchmove", handleInteractionStart);
      window.removeEventListener("touchend", handleInteractionEnd);
      window.removeEventListener("scroll", handleInteractionStart, { capture: true });
      if (interactionTimeout) clearTimeout(interactionTimeout);
    };
  }, []);

  const resetAllParams = () => {
    setChaos(2.5);
    setLoad(1.2);
    setMacroRadius(45);
    setMicroRadius(14);
    setPLoops(2);
    setQTwists(5);
    setEnergyFlow(0.45);
    setSimSpeed(1.0);
  };

  return (
    <div className="w-full border border-white/10 bg-black/60 rounded-xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row items-stretch select-none">
      
      {/* 3D WebGL Canvas Arena Viewport */}
      <div 
        ref={containerRef} 
        className="flex-1 min-h-[380px] md:min-h-[480px] relative bg-black/80 flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
        
        {/* Absolute HUD decorative grids overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 select-none pointer-events-none">
          <span className="text-[10px] font-mono tracking-[0.2em] font-medium text-cyan-400 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            3D INTERACTIVE SANDBOX
          </span>
          <span className="text-[8px] font-mono text-white/30 lowercase font-light">
            SYSTEM // webgl_power_enabled_1.0
          </span>
        </div>

        {/* Orbit instruction label */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none select-none">
          <p className="text-[8px] font-mono tracking-widest text-white/40 uppercase">
            [ Drag to rotate • Scroll to zoom • Swipe to orbit ]
          </p>
        </div>

        {/* Dynamic Mode Controller Selector inside viewport to ensure pristine focus */}
        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          <button
            onClick={() => setActiveMode("tesseract")}
            className={`px-3 py-1.5 font-mono text-[9px] tracking-wider uppercase rounded-md border flex items-center gap-1.5 transition-all duration-300 focus:outline-none cursor-pointer ${
              activeMode === "tesseract"
                ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.5)]"
                : "bg-black/60 border-white/10 text-white/50 hover:border-white/20 hover:text-white"
            }`}
            id="sand-mode-tesseract"
          >
            <Activity className="w-3 h-3 text-cyan-400" />
            Quantum Knot
          </button>
          
          <button
            onClick={() => setActiveMode("ocean")}
            className={`px-3 py-1.5 font-mono text-[9px] tracking-wider uppercase rounded-md border flex items-center gap-1.5 transition-all duration-300 focus:outline-none cursor-pointer ${
              activeMode === "ocean"
                ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.5)]"
                : "bg-black/60 border-white/10 text-white/50 hover:border-white/20 hover:text-white"
            }`}
            id="sand-mode-ocean"
          >
            <Ship className="w-3 h-3 text-pink-500 animate-pulse" />
            Cyber Ship Wave
          </button>
        </div>
      </div>

      {/* Cyberpunk Parameter Adjuster Slider HUD Panel Tray (Desktop fits cleanly side-by-side, Mobile expands) */}
      <div className="w-full md:w-80 shrink-0 border-t md:border-t-0 md:border-l border-white/10 bg-white/[0.01] p-6 flex flex-col justify-between gap-6">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
            <span className="text-[10px] font-bold font-mono tracking-widest text-[#00d2ff] uppercase flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              MATRIX TUNING
            </span>
            <button
              onClick={resetAllParams}
              className="text-white/40 hover:text-cyan-400 hover:rotate-180 transition-all duration-500"
              title="Reset WebGL parameter vectors"
              id="btn-sand-reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-5">
            {/* Common Speed Multipier input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[9px] font-mono tracking-wider text-white/50 uppercase">
                <span>Simulation Speed</span>
                <span className="text-cyan-400 font-bold font-mono">{simSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={simSpeed}
                onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#00d2ff] h-1 bg-white/10 rounded-lg cursor-pointer focus:outline-none"
                id="slider-sand-speed"
              />
            </div>

            <AnimatePresence mode="wait">
              {activeMode === "tesseract" ? (
                <motion.div
                  key="controls-tesseract"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {/* Knot Macro Radius */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[9px] font-mono tracking-wider text-white/50 uppercase">
                      <span>Macro Radius (R)</span>
                      <span className="text-cyan-400 font-bold font-mono">{macroRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="75"
                      step="1"
                      value={macroRadius}
                      onChange={(e) => setMacroRadius(parseInt(e.target.value))}
                      className="w-full accent-[#00d2ff] h-1 bg-white/10 rounded-lg cursor-pointer focus:outline-none"
                      id="slider-sand-macro"
                    />
                  </div>

                  {/* Knot Micro Radius */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[9px] font-mono tracking-wider text-white/50 uppercase">
                      <span>Micro Radius (r)</span>
                      <span className="text-cyan-400 font-bold font-mono">{microRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={microRadius}
                      onChange={(e) => setMicroRadius(parseInt(e.target.value))}
                      className="w-full accent-[#00d2ff] h-1 bg-white/10 rounded-lg cursor-pointer focus:outline-none"
                      id="slider-sand-micro"
                    />
                  </div>

                  {/* Knot P Loops */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[9px] font-mono tracking-wider text-white/50 uppercase">
                      <span>Knot P Loops</span>
                      <span className="text-cyan-400 font-bold font-mono">{pLoops}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="1"
                      value={pLoops}
                      onChange={(e) => setPLoops(parseInt(e.target.value))}
                      className="w-full accent-[#00d2ff] h-1 bg-white/10 rounded-lg cursor-pointer focus:outline-none"
                      id="slider-sand-ploops"
                    />
                  </div>

                  {/* Knot Q Twists */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[9px] font-mono tracking-wider text-white/50 uppercase">
                      <span>Knot Q Twists</span>
                      <span className="text-cyan-400 font-bold font-mono">{qTwists}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={qTwists}
                      onChange={(e) => setQTwists(parseInt(e.target.value))}
                      className="w-full accent-[#00d2ff] h-1 bg-white/10 rounded-lg cursor-pointer"
                      id="slider-sand-qtwists"
                    />
                  </div>

                  {/* Energy Flow speed */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[9px] font-mono tracking-wider text-white/50 uppercase">
                      <span>Energy Flow Rate</span>
                      <span className="text-cyan-400 font-bold font-mono">{energyFlow.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="-1.5"
                      max="1.5"
                      step="0.05"
                      value={energyFlow}
                      onChange={(e) => setEnergyFlow(parseFloat(e.target.value))}
                      className="w-full accent-[#00d2ff] h-1 bg-white/10 rounded-lg cursor-pointer"
                      id="slider-sand-flow"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="controls-ocean"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {/* Cyber Ocean Internet Chaos */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[9px] font-mono tracking-wider text-white/50 uppercase">
                      <span>Internet Chaos</span>
                      <span className="text-pink-400 font-bold font-mono">{chaos.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="6.0"
                      step="0.1"
                      value={chaos}
                      onChange={(e) => setChaos(parseFloat(e.target.value))}
                      className="w-full accent-pink-500 h-1 bg-white/10 rounded-lg cursor-pointer"
                      id="slider-sand-chaos"
                    />
                  </div>

                  {/* Cyber Ocean Server Load */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[9px] font-mono tracking-wider text-white/50 uppercase">
                      <span>Server Rig Load</span>
                      <span className="text-pink-400 font-bold font-mono">{load.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.1"
                      value={load}
                      onChange={(e) => setLoad(parseFloat(e.target.value))}
                      className="w-full accent-pink-500 h-1 bg-white/10 rounded-lg cursor-pointer"
                      id="slider-sand-load"
                    />
                  </div>

                  {/* Cyber info stats box */}
                  <div className="border border-white/5 bg-black/[0.15] p-3 rounded text-[9px] font-mono text-white/40 leading-relaxed font-light">
                    <p className="mb-1 text-white/60 font-semibold">[SIMULATOR_LOGS]</p>
                    <p>• Wave function simulation active</p>
                    <p>• Instanced tetrahedral mesh: count 16,000</p>
                    <p>• Interactive pitch & roll lerped smoothly</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Console footer detail block */}
        <div className="border-t border-white/10 pt-4 flex items-start gap-2 text-[8px] font-mono tracking-wider text-white/40 leading-normal">
          <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>REAL-TIME COMPILATION OF INSTANCED THREE.JS SWARM MATRIX COMPLETED VITAL // OK</span>
        </div>
      </div>
    </div>
  );
};
