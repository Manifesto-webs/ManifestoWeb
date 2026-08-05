"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SpaceBackdrop } from "@/components/ui/SpaceBackdrop";

/* -------------------------------------------------------------------------- */
/*  Preguntas frecuentes — copy de "Textos web v3"                             */
/*                                                                            */
/*  Van al cierre de /servicios: son objeciones a la oferta que está arriba,   */
/*  así que se responden donde se está tomando la decisión.                    */
/*                                                                            */
/*  A propósito NO es un acordeón: justo encima ya hay uno (los cuatro         */
/*  frentes) y repetir el patrón haría que la página se lea como una sola      */
/*  lista larga. Acá todo está abierto, que además es lo que conviene para     */
/*  que un buscador lea las respuestas.                                        */
/* -------------------------------------------------------------------------- */

interface Pregunta {
  q: string;
  a: string;
}

const PREGUNTAS: Pregunta[] = [
  {
    q: "Solo necesito vender más rápido. ¿Igual necesito branding?",
    a: "La publicidad sin marca es tráfico que no vuelve. Podemos empezar por lo que hace que la primera venta traiga la segunda.",
  },
  {
    q: "Estoy empezando. ¿Es muy pronto para invertir en marca?",
    a: "Es el mejor momento. Corregir una marca siempre cuesta más que construirla bien.",
  },
  {
    q: "Necesito convencer a inversionistas o al banco.",
    a: "El informe de diagnóstico traduce la marca a lenguaje financiero: precio, fidelidad y expansión. Es material que se presenta en junta.",
  },
  {
    // La respuesta venía sin cerrar en el documento; se reescribió respetando
    // la idea: el miedo a que se pierda el valor construido.
    q: "Vamos a entregar la empresa a la siguiente generación.",
    a: "Es uno de los momentos donde más se teme perder el valor construido. La marca —los valores, el propósito— es lo que sostiene el negocio mientras cambian las personas.",
  },
  {
    q: "¿Cómo trabajamos durante el proyecto?",
    a: "Con tu equipo en la sala. La fase de definición no funciona si la hacemos solos.",
  },
  {
    // El documento pedía sumar acá el rango de 6 a 12 semanas.
    q: "¿Cuánto dura un proyecto?",
    a: "Entre 6 y 12 semanas, según el alcance. Lo definimos en la primera conversación, junto con el calendario de cada fase.",
  },
];

export function Preguntas() {
  return (
    <section
      id="preguntas"
      className="relative overflow-hidden px-[clamp(1rem,3vw,3rem)] py-[clamp(4.5rem,11vw,13rem)]"
      style={{ backgroundColor: "#282e32" }}
    >
      <SpaceBackdrop glow="ice" />

      <Reveal className="relative z-10 mb-[clamp(2.5rem,4vw,4rem)]">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(214,226,237,0.55)]">
          Preguntas frecuentes
        </span>
        <h2 className="mt-3 max-w-[18ch] font-display text-[clamp(2rem,5vw,5rem)] font-normal leading-[0.95] tracking-[-0.035em] text-white">
          Lo que casi siempre nos preguntan.
        </h2>
      </Reveal>

      <dl className="relative z-10 m-0 grid gap-[clamp(1rem,2vw,2rem)] md:grid-cols-2">
        {PREGUNTAS.map((p, i) => (
          <Reveal key={p.q} delay={i * 90}>
            <div
              className="flex h-full flex-col gap-3 rounded-tile border border-[rgba(214,226,237,0.16)] bg-white/[0.03] p-[clamp(1.25rem,2.2vw,2.2rem)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(214,226,237,0.4)]"
              style={{ boxShadow: "0 30px 60px -45px rgba(95,0,0,0.6)" }}
            >
              <dt className="m-0 font-display text-[clamp(1.1rem,1.7vw,1.6rem)] font-normal leading-[1.2] tracking-[-0.02em] text-white text-pretty">
                {p.q}
              </dt>
              <dd className="m-0 text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.6] text-[rgba(214,226,237,0.72)] text-pretty">
                {p.a}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
