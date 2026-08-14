import type { Metadata } from "next";
import Link from "next/link";
import { TitleReveal } from "@/components/ui/TitleReveal";
import { ManifestoLogo } from "@/components/icons/ManifestoLogo";

/* -------------------------------------------------------------------------- */
/*  404 — página no encontrada                                                 */
/*                                                                            */
/*  App Router la muestra sola en cualquier ruta que no exista (y con el       */
/*  estado HTTP 404 correcto). Renderiza dentro del layout, así que conserva   */
/*  el header y el footer del sitio: acá solo va la sección del medio.         */
/*                                                                            */
/*  Va en el azul astral de la marca (space-slate), no en blanco: un 404 es    */
/*  un momento, y el fondo oscuro con la estrella al fondo lo trata como tal,  */
/*  en la misma clave que el hero. Los gestos son los de siempre —el titular   */
/*  que se asoma, el punto en corinto, el botón cuyo relleno sube— para que    */
/*  el error se sienta parte del sitio y no una pantalla de sistema.           */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: "Página no encontrada",
  // No tiene sentido que un 404 entre al índice de los buscadores.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-space-slate px-[clamp(1rem,3vw,3rem)] pb-[clamp(4rem,8vw,7rem)] pt-[clamp(8rem,14vw,12rem)]">
      {/* La estrella del estudio, enorme y apenas visible, girando lento: el
          mismo gesto astral del hero pero en voz baja. Decorativa (el logo ya
          trae aria-hidden), así que no la lee el lector de pantalla. */}
      <ManifestoLogo
        size={620}
        className="animate-spin-slow pointer-events-none absolute -right-[16vw] top-1/2 -translate-y-1/2 select-none text-space-star/[0.05]"
      />

      <div className="relative mx-auto w-full max-w-[1280px]">
        <span className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-px w-[clamp(1.5rem,4vw,3.5rem)] bg-space-star/30"
          />
          <span className="font-mono text-xs uppercase tracking-kicker text-space-star/70">
            Error 404
          </span>
        </span>

        {/* El número enorme en extralight es el gesto, no el mensaje: pesa
            visualmente pero el que habla es el titular de abajo. */}
        <p className="mt-6 font-display text-[clamp(6rem,26vw,20rem)] font-extralight leading-[0.82] tracking-[-0.05em] text-paper-bone">
          404
        </p>

        <h1 className="mt-2 max-w-[16ch] font-display text-display-2xl font-normal text-paper-bone">
          <TitleReveal text="Te saliste del mapa" stagger={70} />
          <span className="text-accent-corinto-on-dark">.</span>
        </h1>

        <p className="mt-6 max-w-[46ch] text-lead text-space-star/75">
          El enlace que seguiste no lleva a ninguna página, o dejó de existir.
          Vuelve al inicio y te orientamos desde ahí.
        </p>

        <div className="mt-[clamp(2rem,4vw,3rem)] flex flex-wrap items-center gap-x-8 gap-y-4">
          {/* Primario: el relleno sube desde abajo, como en todo el sitio, pero
              en claro para pesar sobre el fondo oscuro. Al llenarse pasa a
              corinto y el texto se aclara. */}
          <Link
            href="/"
            data-cursor="estrella"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-pill border border-paper-bone bg-paper-bone px-7 py-3.5 font-mono text-xs uppercase tracking-kicker text-ink-900 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-paper-bone"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-bottom scale-y-0 bg-space-maroon transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
            />
            <span className="relative">Volver al inicio</span>
            <span className="relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
              →
            </span>
          </Link>

          {/* Secundario: la regla que crece bajo el enlace, el mismo gesto de
              las fichas de proyecto y de los frentes de servicios. */}
          <Link
            href="/proyectos"
            data-cursor="estrella"
            className="group relative py-1 font-mono text-xs uppercase tracking-kicker text-space-star/80 transition-colors duration-300 hover:text-paper-bone"
          >
            Ver proyectos
            <span
              aria-hidden="true"
              className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-paper-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
