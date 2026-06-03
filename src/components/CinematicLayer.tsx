import { useEffect, useRef } from "react";
import * as THREE from "three";


const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

export default function CinematicLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);


  // Three.js hero background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = prefersReducedMotion();
    const mobile = isMobile();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Particles
    const particleCount = mobile ? 200 : 600;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    const pGeom = new THREE.BufferGeometry();
    pGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x90caf9,
      size: 0.18,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pGeom, pMat);
    scene.add(points);

    // 12 large faint torus rings
    const rings: THREE.Mesh[] = [];
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x3d5a80,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    });
    for (let i = 0; i < 12; i++) {
      const r = 6 + Math.random() * 14;
      const geom = new THREE.TorusGeometry(r, 0.08, 8, 64);
      const m = new THREE.Mesh(geom, ringMat);
      m.position.set((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40);
      m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      m.userData = {
        rx: (Math.random() - 0.5) * 0.002,
        ry: (Math.random() - 0.5) * 0.002,
        rz: (Math.random() - 0.5) * 0.002,
      };
      scene.add(m);
      rings.push(m);
    }

    let raf = 0;
    const animate = () => {
      if (!reduced) {
        const pos = pGeom.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          pos.array[i * 3 + 1] = (pos.array[i * 3 + 1] as number) + 0.01;
          if ((pos.array[i * 3 + 1] as number) > 40) pos.array[i * 3 + 1] = -40;
        }
        pos.needsUpdate = true;
        rings.forEach((m) => {
          m.rotation.x += m.userData.rx;
          m.rotation.y += m.userData.ry;
          m.rotation.z += m.userData.rz;
        });
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      pGeom.dispose();
      pMat.dispose();
      ringMat.dispose();
      rings.forEach((r) => r.geometry.dispose());
    };
  }, []);

  // Scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const bar = progressRef.current;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Custom cursor (desktop only) — canvas-rendered spiral + dot for smooth GPU paint
  useEffect(() => {
    if (isMobile()) return;
    const canvas = cursorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const reduced = prefersReducedMotion();

    document.documentElement.classList.add("cinematic-cursor");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Positions
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;      // smoothed ring
    let dx = tx, dy = ty;      // dot (fast)
    let scale = 1, scaleTarget = 1;
    let hoverAccent = false;
    let rot = 0;
    let scrollSpin = 0;
    let scrollIntensity = 0;
    let lastScrollY = window.scrollY;
    let scrollTimer: number | undefined;

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY;
      lastScrollY = y;
      scrollSpin = Math.max(-24, Math.min(24, delta * 0.6));
      scrollIntensity = 1;
      if (scrollTimer) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => { scrollIntensity = 0; }, 220);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      hoverAccent = !!t.closest?.("a, button, [role='button']");
      scaleTarget = hoverAccent ? 1.8 : 1;
    };

    let raf = 0;
    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const drawSpiral = (x: number, y: number, baseR: number, rotation: number, intensity: number) => {
      // Spiral made of arc segments — fast to draw, looks like a 3D ribbon
      const turns = 1.4;
      const segs = 48;
      const startR = baseR * 0.35;
      const endR = baseR * (1 + intensity * 0.35);
      const rad = (rotation * Math.PI) / 180;
      ctx.lineCap = "round";
      for (let i = 0; i < segs; i++) {
        const tNorm = i / (segs - 1);
        const a0 = rad + tNorm * turns * Math.PI * 2;
        const a1 = rad + ((i + 1) / (segs - 1)) * turns * Math.PI * 2;
        const r0 = startR + (endR - startR) * tNorm;
        const r1 = startR + (endR - startR) * ((i + 1) / (segs - 1));
        const x0 = x + Math.cos(a0) * r0;
        const y0 = y + Math.sin(a0) * r0;
        const x1 = x + Math.cos(a1) * r1;
        const y1 = y + Math.sin(a1) * r1;
        // Color shifts from accent red -> blue along the spiral
        const r = Math.round(229 + (144 - 229) * tNorm);
        const g = Math.round(57 + (202 - 57) * tNorm);
        const b = Math.round(53 + (249 - 53) * tNorm);
        const alpha = (0.25 + tNorm * 0.75) * (0.5 + intensity * 0.5);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.lineWidth = 1 + tNorm * 1.6;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);

      // Smoothing
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      dx += (tx - dx) * 0.55;
      dy += (ty - dy) * 0.55;
      scale += (scaleTarget - scale) * 0.18;
      scrollSpin *= 0.9;
      rot += scrollIntensity > 0 ? scrollSpin : 0.5;
      if (rot > 1e6 || rot < -1e6) rot = rot % 360;

      ctx.clearRect(0, 0, W(), H());

      // Pulsing halo on interactive hover — clear "clickable" affordance
      const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 280);
      if (hoverAccent) {
        // Soft outer halo
        const haloR = 22 + pulse * 4;
        const grad = ctx.createRadialGradient(cx, cy, haloR * 0.4, cx, cy, haloR);
        grad.addColorStop(0, "rgba(229,57,53,0.28)");
        grad.addColorStop(1, "rgba(229,57,53,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Outer ring (always visible — this IS the cursor)
      const ringR = 14 * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.lineWidth = hoverAccent ? 2 : 1.5;
      ctx.strokeStyle = hoverAccent ? "rgba(229,57,53,0.95)" : "rgba(144,202,249,0.9)";
      ctx.stroke();

      // "Click" indicator: small inner filled disc when hovering interactive
      if (hoverAccent) {
        ctx.beginPath();
        ctx.arc(cx, cy, 5 + pulse * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(229,57,53,0.9)";
        ctx.fill();
      }

      // Spiral overlay during scroll
      if (!reduced && scrollIntensity > 0.02) {
        drawSpiral(cx, cy, 26 + scale * 6, rot, scrollIntensity);
      } else if (!reduced && Math.abs(scrollSpin) > 0.05) {
        drawSpiral(cx, cy, 26 + scale * 6, rot, Math.min(1, Math.abs(scrollSpin) / 4));
      }


      // Dot
      ctx.beginPath();
      ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#E53935";
      ctx.fill();
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      if (scrollTimer) window.clearTimeout(scrollTimer);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      document.documentElement.classList.remove("cinematic-cursor");
    };
  }, []);


  // Section reveal
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const sections = document.querySelectorAll<HTMLElement>("section");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("cine-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    sections.forEach((s) => {
      // Skip sections already in viewport on initial load
      const r = s.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        s.classList.add("cine-visible");
      } else {
        s.classList.add("cine-section");
        io.observe(s);
      }
    });
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Hero three.js canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
      {/* Grain overlay */}
      <div className="cine-grain" aria-hidden />
      {/* Vignette */}
      <div className="cine-vignette" aria-hidden />
      {/* Scroll progress */}
      <div className="cine-progress-track" aria-hidden>
        <div ref={progressRef} className="cine-progress-bar" />
      </div>
      {/* Cursor (canvas-rendered spiral + dot) */}
      <canvas ref={cursorCanvasRef} id="cine-cursor-canvas" aria-hidden />

      {/* SVG noise filter */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id="cine-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
    </>
  );
}
