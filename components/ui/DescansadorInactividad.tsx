"use client";

import { useEffect, useState } from "react";
import { Descansador } from "@/components/demo/Descansador";

/* -------------------------------------------------------------------------- */
/*  Descansador por inactividad                                                */
/*                                                                            */
/*  Tras x tiempo sin actividad (mouse, teclado, rueda, scroll o toque) aparece    */
/*  el descansador a pantalla completa. Cualquier gesto lo cierra y reinicia   */
/*  el conteo. El canvas solo se monta mientras está activo, así no consume     */
/*  nada el resto del tiempo. Con prefers-reduced-motion no se activa: es puro  */
/*  movimiento.                                                                */
/* -------------------------------------------------------------------------- */

const INACTIVIDAD_MS = 60_000;

export function DescansadorInactividad() {
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let temporizador: ReturnType<typeof setTimeout>;
    const reiniciar = () => {
      setActivo(false);
      clearTimeout(temporizador);
      temporizador = setTimeout(() => setActivo(true), INACTIVIDAD_MS);
    };

    const eventos = [
      "pointermove",
      "pointerdown",
      "keydown",
      "wheel",
      "touchstart",
      "scroll",
    ] as const;
    eventos.forEach((e) =>
      window.addEventListener(e, reiniciar, { passive: true }),
    );
    reiniciar();

    return () => {
      clearTimeout(temporizador);
      eventos.forEach((e) => window.removeEventListener(e, reiniciar));
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9995] transition-opacity duration-700 ${
        activo ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {activo && (
        <>
          <Descansador />
          <span className="pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-kicker text-white/40">
            mové para volver
          </span>
        </>
      )}
    </div>
  );
}
