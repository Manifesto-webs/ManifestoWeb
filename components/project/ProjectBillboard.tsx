import type { Project } from "@/types/project";

interface ProjectBillboardProps {
  project: Project;
}

export function ProjectBillboard({ project }: ProjectBillboardProps) {
  return (
    <section className="relative isolate overflow-hidden bg-space-slate px-[clamp(1rem,3vw,3rem)] py-[clamp(5rem,10vw,10rem)] text-paper-bone">
      <div className="mx-auto max-w-[1280px]">
        <p className="m-0 max-w-[24ch] text-balance font-display text-display-2xl font-normal">
          {project.billboard.lines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              <span className={i === 1 ? "text-[#d6e2ed]" : undefined}>{line}</span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
