"use client";

import { useEffect, useRef, useState } from "react";
import { processStages } from "@/data/process";
import { StarburstImg } from "@/components/icons/StarburstImg";

/* -------------------------------------------------------------------------- */
/*  Geometría: 5 piezas en anillo + líneas que las conectan                    */
/* -------------------------------------------------------------------------- */

const R = 33; // radio del anillo (en %)
const CENTER = 50;

/** Posición (en %) de cada pieza alrededor del centro. */
const POINTS = Array.from({ length: 5 }, (_, i) => {
  const a = ((-90 + i * 72) * Math.PI) / 180;
  return {
    x: CENTER + R * Math.cos(a),
    y: CENTER + R * Math.sin(a),
  };
});

/** Aristas del pentágono en orden de etapa (se van uniendo una a una). */
const EDGES = POINTS.map((_, i) => [i, (i + 1) % 5] as const);

/* -------------------------------------------------------------------------- */
/*  Figura compuesta por los SVG de las etapas                                 */
/* -------------------------------------------------------------------------- */

interface CompositeFigureProps {
  /** Cuántas piezas están activas (0–5). */
  lit: number;
  label: string;
}

function CompositeFigure({ lit, label }: CompositeFigureProps) {
  return (
    <div className="relative aspect-square w-full">
      {/* Líneas que conectan las piezas conforme se van sumando */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {EDGES.map(([a, b], j) => {
          const on = a < lit && b < lit;
          return (
            <line
              key={j}
              x1={POINTS[a].x}
              y1={POINTS[a].y}
              x2={POINTS[b].x}
              y2={POINTS[b].y}
              className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                stroke: "#5f0000",
                strokeWidth: 0.6,
                opacity: on ? 0.55 : 0,
              }}
            />
          );
        })}
        {/* Núcleo que se enciende cuando la figura toma forma */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={lit >= 5 ? 4.5 : 2.5}
          className="transition-all duration-700"
          style={{
            fill: "#5f0000",
            opacity: lit > 0 ? 0.15 + lit * 0.12 : 0,
          }}
        />
      </svg>

      {/* Las 5 piezas: cada etapa aporta su propio gráfico */}
      {processStages.map((stage, i) => {
        const on = i < lit;
        const p = POINTS[i];
        return (
          <div
            key={stage.id}
            className="absolute aspect-square w-[42%] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: on
                ? "translate(-50%, -50%) scale(1) rotate(0deg)"
                : "translate(-50%, -50%) scale(0.45) rotate(-35deg)",
              opacity: on ? 1 : 0,
              filter: on ? "none" : "grayscale(1)",
            }}
          >
            <StarburstImg
              id={stage.id}
              className="h-full w-full object-contain mix-blend-multiply"
            />
          </div>
        );
      })}

      {/* Contador central */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-xs tracking-[0.2em] text-ink-500">
        {label}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sección                                                                    */
/* -------------------------------------------------------------------------- */

export function ProcessStar() {
  const [active, setActive] = useState(-1);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  // El scroll arma la figura: la etapa que cruza el centro del viewport se
  // activa sola (en cualquier pantalla). El hover en desktop permite saltar.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index ?? -1);
            setActive(idx);
          }
        }
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );
    const nodes = rowsRef.current.filter(Boolean) as HTMLDivElement[];
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const litCount = active + 1;
  const centerLabel = active >= 0 ? `${litCount}/5` : "";

  return (
    <section
      id="proceso"
      className="bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,10vw,12rem)]"
    >
      <div className="mb-[clamp(2.5rem,4vw,4rem)] flex flex-col gap-3">
        <span className="kicker">El método</span>
        <h2 className="m-0 font-display text-[clamp(2rem,5.5vw,6rem)] font-normal leading-[0.92] tracking-[-0.035em] text-ink-900">
          Cinco etapas, un mismo motivo.
        </h2>
      </div>

      <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-10 lg:grid-cols-[1fr_minmax(280px,40%)]">
        {/* Figura (arriba en móvil, sticky a la derecha en desktop) */}
        <div className="order-1 lg:order-2">
          <div className="sticky top-24 flex flex-col items-center gap-4">
            <div className="w-[clamp(200px,44vw,380px)]">
              <CompositeFigure lit={litCount} label={centerLabel} />
            </div>
            <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-ink-500">
              {litCount > 0
                ? `${litCount} / 5 · la marca toma forma`
                : "pasá o bajá para armar la figura"}
            </p>
          </div>
        </div>

        {/* Lista de etapas */}
        <div className="order-2 flex flex-col border-t border-ink-900 lg:order-1">
          {processStages.map((stage, i) => {
            const isActive = i === active;
            return (
              <div
                key={stage.id}
                data-index={i}
                ref={(el) => {
                  rowsRef.current[i] = el;
                }}
                tabIndex={0}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group relative isolate cursor-default overflow-hidden border-b border-ink-900/20 py-[clamp(1.3rem,2.4vw,2rem)] outline-none transition-[padding] duration-300"
              >
                <div
                  className="absolute inset-0 -z-10 bg-paper-sage transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: isActive ? "translateX(0)" : "translateX(-101%)",
                  }}
                />

                <div className="flex items-center gap-4 px-[clamp(0.5rem,1.5vw,1.5rem)]">
                  <span
                    className="font-mono text-xs tabular-nums tracking-[0.2em] transition-colors duration-300"
                    style={{ color: isActive ? "#5f0000" : "#757A7D" }}
                  >
                    {stage.id}
                  </span>

                  <span className="flex-1 font-display text-[clamp(1.6rem,4vw,3.6rem)] font-normal leading-[1] tracking-[-0.03em] text-ink-900">
                    {stage.name}
                  </span>

                  {/* El gráfico de la etapa aparece al lado al activarse */}
                  <div
                    className="aspect-square w-[clamp(44px,5vw,80px)] shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "scale(1) rotate(0deg)"
                        : "scale(0.6) rotate(-25deg)",
                    }}
                    aria-hidden={!isActive}
                  >
                    <StarburstImg
                      id={stage.id}
                      className="h-full w-full object-contain mix-blend-multiply"
                    />
                  </div>
                </div>

                <div
                  className="grid px-[clamp(0.5rem,1.5vw,1.5rem)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    gridTemplateRows: isActive ? "1fr" : "0fr",
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  <p className="overflow-hidden pl-[calc(2ch+1rem)] pt-3 text-[clamp(0.95rem,1.1vw,1.15rem)] leading-[1.5] text-ink-700">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
