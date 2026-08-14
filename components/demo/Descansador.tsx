"use client";

import { useEffect, useRef } from "react";

/* -------------------------------------------------------------------------- */
/*  Descansador de pantalla — isotipo de Manifesto                             */
/*                                                                            */
/*  El isotipo rebota contra los bordes y alterna entre blanco y celeste en    */
/*  cada rebote. Sin rastro: el lienzo se limpia entero cada cuadro, así solo   */
/*  se ve el isotipo en su posición actual, limpio.                           */
/*                                                                            */
/*  Se dibuja en canvas y no con divs por rendimiento.                        */
/* -------------------------------------------------------------------------- */

/** Rutas del isotipo, en su viewBox original de 96 × 51. */
const TRAZOS = [
  "M0.64 51V36.1118C3.09333 36.1118 8 38.3292 8 43.3975C8 48.4658 3.09333 50.8944 0.64 51Z",
  "M16 0H0L24.64 50.3665H40.96L16 0Z",
  "M77.44 0H48.96V50.3665H64V13.3043H77.44V0Z",
  "M96 40.5466C96 35.1615 91.2 31.677 87.36 31.677C82.88 31.677 78.08 35.1615 78.08 40.5466C78.08 45.9317 82.56 49.7329 87.36 49.7329C91.84 49.7329 96 45.9317 96 40.5466Z",
];
const LOGO_W = 96;
const LOGO_H = 51;

/** Solo blanco y celeste (ice), alternando en cada rebote. */
const COLORES = ["#ffffff", "#d6e2ed"];
/** Velocidad del isotipo, en píxeles por segundo. */
const VELOCIDAD = 190;

interface DescansadorProps {
  /** Ancho del isotipo en píxeles. */
  ancho?: number;
  className?: string;
}

export function Descansador({ ancho = 190, className = "" }: DescansadorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rutas = TRAZOS.map((d) => new Path2D(d));

    let w = 0;
    let h = 0;
    let escala = 1;
    let lw = 0;
    let lh = 0;
    let iniciado = false;
    let tiempo = 0;
    let estrellas: { x: number; y: number; r: number; fase: number }[] = [];

    /**
     * Ajusta el lienzo al tamaño real del elemento.
     *
     * La escala del isotipo se recalcula acá dentro y no una sola vez al
     * montar: si se recalcula fuera, al cambiar el tamaño de la ventana el
     * isotipo conserva la medida vieja y los límites del rebote dejan de
     * coincidir con los bordes.
     */
    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nw = canvas.clientWidth;
      const nh = canvas.clientHeight;
      if (!nw || !nh) return;

      w = nw;
      h = nh;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      // Estrellas de fondo (como en el hero). Se regeneran al cambiar el tamaño.
      const cuenta = Math.min(160, Math.max(40, Math.round((w * h) / 9000)));
      estrellas = Array.from({ length: cuenta }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        fase: Math.random() * Math.PI * 2,
      }));

      // El isotipo se achica en pantallas angostas para que quepa el rebote.
      escala = Math.min(ancho, w * 0.42) / LOGO_W;
      lw = LOGO_W * escala;
      lh = LOGO_H * escala;

      if (!iniciado) {
        // Arranca al centro. Nada de Math.random: así el primer cuadro es el
        // mismo en el servidor y en el navegador.
        x = (w - lw) / 2;
        y = (h - lh) / 2;
        iniciado = true;
      } else {
        // Tras un cambio de tamaño, de vuelta adentro de los límites nuevos.
        x = Math.min(Math.max(x, 0), Math.max(0, w - lw));
        y = Math.min(Math.max(y, 0), Math.max(0, h - lh));
      }
    };

    let x = 0;
    let y = 0;
    let vx = VELOCIDAD * 0.78;
    let vy = VELOCIDAD * 0.55;
    let color = 0;
    let raf = 0;
    let ultimo = 0;

    const dibujar = () => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(escala, escala);
      ctx.fillStyle = COLORES[color];
      for (const r of rutas) ctx.fill(r);
      ctx.restore();
    };

    const frame = (t: number) => {
      if (!ultimo) ultimo = t;
      const dt = Math.min((t - ultimo) / 1000, 0.05);
      ultimo = t;

      // Sin rastro: se limpia el lienzo entero cada cuadro.
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      // Estrellas titilando de fondo, en ice, como en el inicio.
      tiempo += dt;
      for (const e of estrellas) {
        const tw = quieto ? 0.7 : 0.5 + 0.5 * Math.sin(tiempo * 1.4 + e.fase);
        ctx.globalAlpha = tw * 0.55;
        ctx.fillStyle = "#d6e2ed";
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      x += vx * dt;
      y += vy * dt;

      // Rebote. Se reubica dentro del borde antes de invertir para que no se
      // quede vibrando pegado si el cuadro se atrasa.
      if (x <= 0) {
        x = 0;
        vx = Math.abs(vx);
        color = (color + 1) % COLORES.length;
      } else if (x + lw >= w) {
        x = w - lw;
        vx = -Math.abs(vx);
        color = (color + 1) % COLORES.length;
      }
      if (y <= 0) {
        y = 0;
        vy = Math.abs(vy);
        color = (color + 1) % COLORES.length;
      } else if (y + lh >= h) {
        y = h - lh;
        vy = -Math.abs(vy);
        color = (color + 1) % COLORES.length;
      }

      dibujar();
      raf = requestAnimationFrame(frame);
    };

    // ResizeObserver y no el evento `resize` de la ventana: el lienzo puede
    // cambiar de tamaño sin que la ventana cambie, y ahí el evento nunca
    // llega. Pasó en pruebas: el lienzo quedó de 750×1624 dentro de un
    // elemento de 1265×800 y el isotipo se dibujaba fuera de cuadro.
    const ro = new ResizeObserver(() => {
      medir();
      dibujar();
    });
    ro.observe(canvas);

    medir();
    // Un cuadro dibujado ya: si el bucle tarda en arrancar, el descansador
    // no se queda en negro.
    dibujar();

    // Sin movimiento queda el isotipo quieto al centro y sin rastro.
    if (!quieto) raf = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ancho]);

  return (
    <canvas
      ref={canvasRef}
      className={`block h-full w-full bg-ink-pure ${className}`}
      role="img"
      aria-label="Descansador de pantalla: el isotipo de Manifesto rebotando"
    />
  );
}
