"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SpaceBackdrop } from "@/components/ui/SpaceBackdrop";

const LINE1 =
  "Ninguna marca existe sola. Vive dentro de una cultura, un mercado y un equipo que la sostiene.";
const LINE2 =
  "Leer ese sistema completo es lo que convierte una intuición en una decisión.";

const HIGHLIGHT = new Set(["cultura,", "mercado", "equipo", "intuición", "decisión."]);

/** Párrafo cuyas palabras entran escalonadas al aparecer en viewport. */
function StatementLine({
  text,
  className,
  base = 0,
}: {
  text: string;
  className: string;
  base?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => {
        const hot = HIGHLIGHT.has(w);
        return (
          <span
            key={`${w}-${i}`}
            className="mr-[0.28em] inline-block"
            style={{
              color: hot ? "#ffffff" : undefined,
              textShadow: hot ? "0 0 22px rgba(214,226,237,0.75)" : undefined,
              opacity: shown ? 1 : 0,
              transform: shown ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
              transitionDelay: `${base + i * 45}ms`,
            }}
          >
            {w}
          </span>
        );
      })}
    </p>
  );
}

export function UniversoMarca() {
  return (
    <section
      id="universo-marca"
      className="relative overflow-hidden px-[clamp(1rem,3vw,3rem)] py-[clamp(5rem,12vw,14rem)]"
      style={{ backgroundColor: "#282e32" }}
    >
      <SpaceBackdrop glow="dual" />

      <div className="relative z-10 mx-auto max-w-[80ch] text-center">
        <Reveal className="mb-8">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(214,226,237,0.5)]">
            El universo de marca
          </span>
        </Reveal>

        <StatementLine
          text={LINE1}
          base={0}
          className="m-0 font-display text-[clamp(1.9rem,4.8vw,4.8rem)] font-normal leading-[1.08] tracking-[-0.03em] text-[rgba(214,226,237,0.82)]"
        />

        <StatementLine
          text={LINE2}
          base={260}
          className="mx-auto mt-[clamp(1.5rem,3vw,2.5rem)] max-w-[46ch] text-[clamp(1rem,1.5vw,1.4rem)] leading-[1.5] text-[rgba(214,226,237,0.7)]"
        />
      </div>
    </section>
  );
}
