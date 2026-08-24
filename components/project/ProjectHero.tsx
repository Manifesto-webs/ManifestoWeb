import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/project";
import { SpaceBackdrop } from "@/components/ui/SpaceBackdrop";
import { TitleReveal } from "@/components/ui/TitleReveal";

interface ProjectHeroProps {
  project: Project;
}

/* -------------------------------------------------------------------------- */
/*  Portada del caso — lo primero que se ve al abrir un proyecto               */
/*                                                                            */
/*  Un case-study editorial sobre fondo astral (blanco con estrellas,          */
/*  destellos y anillos orbitales: la esencia Manifesto, no un bloque plano).  */
/*  Muestra lo esencial de un vistazo —año, nombre, especialidad, la foto y    */
/*  una descripción corta— antes de entrar al desarrollo largo del caso.       */
/* -------------------------------------------------------------------------- */

export function ProjectHero({ project }: ProjectHeroProps) {
  const { name, meta, lead, coverImage } = project;

  return (
    <section className="relative isolate overflow-hidden bg-paper-bone px-[clamp(1rem,3vw,3rem)] pb-[clamp(3rem,6vw,6rem)] pt-[clamp(6.5rem,10vw,9.5rem)]">
      {/* Fondo galáctico sobre blanco: estrellas + destellos + anillos. */}
      <SpaceBackdrop variant="paper" className="opacity-70" />

      <div className="relative mx-auto max-w-[1280px]">
        {/* ── Barra superior: volver al índice + año ─────────────────────── */}
        <div className="flex items-center justify-between gap-4">
          {/* Vuelve a /proyectos, no al ancla del inicio: desde un caso,
              "volver" devuelve al listado del que se salió. */}
          <Link
            href="/proyectos"
            data-cursor="estrella"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-kicker text-ink-700 transition-colors hover:text-ink-900"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            Proyectos
          </Link>
          <span className="font-mono text-xs uppercase tracking-kicker text-ink-500">
            Año —{" "}
            <span className="tabular-nums text-ink-900">{meta.year}</span>
          </span>
        </div>

        {/* ── Especialidad (kicker) + nombre ─────────────────────────────── */}
        <div className="mt-[clamp(2.5rem,6vw,5rem)]">
          <span className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-[clamp(1.5rem,4vw,3.5rem)] bg-ink-900/30"
            />
            <span className="font-mono text-xs uppercase tracking-kicker text-ink-700">
              {meta.services}
            </span>
          </span>

          <h1 className="mt-5 max-w-[16ch] font-display text-display-3xl font-normal text-ink-900">
            <TitleReveal text={name} stagger={70} />
            <span className="text-accent-corinto">.</span>
          </h1>
        </div>

        {/* ── La foto principal, enmarcada ───────────────────────────────── */}
        <div className="relative mt-[clamp(2rem,4.5vw,3.75rem)] aspect-[16/9] w-full overflow-hidden rounded-tile bg-ink-900/5 ring-1 ring-inset ring-ink-900/10 max-md:aspect-[4/5]">
          <Image
            src={coverImage}
            alt={`${name} — imagen principal`}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover [filter:saturate(0.9)]"
          />
        </div>

        {/* ── Ficha: cliente · rol · sobre el proyecto ───────────────────── */}
        <dl className="mt-[clamp(2rem,4vw,3.5rem)] grid gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-8 border-t border-ink-900/12 pt-[clamp(1.5rem,3vw,2.5rem)] md:grid-cols-[1fr_1fr_2fr]">
          <Dato label="Cliente" value={meta.client} />
          <Dato label="Rol" value={meta.role} />
          <div>
            <dt className="font-mono text-xs uppercase tracking-kicker text-ink-500">
              (Sobre el proyecto)
            </dt>
            <dd className="m-0 mt-3 max-w-[62ch] text-lead text-ink-700 text-pretty">
              {lead}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function Dato({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-kicker text-ink-500">
        {label}
      </dt>
      <dd className="m-0 mt-3 font-display text-display-md font-normal text-ink-900 text-pretty">
        {value}
      </dd>
    </div>
  );
}
