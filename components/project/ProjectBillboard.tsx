import type { Project } from "@/types/project";

interface ProjectBillboardProps {
  project: Project;
}

export function ProjectBillboard({ project }: ProjectBillboardProps) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 px-[clamp(1rem,3vw,3rem)] py-[clamp(5rem,10vw,10rem)] text-paper-bone">
      <div className="mx-auto max-w-[1280px]">
        <p className="m-0 max-w-[24ch] text-balance font-display text-[clamp(2.25rem,5.5vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.035em]">
          {project.billboard.lines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              <span className={i === 1 ? "text-accent-clay" : undefined}>{line}</span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
