"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";

/* -------------------------------------------------------------------------- */
/*  DEMO — Proyectos en corredor                                               */
/*                                                                            */
/*  Las piezas viajan por un pasillo en perspectiva y pasan junto a la cámara. */
/*                                                                            */
/*  Control: automático y manual al mismo tiempo. La altura del mouse dentro   */
/*  de la sección suma o resta velocidad — arriba frena y da marcha atrás,     */
/*  abajo acelera — y al soltar vuelve sola a su ritmo. No se secuestra la     */
/*  rueda del mouse a propósito: si la sección se queda con el scroll, la      */
/*  página deja de poder pasarse y eso se siente roto.                        */
/*                                                                            */
/*  Al hacer clic se abre el proyecto.                                        */
/* -------------------------------------------------------------------------- */

/* Los tres números de abajo se calibraron juntos: con seis proyectos y un
   espaciado de 1000 sobre una perspectiva de 1000, la pieza más lejana caía a
   escala 0.15 —una mancha de 69 px— y el pasillo se veía vacío. Subiendo la
   perspectiva y acortando el espaciado, la más lejana queda en 0.26 y la del
   frente en 0.82, que es el degradado que se ve en la referencia. */

/** Distancia en z entre una pieza y la siguiente. */
const ESPACIADO = 780;
/** Perspectiva de la escena. Cuanto más chico, más agresiva la fuga. */
const PERSPECTIVA = 1400;
/** Velocidad de crucero, en px de profundidad por segundo. */
const VELOCIDAD_BASE = 130;
/** Cuánto suma o resta la posición del mouse a esa velocidad. */
const GANANCIA_MANUAL = 520;
/** A qué distancia de la cámara la pieza termina de desvanecerse. */
const FUNDIDO_CERCA = 300;
/** Y a qué distancia del fondo termina de aparecer. */
const FUNDIDO_LEJOS = 900;

/** Alto de cada carril: -1 techo, 0 centro, 1 piso. */
const CARRIL = [0, -1, 0, 1, 0, -1];
/** Separación vertical de los carriles de arriba y abajo. */
const ALTO_CARRIL = 300;
/** Inclinación de las piezas que no van al centro. */
const INCLINACION = 30;

const wrap = (v: number, n: number) => ((v % n) + n) % n;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function CorredorProyectos() {
  const total = projects.length * ESPACIADO;

  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  /** Desplazamiento acumulado por el pasillo. */
  const offsetRef = useRef(0);
  /** Posición vertical del mouse, de -1 (arriba) a 1 (abajo). */
  const manualRef = useRef(0);
  const [frente, setFrente] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    const seccion = sectionRef.current;
    if (!seccion) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let ultimo = 0;
    let frenteAnterior = -1;

    const onMove = (e: PointerEvent) => {
      const r = seccion.getBoundingClientRect();
      manualRef.current = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1);
    };
    const onLeave = () => (manualRef.current = 0);

    const frame = (t: number) => {
      if (!ultimo) ultimo = t;
      // Se acota el delta: si la pestaña estuvo en segundo plano, un salto de
      // varios segundos mandaría las piezas al otro extremo de golpe.
      const dt = Math.min((t - ultimo) / 1000, 0.05);
      ultimo = t;

      const base = quieto ? 0 : VELOCIDAD_BASE;
      offsetRef.current += (base + manualRef.current * GANANCIA_MANUAL) * dt;

      let masCerca = 0;
      let minDist = Infinity;

      projects.forEach((_, i) => {
        const el = itemRefs.current[i];
        if (!el) return;

        // Distancia de esta pieza a la cámara, dando la vuelta al pasillo.
        const dist = wrap(i * ESPACIADO - offsetRef.current, total);
        const carril = CARRIL[i % CARRIL.length];

        const opacidad =
          Math.min(
            clamp(dist / FUNDIDO_CERCA, 0, 1),
            clamp((total - dist) / FUNDIDO_LEJOS, 0, 1),
          ) ** 1.2;

        el.style.transform =
          `translate(-50%, -50%) translateY(${carril * ALTO_CARRIL}px) ` +
          `translateZ(${-dist}px) rotateX(${-carril * INCLINACION}deg)`;
        el.style.opacity = String(opacidad);
        // La más cercana tapa a las de atrás.
        el.style.zIndex = String(Math.round(1000 - dist / 10));
        // Las que ya casi no se ven no deben poder recibir clics.
        el.style.pointerEvents = opacidad > 0.25 ? "auto" : "none";

        if (dist < minDist) {
          minDist = dist;
          masCerca = i;
        }
      });

      if (masCerca !== frenteAnterior) {
        frenteAnterior = masCerca;
        setFrente(masCerca);
      }

      raf = requestAnimationFrame(frame);
    };

    seccion.addEventListener("pointermove", onMove, { passive: true });
    seccion.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      seccion.removeEventListener("pointermove", onMove);
      seccion.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [total]);

  return (
    <section
      ref={sectionRef}
      id="corredor"
      /* ═══════════════════════════════════════════════════════════════════
         COLOR DE FONDO — DEMO CORREDOR
         Es este `bg-ink-pure` (negro). El pasillo necesita fondo oscuro:
         las líneas de fuga van en ice a baja opacidad.
         ═══════════════════════════════════════════════════════════════════ */
      className="relative isolate h-[100svh] w-full overflow-hidden bg-ink-pure"
      style={{ perspective: `${PERSPECTIVA}px` }}
    >
      <LineasDeFuga />

      <div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        aria-hidden={false}
      >
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/proyectos/${p.slug}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
            aria-label={`Ver el proyecto ${p.name}`}
            /* Ancho grande a propósito: la escala de la perspectiva nunca
               pasa de 1, así que el tamaño en pantalla de la pieza del frente
               lo fija este ancho, no la cercanía. */
            className="group absolute left-1/2 top-1/2 block w-[min(88vw,820px)] will-change-transform"
            style={{ opacity: 0, transformStyle: "preserve-3d" }}
          >
            <span className="relative block aspect-[4/3] overflow-hidden rounded-[4px] bg-ink-900">
              <Image
                src={p.coverImage}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 88vw, 820px"
                className="object-cover transition-[filter] duration-500 [filter:saturate(0.85)] group-hover:[filter:saturate(1)]"
              />
              {/* Marco: reproduce el borde claro de las piezas de la referencia. */}
              <span className="pointer-events-none absolute inset-0 rounded-[4px] ring-1 ring-inset ring-white/25 transition-colors duration-300 group-hover:ring-white/70" />
            </span>

            <span className="mt-3 flex items-baseline justify-between font-mono text-xs uppercase tracking-kicker text-white/70 transition-colors duration-300 group-hover:text-white">
              <span>{p.name}</span>
              <span>{p.meta.year}</span>
            </span>
          </Link>
        ))}
      </div>

      <Hud nombre={projects[frente]?.name ?? ""} indice={frente} total={projects.length} pausado={pausado} />
    </section>
  );
}

/** El pasillo: rectángulo al fondo y cuatro líneas hacia las esquinas. */
function LineasDeFuga() {
  const trazo = "rgba(214,226,237,0.28)";
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <rect
        x="20"
        y="14"
        width="60"
        height="72"
        fill="none"
        stroke={trazo}
        strokeWidth="0.12"
        vectorEffect="non-scaling-stroke"
      />
      {[
        [0, 0, 20, 14],
        [100, 0, 80, 14],
        [0, 100, 20, 86],
        [100, 100, 80, 86],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={trazo}
          strokeWidth="0.12"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

interface HudProps {
  nombre: string;
  indice: number;
  total: number;
  pausado: boolean;
}

/** Nombre de la pieza que viene al frente, contador y la ayuda de control. */
function Hud({ nombre, indice, total, pausado }: HudProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2000] flex items-end justify-between gap-6 p-[clamp(1rem,3vw,3rem)] font-mono text-xs uppercase tracking-kicker text-white/60">
      <span>
        <span className="text-white">{String(indice + 1).padStart(2, "0")}</span> /{" "}
        {String(total).padStart(2, "0")} · {nombre}
      </span>
      <span className="hidden text-right sm:inline">
        {pausado ? "clic para abrir el proyecto" : "mové el mouse arriba y abajo para recorrer"}
      </span>
    </div>
  );
}
