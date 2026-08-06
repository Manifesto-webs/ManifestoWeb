"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { MagicRings } from "@/components/ui/MagicRings";
import { Creencias } from "@/components/landing/Creencias";

/* -------------------------------------------------------------------------- */
/*  Nosotros — tres tarjetas, copy de "Textos web v3"                          */
/*                                                                            */
/*  El documento da la sección en tres bloques (quiénes somos, qué creemos y   */
/*  nuestro equipo), así que son tres tarjetas y no un texto corrido.          */
/*                                                                            */
/*  "Qué creemos" reusa el componente Creencias en su variante compacta: la    */
/*  máquina de escribir es la misma, solo entra a la medida de la tarjeta.     */
/*                                                                            */
/*  About.tsx queda en disco sin usar, con los contadores y la cita: es el     */
/*  diseño anterior de esta página y se conserva por si se retoma.             */
/* -------------------------------------------------------------------------- */

export function Somos() {
  const [hover, setHover] = useState<number | null>(null);

  const cardStyle = (i: number) => {
    const on = hover === i;
    return {
      backgroundColor: on ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.03)",
      borderColor: on ? "rgba(214,226,237,0.45)" : "rgba(214,226,237,0.16)",
      transform: on ? "translateY(-6px)" : "translateY(0)",
      opacity: hover !== null && !on ? 0.6 : 1,
      boxShadow: on
        ? "0 40px 80px -40px rgba(95,0,0,0.75), inset 0 0 0 1px rgba(214,226,237,0.06)"
        : "0 30px 60px -45px rgba(95,0,0,0.6)",
    };
  };

  const cardClass =
    "relative flex h-full flex-col gap-4 overflow-hidden rounded-tile border p-[clamp(1.5rem,2.4vw,2.4rem)] backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";

  return (
    <section
      id="about"
      className="relative overflow-hidden px-[clamp(1rem,3vw,3rem)] py-[clamp(4.5rem,11vw,13rem)]"
      style={{ backgroundColor: "#282e32" }}
    >
      <MagicRings color="#5f0000" />

      <Reveal className="relative z-10 mb-[clamp(2.5rem,4vw,4rem)] flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(214,226,237,0.55)]">
          Nosotros
        </span>
        <h2 className="m-0 max-w-[22ch] font-display text-[clamp(2rem,5vw,5rem)] font-normal leading-[0.95] tracking-[-0.035em] text-white text-balance">
          Quiénes somos.
        </h2>
      </Reveal>

      {/* items-stretch para que las tres tarjetas midan lo mismo aunque el
          texto de cada una sea de distinto largo. */}
      <div className="relative z-10 grid items-stretch gap-[clamp(1rem,1.6vw,1.5rem)] lg:grid-cols-3">
        {/* 01 — Quiénes somos */}
        <Reveal delay={0}>
          <article
            onMouseEnter={() => setHover(0)}
            onMouseLeave={() => setHover(null)}
            className={cardClass}
            style={cardStyle(0)}
          >
            <Marca on={hover === 0} />
            <CardKicker id="01" on={hover === 0} label="Quiénes somos" />
            <p className="m-0 max-w-[36ch] font-display text-[clamp(1.25rem,1.9vw,1.75rem)] font-normal leading-[1.25] tracking-[-0.02em] text-white text-pretty">
              Manifesto nació en 2019, pero el equipo lleva más de quince años
              construyendo marcas junto a empresas que necesitan claridad y
              quieren capitalizar su identidad.
            </p>
          </article>
        </Reveal>

        {/* 02 — Qué creemos (con la máquina de escribir) */}
        <Reveal delay={110}>
          <article
            onMouseEnter={() => setHover(1)}
            onMouseLeave={() => setHover(null)}
            className={cardClass}
            style={cardStyle(1)}
          >
            <Marca on={hover === 1} />
            <CardKicker id="02" on={hover === 1} label="Qué creemos" />
            <Creencias compact />
          </article>
        </Reveal>

        {/* 03 — Nuestro equipo */}
        <Reveal delay={220}>
          <article
            onMouseEnter={() => setHover(2)}
            onMouseLeave={() => setHover(null)}
            className={cardClass}
            style={cardStyle(2)}
          >
            <Marca on={hover === 2} />
            <CardKicker id="03" on={hover === 2} label="Nuestro equipo" />
            <p className="m-0 max-w-[26ch] font-display text-[clamp(1.4rem,2.2vw,2.1rem)] font-normal leading-[1.15] tracking-[-0.025em] text-white text-pretty">
              Estructura y sensibilidad. Análisis y creatividad.
            </p>
            {/* El documento pide cambiar este cierre para no repetir la frase
                del punto 05 de "Por qué Manifesto". Queda el del doc hasta
                que el cliente dé el reemplazo. */}
            <p className="m-0 max-w-[38ch] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.6] text-[rgba(214,226,237,0.72)] text-pretty">
              Trabajamos como socios, no como proveedores. Las buenas ideas rara
              vez llegan solas.
            </p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

/** Línea superior que crece al pasar el puntero, igual que en el resto del sitio. */
function Marca({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="absolute left-0 top-0 h-[2px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        width: on ? "100%" : "0%",
        background: "linear-gradient(90deg, #5f0000, transparent)",
      }}
    />
  );
}

function CardKicker({ id, label, on }: { id: string; label: string; on: boolean }) {
  return (
    <div className="flex items-baseline gap-3">
      <span
        className="font-mono text-xs tabular-nums tracking-[0.2em] transition-colors duration-500"
        style={{ color: on ? "#dcddca" : "rgba(214,226,237,0.4)" }}
      >
        {id}
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(214,226,237,0.6)]">
        {label}
      </span>
    </div>
  );
}
