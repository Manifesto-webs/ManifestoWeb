import Link from "next/link";
import type { Project } from "@/types/project";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <section className="bg-paper-bone px-[clamp(1rem,3vw,3rem)] pt-[clamp(6.5rem,10vw,9rem)] pb-[clamp(3rem,6vw,6rem)]">
      <div className="mx-auto grid max-w-[1280px] gap-[clamp(1.5rem,3vw,3rem)]">
        <Link
          href="/#trabajo"
          className="group inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-kicker text-ink-700 transition-colors hover:text-ink-900"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          proyectos
        </Link>

        <div className="grid grid-cols-1 items-end gap-[clamp(1.5rem,3vw,3rem)] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-kicker text-ink-500">
              {project.meta.services}
            </span>
            <h1 className="m-0 font-display text-display-3xl font-normal text-ink-900">
              {project.name}<span className="text-accent-clay">.</span>
            </h1>
            <p className="max-w-[52ch] text-lead text-ink-700">
              {project.lead}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 self-end rounded-tile bg-paper-sage p-6">
            <MetaRow label="cliente" value={project.meta.client} />
            <MetaRow label="año" value={project.meta.year} />
            <MetaRow label="rol" value={project.meta.role} />
          </dl>
        </div>
      </div>
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-mono text-[0.7rem] uppercase tracking-kicker text-ink-700">
        {label}
      </dt>
      <dd className="m-0 font-display text-base font-medium text-ink-900">{value}</dd>
    </div>
  );
}
