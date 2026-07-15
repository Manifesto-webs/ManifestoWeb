import type { Project } from "@/types/project";

interface ProjectContextProps {
  project: Project;
}

export function ProjectContext({ project }: ProjectContextProps) {
  return (
    <section className="bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,8vw,8rem)]">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-[clamp(2rem,5vw,5rem)] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex max-w-[62ch] flex-col gap-6">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-ink-700">
            contexto
          </span>
          <h2 className="m-0 whitespace-pre-line font-display text-[clamp(1.75rem,3.4vw,3.4rem)] font-normal leading-[1.05] tracking-[-0.025em] text-ink-900 text-pretty">
            {project.context.title}
          </h2>
          {project.context.paragraphs.map((p, i) => (
            <p key={i} className="text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.65] text-ink-700">
              {p}
            </p>
          ))}
        </div>

        <aside className="sticky top-24 flex flex-col gap-4 max-md:static">
          {project.context.aside.map((item, i) => (
            <div
              key={i}
              className={`flex flex-col gap-2 rounded-tile p-6 ${
                i % 2 === 0 ? "bg-paper-sage" : "bg-paper-ice"
              }`}
            >
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] opacity-70">
                {item.label}
              </span>
              <span className="font-display text-[clamp(1.1rem,1.4vw,1.4rem)] font-medium leading-[1.2] tracking-[-0.02em]">
                {item.value}
              </span>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
