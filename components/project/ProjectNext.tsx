import Link from "next/link";
import Image from "next/image";
import { projects } from "@/data/projects";
import type { Project } from "@/types/project";

interface ProjectNextProps {
  project: Project;
}

export function ProjectNext({ project }: ProjectNextProps) {
  const next = projects.find((p) => p.slug === project.nextSlug);
  if (!next) return null;

  return (
    <section className="bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,8vw,8rem)]">
      <div className="mx-auto max-w-[1280px]">
        <Link
          href={`/proyectos/${next.slug}`}
          className="group relative flex min-h-[clamp(340px,42vw,520px)] items-end overflow-hidden rounded-tile bg-ink-900"
        >
          <Image
            src={next.coverImage}
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [filter:saturate(0.68)_brightness(0.85)] group-hover:scale-[1.03] group-hover:[filter:saturate(0.9)_brightness(0.95)]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="relative z-10 flex w-full flex-col gap-3 p-[clamp(1.5rem,3vw,3rem)] text-paper-bone">
            <span className="font-mono text-xs uppercase tracking-[0.22em] opacity-80">
              siguiente · {next.meta.year}
            </span>
            <h3 className="m-0 font-display text-[clamp(2rem,5vw,5rem)] font-normal leading-[0.95] tracking-[-0.035em]">
              {next.name}
              <span className="text-accent-clay">.</span>
            </h3>
          </div>
          <span className="absolute right-[clamp(1.5rem,3vw,3rem)] top-[clamp(1.5rem,3vw,3rem)] z-10 grid h-[64px] w-[64px] place-items-center rounded-full bg-paper-bone font-mono text-xl text-ink-900 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        </Link>
      </div>
    </section>
  );
}
