"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { MagicRings } from "@/components/ui/MagicRings";
import { TitleReveal } from "@/components/ui/TitleReveal";
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

  /* ── Cómo responden las tarjetas ──────────────────────────────────────────
     Antes: subían 6 px, el borde se oscurecía y las otras dos bajaban a 0.6 de
     opacidad. Tres cosas a la vez y ninguna se notaba, porque `transition-all`
     interpolaba TODAS las propiedades —incluido el backdrop-blur— y el
     navegador terminaba repintando la tarjeta entera en cada frame.

     Ahora el gesto es uno solo y se lee: la tarjeta apuntada SE LEVANTA (sube
     10 px y escala un 1.5%) mientras las otras dos se hunden apenas y pierden
     un punto de contraste. Y las propiedades animadas se declaran una por una
     —transform, background, border, opacity—, que son las que el compositor
     resuelve sin recalcular layout. */
  const cardStyle = (i: number) => {
    const on = hover === i;
    const otra = hover !== null && !on;
    return {
      /* ── FONDO DE CADA TARJETA ── */
      backgroundColor: on ? "rgba(45,52,54,0.05)" : "rgba(255,255,255,0.7)",
      borderColor: on ? "rgba(45,52,54,0.45)" : "rgba(45,52,54,0.14)",
      // scale junto al translate: sin él, subir 10 px se lee como un salto;
      // con él, como una tarjeta que se acerca.
      transform: on
        ? "translateY(-10px) scale(1.015)"
        : otra
          ? "translateY(2px) scale(0.99)"
          : "translateY(0) scale(1)",
      opacity: otra ? 0.72 : 1,
      /* Sin sombra: las tarjetas se distinguen por el borde y por el
         desplazamiento al pasar el puntero. */
      boxShadow: "none",
    };
  };

  const cardClass =
    "relative flex h-full flex-col gap-4 overflow-hidden rounded-tile border p-[clamp(1.5rem,2.4vw,2.4rem)] backdrop-blur-sm transition-[transform,background-color,border-color,opacity] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform";

  return (
    <section
      id="about"
      /* ─────────────────────────────────────────────────────────────────
         FONDO DE ESTA SECCIÓN (Nosotros / las tres tarjetas)
         Va en blanco: bg-paper-bone. Para cambiarlo, es esta clase.
         El fondo de TODA la página está en app/nosotros/page.tsx.
         ───────────────────────────────────────────────────────────────── */
      /* El padding de abajo es la mitad del de arriba: "Por qué Manifesto"
         tiene que leerse pegado a estas tarjetas y no como un bloque suelto
         más abajo. Entre los dos sumaban hasta 26 rem de blanco. */
      className="relative overflow-hidden bg-paper-bone px-[clamp(1rem,3vw,3rem)] pb-[clamp(2rem,4vw,4.5rem)] pt-[clamp(4.5rem,11vw,13rem)]"
    >
      {/* Los anillos eran corinto. Van en ice —el azul de la paleta— y en
          variante clara, porque sobre blanco las opacidades originales no
          se ven. */}
      <MagicRings color="#d6e2ed" tone="light" />

      {/* Sin el rótulo chico: decía "Nosotros" justo encima del titular que
          dice lo mismo en grande. */}
      <Reveal className="relative z-10 mb-[clamp(1.5rem,3vw,2.75rem)]">
        <h2 className="m-0 max-w-[22ch] font-display text-[clamp(2rem,5vw,5rem)] font-normal leading-[0.95] tracking-[-0.035em] text-ink-900 text-balance">
          <TitleReveal text="Nosotros." />
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
            <CardHead id="01" on={hover === 0} title="Quiénes somos" />
            {/* En texto de cuerpo: el peso display ahora lo lleva el título,
                y dos bloques grandes seguidos se pelean. */}
            <p className="m-0 max-w-[38ch] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.6] text-ink-700 text-pretty">
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
            <CardHead id="02" on={hover === 1} title="Qué creemos" />
            <Creencias compact tone="light" />
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
            <CardHead id="03" on={hover === 2} title="Nuestro equipo" />
            {/* Esta frase tenía la tipografía display; ahora esa la lleva el
                título de la tarjeta, así que baja a cuerpo. Queda en ink-900
                para que siga leyéndose antes que el cierre. */}
            <p className="m-0 max-w-[38ch] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.6] text-ink-900 text-pretty">
              Estructura y sensibilidad. Análisis y creatividad.
            </p>
            {/* El documento pide cambiar este cierre para no repetir la frase
                del punto 05 de "Por qué Manifesto". Queda el del doc hasta
                que el cliente dé el reemplazo. */}
            <p className="m-0 max-w-[38ch] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.6] text-ink-700 text-pretty">
              Trabajamos como socios, no como proveedores. Las buenas ideas rara
              vez llegan solas.
            </p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Línea superior que crece al pasar el puntero, igual que en el resto del sitio.
 *
 * Va con `transform: scaleX` y no animando el `width`: el ancho obliga al
 * navegador a rehacer el layout en cada frame, la escala la resuelve el
 * compositor. Se nota en móvil, que es donde estas tres tarjetas y sus
 * `backdrop-blur` ya cuestan caro.
 */
function Marca({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="absolute left-0 top-0 h-[2px] w-full origin-left transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        transform: on ? "scaleX(1)" : "scaleX(0)",
        /* Era corinto. Va en el slate del fondo espacial: el ice sobre
           blanco no se ve en una línea de 2px. */
        background: "linear-gradient(90deg, #282e32, transparent)",
      }}
    />
  );
}

/**
 * Cabecera de tarjeta: el número y el título.
 *
 * El título va en la tipografía display que antes solo tenía "Estructura y
 * sensibilidad. Análisis y creatividad." — es la que se pidió para los tres.
 * Antes el título era el mismo rótulo mono chico del resto del sitio.
 */
function CardHead({ id, title, on }: { id: string; title: string; on: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="font-mono text-xs tabular-nums tracking-[0.2em] transition-colors duration-500"
        style={{ color: on ? "#2D3436" : "#4A5054" }}
      >
        {id}
      </span>
      <h3 className="m-0 max-w-[20ch] font-display text-[clamp(1.4rem,2.2vw,2.1rem)] font-normal leading-[1.15] tracking-[-0.025em] text-ink-900 text-pretty">
        {title}
      </h3>
    </div>
  );
}
