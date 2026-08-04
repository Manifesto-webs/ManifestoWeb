"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ManifestoLogo } from "@/components/icons/ManifestoLogo";
import { NAV_LINKS } from "@/lib/constants";

export function Nav() {
  const [open, setOpen] = useState(false);

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
        className="fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-black/[0.08] bg-paper-bone/80 px-[clamp(1rem,3vw,3rem)] py-[1.1rem] backdrop-blur-lg backdrop-saturate-150"
        role="banner"
      >
        <Link
          href="/"
          aria-label="Manifesto — inicio"
          onClick={() => setOpen(false)}
          className="inline-flex size-12 items-center justify-center"
        >
          {/* Solo isotipo, en un área cuadrada de 48×48. El nombre ya lo
              cubre el aria-label del enlace, así que no hace falta el
              wordmark para que sea accesible. */}
          <ManifestoLogo size={48} />
        </Link>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-4 font-display text-base tracking-[-0.005em] text-ink-700 lg:inline-flex"
        >
          {NAV_LINKS.map((link, i) => (
            <span key={link.href} className="inline-flex items-center gap-4">
              <Link
                href={link.href}
                className="transition-colors duration-150 hover:text-ink-900"
              >
                {link.label}
              </Link>
              {i < NAV_LINKS.length - 1 && (
                <span className="inline-block h-[3px] w-[3px] rounded-full bg-ink-300" />
              )}
            </span>
          ))}
        </nav>

        <div className="col-start-3 flex items-center justify-end gap-2">
          <Link
            href="/#contacto"
            className="group hidden items-center gap-2 rounded-pill bg-paper-sage px-4 py-2.5 font-display text-base font-medium text-ink-900 transition-colors duration-300 hover:bg-ink-900 hover:text-paper-bone lg:inline-flex"
          >
            Hablemos
            <span className="font-mono transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">↗</span>
          </Link>

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
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
              className={`w-fit font-display text-[clamp(2.5rem,11vw,4.5rem)] font-medium leading-[1.15] tracking-[-0.03em] text-ink-900 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-accent-clay ${
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/#contacto"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            style={{ transitionDelay: open ? `${120 + NAV_LINKS.length * 55}ms` : "0ms" }}
            className={`mt-8 inline-flex w-fit items-center gap-2 rounded-pill bg-ink-900 px-6 py-3 font-display text-lg font-medium text-paper-bone transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
