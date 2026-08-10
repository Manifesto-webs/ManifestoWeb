"use client";

import { useEffect, useRef, useState } from "react";
import { processStages } from "@/data/process";
import { StarburstImg } from "@/components/icons/StarburstImg";
import { TitleReveal } from "@/components/ui/TitleReveal";

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
/*  Los mismos papeles, sobre fondo claro                                      */
/*                                                                            */
/*  Las constantes de arriba quedan tal cual: son las del fondo #282e32 y      */
/*  siguen usándose cuando la sección va oscura. Estas son su equivalente      */
/*  sobre blanco, con los mismos criterios de contraste: MUTED_L para las      */
/*  etiquetas mono chicas (4.5:1) y DIM_L para los nombres de fase, que por    */
/*  tamaño piden 3:1 y quedan en 3.30:1.                                       */
/* -------------------------------------------------------------------------- */

const BRIGHT_L = "#2D3436";
const MUTED_L = "#4A5054";
const DIM_L = "rgba(45,52,54,0.55)";
const LINE_L = "rgba(45,52,54,0.14)";
const CREAM_L = "#2D3436";
const GUIDE_L = "rgba(40,46,50,0.14)";
const SPOKE_ON_L = "rgba(40,46,50,0.55)";
const SPOKE_OFF_L = "rgba(40,46,50,0.14)";

/** Devuelve la paleta según el fondo sobre el que se dibuja la sección. */
function paleta(light: boolean) {
  return {
    bright: light ? BRIGHT_L : BRIGHT,
    muted: light ? MUTED_L : MUTED,
    dim: light ? DIM_L : DIM,
    line: light ? LINE_L : LINE,
    cream: light ? CREAM_L : CREAM,
    guide: light ? GUIDE_L : GUIDE,
    spokeOn: light ? SPOKE_ON_L : SPOKE_ON,
    spokeOff: light ? SPOKE_OFF_L : SPOKE_OFF,
    /** Relleno del polígono y fondo de la fila activa. */
    wash: light ? "rgba(45,52,54,0.04)" : "rgba(214,226,237,0.035)",
    polyFill: light ? "rgba(40,46,50,0.05)" : "rgba(214,226,237,0.05)",
    /** Los starburst son PNG blancos: sobre claro hay que invertirlos. */
    invert: light ? "brightness(0)" : "brightness(0) invert(1)",
    body: light ? "#4A5054" : "rgba(214,226,237,0.7)",
  };
}

/* -------------------------------------------------------------------------- */
/*  Geometría radial                                                           */
/* -------------------------------------------------------------------------- */

const VB = 300; // viewBox
const Cx = 150;
const Cy = 150;
const R_TIP = 116; // radio donde vive cada gráfico/punta

/** Cuántas fases tiene el método. Sale del data file y no de un número fijo:
 *  antes eran cinco etapas y el 72° estaba escrito a mano en tres lugares. */
const N = processStages.length;
const STEP = 360 / N;

/** Punta i en coordenadas del viewBox (0° arriba). */
function tip(i: number) {
  const a = ((-90 + i * STEP) * Math.PI) / 180;
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

function CompositeFigure({
  lit,
  active,
  pal,
}: {
  lit: number;
  active: number;
  pal: ReturnType<typeof paleta>;
}) {
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
        <circle cx={Cx} cy={Cy} r={132} fill="none" stroke={pal.guide} strokeWidth={1} />
        <circle cx={Cx} cy={Cy} r={88} fill="none" stroke={pal.guide} strokeWidth={1} />
        <circle cx={Cx} cy={Cy} r={44} fill="none" stroke={pal.guide} strokeWidth={1} />

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
              stroke: i < lit ? pal.spokeOn : pal.spokeOff,
              strokeWidth: i === active ? 1.6 : 1,
            }}
          />
        ))}

        {/* Polígono que dibuja la figura al complementarse las etapas */}
        {lit >= 2 && (
          <polyline
            points={lit >= N ? `${chain} ${TIPS[0].x},${TIPS[0].y}` : chain}
            fill={lit >= N ? pal.polyFill : "none"}
            stroke={pal.spokeOn}
            strokeWidth={1.2}
            className="transition-all duration-700"
          />
        )}

        {/* Núcleo */}
        <circle
          cx={Cx}
          cy={Cy}
          r={lit >= N ? 6 : 3.5}
          className="transition-all duration-700"
          style={{ fill: pal.cream, opacity: lit > 0 ? 0.2 + lit * (0.6 / N) : 0.1 }}
        />
      </svg>

      {/* Un gráfico por punta. Los PNG son blancos: sobre fondo claro hay que
          invertirlos o no se ven. */}
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
              filter: pal.invert,
            }}
          >
            <StarburstImg id={stage.id} className="h-full w-full object-contain" />
          </div>
        );
      })}

      {/* Contador central */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-xs tracking-kicker"
        style={{ color: pal.muted }}
      >
        {lit > 0 ? `${lit}/${N}` : ""}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sección "método"                                                           */
/* -------------------------------------------------------------------------- */

interface ProcessStarProps {
  /** Sobre qué fondo se dibuja. `dark` deja el diseño original del #282e32. */
  tone?: "dark" | "light";
}

export function ProcessStar({ tone = "dark" }: ProcessStarProps) {
  const light = tone === "light";
  const pal = paleta(light);
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
      /* ═══════════════════════════════════════════════════════════════════
         COLOR DE FONDO — SECCIÓN "EL MÉTODO"
         Se decide con la prop `tone` desde la página que la usa, no acá.
         En /metodologia entra con tone="light" y queda blanco.
         ═══════════════════════════════════════════════════════════════════ */
      className={`px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,10vw,12rem)] ${
        light ? "bg-paper-bone" : ""
      }`}
      style={light ? undefined : { backgroundColor: "#282e32" }}
    >
      <div className="mb-[clamp(2.5rem,4vw,4rem)] flex flex-col gap-3">
        <span
          className="font-mono text-xs uppercase tracking-kicker"
          style={{ color: pal.muted }}
        >
          El método
        </span>
        <h2
          className="m-0 max-w-[16ch] font-display text-display-2xl font-normal"
          style={{ color: pal.bright }}
        >
          <TitleReveal text="Un método en cuatro fases." />
        </h2>
        <p className="m-0 max-w-[62ch] text-body-sm" style={{ color: pal.muted }}>
          Cada fase cierra una decisión. Ninguna avanza sin la anterior: así no se
          repite trabajo ni se discute dos veces lo mismo.
        </p>
      </div>

      <div className="grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-10 lg:grid-cols-[1fr_minmax(300px,42%)]">
        {/* Figura (arriba en móvil, sticky a la derecha en desktop) */}
        <div className="order-1 lg:order-2">
          <div className="sticky top-20 flex flex-col items-center gap-5 lg:top-24">
            <div className="w-[clamp(180px,42vw,420px)]">
              <CompositeFigure lit={litCount} active={active} pal={pal} />
            </div>
            <p
              className="text-center font-mono text-xs uppercase tracking-kicker"
              style={{ color: pal.muted }}
            >
              {litCount} / {N} · la marca toma forma
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
                  borderColor: pal.line,
                  backgroundColor: isActive ? pal.wash : "transparent",
                }}
              >
                <div className="flex items-center gap-[clamp(0.75rem,2vw,1.5rem)]">
                  <span
                    className="font-mono text-xs tabular-nums tracking-kicker transition-colors duration-500"
                    style={{ color: isActive ? pal.cream : pal.muted }}
                  >
                    {stage.id}
                  </span>

                  <span
                    className="flex-1 font-display text-display-xl font-normal transition-colors duration-500"
                    style={{ color: isActive ? pal.bright : pal.dim }}
                  >
                    {stage.name}
                  </span>

                  {/* "Entender el terreno": el doc da cada fase con su
                      subtítulo. Se oculta en móvil, donde compite con el
                      nombre de la fase por el mismo renglón. */}
                  {stage.tagline && (
                    <span
                      className="hidden shrink-0 font-mono text-xs uppercase tracking-kicker transition-colors duration-500 sm:inline"
                      style={{ color: isActive ? pal.cream : pal.muted }}
                    >
                      {stage.tagline}
                    </span>
                  )}
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
                    style={{ color: pal.body }}
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
