"use client";

import { Fragment, useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Título que entra palabra por palabra                                       */
/*                                                                            */
/*  Cada palabra vive en una ventanita con overflow oculto y sube desde        */
/*  abajo, escalonada. El efecto es que el titular "se asoma" en vez de        */
/*  aparecer de golpe.                                                        */
/*                                                                            */
/*  Todo con <span> y nada de <div>: esto se usa dentro de encabezados y       */
/*  párrafos, y un <div> ahí adentro rompe la hidratación.                     */
/*                                                                            */
/*  Con prefers-reduced-motion el texto ya sale puesto, sin animación.         */
/* -------------------------------------------------------------------------- */

interface TitleRevealProps {
  /** El texto. Se parte por espacios; cada palabra entra por separado. */
  text: string;
  /** Retraso inicial en ms, para escalonar contra otros elementos. */
  delay?: number;
  /** Milisegundos entre una palabra y la siguiente. */
  stagger?: number;
  className?: string;
  /**
   * Palabra a resaltar (una sola). Se compara sin acentos, mayúsculas ni
   * puntuación, así que `accent="decisión"` alcanza "decisión." al final de la
   * frase. La palabra entra con la misma máscara; el resalte va en un span
   * interno propio, aparte del que hace el revelado.
   */
  accent?: string;
  /** Clase para la palabra resaltada (p. ej. una animación de brillo/expansión). */
  accentClassName?: string;
}

/** Normaliza para comparar: minúsculas, sin acentos y sin puntuación. */
const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "");

export function TitleReveal({
  text,
  delay = 0,
  stagger = 55,
  className = "",
  accent,
  accentClassName = "",
}: TitleRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    io.observe(el);

    // Red de seguridad. Acá el texto arranca invisible, así que si el
    // observador no dispara —pasó antes en "Qué creemos"— el titular no se
    // vería nunca. A los 1.2 s se muestra igual.
    const fb = window.setTimeout(() => setShown(true), 1200);

    return () => {
      io.disconnect();
      clearTimeout(fb);
    };
  }, []);

  const palabras = text.split(" ");
  const accentNorm = accent ? normalizar(accent) : "";

  return (
    <span ref={ref} className={className}>
      {palabras.map((palabra, i) => {
        const resaltada = !!accentNorm && normalizar(palabra) === accentNorm;
        return (
          <Fragment key={`${palabra}-${i}`}>
            {/* La ventana que recorta. El padding-bottom evita que las colas de
                la g y la j queden cortadas por el propio overflow.

                En la palabra resaltada NO se recorta: si no, la animación de
                expansión (scale) le cortaría el borde al crecer. */}
            <span
              className={`inline-flex pb-[0.12em] align-bottom${resaltada ? "" : " overflow-hidden"}`}
            >
              <span
                className="inline-block will-change-transform"
                style={{
                  transform: shown ? "translateY(0)" : "translateY(105%)",
                  opacity: shown ? 1 : 0,
                  transition:
                    "transform 900ms cubic-bezier(0.16,1,0.3,1), opacity 700ms cubic-bezier(0.16,1,0.3,1)",
                  transitionDelay: `${delay + i * stagger}ms`,
                }}
              >
                {resaltada ? (
                  <span className={accentClassName}>{palabra}</span>
                ) : (
                  palabra
                )}
              </span>
            </span>
            {i < palabras.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </span>
  );
}
