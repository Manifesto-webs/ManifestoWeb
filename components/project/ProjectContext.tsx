import type { Project } from "@/types/project";
import { Reveal } from "@/components/ui/Reveal";

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

        {/* Ficha del proyecto — texto, no cards. Cada dato entra escalonado al
            aparecer en cuadro (Reveal) y va separado por una línea fina que se
            recorre al pasar el mouse; el dato se desplaza apenas a la derecha.
            Es el mismo lenguaje de las fichas de /proyectos y de los frentes de
            servicios: la obra manda, la ficha acompaña. */}
        <aside className="md:sticky md:top-28">
          <span className="font-mono text-xs uppercase tracking-kicker text-ink-500">
            (Ficha)
          </span>
          <dl className="m-0 mt-6 flex flex-col">
            {project.context.aside.map((item, i) => (
              <Reveal key={i} delay={i * 90}>
                <div className="group border-t border-ink-900/12 py-[clamp(1.1rem,1.8vw,1.6rem)]">
                  {/* La línea fina que se recorre al pasar el mouse. */}
                  <span
                    aria-hidden="true"
                    className="mb-4 block h-px w-full origin-left scale-x-0 bg-ink-900 transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  />
                  <dt className="font-mono text-[0.7rem] uppercase tracking-kicker text-ink-500">
                    {item.label}
                  </dt>
                  <dd className="m-0 mt-2 font-display text-display-md font-normal text-ink-900 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
                    {item.value}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}
