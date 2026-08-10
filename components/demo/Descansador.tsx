"use client";

import { useEffect, useRef } from "react";

/* -------------------------------------------------------------------------- */
/*  Descansador de pantalla — isotipo de Manifesto                             */
/*                                                                            */
/*  El isotipo rebota contra los bordes y cambia de color en cada rebote,      */
/*  dejando su rastro como los tubos de rayos catódicos: el fósforo tardaba    */
/*  en apagarse y lo que ya pasó se queda un rato en pantalla.                 */
/*                                                                            */
/*  Cómo se hace el rastro: en vez de borrar el lienzo cada cuadro, se le      */
/*  pinta encima un negro casi transparente. Lo viejo se va apagando solo,     */
/*  capa sobre capa, y nunca hay que guardar posiciones anteriores.            */
/*                                                                            */
/*  Se dibuja en canvas y no con divs: son cientos de capas por segundo y el   */
/*  DOM no da abasto.                                                         */
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

/** Solo colores de marca. El corinto entra porque acá es relleno, no texto. */
const COLORES = ["#d6e2ed", "#dcddca", "#ffffff", "#5f0000"];

/** Cuánto se apaga el rastro por cuadro. Más alto, rastro más corto. */
const APAGADO = 0.055;
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

      // El velo que apaga lo anterior: esto es el rastro.
      ctx.fillStyle = `rgba(0,0,0,${APAGADO})`;
      ctx.fillRect(0, 0, w, h);

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
      aria-label="Descansador de pantalla: el isotipo de Manifesto rebotando y dejando rastro"
    />
  );
}
