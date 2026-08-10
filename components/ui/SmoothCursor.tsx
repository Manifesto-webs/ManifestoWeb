"use client";

import { useEffect, useRef } from "react";

/* -------------------------------------------------------------------------- */
/*  Puntero suave                                                              */
/*                                                                            */
/*  Dos piezas: un punto que va casi pegado al mouse y un anillo que llega     */
/*  tarde. Esa diferencia de retraso es lo que da la sensación de suavidad —   */
/*  el puntero no "salta", persigue.                                          */
/*                                                                            */
/*  Va en mix-blend-mode: difference porque el sitio tiene secciones blancas   */
/*  y secciones oscuras. Con la mezcla, el puntero se invierte contra lo que   */
/*  tenga debajo y siempre se ve, sin tener que saber en qué sección está.    */
/*                                                                            */
/*  No se dibuja en pantallas táctiles (no hay puntero que reemplazar) ni con  */
/*  prefers-reduced-motion: ahí se deja el del sistema, que es lo correcto.    */
/* -------------------------------------------------------------------------- */

/** Qué tanto se acerca cada capa a su objetivo en cada frame (0-1). */
const EASE_DOT = 0.32;
const EASE_RING = 0.13;

export function SmoothCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fino = window.matchMedia("(pointer: fine)").matches;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fino || quieto) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Mientras no se mueva el mouse no se dibuja nada: si no, al cargar la
    // página aparecería un puntero pegado en la esquina superior izquierda.
    let visible = false;
    const target = { x: 0, y: 0 };
    const d = { x: 0, y: 0 };
    const r = { x: 0, y: 0 };
    let raf = 0;
    let sobreClic = false;
    let presionado = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        d.x = r.x = e.clientX;
        d.y = r.y = e.clientY;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      // Crece sobre cualquier cosa clicable, sin tener que listarlas a mano.
      sobreClic = !!(e.target as Element)?.closest?.(
        'a, button, [role="button"], input, textarea, select, label, summary',
      );
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onDown = () => (presionado = true);
    const onUp = () => (presionado = false);

    const loop = () => {
      d.x += (target.x - d.x) * EASE_DOT;
      d.y += (target.y - d.y) * EASE_DOT;
      r.x += (target.x - r.x) * EASE_RING;
      r.y += (target.y - r.y) * EASE_RING;

      const escalaAnillo = (sobreClic ? 1.9 : 1) * (presionado ? 0.82 : 1);
      const escalaPunto = sobreClic ? 0.45 : 1;

      dot.style.transform = `translate3d(${d.x}px, ${d.y}px, 0) translate(-50%, -50%) scale(${escalaPunto})`;
      ring.style.transform = `translate3d(${r.x}px, ${r.y}px, 0) translate(-50%, -50%) scale(${escalaAnillo})`;
      raf = requestAnimationFrame(loop);
    };

    document.documentElement.classList.add("smooth-cursor-on");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("smooth-cursor-on");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="smooth-cursor pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border border-white opacity-0 transition-opacity duration-300"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="smooth-cursor pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-white opacity-0 transition-opacity duration-300"
      />
    </>
  );
}
