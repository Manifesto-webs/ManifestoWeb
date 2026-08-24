"use client";

import { useEffect, useRef, useState } from "react";
import { TitleReveal } from "@/components/ui/TitleReveal";

/* -------------------------------------------------------------------------- */
/*  Bloque 3 — El universo de marca                                            */
/*                                                                            */
/*  El copy dice que la marca vive DENTRO de una cultura, un mercado y un      */
/*  equipo: contención, no jerarquía. La marca ocupa el centro y cada capa la  */
/*  envuelve, de la más cercana (el equipo que la sostiene) a la más amplia    */
/*  (la cultura donde ocurre).                                                 */
/*                                                                            */
/*  Nota: el diagrama nació como campos concéntricos quietos, a propósito.     */
/*  A pedido del cliente cada capa ahora recorre su propio anillo, como un     */
/*  planeta en su órbita — la contención se mantiene (nadie cambia de anillo   */
/*  ni cruza al de al lado), pero el sistema se lee vivo. Si se quiere volver  */
/*  al estado quieto basta con sacar los dos <g className="orbit*"> de abajo.  */
/* -------------------------------------------------------------------------- */

// 570 y no 460: al girar, la etiqueta del anillo externo recorre todo el
// contorno y necesita margen en los cuatro lados para no cortarse. El sobrante
// da para que "Cultura" pase entera aunque la mono caiga en una fuente más
// ancha. El ancho en CSS sube casi en la misma proporción, así que el diagrama
// se ve prácticamente del mismo tamaño que antes.
const VB = 570;
const C = VB / 2;

/**
 * De adentro hacia afuera. El ángulo es la posición de arranque — separa las
 * etiquetas para que no salgan juntas. `orbit` son los segundos que tarda en
 * dar la vuelta: mientras más afuera, más lento, como en un sistema solar.
 */
const FIELDS = [
  { label: "Equipo", r: 74, angle: -90, orbit: 32 },
  { label: "Cultura", r: 130, angle: -32, orbit: 48 },
  { label: "Mercado", r: 186, angle: -140, orbit: 66 },
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
      className="overflow-x-clip bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,10vw,12rem)]"
    >
      {/* ═══════════════════════════════════════════════════════════════════
          Reparto de la sección: el DIAGRAMA manda.
          Antes el texto se llevaba la columna ancha (1fr contra 44%) y un
          titular de hasta 96px; el diagrama quedaba de ilustración al costado.
          Ahora es al revés —columna angosta para el copy, ancha para el
          diagrama— y la tipografía bajó un escalón entero. El sistema se
          explica solo; el texto lo nombra.
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid items-center gap-[clamp(2.5rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,0.72fr)_minmax(340px,1.28fr)]">
        {/* ---------------------------------------------------------------- */}
        {/*  Copy                                                             */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-col gap-5">
          {/* El kicker lleva su propia regla, que crece al entrar la sección.
              Es el gesto que abre el bloque: primero la línea, después el
              titular palabra por palabra. */}
          <span className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-[clamp(1.5rem,4vw,3.5rem)] origin-left bg-ink-900/35 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: shown ? "scaleX(1)" : "scaleX(0)" }}
            />
            {/* ink-700 y no el ink-500 de los otros kickers: sobre paper-ice
                ese gris da 3.29:1 y a 12px hace falta 4.5:1. */}
            <span className="font-mono text-xs uppercase tracking-kicker text-ink-700">
              El universo de marca
            </span>
          </span>

          {/* ── El titular ──────────────────────────────────────────────────
              Dos líneas fijas, cada una en su propio bloque y con el corte
              decidido acá: "Ninguna marca" / "existe sola."

              El corte NO puede quedar en manos del navegador. Antes esto iba
              en un solo bloque con max-w en `ch`, y el `ch` se mide contra la
              fuente actual: en Clash Display a 70 px, 13ch da un ancho en el
              que no entra ni "Ninguna marca", así que cada palabra caía en su
              propio renglón y la frase se leía como una lista. Con líneas
              explícitas y whitespace-nowrap eso no puede volver a pasar, y el
              tamaño se resuelve donde corresponde: en el clamp de la fuente.

              El acento va en el punto final y en el leading cerrado (0.9),
              no en cambiar de color ni de estilo a mitad de frase: la frase
              ya es la idea, no necesita que se la subraye. */}
          <h2 className="m-0 font-display text-[clamp(1.9rem,4vw,4rem)] font-normal leading-[0.9] tracking-[-0.04em] text-ink-900">
            <span className="block whitespace-nowrap">
              <TitleReveal text="Ninguna marca" stagger={80} />
            </span>
            <span className="block whitespace-nowrap">
              <TitleReveal text="existe sola." delay={200} stagger={80} />
            </span>
          </h2>

          <p className="m-0 max-w-[42ch] text-body-sm text-ink-700 text-pretty">
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

          {/* Bajó de display-xl (hasta 57px) a display-md. Era la tipografía
              más grande de la sección y competía de frente con el diagrama. */}
          <p className="m-0 max-w-[26ch] font-display text-display-md font-normal text-ink-900 text-balance">
            Leer ese sistema completo es lo que convierte una intuición en{" "}
            <span className="text-accent-corinto">una decisión</span>.
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*  Diagrama — la pieza principal de la sección                       */}
        {/* ---------------------------------------------------------------- */}
        <figure className="m-0 justify-self-center lg:justify-self-end">
          <svg
            viewBox={`0 0 ${VB} ${VB}`}
            /* De 560 a 760 px de tope: es lo que lo convierte en el sujeto de
               la sección y no en la ilustración de al lado. */
            className="w-[clamp(320px,88vw,760px)]"
            role="img"
            aria-label="Diagrama: la marca en el centro, envuelta por tres capas — equipo, mercado y cultura."
          >
            {/* Retícula de fondo: ejes tenues, para que se lea como plano
                técnico y no como adorno. */}
            <g stroke="currentColor" className="text-ink-900/[0.10]" strokeWidth={1}>
              <line x1={C} y1={18} x2={C} y2={VB - 18} />
              <line x1={18} y1={C} x2={VB - 18} y2={C} />
            </g>

            {/* Pulso: sale de la marca y se disuelve al llegar a la capa
                externa. Tres, desfasados, para que el sistema nunca esté
                quieto sin que se vea repetitivo. Solo cuando la sección ya
                entró en cuadro: si no, arrancan a destiempo del armado. */}
            {shown &&
              [0, 2.35, 4.7].map((retraso) => (
                <circle
                  key={retraso}
                  cx={C}
                  cy={C}
                  r={FIELDS[FIELDS.length - 1].r}
                  fill="none"
                  strokeWidth={1.4}
                  className="field-pulse stroke-ink-900/45"
                  style={{
                    transformOrigin: `${C}px ${C}px`,
                    transformBox: "view-box",
                    animationDelay: `${retraso}s`,
                  }}
                />
              ))}

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

                  {/* Órbita: el punto y la etiqueta recorren el anillo. Gira
                      el grupo entero alrededor del centro, así el radio sigue
                      apuntando siempre a la capa. */}
                  <g
                    className="orbit"
                    style={{
                      transformOrigin: `${C}px ${C}px`,
                      transformBox: "view-box",
                      animationDuration: `${field.orbit}s`,
                    }}
                  >
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

                    {/* Contra-giro a la misma velocidad: la etiqueta viaja por
                        el anillo pero nunca se pone de cabeza. */}
                    <g
                      className="orbit-counter"
                      style={{
                        transformOrigin: `${label.x}px ${label.y}px`,
                        transformBox: "view-box",
                        animationDuration: `${field.orbit}s`,
                      }}
                    >
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
                  </g>
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
