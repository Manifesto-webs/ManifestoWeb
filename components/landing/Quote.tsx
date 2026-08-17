"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  La cita                                                                    */
/*                                                                            */
/*  Dos animaciones sobre la misma frase, y ninguna compite con la otra:       */
/*                                                                            */
/*    1. Al entrar en cuadro, cada palabra SE ASIENTA — sube unos píxeles y     */
/*       endereza una inclinación mínima, escalonada de izquierda a derecha.    */
/*       Es un gesto de una vez: la frase llega, no está "animándose".         */
/*    2. Mientras se scrollea, la frase SE ENCIENDE palabra por palabra. Cada   */
/*       una pasa de apagada al blanco pleno según cuánto avanzó el scroll de   */
/*       la sección. Leer y scrollear terminan siendo el mismo gesto.          */
/*                                                                            */
/*  El color de fondo es el #282e32 de marca (token space-slate) y NO ink-900:  */
/*  esta sección era el único oscuro del sitio en #2D3436 y se leía como otro   */
/*  azul apenas distinto justo al lado del hero y de clientes.                 */
/* -------------------------------------------------------------------------- */

const FRASE =
  "La diferencia entre comunicación y comunicación consciente es el compromiso basado en el autodescubrimiento y la definición de objetivos.";

/** Palabras que llevan el peso de la idea: se encienden en ice, no en blanco. */
const CLAVES = new Set(["consciente", "compromiso", "autodescubrimiento"]);

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function Quote() {
  const sectionRef = useRef<HTMLElement>(null);
  /** 0 = ninguna palabra encendida, 1 = todas. */
  const [avance, setAvance] = useState(0);
  const [visible, setVisible] = useState(false);

  const palabras = FRASE.split(" ");

  // Encendido ligado al scroll. El recorrido útil arranca cuando la sección
  // entra por abajo y termina cuando su centro pasa el centro de la pantalla:
  // así la frase queda encendida entera mientras todavía se está leyendo, y no
  // recién cuando ya se fue de la pantalla.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (quieto) {
      setAvance(1);
      setVisible(true);
      return;
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const centro = r.top + r.height / 2;
        // 1 cuando el centro de la sección llegó al 42% de la pantalla.
        const p = (vh - centro) / (vh * 0.58);
        setAvance(clamp(p, 0, 1));
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "-15% 0px -15% 0px" },
    );
    io.observe(el);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-space-slate px-[clamp(1rem,3vw,3rem)] py-[clamp(7rem,14vw,14rem)] text-paper-bone"
    >
      {/* ── La estrella ────────────────────────────────────────────────────
          Centrada y girando. Cada cosa en su propia propiedad: el centrado en
          `translate` (que es lo que escriben las clases -translate-x/y de
          Tailwind 4), la escala en `scale` y el giro en `rotate` (keyframe
          spin-slow). Así las tres se componen en vez de pisarse — que es lo
          que pasaba cuando el centrado iba en `transform`: el keyframe
          reemplazaba la matriz completa y la estrella se iba del centro.

          La opacidad sube con el scroll y acompaña el encendido de la frase. */}
      <Image
        src="/graphics/starburst-05-launch.png"
        alt=""
        aria-hidden="true"
        width={1200}
        height={1200}
        style={{
          opacity: 0.05 + avance * 0.07,
          scale: String(0.9 + avance * 0.16),
        }}
        className="animate-spin-slow pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[200vw] max-w-none -translate-x-1/2 -translate-y-1/2 [transition:opacity_700ms_linear,scale_700ms_linear] [filter:brightness(0)_invert(1)]"
        unoptimized
      />

      {/* El texto completo va aparte para lectores de pantalla: lo de abajo
          está partido en palabras y letras, y se lee entrecortado. */}
      <p className="sr-only">{FRASE}</p>

      <p
        aria-hidden="true"
        /* Más chica que el display-2xl que tenía (llegaba a 96px). Un estudio
           de diseño no puede tener el párrafo más grande que su trabajo: acá
           el texto acompaña, la obra manda. */
        className="m-0 max-w-[30ch] text-balance font-display text-[clamp(1.6rem,3.6vw,3.4rem)] font-normal leading-[1.14] tracking-[-0.025em]"
      >
        {palabras.map((palabra, i) => {
          // Cada palabra tiene su propio tramo del recorrido, con solape: la
          // siguiente empieza a encenderse antes de que termine la anterior,
          // así el barrido se ve continuo y no como un contador.
          const inicio = i / (palabras.length + 4);
          const luz = clamp((avance - inicio) / 0.16, 0, 1);
          const clave = CLAVES.has(palabra.replace(/[.,]/g, ""));

          return (
            <Fragment key={`${palabra}-${i}`}>
              <span
                className="inline-block whitespace-nowrap"
                style={{
                  // De apagado a encendido. Las palabras clave rematan en el
                  // ice de la paleta; el resto, en blanco.
                  color: clave
                    ? `rgba(214, 226, 237, ${0.2 + luz * 0.8})`
                    : `rgba(255, 255, 255, ${0.18 + luz * 0.82})`,
                  textShadow:
                    clave && luz > 0.6
                      ? `0 0 ${18 * luz}px rgba(214,226,237,${0.35 * luz})`
                      : "none",
                  transition: "color 420ms linear, text-shadow 420ms linear",
                }}
              >
                {/* El asentado de entrada va letra por letra dentro de la
                    palabra; el encendido, palabra por palabra. Dos escalas
                    distintas para que no se lean como un mismo efecto. */}
                {[...palabra].map((c, j) => (
                  <span
                    key={j}
                    className="inline-block"
                    style={{
                      // El delay va DENTRO del shorthand `animation` (su segundo
                      // valor de tiempo), no como `animationDelay` aparte: mezclar
                      // un shorthand con su longhand hace que React avise —al
                      // re-renderizar con el scroll uno puede pisar al otro— y el
                      // escalonado letra por letra se rompería. Orden del
                      // shorthand: nombre, duración, easing, delay, fill-mode.
                      animation: visible
                        ? `word-settle 780ms var(--ease-out-spring) ${i * 42 + j * 12}ms both`
                        : "none",
                      opacity: visible ? undefined : 0,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </span>
              {i < palabras.length - 1 ? " " : null}
            </Fragment>
          );
        })}
      </p>
    </section>
  );
}
