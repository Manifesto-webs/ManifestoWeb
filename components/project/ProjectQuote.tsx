import type { Project } from "@/types/project";

interface ProjectQuoteProps {
  project: Project;
}

export function ProjectQuote({ project }: ProjectQuoteProps) {
  if (!project.quote) return null;
  return (
    <section className="bg-paper-sage px-[clamp(1rem,3vw,3rem)] py-[clamp(5rem,10vw,10rem)]">
      <div className="mx-auto max-w-[1080px]">
        <blockquote className="m-0 border-l-[3px] border-accent-clay pl-[clamp(1.25rem,2.5vw,2.5rem)]">
          <p className="m-0 font-display text-display-lg font-normal text-ink-900 before:content-['“'] before:text-accent-clay/60 after:content-['”'] after:text-accent-clay/60">
            {project.quote.text}
          </p>
          <footer className="mt-6 flex flex-col gap-1 font-mono text-xs uppercase tracking-kicker text-ink-700">
            <span>{project.quote.attrName}</span>
            <span className="text-ink-500">{project.quote.attrRole}</span>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
