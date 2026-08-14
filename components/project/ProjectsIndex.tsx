"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { TitleReveal } from "@/components/ui/TitleReveal";

/* -------------------------------------------------------------------------- */
/*  Índice de proyectos — /proyectos                                           */
/*                                                                            */
/*  Es el archivo completo, y tiene que ser distinto de la caja 3D del inicio:  */
/*  allá el portafolio es un gesto —piezas plegándose mientras se scrollea—,    */
/*  acá es un lugar donde se viene a MIRAR el trabajo. Así que nada de          */
/*  movimiento propio: una retícula editorial, imágenes grandes y quietas, y    */
/*  la ficha de cada proyecto debajo.                                          */
/*                                                                            */
/*  ── Por qué escalonada ─────────────────────────────────────────────────    */
/*  Dos columnas parejas convierten seis proyectos en tres filas de dos, y una  */
/*  retícula así se lee como catálogo de stock. Bajando media altura la columna */
/*  derecha, la vista nunca tiene dos piezas alineadas al mismo nivel: el ojo   */
/*  recorre en zigzag y cada proyecto se mira por separado. Además las          */
/*  proporciones alternan (vertical / apaisada), que es lo que evita que seis   */
/*  portadas distintas se lean como una sola textura.                          */
/*                                                                            */
/*  El texto queda al mínimo a propósito: número, nombre, año y servicios. En   */
/*  un estudio de diseño el índice lo tiene que llevar la obra, no la ficha.    */
/* -------------------------------------------------------------------------- */

/**
 * Proporción de cada portada, alternando. Las verticales (4/5) y las apaisadas
 * (4/3) se turnan para que la columna no quede con todas las piezas iguales.
 * El índice par va vertical, el impar apaisado.
 */
const PROPORCIONES = ["aspect-[4/5]", "aspect-[4/3]"] as const;

export function ProjectsIndex() {
  return (
    <div className="bg-paper-bone">
      <Portada />
      <Reticula />
      <Cierre />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Portada                                                                    */
/* -------------------------------------------------------------------------- */

function Portada() {
  const anios = projects.map((p) => p.meta.year).sort();

  return (
    <header className="px-[clamp(1rem,3vw,3rem)] pb-[clamp(2rem,5vw,4.5rem)] pt-[clamp(7rem,12vw,11rem)]">
      <span className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-px w-[clamp(1.5rem,4vw,3.5rem)] bg-ink-900/35"
        />
        <span className="font-mono text-xs uppercase tracking-kicker text-ink-700">
          Portafolio · {anios[0]}–{anios[anios.length - 1]}
        </span>
      </span>

      {/* Dos líneas con el corte decidido acá y whitespace-nowrap: el ancho no
          puede quedar en manos del navegador, o a este tamaño la fuente display
          parte la frase palabra por palabra. */}
      <h1 className="mt-4 font-display text-[clamp(2.2rem,6vw,6.5rem)] font-normal leading-[0.88] tracking-[-0.045em] text-ink-900">
        <span className="block whitespace-nowrap">
          <TitleReveal text="El trabajo" stagger={80} />
        </span>
        <span className="block whitespace-nowrap text-ink-500">
          <TitleReveal text="habla primero." delay={200} stagger={80} />
        </span>
      </h1>

      <div className="mt-[clamp(1.5rem,3vw,2.5rem)] flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-ink-900/15 pt-4">
        <p className="m-0 max-w-[52ch] text-body-sm text-ink-700 text-pretty">
          Marcas construidas para decidir, no para presentar. Cada proyecto
          empieza en un diagnóstico y termina en un sistema que el equipo puede
          usar sin nosotros.
        </p>
        <span className="font-mono text-xs uppercase tracking-kicker tabular-nums text-ink-500">
          {String(projects.length).padStart(2, "0")} proyectos
        </span>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Retícula                                                                   */
/* -------------------------------------------------------------------------- */

function Reticula() {
  return (
    <ol className="m-0 grid list-none gap-x-[clamp(1rem,3vw,3.5rem)] gap-y-[clamp(3rem,6vw,7rem)] px-[clamp(1rem,3vw,3rem)] pb-[clamp(4rem,8vw,9rem)] p-0 md:grid-cols-2">
      {projects.map((p, i) => (
        <li
          key={p.slug}
          /* La columna derecha arranca media pieza más abajo. Solo desde md:
             en una columna el desfase no significa nada y solo dejaría un
             hueco arriba. */
          className={i % 2 === 1 ? "md:mt-[clamp(3rem,8vw,9rem)]" : undefined}
        >
          <Ficha proyecto={p} indice={i} />
        </li>
      ))}
    </ol>
  );
}

interface FichaProps {
  proyecto: (typeof projects)[number];
  indice: number;
}

function Ficha({ proyecto, indice }: FichaProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);

  // Entra al aparecer en cuadro. Observer propio y no el componente Reveal
  // porque acá el gesto es en dos tiempos —primero la portada, después la
  // ficha— y hace falta el mismo disparo para las dos partes.
  //
  // Sin temporizador de respaldo a propósito. La tentación es poner uno "por
  // si el observador no dispara", pero acá habría seis fichas montadas de
  // entrada: al cumplirse el plazo se revelarían TODAS a la vez, incluidas
  // las que están tres pantallas abajo, y el escalonado desaparecería.
  // No hace falta: observe() evalúa el elemento de inmediato, así que las
  // fichas que ya están en cuadro se revelan en el primer callback y las
  // demás cuando les toca.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    // Chequeo directo al montar: si la ficha YA está en cuadro se revela sin
    // esperar al observador. Es la red de seguridad que sí sirve —cubre el
    // caso en que el observador no llega a disparar para lo que está a la
    // vista— y a diferencia de un temporizador no toca a las fichas de más
    // abajo, así que el escalonado queda intacto.
    const enCuadro = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.88 && r.bottom > 0;
    };
    if (enCuadro()) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Link
      ref={ref}
      href={`/proyectos/${proyecto.slug}`}
      /* El puntero pasa a su estado "importante": esto abre un proyecto. */
      data-cursor="estrella"
      className="group block"
    >
      {/* ── La portada ────────────────────────────────────────────────────
          Se descubre bajo una máscara que sube (clip-path) en vez de aparecer
          con un fade: la imagen ya está completa desde el primer frame y lo
          que se mueve es el recorte, así que no hay ningún momento en que la
          obra se vea a medias. */}
      <span className="relative block overflow-hidden bg-ink-900/5">
        <span
          className={`relative block ${PROPORCIONES[indice % PROPORCIONES.length]}`}
          style={{
            clipPath: visible ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
            transition: "clip-path 1100ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <Image
            src={proyecto.coverImage}
            alt={proyecto.name}
            fill
            sizes="(max-width: 767px) 92vw, (max-width: 1279px) 46vw, 620px"
            className="object-cover transition-[transform,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] [filter:saturate(0.85)] group-hover:scale-[1.03] group-hover:[filter:saturate(1)]"
            priority={indice < 2}
          />
        </span>
        {/* Marco fino: define la lámina sobre el blanco, sin sombra. */}
        <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink-900/15 transition-colors duration-500 group-hover:ring-ink-900/40" />
      </span>

      {/* ── La ficha ──────────────────────────────────────────────────────── */}
      <span
        className="mt-[clamp(0.9rem,1.6vw,1.4rem)] block transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transitionDelay: "220ms",
        }}
      >
        {/* La regla se recorre al pasar el puntero: el mismo gesto que usan
            los frentes de servicios y las filas de "por qué Manifesto". */}
        <span
          aria-hidden="true"
          className="block h-px w-full origin-left scale-x-0 bg-ink-900 transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        />

        <span className="mt-3 flex items-baseline justify-between gap-4">
          <span className="font-mono text-xs uppercase tracking-kicker tabular-nums text-ink-500">
            {String(indice + 1).padStart(2, "0")}
          </span>
          <span className="font-mono text-xs uppercase tracking-kicker tabular-nums text-ink-500">
            {proyecto.meta.year}
          </span>
        </span>

        <span className="mt-1.5 flex items-end justify-between gap-4">
          <span className="font-display text-[clamp(1.5rem,2.6vw,2.6rem)] font-normal leading-[1.05] tracking-[-0.03em] text-ink-900">
            {proyecto.name}
          </span>
          <span
            aria-hidden="true"
            className="mb-1 shrink-0 font-mono text-base text-ink-500 transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-ink-900"
          >
            →
          </span>
        </span>

        <span className="mt-1 block text-body-sm text-ink-700">
          {proyecto.meta.services}
        </span>
      </span>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Cierre                                                                     */
/* -------------------------------------------------------------------------- */

function Cierre() {
  return (
    <section className="border-t border-ink-900/12 px-[clamp(1rem,3vw,3rem)] py-[clamp(3rem,7vw,7rem)]">
      <div className="flex flex-wrap items-end justify-between gap-[clamp(1.5rem,4vw,4rem)]">
        <p className="m-0 max-w-[20ch] font-display text-[clamp(1.6rem,3.2vw,3rem)] font-normal leading-[1.05] tracking-[-0.03em] text-ink-900 text-balance">
          El próximo puede ser el tuyo.
        </p>

        {/* Mismo botón que el "Hablemos" del header: el relleno sube desde
            abajo en vez de cambiar de color de un frame al otro. */}
        <Link
          href="/#contacto"
          data-cursor="estrella"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-pill border border-space-slate bg-space-slate px-7 py-3.5 font-mono text-xs uppercase tracking-kicker text-paper-bone transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-ink-900"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-bottom scale-y-0 bg-paper-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
          />
          <span className="relative">Hablemos</span>
          <span className="relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
