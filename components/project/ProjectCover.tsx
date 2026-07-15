import Image from "next/image";
import type { Project } from "@/types/project";

interface ProjectCoverProps {
  project: Project;
}

export function ProjectCover({ project }: ProjectCoverProps) {
  return (
    <section className="bg-paper-bone px-[clamp(1rem,3vw,3rem)] pb-[clamp(3rem,6vw,6rem)]">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-tile bg-ink-100 max-md:aspect-[4/5]">
          <Image
            src={project.coverImage}
            alt={`${project.name} — imagen principal`}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
            className="object-cover object-center [filter:saturate(0.75)_brightness(0.98)]"
          />
        </div>
      </div>
    </section>
  );
}
