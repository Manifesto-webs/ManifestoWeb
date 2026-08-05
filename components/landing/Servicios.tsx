"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SpaceBackdrop } from "@/components/ui/SpaceBackdrop";

interface Frente {
  id: string;
  name: string;
  desc: string;
  items: string[];
}

const FRENTES: Frente[] = [
  {
    id: "01",
    name: "Universo de marca",
    desc: "Definimos qué es la marca y cómo se ve, se escucha y se comporta.",
    items: [
      "Dirección estratégica de marca",
      "Arquitectura de portafolio",
      "Narrativa",
      "Naming",
      "Identidad visual",
      "Activación",
    ],
  },
  {
    id: "02",
    name: "Cultura y talento",
    desc: "La marca empieza adentro. Si el equipo no la entiende, el mercado tampoco.",
    items: [
      "Propuesta de valor para el talento (EVP)",
      "Comunicación para equipos de alto rendimiento",
      "Experiencias de activación cultural",
    ],
  },
  {
    id: "03",
    name: "Experiencia de cliente",
    desc: "Alineamos cada punto de contacto con lo que la marca dice ser.",
    items: [
      "Estrategia de experiencia B2B y B2C",
      "Mapeo de recorrido y puntos de contacto",
      "Plan integral de experiencia",
      "Activación en canales",
    ],
  },
  {
    id: "04",
    name: "Crecimiento y visibilidad",
    desc: "Campañas y activos digitales que abren demanda sin diluir la marca.",
    items: [
      "Estrategia de lanzamientos y eventos",
      "Diseño y gestión de activos digitales",
      "Planificación de visibilidad en entornos digitales",
    ],
  },
];

export function Servicios() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="servicios"
      className="relative overflow-hidden px-[clamp(1rem,3vw,3rem)] py-[clamp(4.5rem,11vw,13rem)]"
      style={{ backgroundColor: "#282e32" }}
    >
      <SpaceBackdrop glow="corinto" />

      <Reveal className="relative z-10 mb-[clamp(2.5rem,4vw,4rem)]">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(214,226,237,0.55)]">
          Servicios
        </span>
        <h2 className="mt-3 max-w-[16ch] font-display text-[clamp(2rem,5.5vw,6rem)] font-normal leading-[0.92] tracking-[-0.035em] text-white">
          Cuatro frentes. <br /> Una sola marca.
        </h2>
      </Reveal>

      <div className="relative z-10 flex flex-col border-t border-[rgba(214,226,237,0.25)]">
        {FRENTES.map((f, i) => {
          const active = open === i;
          return (
            <Reveal key={f.id} delay={i * 90}>
              <div
                onMouseEnter={() => setOpen(i)}
                onClick={() => setOpen(i)}
                className="group cursor-pointer border-b border-[rgba(214,226,237,0.16)] transition-colors duration-500"
                style={{ backgroundColor: active ? "rgba(255,255,255,0.04)" : "transparent" }}
              >
                <div className="flex items-center gap-[clamp(0.75rem,2.5vw,2rem)] px-[clamp(0.5rem,1.5vw,1.5rem)] py-[clamp(1.3rem,2.6vw,2.4rem)]">
                  <span
                    className="font-mono text-xs tabular-nums tracking-[0.2em] transition-colors duration-500"
                    style={{ color: active ? "#dcddca" : "rgba(214,226,237,0.4)" }}
                  >
                    {f.id}
                  </span>
                  <h3
                    className="flex-1 font-display text-[clamp(1.6rem,4vw,3.6rem)] font-normal leading-[1] tracking-[-0.03em] transition-all duration-500"
                    style={{
                      color: active ? "#ffffff" : "rgba(255,255,255,0.5)",
                      transform: active ? "translateX(8px)" : "translateX(0)",
                      textShadow: active ? "0 0 26px rgba(214,226,237,0.35)" : "none",
                    }}
                  >
                    {f.name}
                  </h3>
                  <span
                    className="font-mono text-2xl transition-all duration-500"
                    style={{
                      color: active ? "#d6e2ed" : "rgba(214,226,237,0.35)",
                      transform: active ? "rotate(45deg)" : "rotate(0deg)",
                      filter: active ? "drop-shadow(0 0 8px rgba(214,226,237,0.5))" : "none",
                    }}
                  >
                    +
                  </span>
                </div>

                {/* Panel expandible: descripción + sub-servicios escalonados */}
                <div
                  className="grid px-[clamp(0.5rem,1.5vw,1.5rem)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ gridTemplateRows: active ? "1fr" : "0fr", opacity: active ? 1 : 0 }}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 pb-[clamp(1.5rem,3vw,2.5rem)] pl-[calc(2ch+clamp(0.75rem,2.5vw,2rem))] md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                      <p className="max-w-[36ch] text-[clamp(1rem,1.3vw,1.3rem)] leading-[1.5] text-[rgba(214,226,237,0.72)]">
                        {f.desc}
                      </p>
                      <ul className="flex flex-wrap gap-x-3 gap-y-3 self-start">
                        {f.items.map((it, j) => (
                          <li
                            key={it}
                            className="rounded-pill border border-[rgba(214,226,237,0.22)] bg-white/[0.04] px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-[rgba(214,226,237,0.85)] transition-all duration-500 hover:border-[rgba(214,226,237,0.5)] hover:text-white"
                            style={{
                              opacity: active ? 1 : 0,
                              transform: active ? "translateY(0)" : "translateY(10px)",
                              transitionDelay: active ? `${120 + j * 70}ms` : "0ms",
                            }}
                          >
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
