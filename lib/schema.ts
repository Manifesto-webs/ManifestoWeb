/**
 * Constructores de JSON-LD (schema.org).
 *
 * Por qué importa: los buscadores con IA arman su respuesta a partir de datos
 * explícitos antes que de inferir el copy. Sin esto, "¿qué estudios de branding
 * hay en Guatemala?" obliga al modelo a deducir qué es Manifesto leyendo un hero
 * que dice "Las marcas se construyen" — que es buen copy y mal dato.
 *
 * Regla de la casa: acá solo van hechos verificables del sitio. Nada de
 * teléfonos placeholder, ratings inventados ni premios sin fuente.
 */

import { SITE, SERVICE_AREAS } from "@/lib/constants";
import type { Project } from "@/types/project";

/** IDs estables para poder referenciar nodos entre bloques sin duplicarlos. */
export const ORG_ID = `${SITE.url}/#organization`;
export const SITE_ID = `${SITE.url}/#website`;

const abs = (path: string) => new URL(path, SITE.url).toString();

/**
 * La organización. Se emite una sola vez, en el layout raíz.
 * Doble @type porque Manifesto es a la vez la entidad-empresa y un negocio
 * de servicios profesionales localizable.
 */
export function organizationSchema() {
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: "Manifesto GT",
    url: SITE.url,
    description: SITE.descriptionLong,
    slogan: "Las marcas se construyen. Los valores se revelan.",
    foundingDate: SITE.founded,
    email: SITE.email,
    logo: {
      "@type": "ImageObject",
      url: abs("/marks/manifesto-symbol-black.png"),
      caption: `Logotipo de ${SITE.name}`,
    },
    image: abs("/marks/manifesto-symbol-black.png"),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ciudad de Guatemala",
      addressCountry: "GT",
    },
    areaServed: [
      { "@type": "Country", name: "Guatemala" },
      { "@type": "Place", name: "Centroamérica" },
    ],
    // Señales temáticas: qué sabe hacer el estudio, en los términos con los
    // que la gente realmente busca.
    knowsAbout: [
      "Branding",
      "Estrategia de marca",
      "Identidad visual",
      "Identidad verbal",
      "Naming",
      "Arquitectura de marca",
      "Posicionamiento de marca",
      "Cultura organizacional",
      "Experiencia de cliente",
      "Diseño UX/UI",
      "Diseño de productos digitales",
      "Comunicación estratégica",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de Manifesto",
      itemListElement: SERVICE_AREAS.map((area) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: area.name,
          description: area.description,
          provider: { "@id": ORG_ID },
          areaServed: { "@type": "Country", name: "Guatemala" },
        },
      })),
    },
    sameAs: [SITE.socials.instagram, SITE.socials.linkedin, SITE.socials.facebook],
  };
}

/** El sitio como entidad, enlazado a la organización que lo publica. */
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: "es-GT",
    publisher: { "@id": ORG_ID },
  };
}

/**
 * Un case study. `CreativeWork` en lugar de `Article` porque es trabajo
 * realizado, no una nota editorial.
 */
export function projectSchema(project: Project) {
  const url = abs(`/proyectos/${project.slug}`);
  return {
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    url,
    name: project.name,
    headline: project.name,
    description: project.lead,
    inLanguage: "es-GT",
    image: abs(project.coverImage),
    dateCreated: project.meta.year,
    creator: { "@id": ORG_ID },
    author: { "@id": ORG_ID },
    about: project.meta.services,
    keywords: project.meta.services
      .split("·")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

/** Migas de pan. Le da a los buscadores la jerarquía real del sitio. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/**
 * Envuelve varios nodos en un solo @graph. Un bloque por página, como manda
 * la buena práctica — no seis <script> sueltos compitiendo entre sí.
 */
export function graph(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
