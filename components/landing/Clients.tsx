"use client";

import { useEffect, useRef, useState } from "react";
import { clients } from "@/data/clients";
import { SpaceBackdrop } from "@/components/ui/SpaceBackdrop";

export function Clients() {
  const sectionRef = useRef<HTMLElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  /**
   * Posición continua dentro de la lista (2.4 = entre el tercero y el cuarto,
   * más cerca del tercero). Con decimales y no con un índice entero: es lo que
   * permite que el resalte sea un degradado y no un interruptor.
   */
  const [pos, setPos] = useState(0);
  const [pinned, setPinned] = useState(true);

  /** El más cercano al centro — para el contador y el aria-current. */
  const active = Math.round(pos);

  /* ---------------------------------------------------------------------- */
  /*  Movimiento                                                             */
  /*                                                                        */
  /*  Antes la lista se posicionaba DENTRO del handler de scroll: el         */
  /*  translateY saltaba exactamente lo que había saltado la rueda, así que  */
  /*  con un trackpad se veía fluido y con una rueda de clicks iba a         */
  /*  tirones. Y el resalte era binario (Math.round), o sea que el nombre    */
  /*  activo cambiaba de golpe a mitad de camino.                           */
  /*                                                                        */
  /*  Ahora hay un bucle propio: el scroll solo actualiza el OBJETIVO y el   */
  /*  bucle persigue ese objetivo con suavizado exponencial sobre el delta   */
  /*  real de cada frame. Y la posición dentro de la lista es continua, así  */
  /*  que cada nombre se enciende y se apaga de forma gradual según su       */
  /*  distancia al centro, en vez de prenderse de una.                      */
  /* ---------------------------------------------------------------------- */
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
    /** Progreso objetivo, 0-1, el que dicta el scroll. */
    let objetivo = 0;
    /** Progreso mostrado. Persigue al objetivo con retraso. */
    let actual = -1;
    let ultimo = 0;

    const medir = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      objetivo = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    };

    const frame = (t: number) => {
      if (!ultimo) ultimo = t;
      const dt = Math.min(t - ultimo, 50);
      ultimo = t;

      // Primer frame: se planta directo en el objetivo, sin recorrer desde 0.
      if (actual < 0) actual = objetivo;
      else actual += (objetivo - actual) * (1 - Math.exp(-dt / 150));

      const rowH = list.children[0]?.getBoundingClientRect().height || 100;
      const rightH = right.clientHeight || window.innerHeight;
      const flotante = actual * (n - 1);
      // Centra el nombre activo dentro del área derecha.
      list.style.transform = `translateY(${rightH / 2 - (rowH * flotante + rowH / 2)}px)`;

      // El resalte también es continuo: se guarda el valor con decimales y
      // cada fila calcula su propia intensidad según lo lejos que esté.
      setPos((prev) => (Math.abs(prev - flotante) > 0.002 ? flotante : prev));

      raf = requestAnimationFrame(frame);
    };

    medir();
    raf = requestAnimationFrame(frame);
    window.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      window.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
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
                /* Intensidad continua: 1 justo en el centro, 0 a dos filas de
                   distancia. El resalte deja de ser un interruptor y pasa a
                   ser un degradado —el nombre se enciende MIENTRAS sube—, que
                   es de donde sale la sensación de fluidez.

                   Sin transition en estas propiedades a propósito: el valor ya
                   viene suavizado del bucle, y una transición encima agregaría
                   un segundo retraso que se siente como goma. */
                const d = Math.abs(i - pos);
                const luz = Math.max(0, 1 - d / 2);
                // Curva: la fila del centro se despega de sus vecinas en vez
                // de que las tres se vean casi iguales.
                const k = luz * luz;
                return (
                  <li
                    key={c.name}
                    aria-current={i === active ? "true" : undefined}
                    className="flex h-[clamp(64px,11vh,120px)] items-center gap-[clamp(0.75rem,2vw,2rem)]"
                  >
                    <span
                      className="self-start pt-2 font-mono text-xs italic tabular-nums"
                      style={{
                        color: `color-mix(in oklab, #dcddca ${k * 100}%, rgba(214,226,237,0.3))`,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="font-display font-medium leading-[0.98] tracking-[-0.03em]"
                      style={{
                        fontSize: "clamp(2rem,6vw,5rem)",
                        color: `rgba(255,255,255,${0.2 + k * 0.8})`,
                        transform: `translateX(${k * 12}px)`,
                        textShadow: `0 0 ${34 * k}px rgba(214,226,237,${0.45 * k})`,
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
