"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ManifestoLogo } from "@/components/icons/ManifestoLogo";
import { NAV_LINKS } from "@/lib/constants";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /**
   * En qué página estamos: la del menú que coincide con la ruta va en negrita.
   * "/" (Inicio) solo coincide exacto; las demás también cuando la ruta es una
   * hija (p. ej. /proyectos/algun-caso resalta "Proyectos").
   */
  const esActivo = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  // cuando el menu esta abierto bloqueo el scroll del fondo y dejo cerrar con Escape
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // si agrandan la ventana hasta desktop cierro el menu para que no quede colgado
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <header
        /* La barra SIEMPRE está visible (fija arriba), en todas las páginas y
           también sobre el hero: así el visitante puede ir a cualquier sección
           en cualquier momento sin tener que hacer scroll para que aparezca.

           Blanco sólido, sin efecto vidrio: el backdrop-blur dejaba pasar en
           borroso lo que hubiera debajo, y sobre el portafolio o el hero eso
           ensuciaba la barra con las imágenes que iban pasando. Sólido queda
           siempre igual y el contenido se corta limpio contra el borde. */
        className="fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-ink-900/[0.09] bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[0.55rem]"
        role="banner"
      >
        {/* IZQUIERDA — en escritorio los enlaces del menú; en celular la
            hamburguesa. El isotipo se movió al centro. */}
        <div className="flex items-center">
          <nav
            aria-label="Principal"
            className="hidden items-center gap-5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-500 lg:inline-flex"
          >
            {NAV_LINKS.map((link, i) => {
              const activo = esActivo(link.href);
              return (
              <span key={link.href} className="inline-flex items-center gap-5">
                {/* Subrayado que crece desde la izquierda. Un cambio de color
                    a secas se pierde en una barra translúcida; la línea da la
                    respuesta sin subir el peso visual del enlace.

                    La página en la que estamos va en negrita y en tinta plena;
                    las demás quedan en el gris normal. */}
                <Link
                  href={link.href}
                  aria-current={activo ? "page" : undefined}
                  className={`group relative py-1 transition-colors duration-300 hover:text-ink-900 ${
                    activo ? "font-bold text-ink-900" : ""
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-ink-900 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  />
                </Link>
                {i < NAV_LINKS.length - 1 && (
                  <span className="inline-block h-[2px] w-[2px] rounded-full bg-ink-300" />
                )}
              </span>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="relative z-50 grid h-11 w-11 place-items-center rounded-full transition-colors duration-200 hover:bg-ink-900/5 lg:hidden"
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 block h-[2px] w-6 rounded-full bg-ink-900 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? "top-[7px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] block h-[2px] w-6 rounded-full bg-ink-900 transition-all duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-[2px] w-6 rounded-full bg-ink-900 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? "top-[7px] -rotate-45" : "top-[14px]"
                }`}
              />
            </span>
          </button>
        </div>

        {/* CENTRO — isotipo de Manifesto. */}
        <Link
          href="/"
          aria-label="Manifesto — Inicio"
          onClick={() => setOpen(false)}
          className="inline-flex size-10 items-center justify-center justify-self-center text-ink-900"
        >
          <ManifestoLogo size={38} />
        </Link>

        {/* DERECHA — botón Hablemos, visible también en celular. Mientras el
            menú móvil está abierto se esconde (ahí queda el del overlay). */}
        <div className="flex items-center justify-end">
          <Link
            href="/#contacto"
            onClick={() => setOpen(false)}
            /* El puntero pasa a estrella acá: es la acción de la barra. */
            data-cursor="estrella"
            className={`group relative items-center gap-2 overflow-hidden rounded-pill border border-space-slate bg-space-slate px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-paper-bone transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-ink-900 lg:px-4 lg:py-2 ${
              open ? "hidden lg:inline-flex" : "inline-flex"
            }`}
          >
            {/* El relleno sube desde abajo en vez de cambiar de color de un
                frame al otro: es la diferencia entre un botón y un botón de
                estudio. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-bottom scale-y-0 bg-paper-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
            />
            <span className="relative">Hablemos</span>
            <span className="relative font-mono transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
              ↗
            </span>
          </Link>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-paper-bone transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <nav
          aria-label="Menú"
          className="relative flex h-full flex-col justify-center gap-1 px-[clamp(1.5rem,7vw,4rem)]"
        >
          {NAV_LINKS.map((link, i) => {
            const activo = esActivo(link.href);
            return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              aria-current={activo ? "page" : undefined}
              style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
              className={`w-fit font-display text-[clamp(2.5rem,11vw,4.5rem)] leading-[1.15] tracking-[-0.03em] text-ink-900 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-accent-clay ${
                activo ? "font-bold" : "font-medium"
              } ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
            >
              {link.label}
            </Link>
            );
          })}

          <Link
            href="/#contacto"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            style={{ transitionDelay: open ? `${120 + NAV_LINKS.length * 55}ms` : "0ms" }}
            className={`mt-8 inline-flex w-fit items-center gap-2 rounded-pill border border-space-slate bg-space-slate px-6 py-3 font-display text-lg font-medium text-paper-bone transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-paper-bone hover:text-ink-900 ${
              open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            Hablemos
            <span className="font-mono">↗</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
