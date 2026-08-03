"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Utils                                                                      */
/* -------------------------------------------------------------------------- */

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/* Paleta astral (definida por el cliente) */
const SPACE = "#282e32";
const BONE = "#ffffff";
const STAR = "#d6e2ed";
const MAROON = "#5f0000";
/** Corinto/rojo de marca, aclarado lo justo para que se lea sobre el oscuro.
 *  El #b3243b de marca daba 2.12:1 acá — no llegaba al 3:1 del texto grande. */
const CORINTO = "#d94358";

/* -------------------------------------------------------------------------- */
/*  Starfield en canvas — con efecto de "warp" al hacer scroll                 */
/* -------------------------------------------------------------------------- */

interface Star {
  x: number;
  y: number;
  z: number; // profundidad → tamaño + velocidad de warp
  r: number;
  phase: number;
}

function useStarfield(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  progressRef: React.MutableRefObject<number>,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = clamp(Math.round((w * h) / 6500), 60, 280);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        r: Math.random() * 1.3 + 0.3,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let time = 0;

    const draw = () => {
      time += 0.016;
      const p = progressRef.current; // 0 = espacio, 1 = claro
      const fade = 1 - clamp((p - 0.25) / 0.75, 0, 1);
      const cx = w / 2;
      const cy = h / 2;
      // Cuanto más scroll, más se abren las estrellas hacia afuera (viaje).
      const warp = 1 + p * p * 3.2;

      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";

      for (const s of stars) {
        const twinkle = reduce ? 0.85 : 0.55 + 0.45 * Math.sin(time * 1.4 + s.phase);
        const idle = reduce ? 0 : Math.sin(time * 0.25 + s.phase) * 2;
        const alpha = twinkle * fade * (0.45 + s.z * 0.55);
        if (alpha <= 0.01) continue;

        const dx = s.x - cx;
        const dy = s.y - cy + idle;
        const x = cx + dx * warp;
        const y = cy + dy * warp;
        const color = s.z > 0.9 ? MAROON : STAR;
        const size = s.r * (0.6 + s.z);

        ctx.globalAlpha = alpha;
        if (p > 0.12 && !reduce) {
          // Trazo de "hyperspace": del punto anterior al actual.
          const prevWarp = Math.max(1, warp - 0.4 - s.z * 0.5);
          const px = cx + dx * prevWarp;
          const py = cy + dy * prevWarp;
          ctx.strokeStyle = color;
          ctx.lineWidth = size;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(x, y);
          ctx.stroke();
        } else {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    if (reduce) draw();
    else raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [canvasRef, progressRef]);
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

export function HeroAstral() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
        progressRef.current = p;
        setProgress(p);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useStarfield(canvasRef, progressRef);

  // El fondo se mantiene OSCURO todo el scroll (no se aclara). El progreso
  // solo mueve las capas (warp + parallax) y desvanece el contenido al final.
  const bg = SPACE;
  const heading = BONE;
  const body = STAR;
  // El texto NO desaparece: se mantiene visible y solo se reduce (escala) al bajar.
  const contentScale = 1 - clamp(progress, 0, 1) * 0.42;
  const contentShift = clamp(progress, 0, 1) * -30;

  // "Conoce el método": salta directo a la sección método con scroll suave.
  const goToMetodo = (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById("proceso")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative h-[150vh]"
      style={{ backgroundColor: bg }}
    >
      {/* h-dvh y no h-screen: en móvil la barra del navegador se retrae y
          100vh deja un salto de layout que h-dvh no tiene. */}
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        />

        {/* Halo que crece con el scroll */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[65vmin] w-[65vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${MAROON}40 0%, transparent 62%)`,
            opacity: (1 - progress) * 0.9,
            transform: `translate(-50%, -50%) scale(${1 + progress * 1.4})`,
          }}
          aria-hidden="true"
        />

        {/* Contenido — se reduce al hacer scroll pero NO desaparece */}
        <div
          className="relative z-10 flex max-w-[min(1100px,92vw)] flex-col items-center gap-[clamp(1.5rem,3vh,2.5rem)] px-[clamp(1rem,3vw,3rem)] text-center"
          style={{
            transform: `translateY(${contentShift}px) scale(${contentScale})`,
            transformOrigin: "center top",
          }}
        >
          <span
            className="font-mono text-xs uppercase tracking-kicker animate-drift-up"
            style={{ color: body, animationDelay: "80ms" }}
          >
            Estudio de branding · Guatemala
          </span>

          <h1
            className="m-0 max-w-[20ch] font-display text-display-3xl font-medium animate-drift-up text-balance"
            style={{ color: heading, animationDelay: "160ms" }}
          >
            Las marcas se construyen.
            <br />
            Los valores se{" "}
            <span style={{ color: CORINTO }}>revelan</span>
            <span style={{ color: CORINTO }}>.</span>
          </h1>

          <p
            className="max-w-[62ch] text-lead animate-drift-up text-pretty"
            style={{ color: body, animationDelay: "260ms" }}
          >
            Estudio de branding y comunicación estratégica. Convertimos lo que
            una empresa <em>es</em> en decisiones que el mercado entiende.
          </p>

          <Link
            href="/#proceso"
            onClick={goToMetodo}
            className="group mt-2 inline-flex items-center gap-2 rounded-pill border px-6 py-3 text-base transition-colors duration-300 animate-drift-up hover:bg-white/5"
            style={{
              color: heading,
              borderColor: `${STAR}66`,
              animationDelay: "360ms",
            }}
          >
            Conoce el método
            <span className="font-mono transition-transform duration-300 group-hover:translate-x-[3px]">
              →
            </span>
          </Link>
        </div>

        {/* Indicador de scroll */}
        <div
          className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
          style={{ opacity: 1 - progress * 3 }}
          aria-hidden="true"
        >
          <span
            className="font-mono text-[0.65rem] uppercase tracking-kicker"
            style={{ color: STAR }}
          >
            scroll
          </span>
          <span
            className="block h-8 w-[1px]"
            style={{ background: `linear-gradient(${STAR}, transparent)` }}
          />
        </div>
      </div>
    </section>
  );
}
