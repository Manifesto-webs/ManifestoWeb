import Link from "next/link";
import Image from "next/image";
import { projects } from "@/data/projects";

/**
 * Bento del homepage — 6 tiles con fotos reales.
 * Aritmética del grid: 6 cols × 4 rows = 24 celdas exactas.
 * Cada tile respeta la aritmética (a=8 + bb=4 + cc=3 + dd=3 + ee=3 + ff=3 = 24).
 */

// Los 6 tiles del bento en orden. Modificá acá si querés cambiar el layout
// o los proyectos destacados.
const TILE_LAYOUT: Array<{
  slug: string;
  span: string;
  category: string;
}> = [
  {
    slug: "situa",
    span: "col-span-4 row-span-2 min-h-[580px] max-lg:col-span-2 max-lg:min-h-[420px] max-sm:col-span-1 max-sm:min-h-[280px]",
    category: "2026 · identidad de evento",
  },
  {
    slug: "bore",
    span: "col-span-2 row-span-2 min-h-[580px] max-lg:col-span-1 max-lg:row-span-1 max-lg:min-h-[320px] max-sm:col-span-1 max-sm:min-h-[280px]",
    category: "2022 · identidad corporativa",
  },
  {
    slug: "el-barretal",
    span: "col-span-3 row-span-1 min-h-[340px] max-lg:col-span-1 max-lg:min-h-[320px] max-sm:col-span-1 max-sm:min-h-[280px]",
    category: "2023 · sistema de marca",
  },
  {
    slug: "ark",
    span: "col-span-3 row-span-1 min-h-[340px] max-lg:col-span-1 max-lg:min-h-[320px] max-sm:col-span-1 max-sm:min-h-[280px]",
    category: "2023 · logotipo + sistema",
  },
  {
    slug: "decima",
    span: "col-span-3 row-span-1 min-h-[340px] max-lg:col-span-1 max-lg:min-h-[320px] max-sm:col-span-1 max-sm:min-h-[280px]",
    category: "2022 · identidad premium",
  },
  {
    slug: "lando",
    span: "col-span-3 row-span-1 min-h-[340px] max-lg:col-span-1 max-lg:min-h-[320px] max-sm:col-span-1 max-sm:min-h-[280px]",
    category: "2023 · logotipo textil",
  },
];

export function Bento() {
  return (
    <section
      id="trabajo"
      className="bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,10vw,12rem)] pb-[clamp(2.5rem,5vw,6rem)]"
    >
      <div className="mb-[clamp(2.5rem,4vw,4rem)] flex flex-col gap-3">
        <h2 className="m-0 font-display text-display-2xl font-normal text-ink-900">
          Trabajo seleccionado.
        </h2>
      </div>

      <div className="grid auto-rows-[minmax(260px,auto)] grid-cols-6 gap-[clamp(0.75rem,1.2vw,1.2rem)] [grid-auto-flow:dense] max-lg:grid-cols-2 max-sm:grid-cols-1">
        {TILE_LAYOUT.map((tile) => {
          const project = projects.find((p) => p.slug === tile.slug);
          if (!project) return null;

          return (
            <Link
              key={tile.slug}
              href={`/proyectos/${tile.slug}`}
              className={`group relative isolate flex flex-col overflow-hidden rounded-tile bg-ink-900 ${tile.span}`}
            >
              <Image
                src={project.coverImage}
                alt={project.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center transition-[transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [filter:saturate(0.72)_brightness(0.97)_contrast(0.96)] group-hover:scale-[1.04] group-hover:[filter:saturate(0.9)_brightness(1)_contrast(1)]"
              />
              <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

              {/* Crece con scale (68→82px = 1.21) en vez de animar width/height:
                  el compositor lo resuelve sin recalcular layout en cada frame. */}
              <div className="absolute right-4 top-4 z-[3] grid size-[68px] place-items-center rounded-full bg-ink-900 font-mono text-xs uppercase tracking-kicker text-paper-bone transition-[transform,background-color] duration-200 ease-out group-hover:scale-[1.21] group-hover:bg-accent-clay">
                <span className="flex flex-col items-center gap-0.5 leading-none">
                  ver
                  <span className="text-base tracking-normal">→</span>
                </span>
              </div>

              <div className="absolute inset-x-4 bottom-4 z-[2] font-mono text-xs uppercase tracking-kicker text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] max-sm:inset-x-[1.1rem] max-sm:bottom-4">
                {tile.category}
                <strong className="mt-1 block font-display text-display-md font-medium normal-case text-white max-sm:text-[1.25rem]">
                  {project.name}
                </strong>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
