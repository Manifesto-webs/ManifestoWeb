"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/types/project";
import { GALLERY_SPAN_CLASSES } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Galería del caso                                                           */
/*                                                                            */
/*  Las fotos se muestran tal cual, con su color original y sin filtros: son   */
/*  <img> del navegador. Antes se redibujaban en WebGL y el canvas las dejaba   */
/*  lavadas/oscuras según la GPU; por eso ya no se usa three.js acá.           */
/*                                                                            */
/*  Animaciones (solo CSS, transform y opacidad): al entrar la galería en       */
/*  pantalla, los tiles suben en cascada; en hover la foto crece un pelo.      */
/*  Los tiles que ya están a la vista al cargar no se esconden (sin parpadeo)  */
/*  y con "reducir movimiento" no se anima nada. Sin textos encima de la foto: */
/*  el rótulo de cada pieza va en su alt.                                      */
/*                                                                            */
/*  Columnas: 6 en escritorio, 2 en tablet (< lg) y 1 en celular (< sm). El     */
/*  corte de tablet tiene que ser `lg`, el mismo que usan los spans de         */
/*  GALLERY_SPAN_CLASSES; si no, entre 768 y 1023 px los tiles quedaban en 1   */
/*  de 6 columnas (tiras de ~110 px).                                          */
/* -------------------------------------------------------------------------- */

interface ProjectGalleryProps {
  project: Project;
}

/** "inicial": como llega del servidor (visible). "espera": tapada, fuera de
 *  pantalla. "visto": entra en cascada. */
type Fase = "inicial" | "espera" | "visto";

export function ProjectGallery({ project }: ProjectGalleryProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [fase, setFase] = useState<Fase>("inicial");

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Ya a la vista al cargar: se queda como está.
    const r = grid.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.88) return;

    setFase("espera");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setFase("visto");
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.02 },
    );
    io.observe(grid);
    return () => io.disconnect();
  }, [project.slug]);

  return (
    <section className="bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,8vw,8rem)]">
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-[clamp(2rem,4vw,4rem)] flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-kicker text-ink-700">
            selección visual
          </span>
          <h2 className="m-0 font-display text-display-xl font-normal text-ink-900">
            Aplicaciones del sistema.
          </h2>
        </header>

        <div
          ref={gridRef}
          className="grid auto-rows-[minmax(240px,auto)] grid-cols-6 gap-[clamp(0.5rem,0.8vw,1rem)] [grid-auto-flow:dense] max-lg:grid-cols-2 max-sm:grid-cols-1"
        >
          {project.gallery.map((img, i) => (
            <div
              key={img.src}
              className={`group relative isolate overflow-hidden rounded-tile bg-paper-ice transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                fase === "espera" ? "translate-y-8 opacity-0" : "translate-y-0 opacity-100"
              } ${GALLERY_SPAN_CLASSES[img.span]}`}
              // Cascada: cada tile entra un instante después del anterior.
              style={{ transitionDelay: fase === "visto" ? `${i * 90}ms` : "0ms" }}
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                quality={90}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                style={{ objectPosition: img.position ?? "center", background: img.bg }}
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
