"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SpaceBackdrop } from "@/components/ui/SpaceBackdrop";

interface Pilar {
  id: string;
  name: string;
  desc: string;
}

const PILARES: Pilar[] = [
  {
    id: "01",
    name: "Estrategia",
    desc: "Definimos qué representa la marca y por qué debería importarle a alguien.",
  },
  {
    id: "02",
    name: "Identidad",
    desc: "Diseñamos el sistema visual y verbal que la hace reconocible.",
  },
  {
    id: "03",
    name: "Activación",
    desc: "Entregamos herramientas y criterio para que el equipo se vuelva dueño de sus procesos.",
  },
];

const SPACE = "#282e32";
const BONE = "#ffffff";
const STAR = "#d6e2ed";
const MAROON = "#5f0000";
/** Corinto/rojo de marca, aclarado lo justo para que se lea sobre el oscuro. */
const CORINTO = "#b3243b";

export function QueHacemos() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section
      id="que-hacemos"
      className="relative overflow-hidden px-[clamp(1rem,3vw,3rem)] py-[clamp(4.5rem,11vw,13rem)]"
      style={{ backgroundColor: "#d6e2ed"}} /*de la sec*/ 
    >
      <SpaceBackdrop glow="dual" />

      <Reveal className="relative z-10 mb-[clamp(2.5rem,4vw,4rem)]">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(24, 25, 27, 0.55)]">
          Qué hacemos
        </span>
        <h2 className="mt-3 max-w-[18ch] font-display text-[clamp(2rem,5vw,5rem)] font-normal leading-[0.95] tracking-[-0.035em] text-black">
          Tres frentes, <br></br> una misma marca.
        </h2>
      </Reveal>

      <div className="relative z-10 grid gap-[clamp(1rem,1.5vw,1.5rem)] md:grid-cols-3">
        {PILARES.map((p, i) => {
          const active = hover === i;
          const dimmed = hover !== null && hover !== i;
          return (
            <Reveal key={p.id} delay={i * 120}>
              <article
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-tile border p-[clamp(1.5rem,2.5vw,2.5rem)] backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  backgroundColor: active ? "rgba(86, 83, 83, 0.35)" : "rgba(19, 15, 15, 0.03)",
                  borderColor: active ? "rgba(229, 235, 240, 0.45)" : "rgba(229, 233, 236, 0.22)",
                  transform: active ? "translateY(-8px)" : "translateY(0)",
                  opacity: dimmed ? 0.5 : 1,
                  boxShadow: active /*Sombra de la card */
                    ? "0 30px 70px -30px rgba(3, 1, 1, 0.65), inset 0 0 0 1px rgba(214,226,237,0.08)"
                    : "0 0 0 rgba(0,0,0,0)",
                }}
              >
                {/* Línea superior que crece */}
                <span
                  className="absolute left-0 top-0 h-[2px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    width: active ? "100%" : "0%",
                    background: "linear-gradient(90deg, #5f0000, #212223)",
                  }}
                />

                <div className="flex items-baseline justify-between">
                  <span
                    className="font-mono text-xs tracking-[0.25em] transition-colors duration-500"
                    style={{ color: active ? "#1e1f20" : "rgba(14, 15, 16, 0.5)" }}
                  >
                    {p.id}
                  </span>
                  <span
                    className="text-lg transition-all duration-500"
                    style={{
                      color: active ? "#0c0c0c" : "rgba(39, 42, 45, 0.35)",
                      transform: active ? "rotate(45deg) scale(1.15)" : "rotate(0deg)",
                      filter: active ? "drop-shadow(0 0 8px rgba(214,226,237,0.6))" : "none",
                    }}
                  >
                    ✳
                  </span>
                </div>

                <h3
                  className="font-display text-[clamp(1.6rem,2.6vw,2.6rem)] font-normal leading-[1] tracking-[-0.03em] transition-colors duration-500"
                  style={{ color: active ? "#232121" : "rgba(10, 10, 10, 0.82)" }}
                >
                  {p.name}
                </h3>

                <p
                  className="max-w-[34ch] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.55] transition-colors duration-500"
                  style={{ color: active ? "rgba(214,226,237,0.9)" : "rgba(10, 10, 10, 0.55)" }}
                >
                  {p.desc}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
