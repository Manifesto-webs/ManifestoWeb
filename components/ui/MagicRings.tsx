"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Fondo "magic rings": ondas concéntricas que se expanden desde el centro con
 * glow, y que **siguen el mouse** con parallax por capas (sensación espacial).
 * El color se cambia con la prop `color`. CSS respeta prefers-reduced-motion.
 */

const RINGS = [0, 1, 2, 3];

const STARS: [number, number, number, number][] = [
  [10, 24, 2, 0], [22, 70, 4, 1.4], [34, 16, 3, 0.6], [48, 84, 2, 2.0],
  [60, 30, 2, 0.9], [72, 66, 3, 1.7], [84, 20, 2, 0.4], [90, 74, 2, 2.3],
  [16, 88, 2, 1.1], [66, 90, 2, 0.7],
];

interface MagicRingsProps {
  /** Color de los anillos y el glow (cualquier color CSS). */
  color?: string;
  className?: string;
}

export function MagicRings({ color = "#5f0000", className = "" }: MagicRingsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const guidesRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // objetivo (según cursor) y valor actual (suavizado)
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    let alive = true;

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      target.x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      target.y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      target.x = Math.max(-1, Math.min(1, target.x));
      target.y = Math.max(-1, Math.min(1, target.y));
    };

    const loop = () => {
      if (!alive) return;
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      // Cada capa se mueve distinto → profundidad (parallax)
      if (glowRef.current)
        glowRef.current.style.transform = `translate(calc(-50% + ${cur.x * 46}px), calc(-50% + ${cur.y * 46}px))`;
      if (ringsRef.current)
        ringsRef.current.style.transform = `translate(${cur.x * 26}px, ${cur.y * 26}px)`;
      if (guidesRef.current)
        guidesRef.current.style.transform = `translate(-50%, -50%) translate(${cur.x * 16}px, ${cur.y * 16}px)`;
      if (starsRef.current)
        starsRef.current.style.transform = `translate(${cur.x * 10}px, ${cur.y * 10}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      alive = false;
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const style = { "--ring-color": color } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={style}
      aria-hidden="true"
    >
      {/* Glow central (sigue más al cursor) */}
      <div
        ref={glowRef}
        className="absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] will-change-transform"
        style={{ background: `radial-gradient(circle, ${color}55 0%, transparent 66%)` }}
      />

      {/* Guías estáticas */}
      <div
        ref={guidesRef}
        className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="20" stroke={color} strokeOpacity="0.10" strokeWidth="0.12" />
          <circle cx="50" cy="50" r="34" stroke={color} strokeOpacity="0.08" strokeWidth="0.12" />
          <circle cx="50" cy="50" r="47" stroke={color} strokeOpacity="0.06" strokeWidth="0.12" />
        </svg>
      </div>

      {/* Ondas animadas */}
      <div ref={ringsRef} className="absolute inset-0 will-change-transform">
        {RINGS.map((i) => (
          <span key={i} className="magic-ring" style={{ animationDelay: `${i * 1.5}s` }} />
        ))}
      </div>

      {/* Estrellas */}
      <div ref={starsRef} className="absolute inset-0 will-change-transform">
        {STARS.map(([x, y, s, d], i) => (
          <span
            key={i}
            className="animate-twinkle absolute block rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              height: `${s}px`,
              width: `${s}px`,
              background: "#d6e2ed",
              animationDelay: `${d}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
