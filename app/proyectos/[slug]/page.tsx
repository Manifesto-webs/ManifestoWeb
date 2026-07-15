import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectHero } from "@/components/project/ProjectHero";
import { ProjectCover } from "@/components/project/ProjectCover";
import { ProjectContext } from "@/components/project/ProjectContext";
import { ProjectBillboard } from "@/components/project/ProjectBillboard";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectQuote } from "@/components/project/ProjectQuote";
import { ProjectNext } from "@/components/project/ProjectNext";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.lead,
    openGraph: {
      title: project.name,
      description: project.lead,
      images: [project.coverImage],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article>
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
