import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { SITE } from "@/lib/constants";

/**
 * sitemap.xml
 *
 * Se genera desde `projects`, así que agregar un case study al data file lo
 * mete al sitemap solo. No hay lista que mantener a mano.
 *
 * `lastModified` sale del año del proyecto y no de Date.now(): una fecha que
 * cambia en cada build le enseña al crawler que el dato no es confiable.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap[number] = {
    url: SITE.url,
    changeFrequency: "monthly",
    priority: 1,
  };

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE.url}/proyectos/${project.slug}`,
    lastModified: new Date(`${project.meta.year}-01-01`),
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [home, ...projectPages];
}
