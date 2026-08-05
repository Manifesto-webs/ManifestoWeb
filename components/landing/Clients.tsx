"use client";

import { useEffect, useRef, useState } from "react";
import { clients } from "@/data/clients";
import { SpaceBackdrop } from "@/components/ui/SpaceBackdrop";

export function Clients() {
  const sectionRef = useRef<HTMLElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPinned(false);
      return;
    }
    const section = sectionRef.current;
    const right = rightRef.current;
    const list = listRef.current;
    if (!section || !right || !list) return;

    const n = clients.length;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height - vh;
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

        const rowH = list.children[0]?.getBoundingClientRect().height || 100;
        const rightH = right.clientHeight || vh;
        const activeFloat = p * (n - 1);
        // Centra el nombre activo dentro del área derecha.
        const ty = rightH / 2 - (rowH * activeFloat + rowH / 2);
        list.style.transform = `translateY(${ty}px)`;
        setActive(Math.round(activeFloat));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const total = String(clients.length).padStart(2, "0");

  /* -------------------------------------------------------------------- */
  /*  Fallback sin animación (prefers-reduced-motion)                      */
  /* -------------------------------------------------------------------- */
  if (!pinned) {
    return (
      <section
        id="clientes"
        className="relative overflow-hidden px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,10vw,12rem)]"
        style={{ backgroundColor: "#282e32" }}
      >
        <SpaceBackdrop glow="dual" />
        <div className="relative z-10">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(214,226,237,0.55)]">
            Clientes
          </span>
          <h2 className="mb-10 mt-4 font-display text-[clamp(2.5rem,5.5vw,5.5rem)] font-normal leading-[0.95] tracking-[-0.04em] text-white">
            Confían en el motivo.
          </h2>
          <ol className="flex flex-col gap-2">
            {clients.map((c, i) => (
              <li key={c.name} className="flex items-baseline gap-4">
                <span className="font-mono text-xs italic tabular-nums text-[rgba(214,226,237,0.4)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[clamp(1.6rem,4vw,3rem)] font-medium tracking-[-0.03em] text-[rgba(214,226,237,0.85)]">
                  {c.name}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  /* -------------------------------------------------------------------- */
  /*  Versión "pin": la sección se queda fija y solo suben los nombres     */
  /* -------------------------------------------------------------------- */
  return (
    <section
      ref={sectionRef}
      id="clientes"
      className="relative"
      style={{ height: `${clients.length * 16}vh`, backgroundColor: "#282e32" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <SpaceBackdrop glow="dual" />

        <div className="relative z-10 grid h-full items-center gap-x-[clamp(2rem,5vw,6rem)] px-[clamp(1rem,3vw,3rem)] max-lg:grid-rows-[auto_1fr] max-lg:content-center lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)]">
          {/* IZQUIERDA — fija */}
          <div className="max-lg:pt-[clamp(4rem,10vh,7rem)]">
            <span className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(214,226,237,0.55)]">
              Clientes
            </span>
            <h2 className="mt-4 font-display text-[clamp(2.25rem,5.5vw,5.5rem)] font-normal leading-[0.95] tracking-[-0.04em] text-white">
              Confían en el motivo.
            </h2>
            <div className="mt-8 flex items-baseline gap-3 font-mono text-sm text-[rgba(214,226,237,0.6)]">
              <span
                className="tabular-nums text-[#d6e2ed]"
                style={{ textShadow: "0 0 18px rgba(214,226,237,0.5)" }}
              >
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="h-[1px] w-10 bg-[rgba(214,226,237,0.3)]" />
              <span className="tabular-nums">{total}</span>
            </div>
          </div>

          {/* DERECHA — solo los nombres se desplazan */}
          <div ref={rightRef} className="relative h-full overflow-hidden">
            {/* Guías de centro (línea sutil donde se ilumina) */}
            <div
              className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <ol
              ref={listRef}
              className="absolute inset-x-0 top-0 will-change-transform"
            >
              {clients.map((c, i) => {
                const isActive = i === active;
                return (
                  <li
                    key={c.name}
                    className="flex h-[clamp(64px,11vh,120px)] items-center gap-[clamp(0.75rem,2vw,2rem)]"
                  >
                    <span
                      className="self-start pt-2 font-mono text-xs italic tabular-nums transition-colors duration-300"
                      style={{ color: isActive ? "#dcddca" : "rgba(214,226,237,0.3)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="font-display font-medium leading-[0.98] tracking-[-0.03em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        fontSize: "clamp(2rem,6vw,5rem)",
                        color: isActive ? "#ffffff" : "rgba(214,226,237,0.22)",
                        transform: isActive ? "translateX(10px)" : "translateX(0)",
                        textShadow: isActive ? "0 0 34px rgba(214,226,237,0.45)" : "none",
                      }}
                    >
                      {c.name}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
