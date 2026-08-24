"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Utils                                                                      */
/* -------------------------------------------------------------------------- */

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/* Paleta astral (definida por el cliente).
   Sin corinto ni maroon: acá el fondo es el #282e32 y el rojo sobre ese azul
   es justo lo que se sacó de todo el sitio. Los dos tonos que quedan —ice y
   sand— son los que pinta el campo de estrellas. */
const SPACE = "#282e32";
const BONE = "#ffffff";
const STAR = "#d6e2ed";
const SAND = "#dcddca";

/* -------------------------------------------------------------------------- */
/*  Starfield en canvas — con efecto de "warp" al hacer scroll                 */
/* -------------------------------------------------------------------------- */

interface Star {
  x: number;
  y: number;
  z: number; // profundidad → tamaño + velocidad de warp
  r: number;
  phase: number;
  /** Ritmo propio del parpadeo: sin esto todo el campo late al unísono. */
  speed: number;
  color: string;
  /** Las pocas que llevan destello en cruz (las más cercanas). */
  flare: boolean;
}

/** Estrella fugaz: nace fuera de cuadro, cruza y se apaga. */
interface Shooting {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  len: number;
}

/** Tres tonos de la paleta, no uno: el campo de un solo color se ve impreso. */
const TONOS = [STAR, STAR, STAR, BONE, SAND];

function useStarfield(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  progressRef: React.MutableRefObject<number>,
  pointerRef: React.MutableRefObject<{ x: number; y: number }>,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let fugaces: Shooting[] = [];
    let w = 0;
    let h = 0;
    // Paralaje suavizado: sigue al puntero con retraso, nunca de golpe.
    let px = 0;
    let py = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = clamp(Math.round((w * h) / 900), 70, 340);
      stars = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        r: Math.random() * 1.3 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.6,
        color: TONOS[i % TONOS.length],
        // Una de cada veinte lleva destello: si fueran más, el cielo se vuelve
        // un adorno y deja de leerse como fondo.
        flare: i % 20 === 0,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let time = 0;
    let ultimo = 0;
    let proximaFugaz = 2600;

    const draw = (ahora: number) => {
      if (!ultimo) ultimo = ahora;
      const dt = Math.min(ahora - ultimo, 64);
      ultimo = ahora;
      time += dt / 1000;

      const p = progressRef.current; // 0 = arriba de todo, 1 = fin del hero
      const fade = 1 - clamp((p - 0.25) / 0.75, 0, 1);
      const cx = w / 2;
      const cy = h / 2;
      // Cuanto más scroll, más se abren las estrellas hacia afuera (viaje).
      const warp = 1 + p * p * 3.2;

      // El campo se corre apenas con el puntero: da profundidad sin que se
      // note el truco. 26 px de recorrido total en la capa más cercana.
      px += (pointerRef.current.x - px) * 0.045;
      py += (pointerRef.current.y - py) * 0.045;

      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";

      for (const s of stars) {
        const twinkle = reduce
          ? 0.85
          : 0.5 + 0.5 * Math.sin(time * s.speed + s.phase);
        const idle = reduce ? 0 : Math.sin(time * 0.25 + s.phase) * 2;
        const alpha = twinkle * fade * (0.4 + s.z * 0.6);
        if (alpha <= 0.01) continue;

        // Las de adelante (z alto) se mueven más con el puntero que las del
        // fondo: eso es lo que produce la sensación de capas.
        const par = 0.35 + s.z * 0.9;
        const dx = s.x - cx + px * par;
        const dy = s.y - cy + idle + py * par;
        const x = cx + dx * warp;
        const y = cy + dy * warp;
        const size = s.r * (0.6 + s.z);

        ctx.globalAlpha = alpha;
        if (p > 0.12 && !reduce) {
          // Trazo de "hyperspace": del punto anterior al actual.
          const prevWarp = Math.max(1, warp - 0.4 - s.z * 0.5);
          ctx.strokeStyle = s.color;
          ctx.lineWidth = size;
          ctx.beginPath();
          ctx.moveTo(cx + dx * prevWarp, cy + dy * prevWarp);
          ctx.lineTo(x, y);
          ctx.stroke();
        } else {
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Destello en cruz de las más brillantes. Dos trazos finos y cortos:
        // es lo que separa un punto de una estrella.
        if (s.flare && p < 0.2) {
          const len = size * (5 + twinkle * 4);
          ctx.globalAlpha = alpha * 0.5;
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(x - len, y);
          ctx.lineTo(x + len, y);
          ctx.moveTo(x, y - len);
          ctx.lineTo(x, y + len);
          ctx.stroke();
        }
      }

      /* -------------------------------------------------------------- */
      /*  Fugaces — una cada 6-14 s, nunca dos a la vez                  */
      /* -------------------------------------------------------------- */
      if (!reduce && p < 0.35) {
        proximaFugaz -= dt;
        if (proximaFugaz <= 0 && fugaces.length === 0) {
          proximaFugaz = 6000 + Math.random() * 8000;
          const desdeArriba = Math.random() > 0.5;
          const vel = 0.55 + Math.random() * 0.35;
          fugaces.push({
            x: desdeArriba ? Math.random() * w * 0.7 : -60,
            y: desdeArriba ? -40 : Math.random() * h * 0.5,
            vx: vel,
            vy: vel * (0.35 + Math.random() * 0.3),
            life: 1,
            len: 90 + Math.random() * 110,
          });
        }
      }

      for (const f of fugaces) {
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.life -= dt / 1100;
        if (f.life <= 0) continue;

        const n = Math.hypot(f.vx, f.vy);
        const tx = (f.vx / n) * f.len;
        const ty = (f.vy / n) * f.len;
        // Degradado a lo largo del trazo: la cola se disuelve en el fondo.
        const g = ctx.createLinearGradient(f.x, f.y, f.x - tx, f.y - ty);
        g.addColorStop(0, `rgba(255,255,255,${0.85 * f.life * fade})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(f.x, f.y);
        ctx.lineTo(f.x - tx, f.y - ty);
        ctx.stroke();
      }
      fugaces = fugaces.filter((f) => f.life > 0 && f.x < w + 200 && f.y < h + 200);

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [canvasRef, progressRef, pointerRef]);
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

export function HeroAstral() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  /** Puntero normalizado a px de desplazamiento para el paralaje del campo. */
  const pointerRef = useRef({ x: 0, y: 0 });
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

    // Paralaje: el centro de la pantalla es 0 y cada borde ±13 px. El campo lo
    // suaviza después, así que acá alcanza con guardar el objetivo.
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointerRef.current.x = (e.clientX / window.innerWidth - 0.5) * -26;
      pointerRef.current.y = (e.clientY / window.innerHeight - 0.5) * -26;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(raf);
    };
  }, []);

  useStarfield(canvasRef, progressRef, pointerRef);

  // El fondo se mantiene OSCURO todo el scroll (no se aclara). El progreso
  // solo mueve las capas (warp + parallax) y desvanece el contenido al final.
  const bg = SPACE;
  const heading = BONE;
  // El texto NO desaparece: se mantiene visible y solo se reduce (escala) al bajar.
  const contentScale = 1 - clamp(progress, 0, 1) * 0.42;
  const contentShift = clamp(progress, 0, 1) * -30;

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
            background: `radial-gradient(circle, ${SPACE}40 0%, transparent 62%)`,
            opacity: (1 - progress) * 0.9,
            transform: `translate(-50%, -50%) scale(${1 + progress * 1.4})`,
          }}
          aria-hidden="true"
        />

        {/* Contenido — se reduce al hacer scroll pero NO desaparece */}
        <div
          /* El gap se mide en vh a propósito: con las tres líneas de apertura
             del doc el bloque creció, y en pantallas bajas (667px, iPhone SE)
             un gap fijo empujaba el botón fuera del dvh. */
          className="relative z-10 flex max-w-[min(1100px,92vw)] flex-col items-center gap-[clamp(1rem,2.6vh,2.5rem)] px-[clamp(1rem,3vw,3rem)] text-center"
          style={{
            transform: `translateY(${contentShift}px) scale(${contentScale})`,
            transformOrigin: "center top",
          }}
        >
          {/* El kicker entra bajo su propia máscara, como las líneas del
              titular: todo el bloque se descubre con el mismo gesto.

              El margen va en ESTE div y no en el .line-mask: la clase declara
              `margin` en forma corta (para cancelar su propio padding) y eso
              pisaría cualquier `mt-*` puesto en el mismo elemento. El margen
              baja el bloque para que no quede pegado al borde; en vh y no fijo
              porque en pantallas bajas 88px era espacio que le hacía falta al
              botón. */}
          <div className="mt-[clamp(2.75rem,9vh,5.5rem)]">
            <span className="line-mask">
              <span
                className="font-mono text-xs uppercase tracking-kicker"
                style={{ color: `${STAR}cc`, animationDelay: "60ms" }}
              >
                Estudio de branding · Guatemala
              </span>
            </span>
          </div>

          {/* El doc de textos da el titular con su línea de apoyo pegada, así
              que van en un mismo bloque: si se separan, el gap del flex los
              lee como dos ideas distintas. */}
          <div className="flex flex-col items-center gap-[clamp(0.6rem,1.4vh,1.1rem)]">
            {/* Cada línea se descubre bajo su propia máscara, escalonada. Es lo
                que da la entrada de estudio: la línea SE ASIENTA en su lugar
                en vez de aparecer de a bloques. Las líneas van explícitas (y
                no con <br/>) porque cada una necesita su máscara. */}
            <h1
              className="m-0 max-w-[20ch] font-display text-display-3xl font-medium text-balance"
              style={{ color: heading }}
            >
              <span className="line-mask">
                <span style={{ animationDelay: "180ms" }}>La marca es el único</span>
              </span>
              <span className="line-mask">
                <span style={{ animationDelay: "320ms" }}>
                  activo que crece{" "}
                  {/* "cuando se usa" brilla como una estrella: la palabra en
                      blanco se enciende y se atenúa en loop, pero nunca se apaga
                      del todo —siempre se lee—. La animación vive en globals.css
                      (.brillo-estrella). */}
                  <span className="brillo-estrella">cuando se usa.</span>
                </span>
              </span>
            </h1>
          </div>

          {/* El método dejó de estar en la landing: ahora es su propia
              página, así que esto pasa de un scroll suave a una navegación. */}
          {/* Mismo motivo que el kicker: el `mt-2` va afuera del .line-mask. */}
          <div className="mt-2">
            <span className="line-mask">
              <span style={{ animationDelay: "520ms" }}>
                <Link
                  href="/metodologia"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-pill border px-6 py-3 text-base transition-colors duration-500"
                  style={{ color: heading, borderColor: `${STAR}55` }}
                >
                  {/* El relleno entra desde abajo en vez de prenderse de golpe:
                      un fondo que aparece a los 300 ms se lee como un parpadeo. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                    style={{ background: `${STAR}14` }}
                  />
                  <span className="relative">Conocer el método</span>
                  <span className="relative font-mono transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[4px]">
                    →
                  </span>
                </Link>
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
