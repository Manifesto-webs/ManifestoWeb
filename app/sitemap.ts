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

  /**
   * Las páginas fijas del sitio. Faltaban todas: el sitemap declaraba la home
   * y los seis casos, así que /proyectos, /servicios, /nosotros y /metodologia
   * quedaban fuera del mapa que se le entrega al crawler. Se descubrían por
   * enlaces, pero no estaban declaradas ni tenían prioridad asignada.
   *
   * /proyectos va en 0.9 —lo único por encima de un caso individual— porque es
   * la puerta al portafolio y quien busca el trabajo del estudio tiene que
   * caer ahí antes que en un proyecto suelto.
   */
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/proyectos`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/servicios`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/nosotros`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE.url}/metodologia`, changeFrequency: "yearly", priority: 0.7 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE.url}/proyectos/${project.slug}`,
    lastModified: new Date(`${project.meta.year}-01-01`),
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [home, ...staticPages, ...projectPages];
}
