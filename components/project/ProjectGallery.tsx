import Image from "next/image";
import type { Project } from "@/types/project";
import { GALLERY_SPAN_CLASSES } from "@/lib/utils";

interface ProjectGalleryProps {
  project: Project;
}

export function ProjectGallery({ project }: ProjectGalleryProps) {
  return (
    <section className="bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,8vw,8rem)]">
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-[clamp(2rem,4vw,4rem)] flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-ink-700">
            selección visual
          </span>
          <h2 className="m-0 font-display text-[clamp(1.75rem,3.4vw,3.4rem)] font-normal leading-[1.05] tracking-[-0.025em] text-ink-900">
            Aplicaciones del sistema.
          </h2>
        </header>

        <div className="grid auto-rows-[minmax(240px,auto)] grid-cols-6 gap-[clamp(0.5rem,0.8vw,1rem)] [grid-auto-flow:dense] max-md:grid-cols-2 max-sm:grid-cols-1">
          {project.gallery.map((img, i) => (
            <div
              key={i}
              style={img.bg ? { backgroundColor: img.bg } : undefined}
              className={`relative isolate overflow-hidden rounded-tile bg-paper-sage ${GALLERY_SPAN_CLASSES[img.span]}`}
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectPosition: img.position ?? "center" }}
                className="object-cover [filter:saturate(0.72)_brightness(0.98)]"
              />
              {img.label && (
                <span className="absolute inset-x-4 bottom-4 z-[2] font-mono text-xs uppercase tracking-[0.18em] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]">
                  {img.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
