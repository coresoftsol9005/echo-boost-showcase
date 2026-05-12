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

  // Custom cursor (desktop only)
  useEffect(() => {
    if (isMobile()) return;
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    document.documentElement.classList.add("cinematic-cursor");

    let cx = 0, cy = 0, tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.transform = `translate(${tx - 2}px, ${ty - 2}px)`;
    };
    let raf = 0;
    const tick = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      cursor.style.transform = `translate(${cx - 6}px, ${cy - 6}px) scale(var(--cur-scale, 1))`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [role='button']")) {
        cursor.style.setProperty("--cur-scale", "2");
        cursor.style.borderColor = "#E53935";
      } else {
        cursor.style.setProperty("--cur-scale", "1");
        cursor.style.borderColor = "#90CAF9";
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
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
