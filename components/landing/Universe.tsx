"use client";

import { useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Bloque 3 — El universo de marca                                            */
/*                                                                            */
/*  El copy dice que la marca vive DENTRO de una cultura, un mercado y un      */
/*  equipo. Eso no es una órbita, es contención: por eso el diagrama son       */
/*  campos concéntricos y no satélites girando. La marca ocupa el centro y     */
/*  cada capa la envuelve, de la más cercana (el equipo que la sostiene) a la  */
/*  más amplia (la cultura donde ocurre).                                      */
/* -------------------------------------------------------------------------- */

const VB = 460; // 460 y no 420: deja margen para que las etiquetas no se corten
const C = VB / 2;

/** De adentro hacia afuera. El ángulo separa las etiquetas para que no choquen. */
const FIELDS = [
  { label: "Equipo", r: 74, angle: -90 },
  { label: "Mercado", r: 130, angle: -32 },
  { label: "Cultura", r: 186, angle: -140 },
] as const;

const pointAt = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
};

export function Universe() {
  const [active, setActive] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // El diagrama se arma cuando la sección entra en cuadro, no al montar.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "-12% 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="universo"
      ref={ref}
      className="overflow-x-clip bg-paper-ice px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,10vw,12rem)]"
    >
      <div className="grid items-center gap-[clamp(2.5rem,6vw,6rem)] lg:grid-cols-[minmax(0,1fr)_minmax(320px,44%)]">
        {/* ---------------------------------------------------------------- */}
        {/*  Copy                                                             */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-col gap-6">
          {/* ink-700 y no el ink-500 de los otros kickers: sobre paper-ice ese
              gris da 3.29:1 y a 12px hace falta 4.5:1. Sobre bone sí pasa. */}
          <span className="font-mono text-xs uppercase tracking-kicker text-ink-700">
            El universo de marca
          </span>

          <h2 className="m-0 max-w-[14ch] font-display text-display-2xl font-normal text-ink-900 text-balance">
            Ninguna marca existe sola.
          </h2>

          <p className="m-0 max-w-[46ch] text-lead text-ink-700 text-pretty">
            Vive dentro de una cultura, un mercado y un equipo que la sostiene.
          </p>

          {/* Leyenda: es el control del diagrama. Botones y no ítems de lista
              para que el teclado llegue solo, sin tabIndex a mano. */}
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {FIELDS.map((field, i) => {
              const on = active === i;
              return (
                <li key={field.label}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className={`inline-flex items-center gap-2.5 rounded-pill border px-4 py-2 font-mono text-xs uppercase tracking-kicker transition-colors duration-200 ease-out ${
                      on
                        ? "border-ink-900 bg-ink-900 text-paper-bone"
                        : "border-ink-900/20 text-ink-700 hover:border-ink-900/45"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-pill transition-colors duration-200 ${
                        on ? "bg-accent-corinto" : "bg-ink-900/35"
                      }`}
                    />
                    {field.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="m-0 max-w-[22ch] font-display text-display-xl font-normal text-ink-900 text-balance">
            Leer ese sistema completo es lo que convierte una intuición en{" "}
            <span className="text-accent-corinto">una decisión</span>.
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*  Diagrama                                                         */}
        {/* ---------------------------------------------------------------- */}
        <figure className="m-0 justify-self-center lg:justify-self-end">
          <svg
            viewBox={`0 0 ${VB} ${VB}`}
            className="w-[clamp(260px,72vw,460px)]"
            role="img"
            aria-label="Diagrama: la marca en el centro, envuelta por tres capas — equipo, mercado y cultura."
          >
            {/* Retícula de fondo: ejes tenues, para que se lea como plano
                técnico y no como adorno. */}
            <g stroke="currentColor" className="text-ink-900/[0.10]" strokeWidth={1}>
              <line x1={C} y1={18} x2={C} y2={VB - 18} />
              <line x1={18} y1={C} x2={VB - 18} y2={C} />
            </g>

            {/* Campos, de afuera hacia adentro para que el más chico quede
                encima y siga siendo clicable. */}
            {[...FIELDS].reverse().map((field, revIdx) => {
              const i = FIELDS.length - 1 - revIdx;
              const on = active === i;
              const label = pointAt(field.r + 40, field.angle);
              const edge = pointAt(field.r, field.angle);

              return (
                <g
                  key={field.label}
                  className="field-in"
                  data-shown={shown}
                  style={{
                    transformOrigin: `${C}px ${C}px`,
                    transformBox: "view-box",
                    // Entran de afuera hacia adentro: primero el contexto
                    // amplio, al final el equipo pegado a la marca.
                    animationDelay: `${revIdx * 110}ms`,
                  }}
                >
                  {/* Dos anillos superpuestos: el fino siempre visible y el
                      grueso que sólo se funde. Así el resalte anima opacidad
                      y no stroke-width ni r. */}
                  <circle
                    cx={C}
                    cy={C}
                    r={field.r}
                    fill="none"
                    strokeWidth={1}
                    className="stroke-ink-900/25"
                  />
                  <circle
                    cx={C}
                    cy={C}
                    r={field.r}
                    strokeWidth={1.8}
                    className={`fill-ink-900/[0.045] stroke-ink-900 transition-opacity duration-300 ease-out ${
                      on ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  {/* Radio marca→capa: aparece sólo en la activa. Es la
                      "lectura" del sistema hecha explícita. */}
                  <line
                    x1={C}
                    y1={C}
                    x2={edge.x}
                    y2={edge.y}
                    strokeWidth={1}
                    className={`stroke-accent-corinto transition-opacity duration-300 ease-out ${
                      on ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <circle cx={edge.x} cy={edge.y} r={3} className="fill-ink-900/30" />
                  <circle
                    cx={edge.x}
                    cy={edge.y}
                    r={3}
                    className={`fill-accent-corinto transition-opacity duration-300 ease-out ${
                      on ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  <text
                    x={label.x}
                    y={label.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`font-mono text-[13px] uppercase transition-colors duration-300 ease-out ${
                      on ? "fill-ink-900" : "fill-ink-700"
                    }`}
                    style={{ letterSpacing: "0.18em" }}
                  >
                    {field.label}
                  </text>
                </g>
              );
            })}

            {/* La marca */}
            <g
              className="field-in"
              data-shown={shown}
              style={{
                transformOrigin: `${C}px ${C}px`,
                transformBox: "view-box",
                animationDelay: "330ms",
              }}
            >
              <circle cx={C} cy={C} r={7} className="fill-ink-900" />
              <text
                x={C}
                y={C + 30}
                textAnchor="middle"
                className="fill-ink-900 font-mono text-[13px] uppercase"
                style={{ letterSpacing: "0.18em" }}
              >
                La marca
              </text>
            </g>
          </svg>
        </figure>
      </div>
    </section>
  );
}
