"use client";

import { useEffect, useRef, useState } from "react";
import { processStages } from "@/data/process";
import { StarburstImg } from "@/components/icons/StarburstImg";

/* -------------------------------------------------------------------------- */
/*  Paleta (sección oscura, estilo evaluación 360°)                            */
/* -------------------------------------------------------------------------- */

const BRIGHT = "#f2f5f8";
/* El patrón "dim" necesita dos niveles, no uno: sobre #282e32 un 0.28 daba
   2.15:1 y las etapas inactivas prácticamente desaparecían.
   MUTED es para las etiquetas mono chicas (piden 4.5:1) y DIM para los
   nombres de etapa a 54px (texto grande, piden 3:1). La activa sigue a
   opacidad plena, así que la jerarquía se mantiene. */
const MUTED = "rgba(214,226,237,0.62)";
const DIM = "rgba(214,226,237,0.46)";
const LINE = "rgba(214,226,237,0.14)";
const CREAM = "#dcddca";
const GUIDE = "rgba(214,226,237,0.10)";
const SPOKE_ON = "rgba(214,226,237,0.55)";
const SPOKE_OFF = "rgba(214,226,237,0.10)";

/* -------------------------------------------------------------------------- */
/*  Geometría radial                                                           */
/* -------------------------------------------------------------------------- */

const VB = 300; // viewBox
const Cx = 150;
const Cy = 150;
const R_TIP = 116; // radio donde vive cada gráfico/punta

/** Punta i en coordenadas del viewBox (0° arriba). */
function tip(i: number) {
  const a = ((-90 + i * 72) * Math.PI) / 180;
  return { x: Cx + R_TIP * Math.cos(a), y: Cy + R_TIP * Math.sin(a) };
}
const TIPS = processStages.map((_, i) => tip(i));

/** Mismo punto en % (para posicionar los gráficos HTML encima del SVG). */
const TIPS_PCT = TIPS.map((t) => ({
  x: (t.x / VB) * 100,
  y: (t.y / VB) * 100,
}));

/* -------------------------------------------------------------------------- */
/*  Figura compuesta por los gráficos de las etapas                            */
/* -------------------------------------------------------------------------- */

function CompositeFigure({ lit, active }: { lit: number; active: number }) {
  // Polígono que une las puntas ya encendidas (se va dibujando la figura).
  const chain = TIPS.slice(0, Math.max(lit, 0))
    .map((t) => `${t.x.toFixed(1)},${t.y.toFixed(1)}`)
    .join(" ");

  return (
    <div className="relative aspect-square w-full">
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {/* Círculos guía */}
        <circle cx={Cx} cy={Cy} r={132} fill="none" stroke={GUIDE} strokeWidth={1} />
        <circle cx={Cx} cy={Cy} r={88} fill="none" stroke={GUIDE} strokeWidth={1} />
        <circle cx={Cx} cy={Cy} r={44} fill="none" stroke={GUIDE} strokeWidth={1} />

        {/* Radios: se encienden acumulativamente */}
        {TIPS.map((t, i) => (
          <line
            key={i}
            x1={Cx}
            y1={Cy}
            x2={t.x}
            y2={t.y}
            className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              stroke: i < lit ? SPOKE_ON : SPOKE_OFF,
              strokeWidth: i === active ? 1.6 : 1,
            }}
          />
        ))}

        {/* Polígono que dibuja la figura al complementarse las etapas */}
        {lit >= 2 && (
          <polyline
            points={lit >= 5 ? `${chain} ${TIPS[0].x},${TIPS[0].y}` : chain}
            fill={lit >= 5 ? "rgba(214,226,237,0.05)" : "none"}
            stroke={SPOKE_ON}
            strokeWidth={1.2}
            className="transition-all duration-700"
          />
        )}

        {/* Núcleo */}
        <circle
          cx={Cx}
          cy={Cy}
          r={lit >= 5 ? 6 : 3.5}
          className="transition-all duration-700"
          style={{ fill: CREAM, opacity: lit > 0 ? 0.2 + lit * 0.12 : 0.1 }}
        />
      </svg>

      {/* Los 5 gráficos, uno por punta (en blanco sobre el fondo oscuro) */}
      {processStages.map((stage, i) => {
        const on = i < lit;
        const isActive = i === active;
        const p = TIPS_PCT[i];
        return (
          <div
            key={stage.id}
            className="absolute aspect-square w-[26%] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: on
                ? `translate(-50%, -50%) scale(${isActive ? 1.15 : 1}) rotate(0deg)`
                : "translate(-50%, -50%) scale(0.4) rotate(-40deg)",
              opacity: on ? (isActive ? 1 : 0.55) : 0,
              filter: isActive
                ? "brightness(0) invert(1) drop-shadow(0 0 10px rgba(214,226,237,0.5))"
                : "brightness(0) invert(1)",
            }}
          >
            <StarburstImg id={stage.id} className="h-full w-full object-contain" />
          </div>
        );
      })}

      {/* Contador central */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-xs tracking-kicker"
        style={{ color: MUTED }}
      >
        {lit > 0 ? `${lit}/5` : ""}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sección "método"                                                           */
/* -------------------------------------------------------------------------- */

export function ProcessStar() {
  const [active, setActive] = useState(0);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index ?? 0);
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

  return (
    <section
      id="proceso"
      className="px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,10vw,12rem)]"
      style={{ backgroundColor: "#282e32" }}
    >
      <div className="mb-[clamp(2.5rem,4vw,4rem)] flex flex-col gap-3">
        <span
          className="font-mono text-xs uppercase tracking-kicker"
          style={{ color: MUTED }}
        >
          El método
        </span>
        <h2
          className="m-0 max-w-[16ch] font-display text-display-2xl font-normal"
          style={{ color: BRIGHT }}
        >
          Cinco etapas, un mismo motivo.
        </h2>
      </div>

      <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-10 lg:grid-cols-[1fr_minmax(300px,42%)]">
        {/* Figura (arriba en móvil, sticky a la derecha en desktop) */}
        <div className="order-1 lg:order-2">
          <div className="sticky top-20 flex flex-col items-center gap-5 lg:top-24">
            <div className="w-[clamp(180px,42vw,420px)]">
              <CompositeFigure lit={litCount} active={active} />
            </div>
            <p
              className="text-center font-mono text-xs uppercase tracking-kicker"
              style={{ color: MUTED }}
            >
              {litCount} / 5 · la marca toma forma
            </p>
          </div>
        </div>

        {/* Lista de etapas — patrón "dim": tenue por defecto, se ilumina la activa */}
        <div className="order-2 flex flex-col lg:order-1">
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
                className="group cursor-default border-t px-[clamp(0.5rem,1.5vw,1rem)] py-[clamp(1.2rem,2.2vw,1.9rem)] outline-none transition-colors duration-500 last:border-b"
                style={{
                  borderColor: LINE,
                  backgroundColor: isActive ? "rgba(214,226,237,0.035)" : "transparent",
                }}
              >
                <div className="flex items-center gap-[clamp(0.75rem,2vw,1.5rem)]">
                  <span
                    className="font-mono text-xs tabular-nums tracking-kicker transition-colors duration-500"
                    style={{ color: isActive ? CREAM : MUTED }}
                  >
                    {stage.id}
                  </span>

                  <span
                    className="flex-1 font-display text-display-xl font-normal transition-colors duration-500"
                    style={{ color: isActive ? BRIGHT : DIM }}
                  >
                    {stage.name}
                  </span>
                </div>

                {/* Descripción: se despliega y aclara al activarse */}
                <div
                  className="grid transition-[grid-template-rows,opacity] duration-500 ease-out-spring"
                  style={{
                    gridTemplateRows: isActive ? "1fr" : "0fr",
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  <p
                    className="overflow-hidden pl-[calc(2ch+clamp(0.75rem,2vw,1.5rem))] pt-3 text-body-sm"
                    style={{ color: "rgba(214,226,237,0.7)" }}
                  >
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
