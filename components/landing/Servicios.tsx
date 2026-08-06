"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SpaceBackdrop } from "@/components/ui/SpaceBackdrop";

interface Frente {
  id: string;
  name: string;
  /** A quién le sirve el frente. Va visible en cerrado: ayuda a reconocerse
   *  sin tener que abrir los cuatro. */
  para: string;
  desc: string;
  items: string[];
}

/* Copy de "Textos web v3". Las lineas "para" de Cultura y Experiencia venian
   a medio redactar en el documento; se dejaron en el mismo registro
   diagnostico que las otras dos. */
const FRENTES: Frente[] = [
  {
    id: "01",
    name: "Universo de marca",
    para: "Para empresas que necesitan definir o redefinir quiénes son",
    desc: "Definimos qué es la marca y cómo se ve, se escucha y se comporta.",
    items: [
      "Dirección estratégica de marca",
      "Arquitectura de portafolio",
      "Narrativa y naming",
      "Identidad visual",
      "Activación de marca",
    ],
  },
  {
    id: "02",
    name: "Cultura y talento",
    para: "Para organizaciones donde la marca todavía no llegó al equipo",
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
    para: "Para empresas donde lo que se promete y lo que se vive no coinciden",
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
    name: "Universo digital",
    para: "Para marcas que necesitan operar en digital bajo un sistema sostenible y que la inversión no se pierda",
    desc: "Diseñamos y construimos los productos digitales donde la marca vive.",
    items: [
      "Auditoría, estrategia digital y arquitectura de información",
      "Diseño UX/UI y sistemas de diseño",
      "Sitios, CMS y aplicaciones a medida",
      "Integración de backend, APIs y MarTech",
      "Optimización continua y gestión del rendimiento",
    ],
  },
];

export function Servicios() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="servicios"
      className="relative overflow-hidden bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[clamp(4.5rem,11vw,13rem)]"
    >
      {/* Variante clara: sin nada de corinto y con los anillos en ice, que es
          el azul de la paleta. Sobre blanco el rojo llamaba demasiado. */}
      <SpaceBackdrop variant="paper" />

      <Reveal className="relative z-10 mb-[clamp(2.5rem,4vw,4rem)]">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-ink-700">
          Cómo trabajamos juntos
        </span>
        <h2 className="mt-3 max-w-[16ch] font-display text-[clamp(2rem,5.5vw,6rem)] font-normal leading-[0.92] tracking-[-0.035em] text-ink-900">
          Cuatro frentes. <br /> Una sola marca.
        </h2>
      </Reveal>

      <div className="relative z-10 flex flex-col border-t border-ink-900/25">
        {FRENTES.map((f, i) => {
          const active = open === i;
          return (
            <Reveal key={f.id} delay={i * 90}>
              <div
                onMouseEnter={() => setOpen(i)}
                onClick={() => setOpen(i)}
                className="group cursor-pointer border-b border-ink-900/12 transition-colors duration-500"
                style={{ backgroundColor: active ? "rgba(45,52,54,0.04)" : "transparent" }}
              >
                <div className="flex items-center gap-[clamp(0.75rem,2.5vw,2rem)] px-[clamp(0.5rem,1.5vw,1.5rem)] py-[clamp(1.3rem,2.6vw,2.4rem)]">
                  <span
                    /* El sand no se lee sobre blanco: el número activo pasa a
                       ink-900 y el inactivo a ink-700, que a 12px sigue
                       cumpliendo el 4.5:1. */
                    className="font-mono text-xs tabular-nums tracking-[0.2em] transition-colors duration-500"
                    style={{ color: active ? "#2D3436" : "#4A5054" }}
                  >
                    {f.id}
                  </span>
                  <div
                    /* pr-3 reserva el desplazamiento de la fila activa: sin eso,
                       en mobile el texto se mete debajo del signo +. */
                    className="flex flex-1 flex-col gap-2 pr-3 transition-transform duration-500"
                    style={{ transform: active ? "translateX(8px)" : "translateX(0)" }}
                  >
                    <h3
                      className="m-0 font-display text-[clamp(1.6rem,4vw,3.6rem)] font-normal leading-[1] tracking-[-0.03em] transition-all duration-500"
                      /* El 0.55 no es al ojo: por debajo de eso el nombre
                         inactivo no llega al 3:1 que pide el texto grande. */
                      style={{ color: active ? "#2D3436" : "rgba(45,52,54,0.55)" }}
                    >
                      {f.name}
                    </h3>
                    <span
                      className="max-w-[54ch] text-[clamp(0.8rem,0.95vw,0.95rem)] leading-[1.45] transition-colors duration-500"
                      style={{ color: active ? "#2D3436" : "#4A5054" }}
                    >
                      {f.para}
                    </span>
                  </div>
                  <span
                    className="font-mono text-2xl transition-all duration-500"
                    style={{
                      color: active ? "#2D3436" : "rgba(45,52,54,0.4)",
                      transform: active ? "rotate(45deg)" : "rotate(0deg)",
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
                      <div className="flex flex-col items-start gap-6">
                        <p className="max-w-[36ch] text-[clamp(1rem,1.3vw,1.3rem)] leading-[1.5] text-ink-700">
                          {f.desc}
                        </p>

                        {/* Lleva al portafolio de la landing. tabIndex -1
                            cuando el frente está cerrado: el panel sigue en el
                            DOM aunque no se vea, y si no el tabulador se mete
                            en los cuatro enlaces invisibles. */}
                        <Link
                          href="/#trabajo"
                          tabIndex={active ? 0 : -1}
                          className="group/cta inline-flex items-center gap-2 rounded-pill border border-ink-900/35 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-ink-900 transition-colors duration-300 hover:border-ink-900 hover:bg-ink-900/5"
                        >
                          ver casos
                          <span className="transition-transform duration-300 group-hover/cta:translate-x-[3px]">
                            →
                          </span>
                        </Link>
                      </div>
                      <ul className="flex flex-wrap gap-x-3 gap-y-3 self-start">
                        {f.items.map((it, j) => (
                          <li
                            key={it}
                            className="rounded-pill border border-ink-900/20 bg-ink-900/[0.03] px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-700 transition-all duration-500 hover:border-ink-900/60 hover:text-ink-900"
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
