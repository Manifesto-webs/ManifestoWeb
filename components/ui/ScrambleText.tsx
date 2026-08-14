"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

/* -------------------------------------------------------------------------- */
/*  ScrambleText — el texto se desordena y se reordena solo                     */
/*                                                                            */
/*  Inspirado en locomotive.ca: al pasar el mouse cada letra parpadea con      */
/*  glifos al azar y se sacude un poco, y enseguida —de izquierda a derecha—    */
/*  se asienta en la letra correcta. En celular no hay hover, así que también   */
/*  se dispara una vez al entrar en viewport.                                  */
/*                                                                            */
/*  Cómo mantiene el texto real: cada letra vive en su <span data-final="x">    */
/*  con la letra correcta ya puesta. La animación solo cambia el textContent y  */
/*  el transform de esos spans y al final los devuelve a `data-final`. El SSR   */
/*  y los lectores de pantalla ven siempre el texto entero (va aparte en un     */
/*  span sr-only); si hay `prefers-reduced-motion`, nunca se desordena.        */
/* -------------------------------------------------------------------------- */

/** Un tramo de texto con estilo propio (para conservar, p. ej., el color de acento). */
export interface Tramo {
  texto: string;
  style?: CSSProperties;
}

interface ScrambleTextProps {
  /** Texto plano, o tramos con estilo, o un salto de línea con `\n` dentro del texto. */
  children?: string;
  tramos?: Tramo[];
  className?: string;
  /** ms entre que se asienta una letra y la siguiente. */
  paso?: number;
  /** ms de parpadeo de cada letra antes de asentarse. */
  parpadeo?: number;
  /** Dispara también al entrar en viewport (para celular, sin hover). */
  alEntrar?: boolean;
  /** Dispara al pasar el mouse por el ancestro `.group` más cercano (p. ej. un tile). */
  dispararEnGrupo?: boolean;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function ScrambleText({
  children,
  tramos,
  className,
  paso = 32,
  parpadeo = 180,
  alEntrar = true,
  dispararEnGrupo = false,
}: ScrambleTextProps) {
  const lienzoRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);

  const listaTramos: Tramo[] = tramos ?? [{ texto: children ?? "" }];
  const completo = listaTramos.map((t) => t.texto).join("");

  const correr = useCallback(() => {
    const el = lienzoRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letras = Array.from(el.querySelectorAll<HTMLElement>("[data-final]"));
    if (!letras.length) return;

    // Se agrupan las letras por palabra (su <span> padre) y se guarda el índice
    // global de cada una. Se asienta de izquierda a derecha en toda la frase,
    // pero el revoltijo de cada palabra usa SOLO sus propias letras: nunca
    // aparece un carácter que no esté en la palabra.
    const grupos = new Map<HTMLElement, HTMLElement[]>();
    const indice = new Map<HTMLElement, number>();
    letras.forEach((s, i) => {
      indice.set(s, i);
      const padre = s.parentElement as HTMLElement;
      const arr = grupos.get(padre);
      if (arr) arr.push(s);
      else grupos.set(padre, [s]);
    });

    let inicio = 0;
    let ultimoBaraje = 0;
    const tick = (ahora: number) => {
      if (!inicio) inicio = ahora;
      const t = ahora - inicio;
      // Rebarajar cada ~95 ms; entre medio no se toca nada y el transform, que
      // tiene transición, termina de deslizarse. Así se ve suave y no tembloroso.
      const rebarajar = ahora - ultimoBaraje > 95;
      if (rebarajar) ultimoBaraje = ahora;
      let listo = true;

      grupos.forEach((spans) => {
        const sueltas: HTMLElement[] = [];
        spans.forEach((s) => {
          const asientaEn = (indice.get(s) ?? 0) * paso + parpadeo;
          if (t >= asientaEn) {
            const final = s.dataset.final ?? "";
            if (s.textContent !== final) s.textContent = final;
            if (s.style.transform) s.style.transform = "";
          } else {
            sueltas.push(s);
          }
        });

        if (!sueltas.length) return;
        listo = false;
        if (!rebarajar) return;

        // Se barajan las MISMAS letras de las posiciones sueltas y se les da un
        // desplazamiento leve. Al cambiar solo cada ~95 ms y con la transición
        // del transform, las letras se deslizan suave en lugar de temblar.
        const disponibles = sueltas.map((s) => s.dataset.final ?? "");
        for (let a = disponibles.length - 1; a > 0; a--) {
          const b = Math.floor(Math.random() * (a + 1));
          [disponibles[a], disponibles[b]] = [disponibles[b], disponibles[a]];
        }
        sueltas.forEach((s, k2) => {
          s.textContent = disponibles[k2];
          const asientaEn = (indice.get(s) ?? 0) * paso + parpadeo;
          const resto = clamp((asientaEn - t) / asientaEn, 0, 1);
          const dx = (Math.random() - 0.5) * 5 * resto;
          const dy = (Math.random() - 0.5) * 6 * resto;
          const rot = (Math.random() - 0.5) * 6 * resto;
          s.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
        });
      });

      if (!listo) rafRef.current = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [paso, parpadeo]);

  // Disparo al entrar en viewport (una vez).
  useEffect(() => {
    if (!alEntrar) return;
    const el = lienzoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          correr();
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [alEntrar, correr]);

  // Disparo al pasar el mouse por el tile (`.group`) que lo contiene.
  useEffect(() => {
    if (!dispararEnGrupo) return;
    const grupo = lienzoRef.current?.closest(".group");
    if (!grupo) return;
    grupo.addEventListener("mouseenter", correr);
    return () => grupo.removeEventListener("mouseenter", correr);
  }, [dispararEnGrupo, correr]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Se arma agrupando por PALABRA: cada palabra va en un bloque
  // `whitespace-nowrap`, así nunca se parte a la mitad mientras se revuelve. El
  // espacio entre palabras queda FUERA de ese bloque (si no, el navegador lo
  // recorta por ser espacio final de un inline-block y pega dos palabras).
  const nodos: ReactNode[] = [];
  let k = 0;
  listaTramos.forEach((tramo, ti) => {
    let palabra: ReactNode[] = [];
    const cerrarPalabra = () => {
      if (!palabra.length) return;
      nodos.push(
        <span
          key={`w${ti}-${k}`}
          className="inline-block whitespace-nowrap"
          style={tramo.style}
        >
          {palabra}
        </span>,
      );
      palabra = [];
    };
    for (const c of tramo.texto) {
      if (c === "\n") {
        cerrarPalabra();
        nodos.push(<br key={`br${k++}`} />);
      } else if (c === " ") {
        cerrarPalabra();
        nodos.push(
          <span key={`sp${k++}`} style={tramo.style}>
            {" "}
          </span>,
        );
      } else {
        palabra.push(
          <span
            key={`c${k++}`}
            data-final={c}
            className="inline-block"
            // La transición del transform es lo que vuelve suave el efecto: las
            // letras se DESLIZAN a cada nueva posición en vez de saltar.
            style={{
              willChange: "transform",
              transition: "transform 150ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {c}
          </span>,
        );
      }
    }
    cerrarPalabra();
  });

  return (
    <span className={className} onMouseEnter={correr}>
      <span className="sr-only">{completo}</span>
      <span ref={lienzoRef} aria-hidden="true">
        {nodos}
      </span>
    </span>
  );
}
