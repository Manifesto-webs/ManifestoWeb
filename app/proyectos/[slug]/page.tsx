import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectHero } from "@/components/project/ProjectHero";
import { ProjectCover } from "@/components/project/ProjectCover";
import { ProjectContext } from "@/components/project/ProjectContext";
import { ProjectBillboard } from "@/components/project/ProjectBillboard";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectQuote } from "@/components/project/ProjectQuote";
import { ProjectNext } from "@/components/project/ProjectNext";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph, projectSchema } from "@/lib/schema";
import { SITE } from "@/lib/constants";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/** Solo existen los slugs del data file; cualquier otro es un 404 real. */
export const dynamicParams = false;

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  const path = `/proyectos/${project.slug}`;
  // El lead es largo para una meta description; se recorta en el límite de
  // palabra para no dejar la frase cortada a la mitad.
  const description = truncate(project.lead, 155);

  return {
    title: `${project.name} · Caso de branding`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${project.name} — ${SITE.name}`,
      description,
      url: path,
      siteName: SITE.name,
      locale: "es_GT",
      type: "article",
      images: [{ url: project.coverImage, alt: `${project.name} — caso de Manifesto` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — ${SITE.name}`,
      description,
      images: [project.coverImage],
    },
  };
}

function truncate(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article>
      <JsonLd
        data={graph(
          projectSchema(project),
          breadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: project.name, path: `/proyectos/${project.slug}` },
          ]),
        )}
      />
      <ProjectHero project={project} />
      <ProjectCover project={project} />
      <ProjectContext project={project} />
      <ProjectBillboard project={project} />
      <ProjectGallery project={project} />
      <ProjectQuote project={project} />
      <ProjectNext project={project} />
    </article>
  );
}
