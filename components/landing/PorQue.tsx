"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SpaceBackdrop } from "@/components/ui/SpaceBackdrop";

/* -------------------------------------------------------------------------- */
/*  Por qué Manifesto — copy de "Textos web v3"                                */
/*                                                                            */
/*  Va en /nosotros, después de quiénes somos: son cinco argumentos sobre      */
/*  cómo trabajan, no sobre qué venden, así que refuerzan donde el visitante   */
/*  ya los está conociendo.                                                    */
/*                                                                            */
/*  Lista numerada y no tarjetas: las tarjetas ya se usan en las preguntas     */
/*  frecuentes y en los datos de arriba. Acá el orden importa poco, pero la    */
/*  lectura corrida sí.                                                        */
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
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section
      id="por-que"
      className="relative overflow-hidden px-[clamp(1rem,3vw,3rem)] py-[clamp(4.5rem,11vw,13rem)]"
      style={{ backgroundColor: "#282e32" }}
    >
      <SpaceBackdrop glow="corinto" />

      <Reveal className="relative z-10 mb-[clamp(2.5rem,4vw,4rem)]">
        <h2 className="m-0 max-w-[14ch] font-display text-[clamp(2rem,5vw,5rem)] font-normal leading-[0.95] tracking-[-0.035em] text-white">
          Por qué Manifesto.
        </h2>
      </Reveal>

      <ol className="relative z-10 m-0 flex list-none flex-col border-t border-[rgba(214,226,237,0.2)] p-0">
        {MOTIVOS.map((m, i) => {
          const on = hover === i;
          return (
            <Reveal key={m.id} delay={i * 90}>
              <li
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-[clamp(0.9rem,2.5vw,2.5rem)] gap-y-2 border-b border-[rgba(214,226,237,0.14)] py-[clamp(1.3rem,2.6vw,2.2rem)] transition-all duration-500 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.1fr)]"
                style={{
                  paddingLeft: on ? "0.6rem" : "0",
                  backgroundColor: on ? "rgba(255,255,255,0.03)" : "transparent",
                }}
              >
                {/* Línea que crece al pasar el puntero, igual que en el resto del sitio. */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-[1px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    width: on ? "100%" : "0%",
                    background: "linear-gradient(90deg, #5f0000, transparent)",
                  }}
                />

                <span
                  className="font-mono text-xs tabular-nums tracking-[0.2em] transition-colors duration-500"
                  style={{ color: on ? "#dcddca" : "rgba(214,226,237,0.4)" }}
                >
                  {m.id}
                </span>

                <h3
                  className="m-0 max-w-[22ch] font-display text-[clamp(1.2rem,2.2vw,2.1rem)] font-normal leading-[1.12] tracking-[-0.025em] transition-colors duration-500 text-pretty"
                  style={{ color: on ? "#ffffff" : "rgba(255,255,255,0.82)" }}
                >
                  {m.title}
                </h3>

                <p
                  className="col-start-2 m-0 max-w-[52ch] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.6] transition-colors duration-500 text-pretty md:col-start-3"
                  style={{
                    color: on ? "rgba(214,226,237,0.85)" : "rgba(214,226,237,0.65)",
                  }}
                >
                  {m.desc}
                </p>
              </li>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
