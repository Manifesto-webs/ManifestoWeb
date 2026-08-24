"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SpaceBackdrop } from "@/components/ui/SpaceBackdrop";
import { TitleReveal } from "@/components/ui/TitleReveal";

/* -------------------------------------------------------------------------- */
/*  Preguntas frecuentes — copy de "Textos web v3"                             */
/*                                                                            */
/*  Van al cierre de /servicios: son objeciones a la oferta que está arriba,   */
/*  así que se responden donde se está tomando la decisión.                    */
/*                                                                            */
/*  Acordeón en una sola columna: se ve la pregunta y la respuesta se abre al  */
/*  hacer clic en el +. Las respuestas siguen en el HTML aunque estén          */
/*  plegadas (se colapsan por altura, no se quitan), así que un buscador las   */
/*  sigue leyendo.                                                             */
/* -------------------------------------------------------------------------- */

interface Pregunta {
  q: string;
  a: string;
}

const PREGUNTAS: Pregunta[] = [
  {
    q: "Solo necesito vender más rápido. ¿Igual necesito branding?",
    a: "La publicidad sin marca es tráfico que no vuelve. Se puede empezar por lo que hace que la primera venta traiga la segunda.",
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
    q: "¿Cómo se trabaja durante el proyecto?",
    a: "Con tu equipo en la sala. La fase de definición no funciona en solitario.",
  },
  {
    // El documento pedía sumar acá el rango de 6 a 12 semanas.
    q: "¿Cuánto dura un proyecto?",
    a: "Entre 6 y 12 semanas, según el alcance. Se define en la primera conversación, junto con el calendario de cada fase.",
  },
];

export function Preguntas() {
  /** Cuál está abierta. null = todas cerradas; volver a hacer clic cierra. */
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="preguntas"
      /* El padding de arriba es un tercio del de abajo: esta sección cierra
         la idea de los cuatro frentes, así que va pegada a ellos. */
      className="relative overflow-hidden bg-paper-bone px-[clamp(1rem,3vw,3rem)] pb-[clamp(4.5rem,11vw,13rem)] pt-[clamp(1rem,2.5vw,3rem)]"
    >
      <SpaceBackdrop variant="paper" />

      <Reveal className="relative z-10 mb-[clamp(1.5rem,3vw,2.75rem)]">
        <span className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-px w-[clamp(1.5rem,4vw,3.5rem)] bg-ink-900/35"
          />
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-ink-700">
            Preguntas frecuentes
          </span>
        </span>
        <h2 className="mt-4 max-w-[18ch] font-display text-[clamp(2rem,5vw,5rem)] font-normal leading-[0.95] tracking-[-0.035em] text-ink-900">
          <TitleReveal text="Lo que casi siempre preguntan." />
        </h2>
      </Reveal>

      <dl className="relative z-10 m-0 grid gap-[clamp(0.75rem,1.4vw,1.1rem)]">
        {PREGUNTAS.map((p, i) => {
          const on = open === i;
          return (
            <Reveal key={p.q} delay={i * 90}>
              <div className="rounded-tile border border-ink-900/12 bg-white/90 transition-colors duration-500 hover:border-ink-900/40">
                <dt className="m-0">
                  {/* Botón y no un div con onClick: así el teclado llega solo
                      y el lector de pantalla anuncia si está abierta. */}
                  <button
                    type="button"
                    onClick={() => setOpen(on ? null : i)}
                    aria-expanded={on}
                    aria-controls={`faq-${i}`}
                    className="flex w-full items-center gap-4 p-[clamp(1.25rem,2.2vw,2.2rem)] text-left outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
                  >
                    <span className="flex-1 font-display text-[clamp(1.1rem,1.7vw,1.6rem)] font-normal leading-[1.2] tracking-[-0.02em] text-ink-900 text-pretty">
                      {p.q}
                    </span>
                    {/* El mismo + que gira a × de los cuatro frentes. */}
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-mono text-2xl leading-none transition-transform duration-500"
                      style={{
                        color: on ? "#2D3436" : "rgba(45,52,54,0.45)",
                        transform: on ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      +
                    </span>
                  </button>
                </dt>

                {/* Se pliega por altura (0fr → 1fr) y no se desmonta: la
                    respuesta sigue en el HTML para los buscadores. */}
                <dd
                  id={`faq-${i}`}
                  className="m-0 grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ gridTemplateRows: on ? "1fr" : "0fr", opacity: on ? 1 : 0 }}
                >
                  <div className="overflow-hidden">
                    <p className="m-0 max-w-[68ch] px-[clamp(1.25rem,2.2vw,2.2rem)] pb-[clamp(1.25rem,2.2vw,2.2rem)] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.6] text-ink-700 text-pretty">
                      {p.a}
                    </p>
                  </div>
                </dd>
              </div>
            </Reveal>
          );
        })}
      </dl>
    </section>
  );
}
