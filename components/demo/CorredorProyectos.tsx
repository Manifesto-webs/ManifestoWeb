"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";

/* -------------------------------------------------------------------------- */
/*  Portafolio — proyectos en caja 3D                                          */
/*                                                                            */
/*  Carrusel dentro de una caja. La pieza del centro está de frente; al        */
/*  alejarse hacia los bordes se pliega —como una tapa que se abre— contra el   */
/*  techo y el piso. El recorrido es VERTICAL en todas las pantallas.          */
/*                                                                            */
/*  ── Cómo se maneja: el scroll ES el carrusel ────────────────────────────   */
/*  La sección mide varias pantallas de alto y su contenido queda FIJO         */
/*  (sticky) mientras se la recorre. Ese recorrido se reparte entre los        */
/*  proyectos: arriba de todo está el primero de frente, abajo del todo el     */
/*  último, y cada punto intermedio es una posición exacta del carrusel.       */
/*  Bajar dos dedos avanza siempre lo mismo, y volver a subir devuelve         */
/*  exactamente donde se estaba.                                              */
/*                                                                            */
/*  Antes convivían tres fuentes de movimiento sobre el mismo recorrido —una   */
/*  marcha automática, un empujón por scroll y un arrastre— cada una con su    */
/*  inercia. El resultado era que la caja nunca estaba donde uno la había      */
/*  dejado: seguía andando sola, el scroll le sumaba un envión que no          */
/*  correspondía a la distancia recorrida, y al volver hacia arriba no         */
/*  regresaba al mismo lugar. Nada de eso era controlable.                    */
/*                                                                            */
/*  Queda UNA fuente: la posición del scroll. El bucle solo suaviza el camino  */
/*  hacia ella, así que el movimiento se siente pesado y continuo sin dejar    */
/*  de ser predecible. Y como el scroll de la página es el que manda, en       */
/*  celular funciona igual sin secuestrar el gesto del dedo.                  */
/*                                                                            */
/*  ── Composición (escritorio) ───────────────────────────────────────────    */
/*  Nombre a la IZQUIERDA, pieza a la DERECHA. La pieza es lo más grande de la  */
/*  sección y el nombre la acompaña; el eje de la caja está corrido a la        */
/*  derecha para dejarle la columna izquierda al texto.                        */
/* -------------------------------------------------------------------------- */

/**
 * Cuánto separa una pieza de la siguiente, como múltiplo del alto REAL de la
 * pieza. Se mide en vivo (y en cada resize) en vez de ir en px fijos: así el
 * pliegue se ve igual con la pieza chica del celular y con la grande del
 * escritorio, y sobre todo no hay que recalcularlo a mano cada vez que cambia
 * el ancho de la lámina. Con ~1.1 se ven solo tres a la vez.
 */
const FACTOR_ESCRITORIO = 1.08;
const FACTOR_MOVIL = 1.25;
/** Cuánto se pliega, en grados. 90 la dejaría de canto e invisible. */
const ANGULO = 72;
/**
 * Profundidad del fondo de la caja. Ojo: junto con la perspectiva decide el
 * TAMAÑO REAL en pantalla, que es lo que se ve. La escala aplicada es
 * PERSPECTIVA / (PERSPECTIVA + PROFUNDIDAD) — con 700 y 1150 la lámina se
 * achicaba al 62%, así que un ancho de 700 px terminaba midiendo 435. Bajarla
 * a 640 y subir la perspectiva sube esa escala al 67%, y ahí sí el aumento de
 * ancho del CSS se ve en pantalla.
 */
const PROFUNDIDAD = 640;
/** Perspectiva de la caja. Cuanto más chica, más marcada la fuga. */
const PERSPECTIVA = 1300;
/**
 * Cuántas pantallas de scroll se le dan a CADA proyecto después del primero.
 * Es la sensibilidad del carrusel: más alto, más despacio y más deliberado.
 * Con 0.62 hacen falta unas dos vueltas de rueda por proyecto, que es lo que
 * deja mirar una pieza sin que la siguiente ya esté encima.
 */
const PANTALLAS_POR_PIEZA = 0.62;
/**
 * Constante de tiempo del suavizado, en ms: cuánto tarda la caja en recorrer
 * ~63% de lo que le falta para llegar a donde dice el scroll. Es lo único que
 * separa la posición real de la que pide la página, y de acá sale todo el
 * peso del movimiento. Más alto = más pesado y más retrasado.
 */
const TAU_SEGUIMIENTO = 165;
/** Debajo de este ancho la caja va en su versión compacta y clara. */
const CORTE_MOVIL = "(max-width: 1023px)";

const wrap = (v: number, n: number) => ((v % n) + n) % n;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

interface CorredorProyectosProps {
  /**
   * id de la sección (ancla de scroll). Por defecto "corredor"; en la home va
   * "trabajo" para conservar los enlaces existentes que apuntaban al bento.
   */
  id?: string;
}

export function CorredorProyectos({ id = "corredor" }: CorredorProyectosProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const offsetRef = useRef(0);
  const [frente, setFrente] = useState(0);

  useEffect(() => {
    const seccion = sectionRef.current;
    if (!seccion) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const movil = window.matchMedia(CORTE_MOVIL);

    // En celular NO se usa la caja 3D: la sección va oculta (hidden lg:block) y
    // en su lugar se muestra una lista simple y clicable (PortafolioMovil). Así
    // que acá no montamos nada del motor 3D —ni loop, ni listeners— en móvil.
    if (movil.matches) return;

    let paso = 520;
    let tira = projects.length * paso;
    /** Recorrido total del carrusel, en px: del primer proyecto al último. */
    let recorrido = (projects.length - 1) * paso;

    // La separación sale del alto real de la pieza, así que hay que remedirla
    // cada vez que cambia el tamaño.
    const medir = () => {
      const alto = itemRefs.current[0]?.offsetHeight ?? 0;
      const factor = movil.matches ? FACTOR_MOVIL : FACTOR_ESCRITORIO;
      paso = Math.max(260, alto * factor);
      tira = projects.length * paso;
      recorrido = (projects.length - 1) * paso;
    };

    let raf = 0;
    let ultimo = 0;
    let frenteAnterior = -1;

    /* ---------------------------------------------------------------- */
    /*  El scroll dice DÓNDE está el carrusel                            */
    /*                                                                  */
    /*  La sección mide varias pantallas y su contenido va sticky. El    */
    /*  progreso de ese tramo (0 arriba, 1 abajo) se mapea al recorrido   */
    /*  completo: es una posición, no un empujón. Por eso volver hacia    */
    /*  arriba devuelve exactamente al mismo lugar.                      */
    /* ---------------------------------------------------------------- */
    let destino = 0;

    const leerScroll = () => {
      const r = seccion.getBoundingClientRect();
      // El tramo útil es el alto de la sección menos la pantalla que queda
      // pegada: mientras el sticky está fijo, esto va de 0 a 1.
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
      destino = p * recorrido;
    };

    const frame = (t: number) => {
      if (!ultimo) ultimo = t;
      const dtMs = Math.min(t - ultimo, 50);
      ultimo = t;

      /* El único movimiento: perseguir el destino que marca el scroll. El
         suavizado es exponencial sobre el tiempo REAL del frame, así que la
         caja se siente igual a 60, 120 o 144 Hz. Y como el destino es una
         posición absoluta, nunca se acumula error: por más que se scrollee a
         los tirones, la caja siempre termina exactamente donde corresponde. */
      if (quieto) {
        offsetRef.current = destino;
      } else {
        const k = 1 - Math.exp(-dtMs / TAU_SEGUIMIENTO);
        offsetRef.current += (destino - offsetRef.current) * k;
        // Cuando falta menos de medio píxel se planta: si no, el bucle queda
        // persiguiendo decimales para siempre.
        if (Math.abs(destino - offsetRef.current) < 0.5) {
          offsetRef.current = destino;
        }
      }

      let masCerca = 0;
      let minAbs = Infinity;

      projects.forEach((_, i) => {
        const el = itemRefs.current[i];
        if (!el) return;

        // Posición de esta pieza respecto al centro, dando la vuelta a la tira.
        const d = wrap(i * paso - offsetRef.current + tira / 2, tira) - tira / 2;
        // -1 pegada al techo, 0 de frente, 1 pegada al piso.
        const t01 = clamp(d / paso, -1, 1);
        const abs = Math.abs(t01);

        // Bisagra en el borde que mira al centro de la pantalla.
        el.style.transformOrigin = d < 0 ? "center bottom" : "center top";
        el.style.transform =
          `translate(-50%, -50%) translateZ(${-PROFUNDIDAD}px) ` +
          `translateY(${d}px) rotateX(${t01 * ANGULO}deg)`;

        // Las de en medio a opacidad plena; las de más allá se apagan, que si
        // no se amontonan detrás de las plegadas.
        const visible = clamp((1.7 - Math.abs(d) / paso) / 0.6, 0, 1);
        el.style.opacity = String(visible);
        el.style.zIndex = String(Math.round(500 - abs * 100));

        if (Math.abs(d) < minAbs) {
          minAbs = Math.abs(d);
          masCerca = i;
        }
      });

      // Clics: SOLO la pieza de frente. Antes todas las piezas con opacidad >0.5
      // eran clicables, así que las plegadas de arriba/abajo —por el 3D, su área
      // de click se superpone a la del centro— interceptaban el clic y había que
      // insistir varias veces para abrir el proyecto. Ahora la del frente manda:
      // un clic a la imagen navega directo a SU proyecto.
      itemRefs.current.forEach((el, i) => {
        if (el) el.style.pointerEvents = i === masCerca ? "auto" : "none";
      });

      if (masCerca !== frenteAnterior) {
        frenteAnterior = masCerca;
        setFrente(masCerca);
      }

      raf = requestAnimationFrame(frame);
    };

    const remedir = () => {
      medir();
      leerScroll();
    };

    remedir();
    // Primer frame sin recorrido: la caja arranca donde corresponde en vez de
    // viajar desde el proyecto 01 cuando se entra a media página.
    offsetRef.current = destino;

    // ResizeObserver y no el evento de ventana: la sección puede cambiar de
    // tamaño sin que la ventana lo haga, y ahí el evento nunca llega.
    const ro = new ResizeObserver(remedir);
    ro.observe(seccion);
    movil.addEventListener("change", remedir);

    window.addEventListener("scroll", leerScroll, { passive: true });
    window.addEventListener("resize", remedir);
    raf = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      movil.removeEventListener("change", remedir);
      window.removeEventListener("scroll", leerScroll);
      window.removeEventListener("resize", remedir);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    /* ═══════════════════════════════════════════════════════════════════════
       La sección es ALTA y su contenido va fijo (sticky) mientras se la
       recorre. Ese alto es literalmente cuánto scroll se le dedica al
       portafolio: una pantalla para dejar la primera pieza quieta de frente,
       más PANTALLAS_POR_PIEZA por cada una de las siguientes.

       COLOR DE FONDO — PORTAFOLIO
       Blanco (`bg-paper-bone`). Por eso las aristas van en slate y no en ice:
       el ice a 1 px sobre blanco no se leería.
       ═══════════════════════════════════════════════════════════════════════ */
    <div id={id}>
      {/* CELULAR: la caja 3D no funciona bien en pantalla chica (piezas
          plegadas, aristas cortando y solo la del frente clicable). Se
          reemplaza por una lista simple donde TODAS las piezas se pueden tocar. */}
      <PortafolioMovil className="lg:hidden" />

      {/* ESCRITORIO: la caja 3D original, intacta. */}
      <section
      ref={sectionRef}
      className="relative isolate hidden w-full bg-paper-bone lg:block"
      style={{
        height: `calc(100svh + ${(projects.length - 1) * PANTALLAS_POR_PIEZA * 100}svh)`,
      }}
    >
      {/* El sticky es lo que hace que la caja se quede quieta en pantalla
          mientras la página sigue bajando. select-none para que arrastrar el
          scroll no vaya seleccionando los nombres de los proyectos. */}
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden select-none">
        <div
          className="relative min-h-0 flex-1"
          style={{ perspective: `${PERSPECTIVA}px` }}
        >
          <AristasDeLaCaja />

          {/* ── Nombre del proyecto de frente — columna IZQUIERDA ──────────
              Va antes que las piezas en el DOM pero por debajo en z: la caja
              manda, el nombre acompaña. El ancho se corta antes de que empiece
              la lámina para que nunca se le monte encima. */}
          <NombreActivo
            nombre={projects[frente]?.name ?? ""}
            slug={projects[frente]?.slug ?? ""}
            indice={frente}
            total={projects.length}
            anio={projects[frente]?.meta.year ?? ""}
            className="absolute left-[clamp(1.5rem,4vw,4.5rem)] top-1/2 hidden w-[min(32vw,480px)] -translate-y-1/2 lg:block"
          />

          {/* pointer-events-none es CLAVE: las piezas viven en
              translateZ(-640px), así que este contenedor plano queda adelante
              en el eje Z e interceptaría todos los clics. Apagándolo, el clic
              pasa a las piezas (que se prenden solas con pointer-events:auto
              cuando están al frente). */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            {projects.map((p, i) => (
              <Link
                key={p.slug}
                href={`/proyectos/${p.slug}`}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                /* El puntero pasa a su estado "importante" (estrella grande +
                   halo) sobre una pieza: es lo que abre un proyecto. */
                data-cursor="estrella"
                aria-label={`Ver el proyecto ${p.name}`}
                /* Láminas más anchas y más grandes que antes (eran 700px de
                   tope). El eje va centrado en celular y corrido a la derecha
                   en escritorio (left-[64%]), que es lo que le abre la columna
                   izquierda al nombre. */
                className="group absolute left-1/2 top-1/2 block w-[78vw] will-change-transform lg:left-[76%] lg:w-[min(82vw,1120px)]"
                style={{ opacity: 0, transformStyle: "preserve-3d" }}
              >
                <span className="relative block aspect-[4/3] overflow-hidden bg-ink-900/5 lg:aspect-[16/10]">
                  <Image
                    src={p.coverImage}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1023px) 78vw, 1120px"
                    className="object-cover transition-[filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [filter:saturate(0.85)] group-hover:scale-[1.02] group-hover:[filter:saturate(1)]"
                  />
                  {/* Marco fino oscuro: define la lámina sobre el blanco. */}
                  <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink-900/20 transition-colors duration-300 group-hover:ring-ink-900/45 group-active:ring-ink-900/45" />
                </span>

                {/* Solo en celular: número · año · nombre pegados debajo de la
                    pieza (con su margen para no tocar la lámina). Se pliegan
                    junto con ella. En escritorio el nombre va en la columna
                    izquierda. */}
                <span className="mt-2.5 block lg:hidden">
                  <span className="block font-mono text-[0.65rem] uppercase tracking-kicker text-ink-700">
                    {String(i + 1).padStart(2, "0")} · {p.meta.year}
                  </span>
                  <span className="mt-0.5 block font-display text-[clamp(1.1rem,5.5vw,1.6rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink-900">
                    {p.name}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Portafolio en celular — lista simple, todo clicable                        */
/*                                                                            */
/*  Sin 3D ni scroll secuestrado: seis portadas apiladas, cada una un enlace   */
/*  entero a su proyecto. Es lo que se ve en < 1024px.                         */
/* -------------------------------------------------------------------------- */
function PortafolioMovil({ className = "" }: { className?: string }) {
  return (
    <section
      className={`bg-paper-bone px-[clamp(1rem,5vw,2rem)] pb-[clamp(3rem,10vw,5rem)] pt-[clamp(2rem,7vw,4rem)] ${className}`}
    >
      <span className="mb-[clamp(1.5rem,6vw,2.5rem)] flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-8 bg-ink-900/35" />
        <span className="font-mono text-xs uppercase tracking-kicker text-ink-700">
          Portafolio
        </span>
      </span>

      <ol className="m-0 grid list-none gap-[clamp(2.5rem,9vw,3.5rem)] p-0">
        {projects.map((p, i) => (
          <li key={p.slug}>
            <Link href={`/proyectos/${p.slug}`} className="group block">
              <span className="relative block aspect-[4/3] overflow-hidden bg-ink-900/5">
                <Image
                  src={p.coverImage}
                  alt={p.name}
                  fill
                  sizes="100vw"
                  className="object-cover [filter:saturate(0.9)]"
                />
                <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink-900/15" />
              </span>

              <span className="mt-3 flex items-baseline justify-between gap-4">
                <span className="font-mono text-[0.7rem] uppercase tracking-kicker tabular-nums text-ink-500">
                  {String(i + 1).padStart(2, "0")} · {p.meta.year}
                </span>
                <span
                  aria-hidden="true"
                  className="font-mono text-base text-ink-500 transition-transform duration-300 group-active:translate-x-1"
                >
                  →
                </span>
              </span>

              <span className="mt-1 block font-display text-[clamp(1.6rem,7vw,2.2rem)] font-normal leading-[1.05] tracking-[-0.03em] text-ink-900">
                {p.name}
              </span>
              <span className="mt-1 block text-body-sm text-ink-700">
                {p.meta.services}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Las cuatro aristas que van de las esquinas de la pantalla al fondo. */
function AristasDeLaCaja() {
  return (
    <svg
      /* El trazo toma el color de `currentColor`: slate sobre el blanco de
         celular, ice sobre el negro de escritorio. En 1 px el ice sobre blanco
         no se ve, por eso el slate. */
      className="pointer-events-none absolute inset-0 h-full w-full text-[rgba(40,46,50,0.4)] lg:text-[rgba(214,226,237,0.3)]"
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
        stroke="currentColor"
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
          stroke="currentColor"
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
  indice: number;
  total: number;
  anio: string;
  className?: string;
}

/**
 * Columna izquierda de escritorio: el proyecto que está de frente.
 *
 * Cada palabra va en su propio bloque `whitespace-nowrap` y el espacio entre
 * palabras queda FUERA del bloque: así "Barretal" no se parte al quedarse sin
 * ancho y "El Barretal" conserva su espacio. La `key` es el slug para que al
 * cambiar de proyecto la animación vuelva a correr sola.
 */
function NombreActivo({
  nombre,
  slug,
  indice,
  total,
  anio,
  className = "",
}: NombreActivoProps) {
  const palabras = nombre.split(" ");
  let orden = 0;

  return (
    <div key={slug} className={`pointer-events-none z-[1] ${className}`}>
      {/* Índice y año: el dato duro que antes vivía en la barra de abajo.
          Acá acompaña al nombre en vez de ocupar una franja propia. */}
      <p
        className="m-0 flex items-baseline gap-2 font-mono text-xs uppercase tracking-kicker text-ink-500 animate-drift-up"
        style={{ animationDelay: "40ms" }}
      >
        <span className="tabular-nums text-ink-900">
          {String(indice + 1).padStart(2, "0")}
        </span>
        <span className="h-px w-8 bg-ink-300" aria-hidden="true" />
        <span className="tabular-nums">{String(total).padStart(2, "0")}</span>
        {anio ? <span className="ml-1 text-ink-500">· {anio}</span> : null}
      </p>

      <p
        aria-live="polite"
        aria-label={nombre}
        className="mt-4 m-0 font-display text-[clamp(2rem,3.4vw,3.6rem)] font-normal leading-[1.02] tracking-[-0.035em] text-ink-900 text-balance"
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

      {/* La pista de que la lámina abre el proyecto. Discreta: el trabajo ya
          está a la vista, esto solo confirma que se puede entrar. */}
      <p
        className="mt-6 m-0 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-kicker text-ink-500 animate-drift-up"
        style={{ animationDelay: "260ms" }}
      >
        Ver proyecto
        <span aria-hidden="true">→</span>
      </p>
    </div>
  );
}
