import { useEffect, useRef } from "react";
import * as THREE from "three";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

export default function CinematicLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
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

  // Custom cursor (desktop only) — smooth lerp + scroll-driven spiral
  useEffect(() => {
    if (isMobile()) return;
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!cursor || !dot || !ring) return;
    const reduced = prefersReducedMotion();

    document.documentElement.classList.add("cinematic-cursor");

    // Detect low-end device — drop the expensive glow filter & throttle ring updates
    const lowEnd =
      (navigator as any).hardwareConcurrency != null &&
      (navigator as any).hardwareConcurrency <= 4;
    const deviceMemory = (navigator as any).deviceMemory;
    const veryLowEnd = lowEnd && deviceMemory != null && deviceMemory <= 4;
    if (lowEnd) ring.classList.add("is-lowend");

    // Positions
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;        // smoothed ring/circle
    let dx = tx, dy = ty;        // dot (near-instant)
    let scale = 1, scaleTarget = 1;
    let rot = 0;                 // spiral rotation
    let scrollSpin = 0;          // current scroll-driven angular velocity
    let scrollIntensity = 0;     // 0..1 — how "active" the spiral is
    let lastScrollY = window.scrollY;
    let scrollTimer: number | undefined;
    let ringOpacity = 0;         // tracked locally to avoid style reads
    let ringMounted = false;     // skip ring writes while fully idle+hidden

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY;
      lastScrollY = y;
      // Map scroll delta to angular velocity (deg per frame target)
      const cap = veryLowEnd ? 16 : 24;
      scrollSpin = Math.max(-cap, Math.min(cap, delta * 0.6));
      scrollIntensity = 1;
      if (scrollTimer) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        scrollIntensity = 0;
      }, 180);
    };

    // Frame-rate cap (60fps target on low-end, otherwise uncapped)
    const minFrameMs = veryLowEnd ? 1000 / 30 : 0;
    let lastFrame = 0;
    let raf = 0;
    // Last-written values so we can skip redundant style writes
    let lastCurX = NaN, lastCurY = NaN, lastCurS = NaN;
    let lastDotX = NaN, lastDotY = NaN;
    let lastRingX = NaN, lastRingY = NaN, lastRingR = NaN, lastRingS = NaN;
    let lastOpacityWritten = -1;

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (minFrameMs > 0 && t - lastFrame < minFrameMs) return;
      lastFrame = t;

      // Smooth follow
      const ease = 0.22;
      cx += (tx - cx) * ease;
      cy += (ty - cy) * ease;
      // Dot tracks faster
      dx += (tx - dx) * 0.55;
      dy += (ty - dy) * 0.55;
      // Scale ease
      scale += (scaleTarget - scale) * 0.18;

      // Cursor write (skip if movement is sub-pixel & scale unchanged)
      if (
        Math.abs(cx - lastCurX) > 0.05 ||
        Math.abs(cy - lastCurY) > 0.05 ||
        Math.abs(scale - lastCurS) > 0.005
      ) {
        cursor.style.transform = `translate3d(${cx - 6}px, ${cy - 6}px, 0) scale(${scale.toFixed(3)})`;
        lastCurX = cx; lastCurY = cy; lastCurS = scale;
      }
      if (Math.abs(dx - lastDotX) > 0.05 || Math.abs(dy - lastDotY) > 0.05) {
        dot.style.transform = `translate3d(${dx - 2}px, ${dy - 2}px, 0)`;
        lastDotX = dx; lastDotY = dy;
      }

      if (reduced) return;

      // Decay spin every frame
      scrollSpin *= 0.88;

      // Track local opacity (fade out when idle, snap to 1 when scrolling)
      if (scrollIntensity > 0) {
        ringOpacity = 1;
      } else if (ringOpacity > 0) {
        ringOpacity = Math.max(0, ringOpacity - 0.04);
      }

      // Skip ring work entirely while idle and invisible
      if (ringOpacity <= 0 && Math.abs(scrollSpin) < 0.01) {
        if (ringMounted) {
          ring.style.opacity = "0";
          lastOpacityWritten = 0;
          ringMounted = false;
        }
        return;
      }
      ringMounted = true;

      // Spiral rotation — only advance when needed
      rot += scrollIntensity > 0 ? scrollSpin : 0.6;
      // Keep rot bounded to avoid float drift after long sessions
      if (rot > 1e6 || rot < -1e6) rot = rot % 360;

      const ringScale = 0.6 + scrollIntensity * 0.55 + (scale - 1) * 0.4;

      if (
        Math.abs(cx - lastRingX) > 0.1 ||
        Math.abs(cy - lastRingY) > 0.1 ||
        Math.abs(rot - lastRingR) > 0.25 ||
        Math.abs(ringScale - lastRingS) > 0.005
      ) {
        ring.style.transform = `translate3d(${cx}px, ${cy}px, 0) rotate(${rot.toFixed(2)}deg) scale(${ringScale.toFixed(3)})`;
        lastRingX = cx; lastRingY = cy; lastRingR = rot; lastRingS = ringScale;
      }
      if (Math.abs(ringOpacity - lastOpacityWritten) > 0.02) {
        ring.style.opacity = ringOpacity.toFixed(2);
        lastOpacityWritten = ringOpacity;
      }
    };
    raf = requestAnimationFrame(tick);

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [role='button']")) {
        scaleTarget = 2;
        cursor.style.borderColor = "#E53935";
      } else {
        scaleTarget = 1;
        cursor.style.borderColor = "#90CAF9";
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      if (scrollTimer) window.clearTimeout(scrollTimer);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("scroll", onScroll);
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
      {/* Cursor */}
      <div ref={ringRef} id="cine-cursor-ring" aria-hidden />
      <div ref={cursorRef} id="cine-cursor" aria-hidden />
      <div ref={dotRef} id="cine-cursor-dot" aria-hidden />
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
