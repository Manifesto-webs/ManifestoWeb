"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";

/* -------------------------------------------------------------------------- */
/*  DEMO — Proyectos en caja 3D                                                */
/*                                                                            */
/*  Carrusel dentro de una caja. La pieza del centro está de frente; al        */
/*  alejarse hacia los bordes se va plegando —como una tapa que se abre—       */
/*  hasta quedar acostada contra la pared. Siempre se ven tres: la del centro  */
/*  y sus dos vecinas plegadas.                                               */
/*                                                                            */
/*  El eje cambia con el tamaño de pantalla: en escritorio el recorrido es     */
/*  vertical (se pliegan contra techo y piso) y en celular es horizontal (se   */
/*  pliegan contra las paredes laterales), que es donde hay lugar.            */
/*                                                                            */
/*  El pliegue no gira sobre el centro de la pieza sino sobre el borde que da  */
/*  al centro de la pantalla: por eso parece que la caja se abre y no que la   */
/*  imagen se tuerce.                                                         */
/*                                                                            */
/*  Control: automático y manual a la vez. Con mouse, la altura del cursor     */
/*  suma o resta velocidad. Con dedo, el arrastre de costado. La rueda del     */
/*  mouse no se secuestra: si la sección se queda con el scroll, la página     */
/*  deja de poder pasarse y se siente rota.                                   */
/* -------------------------------------------------------------------------- */

/** Separación entre piezas cuando el recorrido es vertical. */
const PASO_VERTICAL = 560;
/**
 * En horizontal la separación sale del ancho real de la pieza y no de un
 * número fijo: así no queda un hueco enorme entre proyecto y proyecto en
 * pantallas angostas. El 1.12 es apenas más que la pieza, lo justo para que
 * no se toquen.
 */
const HOLGURA_HORIZONTAL = 1.12;
/** Cuánto se pliega, en grados. 90 la dejaría de canto e invisible. */
const ANGULO = 72;
/**
 * A qué profundidad está el fondo de la caja.
 *
 * Todas las piezas viven en ese plano; el pliegue las trae hacia adelante, no
 * hacia atrás. Es lo que hace que las vecinas se vean grandes y se ensanchen
 * hacia el borde de la pantalla en vez de encogerse.
 */
const PROFUNDIDAD = 700;
/** Perspectiva de la caja. Cuanto más chica, más marcada la fuga. */
const PERSPECTIVA = 1150;
/** Velocidad de crucero, en px por segundo. */
const VELOCIDAD_BASE = 90;
/** Cuánto suma o resta la posición del mouse a esa velocidad. */
const GANANCIA_MANUAL = 420;
/** Debajo de este ancho el recorrido pasa a horizontal. */
const CORTE_HORIZONTAL = "(max-width: 1023px)";

const wrap = (v: number, n: number) => ((v % n) + n) % n;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function CorredorProyectos() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const offsetRef = useRef(0);
  const manualRef = useRef(0);
  const [frente, setFrente] = useState(0);
  const [sobrePieza, setSobrePieza] = useState(false);

  useEffect(() => {
    const seccion = sectionRef.current;
    if (!seccion) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mq = window.matchMedia(CORTE_HORIZONTAL);

    let horizontal = mq.matches;
    let paso = PASO_VERTICAL;
    let tira = projects.length * paso;

    /**
     * Recalcula eje y separación. La separación horizontal depende del ancho
     * real de la pieza, así que hay que volver a medirla cada vez que cambia
     * el tamaño de la ventana.
     */
    const medir = () => {
      horizontal = mq.matches;
      const ancho = itemRefs.current[0]?.offsetWidth ?? 0;
      paso = horizontal
        ? Math.max(200, ancho * HOLGURA_HORIZONTAL)
        : PASO_VERTICAL;
      tira = projects.length * paso;
    };

    medir();

    let raf = 0;
    let ultimo = 0;
    let frenteAnterior = -1;

    // Arrastre para pantallas táctiles: horizontal, que es además el eje del
    // carrusel en celular. Con `touch-action: pan-y` el dedo hacia arriba
    // sigue moviendo la página y el de costado, el carrusel.
    let arrastrando = false;
    let ultimaX = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      arrastrando = true;
      ultimaX = e.clientX;
    };
    const onUp = () => {
      arrastrando = false;
      manualRef.current = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (arrastrando) {
        offsetRef.current += (ultimaX - e.clientX) * 1.6;
        ultimaX = e.clientX;
        return;
      }
      // La altura del mouse solo manda si de verdad hay mouse: en táctil este
      // evento llega solo mientras se toca y daría saltos.
      if (e.pointerType !== "mouse") return;
      const r = seccion.getBoundingClientRect();
      manualRef.current = clamp(
        (e.clientY - (r.top + r.height / 2)) / (r.height / 2),
        -1,
        1,
      );
    };
    const onLeave = () => (manualRef.current = 0);

    const frame = (t: number) => {
      if (!ultimo) ultimo = t;
      // Delta acotado: si la pestaña estuvo en segundo plano, un salto de
      // varios segundos mandaría la tira al otro extremo de golpe.
      const dt = Math.min((t - ultimo) / 1000, 0.05);
      ultimo = t;

      const base = quieto ? 0 : VELOCIDAD_BASE;
      offsetRef.current += (base + manualRef.current * GANANCIA_MANUAL) * dt;

      let masCerca = 0;
      let minAbs = Infinity;

      projects.forEach((_, i) => {
        const el = itemRefs.current[i];
        if (!el) return;

        // Posición de esta pieza respecto al centro, dando la vuelta a la tira.
        const d = wrap(i * paso - offsetRef.current + tira / 2, tira) - tira / 2;
        // -1 pegada a una pared, 0 de frente, 1 pegada a la de enfrente.
        const t01 = clamp(d / paso, -1, 1);
        const abs = Math.abs(t01);

        if (horizontal) {
          // Bisagra en el borde que mira al centro de la pantalla.
          el.style.transformOrigin = d < 0 ? "right center" : "left center";
          el.style.transform =
            `translate(-50%, -50%) translateZ(${-PROFUNDIDAD}px) ` +
            `translateX(${d}px) rotateY(${-t01 * ANGULO}deg)`;
        } else {
          el.style.transformOrigin = d < 0 ? "center bottom" : "center top";
          el.style.transform =
            `translate(-50%, -50%) translateZ(${-PROFUNDIDAD}px) ` +
            `translateY(${d}px) rotateX(${t01 * ANGULO}deg)`;
        }

        // Las tres de en medio a opacidad plena; la cuarta y siguientes se
        // apagan, que si no se amontonan detrás de las plegadas.
        const visible = clamp((1.7 - Math.abs(d) / paso) / 0.6, 0, 1);
        el.style.opacity = String(visible);
        el.style.zIndex = String(Math.round(500 - abs * 100));
        el.style.pointerEvents = visible > 0.5 ? "auto" : "none";

        if (Math.abs(d) < minAbs) {
          minAbs = Math.abs(d);
          masCerca = i;
        }
      });

      if (masCerca !== frenteAnterior) {
        frenteAnterior = masCerca;
        setFrente(masCerca);
      }

      raf = requestAnimationFrame(frame);
    };

    // ResizeObserver y no el evento de ventana: la sección puede cambiar de
    // tamaño sin que la ventana lo haga, y ahí el evento nunca llega.
    const ro = new ResizeObserver(medir);
    ro.observe(seccion);
    mq.addEventListener("change", medir);

    seccion.addEventListener("pointermove", onMove, { passive: true });
    seccion.addEventListener("pointerleave", onLeave);
    seccion.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      mq.removeEventListener("change", medir);
      seccion.removeEventListener("pointermove", onMove);
      seccion.removeEventListener("pointerleave", onLeave);
      seccion.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="corredor"
      /* Columna: arriba la caja y abajo una banda fija. La banda no es
         decorativa — es lo que garantiza que el texto del pie nunca se encime
         con la pieza plegada, que antes le pasaba por encima en celular. */
      className="relative isolate flex h-[100svh] w-full flex-col overflow-hidden bg-ink-pure"
      /* pan-y: el dedo hacia arriba scrollea la página, el de costado mueve el
         carrusel. Sin esto habría que elegir una de las dos. */
      style={{ touchAction: "pan-y" }}
    >
      <div
        /* ═══════════════════════════════════════════════════════════════════
           COLOR DE FONDO — DEMO CAJA 3D
           Es el `bg-ink-pure` de la sección. La caja necesita fondo oscuro:
           las aristas van en ice a baja opacidad y sobre claro no se leerían.
           ═══════════════════════════════════════════════════════════════════ */
        className="relative min-h-0 flex-1"
        style={{ perspective: `${PERSPECTIVA}px` }}
      >
        <AristasDeLaCaja />

        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              href={`/proyectos/${p.slug}`}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onMouseEnter={() => setSobrePieza(true)}
              onMouseLeave={() => setSobrePieza(false)}
              aria-label={`Ver el proyecto ${p.name}`}
              /* Al vivir en el fondo de la caja la perspectiva las achica, así
                 que hay que compensar acá. El tope de 660 deja libre la
                 columna derecha donde va el nombre en escritorio. */
              className="group absolute left-1/2 top-1/2 block w-[min(74vw,660px)] will-change-transform"
              style={{ opacity: 0, transformStyle: "preserve-3d" }}
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-ink-900">
                <Image
                  src={p.coverImage}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 74vw, 660px"
                  className="object-cover transition-[filter] duration-500 [filter:saturate(0.85)] group-hover:[filter:saturate(1)]"
                />
                {/* Marco claro: es lo que hace que se lea como una lámina y no
                    como una imagen flotando en el negro. */}
                <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/25 transition-colors duration-300 group-hover:ring-white/80" />
              </span>
            </Link>
          ))}
        </div>

        {/* En escritorio el nombre va al costado derecho, dentro de la caja:
            desde lg hay columna de sobra y no toca la pieza. */}
        <NombreActivo
          nombre={projects[frente]?.name ?? ""}
          slug={projects[frente]?.slug ?? ""}
          className="absolute right-[clamp(1rem,3vw,3rem)] top-1/2 hidden max-w-[22vw] -translate-y-1/2 text-right lg:block"
          tamano="text-[clamp(1.75rem,3.4vw,4rem)]"
        />
      </div>

      <PieDeCaja
        proyecto={projects[frente]}
        indice={frente}
        total={projects.length}
        sobrePieza={sobrePieza}
      />
    </section>
  );
}

/** Las cuatro aristas que van de las esquinas de la pantalla al fondo. */
function AristasDeLaCaja() {
  const trazo = "rgba(214,226,237,0.30)";
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <rect
        x="21"
        y="13"
        width="58"
        height="74"
        fill="none"
        stroke={trazo}
        strokeWidth="0.1"
        vectorEffect="non-scaling-stroke"
      />
      {[
        [0, 0, 21, 13],
        [100, 0, 79, 13],
        [0, 100, 21, 87],
        [100, 100, 79, 87],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={trazo}
          strokeWidth="0.1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

interface NombreActivoProps {
  nombre: string;
  slug: string;
  className?: string;
  /** Clase de tamaño de letra: cambia según dónde se muestre. */
  tamano: string;
}

/**
 * Nombre del proyecto que está de frente, animado letra por letra.
 *
 * Cada palabra va en su propio bloque `whitespace-nowrap` con las letras
 * adentro, y el espacio entre palabras queda FUERA de ese bloque. Es la única
 * forma de que se cumplan las dos cosas a la vez: que "Barretal" no se parta
 * a la mitad al quedarse sin ancho, y que "El Barretal" conserve su espacio.
 * Con el espacio adentro del bloque, el navegador lo recorta por ser espacio
 * final de un inline-block y quedaba "ElBarretal".
 *
 * La `key` es el slug a propósito: al cambiar de proyecto React reemplaza el
 * bloque y las animaciones vuelven a correr solas.
 */
function NombreActivo({ nombre, slug, className = "", tamano }: NombreActivoProps) {
  const palabras = nombre.split(" ");
  let orden = 0;

  return (
    <p
      key={slug}
      aria-live="polite"
      aria-label={nombre}
      className={`pointer-events-none m-0 font-display font-normal leading-[1.05] tracking-[-0.03em] text-white text-balance ${tamano} ${className}`}
    >
      {palabras.map((palabra, w) => (
        <Fragment key={`${slug}-p${w}`}>
          <span className="inline-block whitespace-nowrap">
            {[...palabra].map((c, i) => {
              const n = orden++;
              return (
                <span
                  key={`${slug}-${w}-${i}`}
                  aria-hidden="true"
                  className="animate-drift-up inline-block"
                  // 28 ms por letra: se lee como una ola sin que el nombre
                  // tarde en terminar de armarse.
                  style={{ animationDelay: `${n * 28}ms` }}
                >
                  {c}
                </span>
              );
            })}
          </span>
          {w < palabras.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}

interface PieProps {
  proyecto?: { name: string; slug: string; meta: { year: string } };
  indice: number;
  total: number;
  sobrePieza: boolean;
}

/**
 * Banda fija al pie de la caja.
 *
 * Es una fila propia del flex, no algo flotando encima: la caja de arriba se
 * encoge para dejarle lugar, así que por construcción ninguna pieza puede
 * quedar debajo de este texto.
 */
function PieDeCaja({ proyecto, indice, total, sobrePieza }: PieProps) {
  return (
    <div className="relative z-[2000] shrink-0 border-t border-white/10 px-[clamp(1rem,3vw,3rem)] py-[clamp(0.75rem,1.6vh,1.25rem)]">
      {/* El nombre grande solo en pantallas chicas: en escritorio ya está al
          costado derecho de la caja. */}
      {proyecto && (
        <NombreActivo
          nombre={proyecto.name}
          slug={proyecto.slug}
          className="mb-2 block lg:hidden"
          tamano="text-[clamp(1.5rem,7vw,2.25rem)]"
        />
      )}

      <div className="flex items-baseline justify-between gap-4 font-mono text-xs uppercase tracking-kicker text-white/60">
        {/* El año vive acá, junto al contador. */}
        <span className="whitespace-nowrap">
          <span className="text-white">{String(indice + 1).padStart(2, "0")}</span> /{" "}
          {String(total).padStart(2, "0")}
          {proyecto ? ` · ${proyecto.meta.year}` : null}
        </span>
        <span className="hidden text-right lg:inline">
          {sobrePieza
            ? "clic para abrir el proyecto"
            : "mové el mouse arriba y abajo para recorrer"}
        </span>
        <span className="text-right lg:hidden">deslizá de lado · tocá para abrir</span>
      </div>
    </div>
  );
}
