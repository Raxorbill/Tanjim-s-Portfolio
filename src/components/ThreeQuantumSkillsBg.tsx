import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeQuantumSkillsBgProps {
  activeSkill: string | null;
}

export const ThreeQuantumSkillsBg: React.FC<ThreeQuantumSkillsBgProps> = ({ activeSkill }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef({ activeSkill });

  useEffect(() => {
    paramsRef.current = { activeSkill };
  }, [activeSkill]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || 700;

    const isMobileDevice = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    const COUNT = isMobileDevice ? 5000 : 10000; // Optimal performance and depth on all displays

    // Setup Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.007);

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 75);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // Instanced Mesh
    const geometry = new THREE.TetrahedronGeometry(0.18);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const instancedMesh = new THREE.InstancedMesh(geometry, material, COUNT);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);

    // State vectors (lerped continuously in render loop)
    const currentPositions: THREE.Vector3[] = [];
    const targetPositions: THREE.Vector3[] = [];
    const targetColors: THREE.Color[] = [];
    const currentColors: THREE.Color[] = [];

    const dummy = new THREE.Object3D();
    const tempColor = new THREE.Color();

    // Populate initial particles randomly in space with deep teal/indigo initial themes
    for (let i = 0; i < COUNT; i++) {
      const initialPos = new THREE.Vector3(
        (Math.random() - 0.5) * 140,
        (Math.random() - 0.5) * 145,
        (Math.random() - 0.5) * 140
      );
      currentPositions.push(initialPos.clone());
      targetPositions.push(initialPos.clone());
      
      const col = new THREE.Color().setHSL(0.6 + Math.random() * 0.15, 0.85, 0.35);
      currentColors.push(col.clone());
      targetColors.push(col.clone());
      instancedMesh.setColorAt(i, col);
    }

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const computeMorphicTargets = (active: string | null, time: number) => {
      for (let i = 0; i < COUNT; i++) {
        const u = i / COUNT;
        let tx = 0, ty = 0, tz = 0;
        let h = 0.58, s = 0.8, l = 0.3; // Default warm indigo theme

        if (!active) {
          // --- STATE 0: IDLE COSMIC CLOUD ---
          // A slowly rotating swarm forming concentric galactic shells
          const t1 = u * Math.PI * 2.0;
          const layerIdx = i % 4; // 4 shells of stars
          const baseRadius = 15 + layerIdx * 8;
          
          // Wander offsets
          const noise = Math.sin(time * 0.15 + i * 0.08) * 1.5;
          const theta = t1 + (time * 0.035);
          const phi = Math.acos(((i % 100) / 100) * 2 - 1) + Math.cos(time * 0.05 + i * 0.03) * 0.15;

          tx = (baseRadius + noise) * Math.sin(phi) * Math.cos(theta);
          ty = (baseRadius + noise) * Math.sin(phi) * Math.sin(theta);
          tz = (baseRadius + noise) * Math.cos(phi);

          h = 0.62 + (layerIdx * 0.04) + Math.sin(t1 * 2) * 0.02;
          s = 0.82;
          l = 0.12 + (4 - layerIdx) * 0.06;

        } else if (active === "Artificial Intelligence" || active === "Machine Learning") {
          // --- STATE 1 & STATE 5: AI / NEURAL SYNAPSES ---
          // Dense node clusters representing neural layer layers with axons
          const isCore = i % 15 === 0;
          const layer = i % 3; // Input, Hidden, Output node slots

          if (isCore) {
            // High intensity key synapse center coordinates
            const layerPos = (layer - 1) * 32;
            const subId = Math.floor(i / 15) % 6;
            const nodeAngle = (subId / 6) * Math.PI * 2.5;

            tx = layerPos;
            ty = Math.sin(nodeAngle) * 16;
            tz = Math.cos(nodeAngle) * 16;

            h = 0.51; // Bright cyan synapse highlights
            s = 0.95;
            l = 0.85; // Intense glow
          } else {
            // Bridge fibers emanating from synapse locations
            const parentCore = i - (i % 15);
            const parentLayer = parentCore % 3;
            const parentSubId = Math.floor(parentCore / 15) % 6;
            const parentAngle = (parentSubId / 6) * Math.PI * 2.5;

            const xStart = (parentLayer - 1) * 32;
            const yStart = Math.sin(parentAngle) * 16;
            const zStart = Math.cos(parentAngle) * 16;

            // Target connection vectors
            const nextLayer = (parentLayer + 1) % 3;
            const nextAngle = parentAngle + 1.2;
            const xEnd = (nextLayer - 1) * 32;
            const yEnd = Math.sin(nextAngle) * 16;
            const zEnd = Math.cos(nextAngle) * 16;

            const lerpFactor = (i % 15) / 15;
            const arcOffset = Math.sin(lerpFactor * Math.PI) * 4;

            tx = THREE.MathUtils.lerp(xStart, xEnd, lerpFactor);
            ty = THREE.MathUtils.lerp(yStart, yEnd, lerpFactor) + arcOffset;
            tz = THREE.MathUtils.lerp(zStart, zEnd, lerpFactor);

            h = 0.53 + lerpFactor * 0.07;
            s = 0.85;
            l = 0.22 + (1 - Math.abs(lerpFactor - 0.5)) * 0.25;
          }

        } else if (active === "Web Development") {
          // --- STATE 2: CYBER HIGH FREQUENCY GRID CYBERWAVE ---
          // Continuous ripple waves matching high loading indices
          const waveSize = 85;
          const gridSide = Math.floor(Math.sqrt(COUNT));

          const row = Math.floor(i / gridSide);
          const col = i % gridSide;

          const cx = (col / gridSide - 0.5) * waveSize;
          const cz = (row / gridSide - 0.5) * waveSize;

          const distanceCoord = Math.sqrt(cx * cx + cz * cz);
          const w1 = Math.sin(cx * 0.12 + time * 2.8) * 2.2;
          const w2 = Math.cos(cz * 0.15 - time * 1.8) * 2.2;
          const rip = Math.sin(distanceCoord * 0.22 - time * 3.5) * 1.8;

          tx = cx;
          ty = w1 + w2 + rip - 4;
          tz = cz;

          h = 0.52 + (Math.sin(distanceCoord * 0.05) * 0.08); // Indigo to bright cyan wave transitions
          s = 0.95;
          l = 0.1 + (Math.max(-5, ty) + 5) * 0.07;

        } else if (active === "Python") {
          // --- STATE 3: SPIRALING DOUBLE HELIX CODE STRANDS ---
          // Double helix spiral ribbons rotating about the center axis
          const isHelixB = i >= COUNT / 2;
          const localU = (i % (COUNT / 2)) / (COUNT / 2);

          const helixTurns = 5;
          const theta = localU * Math.PI * 2.0 * helixTurns + time * 0.9;
          const currentHeight = (localU - 0.5) * 48;
          const rad = 14 + Math.sin(theta * 2.5) * 1.5;

          const bOffset = isHelixB ? Math.PI : 0;

          tx = Math.cos(theta + bOffset) * rad;
          ty = currentHeight;
          tz = Math.sin(theta + bOffset) * rad;

          h = isHelixB ? 0.08 : 0.55; // Beautiful Gold vs Cyan helix pairings!
          s = 0.95;
          l = 0.28 + Math.sin(theta * 3.0) * 0.12;

        } else if (active === "C/C++") {
          // --- STATE 4: TWISTING HOLOGRAPHIC MOBIUS STRIP ---
          // Non-orientable geometric loop
          const angle = u * Math.PI * 2.0 + time * 0.4;
          const mobiusTurns = u * Math.PI * 2.5;
          const stripWidth = 9 + Math.sin(time * 1.5 + i * 0.01) * 2;

          const radialOffset = 22 + Math.cos(mobiusTurns) * stripWidth;

          tx = Math.cos(angle) * radialOffset;
          ty = Math.sin(mobiusTurns) * stripWidth;
          tz = Math.sin(angle) * radialOffset;

          h = 0.14 + (Math.sin(angle * 2.0) * 0.04); // Bright high contrast futuristic yellow theme!
          s = 0.95;
          l = 0.35 + Math.sin(angle * 2) * 0.15;

        } else if (active === "UI/UX Design") {
          // --- STATE 6: TOROIDAL KNOT MATRIX ---
          // Elegant dimensional Escher locks
          const knotsP = 3;
          const knotsQ = 4;
          const R = 23;
          const r = 8;

          const knotT = u * Math.PI * 2.0 + (time * 0.35);
          const radTerm = R + r * Math.cos(knotsQ * knotT);

          tx = radTerm * Math.cos(knotsP * knotT);
          ty = radTerm * Math.sin(knotsP * knotT);
          tz = r * Math.sin(knotsQ * knotT);

          h = 0.55 + (Math.sin(knotT * 3) * 0.06); // High-concept rich cyan/magenta overlays
          s = 0.95;
          l = 0.32;

        } else if (active === "Graphic Design") {
          // --- STATE 7: GOLDEN FIBONACCI RADIAL SPIRAL ---
          const phiDiff = Math.PI * (3 - Math.sqrt(5)); // Golden angle
          const fibTheta = i * phiDiff + time * 0.18;
          const fibRadius = Math.sqrt(i) * 0.38;

          tx = Math.cos(fibTheta) * fibRadius;
          ty = Math.sin(fibTheta) * fibRadius;
          tz = Math.sin(fibRadius * 0.22 - time * 2.0) * 3.0;

          h = 0.84 + (fibRadius * 0.0035); // Creative magenta sunset glow
          s = 0.9;
          l = Math.max(0.08, Math.min(0.7, 0.55 - (fibRadius * 0.006)));

        } else {
          // --- STATE 8: VIDEO EDITING DYNAMIC FREQUENCY SPLINE ---
          // Waveform spectrum lanes
          const colX = (u - 0.5) * 85;
          const speedFreq = 3.5;
          const soundLines = i % 5; // 5 parallel signal lanes

          const laneY = (soundLines - 2) * 4.5;
          const localFreq = 0.12;

          const wavePeak = Math.sin(colX * localFreq + time * speedFreq) * Math.cos(colX * 0.04 - time * 0.5) * 8.5;

          tx = colX;
          ty = laneY + wavePeak;
          tz = Math.sin(colX * 0.15 - time * 2.0) * 2.5;

          h = 0.53 + (soundLines * 0.06); 
          s = 0.95;
          l = 0.15 + (Math.abs(wavePeak) / 8.5) * 0.35;
        }

        targetPositions[i].set(tx, ty, tz);
        targetColors[i].setHSL(h % 1.0, s, l);
      }
    };

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

    // Setup IntersectionObserver to pause rendering when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return; // Completely pauses rendering and matrix math for 5000+ particles!

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const config = paramsRef.current;

      // Dynamically compute vectors for the active state
      computeMorphicTargets(config.activeSkill, time);

      // Perform smooth physics translation (lerp) for target coordinates and hex color standards
      const lerpSpeed = 0.072; // Yields organic smooth deceleration animations

      // Gentle global rotation based on background wander
      scene.rotation.y = time * 0.045;
      scene.rotation.x = Math.sin(time * 0.08) * 0.05;

      for (let i = 0; i < COUNT; i++) {
        currentPositions[i].lerp(targetPositions[i], lerpSpeed);
        currentColors[i].lerp(targetColors[i], lerpSpeed);

        dummy.position.copy(currentPositions[i]);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
        instancedMesh.setColorAt(i, currentColors[i]);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) {
        instancedMesh.instanceColor.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }

    animate();

    // Auto-resizer triggers
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current || !camera || !renderer) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || 700;

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
      observer.disconnect();
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

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block opacity-70" />
      {/* Visual dark mask to prevent layout elements contrast failure */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/95 via-transparent to-brand-black/98 pointer-events-none" />
    </div>
  );
};
