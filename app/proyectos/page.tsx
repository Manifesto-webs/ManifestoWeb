import type { Metadata } from "next";
import { ProjectsIndex } from "@/components/project/ProjectsIndex";
import { JsonLd } from "@/components/seo/JsonLd";
import { projects } from "@/data/projects";
import { SITE } from "@/lib/constants";

/**
 * /proyectos — el índice del portafolio.
 *
 * Hasta ahora "Proyectos" del menú era un ancla a la caja 3D del inicio
 * (/#trabajo). Eso servía como gesto, pero no como destino: no tenía URL
 * propia que compartir, no se podía indexar por separado, y el visitante que
 * venía a ver el trabajo caía en medio de la landing con el hero encima.
 *
 * Esta página es el archivo. La caja 3D sigue en el inicio como lo que
 * siempre fue —una entrada al trabajo—, y el ancla #trabajo se conserva viva
 * para los enlaces que ya apuntaban ahí.
 */
const TITLE = "Proyectos";
const DESCRIPTION =
  "Casos de branding del estudio: identidad, sistemas de marca, espacios y " +
  "producto digital para marcas de Guatemala y la región.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/proyectos" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/proyectos`,
    type: "website",
  },
};

export default function ProyectosPage() {
  /**
   * Lista ordenada para buscadores: declara que esto es una colección y en qué
   * orden va, así el índice puede aparecer como tal en un resultado con
   * enlaces a cada caso en lugar de como una página suelta.
   */
  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${TITLE} — ${SITE.name}`,
    description: DESCRIPTION,
    url: `${SITE.url}/proyectos`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: `${SITE.url}/proyectos/${p.slug}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={itemList} />
      <ProjectsIndex />
    </>
  );
}
