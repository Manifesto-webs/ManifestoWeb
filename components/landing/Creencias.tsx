"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";

const CREENCIAS = [
  { id: "01", text: "El diseño es una herramienta para pensar, ordenar y solucionar." },
  {
    id: "02",
    text: "Una marca es un sistema vivo: viene de algún lugar, existe por una razón y va hacia algo.",
  },
  {
    id: "03",
    text: "Todo empieza en la cultura. Lo que no es cierto adentro no se sostiene afuera.",
  },
];

const MS_PER_CHAR = 28; // velocidad de escritura

// Línea de tiempo: cada creencia escribe su número y luego su texto, en orden.
const SEQ = (() => {
  let off = 0;
  return CREENCIAS.map((c) => {
    const numLen = c.id.length;
    const bodyLen = c.text.length;
    const start = off;
    off += numLen + bodyLen;
    return { ...c, numLen, bodyLen, start };
  });
})();
const TOTAL = SEQ.reduce((a, c) => a + c.numLen + c.bodyLen, 0);

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const GLOW = "0 0 20px rgba(214,226,237,0.35)";

/**
 * "Qué creemos": el texto se va escribiendo carácter por carácter (con cursor)
 * y aparece ya alumbrado. Arranca cuando la sección entra en pantalla.
 * El layout es estable (el texto no visible reserva su espacio) para que no salte.
 */
export function Creencias() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(TOTAL);
      setDone(true);
      return;
    }
    const wrap = wrapRef.current;
    if (!wrap) return;

    let raf = 0;
    let startTime = 0;
    let playing = false;

    const tick = (t: number) => {
      if (!startTime) startTime = t;
      const chars = Math.min(TOTAL, Math.floor((t - startTime) / MS_PER_CHAR));
      setN(chars);
      if (chars < TOTAL) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };
    const play = () => {
      if (playing) return;
      playing = true;
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(wrap);
    // Red de seguridad: si el observer no dispara, igual se escribe.
    const fb = window.setTimeout(play, 8000);

    return () => {
      io.disconnect();
      clearTimeout(fb);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative z-10 mt-[clamp(4rem,8vw,9rem)]">
      <Reveal>
        <h3 className="mb-10 font-display text-[clamp(2.5rem,1.8vw,2.5rem)] font-semibold tracking-[-0.03em] text-white">
          Qué creemos
        </h3>
      </Reveal>

        <div className="flex flex-col gap-[clamp(1.5rem,2.2vw,2rem)]">
        {SEQ.map((c) => {
          const numShown = clamp(n - c.start, 0, c.numLen);
          const bodyShown = clamp(n - c.start - c.numLen, 0, c.bodyLen);
          const typingNum = n > c.start && n < c.start + c.numLen;
          const typingBody =
            n >= c.start + c.numLen && n < c.start + c.numLen + c.bodyLen && !done;

          return (
            <div
              key={c.id}
              className="grid grid-cols-[auto_1fr] items-baseline gap-[clamp(2.2rem,2.2vw,2.5rem)]"
            >
              {/* Número */}
              <span className="font-mono text-sm tabular-nums tracking-[0.2em]">
                <span style={{ color: "#dcddca" }}>{c.id.slice(0, numShown)}</span>
                {typingNum && <span className="typewriter-caret" aria-hidden="true" />}
                <span style={{ opacity: 0 }}>{c.id.slice(numShown)}</span>
              </span>

              {/* Texto */}
              <p className="m-0 max-w-[26ch] font-display text-[clamp(2rem,1.5vw,2rem)] font-normal leading-[1.3] tracking-[-0.025em]">
                <span style={{ color: "#ffffff", textShadow: GLOW }}>
                  {c.text.slice(0, bodyShown)}
                </span>
                {typingBody && <span className="typewriter-caret" aria-hidden="true" />}
                {/* reserva el espacio del texto aún no escrito (sin salto de layout) */}
                <span style={{ opacity: 0 }}>{c.text.slice(bodyShown)}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
