import type { Project } from "@/types/project";

interface ProjectContextProps {
  project: Project;
}

export function ProjectContext({ project }: ProjectContextProps) {
  return (
    <section className="bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,8vw,8rem)]">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-[clamp(2rem,5vw,5rem)] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex max-w-[62ch] flex-col gap-6">
          <span className="font-mono text-xs uppercase tracking-kicker text-ink-700">
            contexto
          </span>
          <h2 className="m-0 whitespace-pre-line font-display text-display-xl font-normal text-ink-900 text-pretty">
            {project.context.title}
          </h2>
          {project.context.paragraphs.map((p, i) => (
            <p key={i} className="text-body-sm text-ink-700">
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
              <span className="font-mono text-[0.7rem] uppercase tracking-kicker opacity-70">
                {item.label}
              </span>
              <span className="font-display text-display-md font-medium">
                {item.value}
              </span>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
