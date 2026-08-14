"use client";

import { useEffect, useRef } from "react";

/* -------------------------------------------------------------------------- */
/*  Puntero suave — estrella                                                    */
/*                                                                            */
/*  Tres capas, cada una con su propio retraso. Esa diferencia es lo que da la  */
/*  sensación de suavidad: el puntero no "salta", persigue.                    */
/*                                                                            */
/*    · estrella — la estrella de marca, casi pegada al mouse. Gira despacio   */
/*      todo el tiempo y se inclina con la velocidad del movimiento.           */
/*    · anillo   — llega tarde. Es el que reacciona a lo que hay debajo.       */
/*    · halo     — llega más tarde todavía y solo se ve sobre algo importante.  */
/*                                                                            */
/*  Sobre qué reacciona (los tres estados):                                    */
/*    normal      — nada debajo: estrella chica, anillo chico.                 */
/*    clicable    — cualquier control (botón, campo, label): el anillo abre.   */
/*    importante  — un proyecto, el CTA, un enlace del menú: el anillo abre    */
/*      más, late, y la estrella crece y se acelera. Se marca con              */
/*      `data-cursor="estrella"` o sale solo de los <a> a /proyectos.          */
/*                                                                            */
/*  Además deja una estela de chispas cuando el mouse se mueve rápido —        */
/*  espaciada por distancia, no por tiempo, así no aparecen amontonadas.       */
/*                                                                            */
/*  No se dibuja en pantallas táctiles (no hay puntero que reemplazar) ni con  */
/*  prefers-reduced-motion: ahí se deja el del sistema, que es lo correcto.    */
/* -------------------------------------------------------------------------- */

/**
 * Constantes de tiempo, en ms: cuánto tarda cada capa en recorrer ~63% de lo
 * que le falta. Se usan con suavizado exponencial sobre el delta real de cada
 * frame, así el puntero se siente IGUAL a 60, 120 o 144 Hz. Antes era un lerp
 * de factor fijo por frame: en una pantalla de 120 Hz iba al doble de rápido.
 */
const TAU_ESTRELLA = 42;
const TAU_ANILLO = 105;
const TAU_HALO = 190;
/** Distancia mínima entre chispas de la estela, en px. */
const PASO_CHISPA = 90;
/** Velocidad (px/frame) a partir de la cual se empieza a dejar estela. */
const VEL_CHISPA = 9;

/** Path de la estrella de cuatro puntas de la marca (viewBox 24). */
const ESTRELLA =
  "M12 0c.95 7.83 4.17 11.05 12 12-7.83.95-11.05 4.17-12 12-.95-7.83-4.17-11.05-12-12 7.83-.95 11.05-4.17 12-12Z";

/** Selector de "cualquier cosa con la que se puede interactuar". */
const CLICABLE =
  'a, button, [role="button"], input, textarea, select, label, summary';
/**
 * Selector de lo IMPORTANTE. `data-cursor="estrella"` es la marca explícita —
 * cualquier componente puede pedir el estado fuerte sin tocar este archivo.
 */
const IMPORTANTE =
  '[data-cursor="estrella"], a[href^="/proyectos/"], a[href*="#contacto"], button[type="submit"]';

export function SmoothCursor() {
  const estrellaRef = useRef<HTMLDivElement>(null);
  const anilloRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fino = window.matchMedia("(pointer: fine)").matches;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fino || quieto) return;

    const estrella = estrellaRef.current;
    const anillo = anilloRef.current;
    const halo = haloRef.current;
    if (!estrella || !anillo || !halo) return;

    // Mientras no se mueva el mouse no se dibuja nada: si no, al cargar la
    // página aparecería un puntero pegado en la esquina superior izquierda.
    let visible = false;
    const target = { x: 0, y: 0 };
    const e = { x: 0, y: 0 };
    const a = { x: 0, y: 0 };
    const h = { x: 0, y: 0 };
    // Última posición donde nació una chispa, para espaciar la estela.
    const chispa = { x: 0, y: 0 };

    let raf = 0;
    let ultimo = 0;
    let sobreClic = false;
    let sobreFuerte = false;
    let presionado = false;
    let giro = 0;
    /** Escalas suavizadas: sin esto el cambio de estado sería un salto. */
    let escAnillo = 1;
    let escEstrella = 1;
    let opHalo = 0;

    const capas = [estrella, anillo, halo];

    const mostrar = (on: boolean) => {
      visible = on;
      for (const c of capas) c.style.opacity = on ? "1" : "0";
    };

    const onMove = (ev: PointerEvent) => {
      target.x = ev.clientX;
      target.y = ev.clientY;
      if (!visible) {
        e.x = a.x = h.x = chispa.x = ev.clientX;
        e.y = a.y = h.y = chispa.y = ev.clientY;
        mostrar(true);
      }
      const bajo = ev.target as Element | null;
      // closest() y no una lista a mano: alcanza con que el elemento —o
      // cualquiera de sus padres— sea clicable.
      sobreClic = !!bajo?.closest?.(CLICABLE);
      sobreFuerte = !!bajo?.closest?.(IMPORTANTE);
    };

    const onLeave = () => mostrar(false);
    const onDown = () => (presionado = true);
    const onUp = () => (presionado = false);

    /**
     * Chispa suelta: nace donde pasó el mouse, se abre y se borra sola.
     * Van dos nodos: el de afuera lleva la POSICIÓN y el de adentro la
     * animación. Si fuera uno solo, el transform del keyframe pisaría el
     * translate de la posición y todas las chispas saldrían de la esquina.
     */
    const soltarChispa = (x: number, y: number) => {
      const envoltura = document.createElement("div");
      envoltura.style.cssText = `position:fixed;left:${x}px;top:${y}px;z-index:9998;pointer-events:none;mix-blend-mode:difference`;
      envoltura.innerHTML =
        `<div class="cursor-spark" style="position:absolute;left:0;top:0">` +
        `<svg width="9" height="9" viewBox="0 0 24 24" fill="#fff" style="display:block">` +
        `<path d="${ESTRELLA}"/></svg></div>`;
      document.body.appendChild(envoltura);
      window.setTimeout(() => envoltura.remove(), 760);
    };

    const loop = (ahora: number) => {
      if (!ultimo) ultimo = ahora;
      // Se acota el delta: si la pestaña estuvo en segundo plano, `ahora`
      // vuelve con un salto enorme y el puntero se teletransportaría.
      const dt = Math.min(ahora - ultimo, 64);
      ultimo = ahora;

      // Suavizado exponencial: independiente de los Hz de la pantalla.
      const kE = 1 - Math.exp(-dt / TAU_ESTRELLA);
      const kA = 1 - Math.exp(-dt / TAU_ANILLO);
      const kH = 1 - Math.exp(-dt / TAU_HALO);

      const antX = e.x;
      const antY = e.y;

      e.x += (target.x - e.x) * kE;
      e.y += (target.y - e.y) * kE;
      a.x += (target.x - a.x) * kA;
      a.y += (target.y - a.y) * kA;
      h.x += (target.x - h.x) * kH;
      h.y += (target.y - h.y) * kH;

      const vx = e.x - antX;
      const vy = e.y - antY;
      const vel = Math.hypot(vx, vy);

      // Estela: por distancia recorrida, no por tiempo. Así el reguero queda
      // parejo tanto en un gesto lento como en uno rápido.
      if (visible && vel > VEL_CHISPA) {
        const dist = Math.hypot(e.x - chispa.x, e.y - chispa.y);
        if (dist > PASO_CHISPA) {
          soltarChispa(e.x, e.y);
          chispa.x = e.x;
          chispa.y = e.y;
        }
      }

      // Objetivos de cada estado. El halo solo existe sobre lo importante.
      const objAnillo = (sobreFuerte ? 2.5 : sobreClic ? 1.75 : 1) * (presionado ? 0.82 : 1);
      const objEstrella = (sobreFuerte ? 1.75 : sobreClic ? 0.55 : 1) * (presionado ? 0.85 : 1);
      const objHalo = sobreFuerte ? 1 : 0;

      // Los estados también se suavizan: el anillo se ABRE, no aparece abierto.
      const kS = 1 - Math.exp(-dt / 130);
      escAnillo += (objAnillo - escAnillo) * kS;
      escEstrella += (objEstrella - escEstrella) * kS;
      opHalo += (objHalo - opHalo) * kS;

      // Gira siempre despacio; sobre algo importante acelera. La velocidad del
      // mouse le suma una inclinación, que es lo que la hace sentir con peso.
      giro += (sobreFuerte ? 0.09 : 0.022) * dt;
      const inclina = Math.max(-14, Math.min(14, vx * 0.55));

      estrella.style.transform =
        `translate3d(${e.x}px, ${e.y}px, 0) translate(-50%, -50%) ` +
        `rotate(${giro + inclina}deg) scale(${escEstrella})`;
      anillo.style.transform =
        `translate3d(${a.x}px, ${a.y}px, 0) translate(-50%, -50%) scale(${escAnillo})`;
      halo.style.transform =
        `translate3d(${h.x}px, ${h.y}px, 0) translate(-50%, -50%) scale(${0.9 + opHalo * 0.8})`;
      halo.style.opacity = visible ? String(opHalo * 0.9) : "0";
      halo.dataset.fuerte = String(sobreFuerte);
      // El anillo se adelgaza al abrirse: un aro grueso y grande tapa el
      // contenido, uno fino a la misma escala se lee como un encuadre.
      anillo.style.borderWidth = escAnillo > 1.6 ? "1px" : "1.5px";

      raf = requestAnimationFrame(loop);
    };

    document.documentElement.classList.add("smooth-cursor-on");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    // Al salir a otra pestaña el reloj se corta: sin esto vuelve con un salto.
    const onBlur = () => (ultimo = 0);
    window.addEventListener("blur", onBlur);
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("smooth-cursor-on");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onBlur);
      cancelAnimationFrame(raf);
      document.querySelectorAll(".cursor-spark").forEach((n) => n.parentElement?.remove());
    };
  }, []);

  return (
    <>
      {/* Halo — la capa más lenta. Solo se ve sobre lo importante. */}
      <div
        ref={haloRef}
        aria-hidden="true"
        className="cursor-halo smooth-cursor pointer-events-none fixed left-0 top-0 z-[9997] h-16 w-16 rounded-full border border-white/50 opacity-0"
      />
      {/* Anillo — el que reacciona a lo que hay debajo. */}
      <div
        ref={anilloRef}
        aria-hidden="true"
        className="smooth-cursor pointer-events-none fixed left-0 top-0 z-[9998] h-9 w-9 rounded-full border-[1.5px] border-white opacity-0 transition-opacity duration-300"
      />
      {/* Estrella — la punta. El mix-blend-difference del `smooth-cursor` la
          invierte contra el fondo, así se ve igual sobre secciones claras y
          oscuras sin tener que saber en cuál está. */}
      <div
        ref={estrellaRef}
        aria-hidden="true"
        className="smooth-cursor pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 transition-opacity duration-300"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="block">
          <path d={ESTRELLA} />
        </svg>
      </div>
    </>
  );
}
