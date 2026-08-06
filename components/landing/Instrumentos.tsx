"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SpaceBackdrop } from "@/components/ui/SpaceBackdrop";

/* -------------------------------------------------------------------------- */
/*  Instrumentos de dirección de marca — copy de "Textos web v3"               */
/*                                                                            */
/*  El doc preguntaba cómo mostrarlo. La respuesta: son cinco entregables      */
/*  concretos, así que se ven como cinco cosas que se reciben, no como una     */
/*  lista de servicios. Grid de cinco fichas numeradas; las dos primeras       */
/*  traen una segunda línea de detalle y por eso ocupan el doble de ancho.     */
/*                                                                            */
/*  Fichas y no acordeón: acá todo lo que se entrega tiene que verse a la vez  */
/*  —es el inventario—, y el acordeón ya se usa en los cuatro frentes.         */
/* -------------------------------------------------------------------------- */

interface Instrumento {
  id: string;
  name: string;
  desc: string;
  /** Segunda línea, solo en los dos que la traen en el documento. */
  detail?: string;
  /** Ocupa dos columnas en desktop. */
  wide?: boolean;
}

const INSTRUMENTOS: Instrumento[] = [
  {
    id: "01",
    name: "Marco de posicionamiento",
    desc: "Dónde está la marca frente a su competencia y dónde puede ganar.",
    detail:
      "Incluye un lienzo de modelo de negocio: dónde vive el valor, quién paga por él y qué lo sostiene.",
    wide: true,
  },
  {
    id: "02",
    name: "Perfil de tono y personalidad",
    desc: "Nuestra plataforma reúne las lecturas del equipo y devuelve una guía expresiva aplicable en cualquier canal.",
    detail:
      "Trabaja en tres capas: lo que la organización muestra, lo que declara y lo que da por sentado sin decirlo. La tercera es la que casi nadie mira y la que explica todo lo demás.",
    wide: true,
  },
  {
    id: "03",
    name: "Sistema de identidad",
    desc: "Naming, logotipo y el conjunto de elementos que hacen reconocible a la marca.",
  },
  {
    id: "04",
    name: "Kit de activación",
    desc: "Manual y piezas esenciales para lanzar sin improvisar.",
  },
  {
    // El doc pide buscarle un nombre mejor ("algo de diagnóstico en el
    // tiempo"). Queda el del documento hasta que el cliente decida.
    id: "05",
    name: "Acompañamiento",
    desc: "Revisión periódica para que la marca no se desalinee con el tiempo.",
  },
];

export function Instrumentos() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section
      id="instrumentos"
      className="relative overflow-hidden px-[clamp(1rem,3vw,3rem)] py-[clamp(4.5rem,11vw,13rem)]"
      style={{ backgroundColor: "#282e32" }}
    >
      <SpaceBackdrop glow="dual" />

      <Reveal className="relative z-10 mb-[clamp(2.5rem,4vw,4rem)] flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(214,226,237,0.55)]">
          Dirección de marca
        </span>
        <h2 className="m-0 max-w-[18ch] font-display text-[clamp(2rem,5vw,5rem)] font-normal leading-[0.95] tracking-[-0.035em] text-white text-balance">
          Instrumentos de dirección de marca.
        </h2>
        <p className="m-0 max-w-[54ch] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.6] text-[rgba(214,226,237,0.72)] text-pretty">
          Cinco entregables concretos. Uno por cada decisión que la marca
          necesita tomar.
        </p>
      </Reveal>

      <ol className="relative z-10 m-0 grid list-none gap-[clamp(1rem,1.6vw,1.5rem)] p-0 md:grid-cols-2 lg:grid-cols-3">
        {INSTRUMENTOS.map((it, i) => {
          const on = hover === i;
          const dimmed = hover !== null && hover !== i;
          return (
            <Reveal
              key={it.id}
              delay={i * 90}
              className={it.wide ? "md:col-span-2 lg:col-span-3" : undefined}
            >
              <li
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="relative flex h-full flex-col gap-3 overflow-hidden rounded-tile border p-[clamp(1.25rem,2.2vw,2.2rem)] backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  backgroundColor: on ? "rgba(0,0,0,0.32)" : "rgba(255,255,255,0.03)",
                  borderColor: on
                    ? "rgba(214,226,237,0.45)"
                    : "rgba(214,226,237,0.16)",
                  transform: on ? "translateY(-6px)" : "translateY(0)",
                  opacity: dimmed ? 0.55 : 1,
                  boxShadow: on
                    ? "0 40px 80px -40px rgba(95,0,0,0.75), inset 0 0 0 1px rgba(214,226,237,0.06)"
                    : "0 30px 60px -45px rgba(95,0,0,0.6)",
                }}
              >
                {/* Línea superior que crece, el mismo gesto del resto del sitio */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-[2px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    width: on ? "100%" : "0%",
                    background: "linear-gradient(90deg, #5f0000, transparent)",
                  }}
                />

                <span
                  className="font-mono text-xs tabular-nums tracking-[0.2em] transition-colors duration-500"
                  style={{ color: on ? "#dcddca" : "rgba(214,226,237,0.4)" }}
                >
                  {it.id}
                </span>

                <h3 className="m-0 max-w-[26ch] font-display text-[clamp(1.3rem,2.2vw,2.1rem)] font-normal leading-[1.1] tracking-[-0.025em] text-white text-pretty">
                  {it.name}
                </h3>

                <p
                  className="m-0 max-w-[52ch] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.6] transition-colors duration-500 text-pretty"
                  style={{
                    color: on ? "rgba(214,226,237,0.9)" : "rgba(214,226,237,0.7)",
                  }}
                >
                  {it.desc}
                </p>

                {it.detail && (
                  <p className="m-0 max-w-[62ch] border-t border-[rgba(214,226,237,0.14)] pt-3 text-[clamp(0.9rem,1vw,1.05rem)] leading-[1.6] text-[rgba(214,226,237,0.6)] text-pretty">
                    {it.detail}
                  </p>
                )}
              </li>
            </Reveal>
          );
        })}
      </ol>

      {/* "Por qué funciona": el cierre del bloque en el documento. */}
      <Reveal className="relative z-10 mt-[clamp(3rem,6vw,6rem)]" delay={200}>
        <div
          className="grid gap-4 rounded-tile border border-[rgba(214,226,237,0.18)] p-[clamp(1.5rem,4vw,4rem)]"
          style={{
            backgroundColor: "rgba(0,0,0,0.35)",
            boxShadow: "0 40px 90px -50px rgba(95,0,0,0.7)",
          }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(214,226,237,0.6)]">
            Por qué funciona
          </span>
          <p className="m-0 max-w-[48ch] text-[clamp(0.95rem,1.1vw,1.15rem)] leading-[1.6] text-[rgba(214,226,237,0.75)] text-pretty">
            Porque cada fase cierra una decisión que antes estaba abierta.
          </p>
          <p className="m-0 max-w-[22ch] font-display text-[clamp(1.6rem,3.6vw,3.4rem)] font-normal leading-[1.08] tracking-[-0.03em] text-white">
            Al final no tienes un manual. Tienes criterio.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
