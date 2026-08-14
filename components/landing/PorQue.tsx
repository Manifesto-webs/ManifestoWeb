"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SpaceBackdrop } from "@/components/ui/SpaceBackdrop";
import { TitleReveal } from "@/components/ui/TitleReveal";

/* -------------------------------------------------------------------------- */
/*  Por qué Manifesto — copy de "Textos web v3"                                */
/*                                                                            */
/*  Cinco argumentos sobre cómo trabajan, no sobre qué venden. Va en           */
/*  /nosotros, después de quiénes somos: refuerza donde el visitante ya los    */
/*  está conociendo.                                                          */
/*                                                                            */
/*  ── Cómo se lee ─────────────────────────────────────────────────────────   */
/*  En reposo solo se ven los cinco títulos. La explicación aparece cuando se  */
/*  pide: con el puntero encima en escritorio, con un toque en celular.        */
/*                                                                            */
/*  Antes las dos cosas convivían en columnas separadas —título a la           */
/*  izquierda, explicación a la derecha— y eso traía dos problemas: la lista   */
/*  era un muro de texto donde ningún título alcanzaba a destacar, y entre el  */
/*  título y su propia explicación había hasta 2.5 rem de aire, así que se     */
/*  leían como dos cosas y no como una. Ahora la explicación cae PEGADA        */
/*  debajo de su título, en la misma columna, y solo cuando hace falta.       */
/*                                                                            */
/*  El plegado usa grid-template-rows 0fr → 1fr y no max-height: no hay que    */
/*  adivinar una altura, así que el texto puede crecer sin que nadie ajuste    */
/*  un número, y la animación sale exacta en vez de "más o menos".             */
/* -------------------------------------------------------------------------- */

interface Motivo {
  id: string;
  title: string;
  desc: string;
}

const MOTIVOS: Motivo[] = [
  {
    id: "01",
    title: "Decisiones, no presentaciones",
    desc: "Cada fase cierra con algo definido. Menos juntas para revisar, más para decidir.",
  },
  {
    id: "02",
    title: "Método corto, fondo profundo",
    desc: "Cuatro fases que se entienden en diez segundos. Lo que hay debajo es lo que toma tiempo, pero definimos una ruta personalizada para abordarlo.",
  },
  {
    // El documento marcaba esta línea como poco clara. Se reescribió con la
    // misma fórmula que usa el bloque de la decisión financiera, para que las
    // dos secciones se refuercen en vez de sonar distintas.
    id: "03",
    title: "Empezamos por el número",
    desc: "Antes de diseñar, estimamos cómo la marca puede mover tus números: precio, fidelidad y expansión.",
  },
  {
    id: "04",
    title: "El equipo se queda con el criterio",
    desc: "Entregamos herramientas para que se apoderen de sus procesos. No construimos dependencia.",
  },
  {
    // El documento cerraba con "Las buenas ideas rara vez llegan solas", que ya
    // es el cierre de "Nuestro equipo" en esta misma página. Se dejó solo la
    // primera frase para no repetirla.
    id: "05",
    title: "Socios, no proveedores",
    desc: "Trabajamos dentro del equipo del cliente.",
  },
];

export function PorQue() {
  const [abierto, setAbierto] = useState<number | null>(null);
  /**
   * Si el dispositivo tiene puntero de verdad. Decide el gesto: pasar el mouse
   * en escritorio, tocar en celular. No se usa el ancho de pantalla porque una
   * tablet ancha sigue sin tener hover.
   */
  const [conHover, setConHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const leer = () => setConHover(mq.matches);
    leer();
    mq.addEventListener("change", leer);
    return () => mq.removeEventListener("change", leer);
  }, []);

  const abrir = (i: number) => setAbierto(i);
  const cerrar = () => setAbierto(null);

  return (
    <section
      id="por-que"
      /* ─────────────────────────────────────────────────────────────────
         FONDO DE ESTA SECCIÓN (Por qué Manifesto)
         Va en blanco: bg-paper-bone. Para cambiarlo, es esta clase.
         El fondo de TODA la página está en app/nosotros/page.tsx.

         El padding de ARRIBA es la mitad del de abajo a propósito: esta
         sección tiene que leerse pegada a las tarjetas de "Nosotros", no
         como un bloque aparte. Antes los dos eran de hasta 13 rem y entre
         las tarjetas y este titular quedaban 26 rem de blanco.
         ───────────────────────────────────────────────────────────────── */
      className="relative overflow-hidden bg-paper-bone px-[clamp(1rem,3vw,3rem)] pb-[clamp(4.5rem,11vw,13rem)] pt-[clamp(1rem,2.5vw,3rem)]"
    >
      {/* Variante clara: sin corinto y con los anillos en ice. */}
      <SpaceBackdrop variant="paper" />

      <Reveal className="relative z-10 mb-[clamp(1.25rem,2.5vw,2.25rem)]">
        <h2 className="m-0 max-w-[14ch] font-display text-[clamp(2rem,5vw,5rem)] font-normal leading-[0.95] tracking-[-0.035em] text-ink-900">
          <TitleReveal text="Por qué Manifesto." />
        </h2>
      </Reveal>

      <ol className="relative z-10 m-0 flex list-none flex-col border-t border-ink-900/20 p-0">
        {MOTIVOS.map((m, i) => {
          const on = abierto === i;
          return (
            <Reveal key={m.id} delay={i * 80}>
              <li
                className="relative border-b border-ink-900/12"
                onMouseEnter={conHover ? () => abrir(i) : undefined}
                onMouseLeave={conHover ? cerrar : undefined}
              >
                {/* Línea que barre de izquierda a derecha al abrir. Va en el
                    <li> y no dentro del botón para que se apoye en el borde
                    superior de la fila sin depender de su padding. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 h-px w-full origin-left transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: on ? "scaleX(1)" : "scaleX(0)",
                    background: "linear-gradient(90deg, #282e32, transparent)",
                  }}
                />
                {/* Botón y no un div con onClick: en celular esto se toca, así
                    que tiene que llegarle al teclado y anunciarse como control.
                    En escritorio el hover hace lo mismo, y el foco también
                    abre —quien navega con Tab ve la explicación igual. */}
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`motivo-${m.id}`}
                  onClick={() => setAbierto(on ? null : i)}
                  onFocus={() => abrir(i)}
                  /* En celular es una sola columna y el "+" se posiciona
                     absoluto: si ocupara columna propia, el título centrado
                     quedaría corrido a la izquierda por el ancho del signo, y
                     lo que se pidió es que el header quede centrado en la
                     PÁGINA. En escritorio vuelve a ser una grilla de tres. */
                  className="group relative grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-[clamp(0.9rem,2.5vw,2rem)] py-[clamp(1.1rem,2.2vw,1.9rem)] text-left transition-[padding,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] max-md:grid-cols-1 max-md:text-center"
                  style={{
                    paddingLeft: on ? "0.7rem" : "0",
                    paddingRight: on ? "0.7rem" : "0",
                    backgroundColor: on ? "rgba(45,52,54,0.035)" : "transparent",
                  }}
                >
                  {/* El número se esconde en celular: ahí el título va centrado
                      y un número al costado lo descentraría. */}
                  <span
                    className="font-mono text-xs tabular-nums tracking-[0.2em] transition-colors duration-500 max-md:hidden"
                    style={{ color: on ? "#2D3436" : "#757A7D" }}
                  >
                    {m.id}
                  </span>

                  <span className="max-md:text-center">
                    <span
                      className="block max-w-[26ch] font-display text-[clamp(1.35rem,2.4vw,2.3rem)] font-normal leading-[1.1] tracking-[-0.025em] transition-colors duration-500 text-pretty max-md:mx-auto"
                      style={{ color: on ? "#2D3436" : "rgba(45,52,54,0.82)" }}
                    >
                      {m.title}
                    </span>

                    {/* ── La explicación ──────────────────────────────────
                        Dos capas: la de afuera abre el espacio (0fr → 1fr) y
                        la de adentro trae el texto (sube y se funde, con un
                        retraso). Separarlas es lo que evita el efecto de
                        texto estirándose: el hueco se hace primero y el texto
                        entra después, ya a su tamaño final. */}
                    <span
                      id={`motivo-${m.id}`}
                      className="grid transition-[grid-template-rows] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                    >
                      <span className="overflow-hidden">
                        <span
                          className="mt-3 block max-w-[54ch] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.6] text-ink-700 transition-[opacity,transform,filter] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-pretty max-md:mx-auto"
                          style={{
                            opacity: on ? 1 : 0,
                            transform: on ? "translateY(0)" : "translateY(-6px)",
                            filter: on ? "blur(0)" : "blur(3px)",
                            transitionDelay: on ? "120ms" : "0ms",
                          }}
                        >
                          {m.desc}
                        </span>
                      </span>
                    </span>
                  </span>

                  {/* El signo: la única pista de que la fila da más. Gira al
                      abrirse en vez de cambiar de glifo. En celular sale del
                      flujo (absoluto a la derecha) para no descentrar el
                      título. */}
                  <span
                    aria-hidden="true"
                    className="mt-1 font-mono text-lg leading-none transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] max-md:absolute max-md:right-0 max-md:top-[clamp(1.1rem,2.2vw,1.9rem)]"
                    style={{
                      color: on ? "#2D3436" : "rgba(45,52,54,0.35)",
                      transform: on ? "rotate(135deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>
                </button>
              </li>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
