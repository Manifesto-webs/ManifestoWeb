/**
 * Tipos para el sistema de proyectos.
 * Un proyecto es un case study (situa, bore, decima, etc.).
 */

export type StarburstId = "01" | "02" | "03" | "04" | "05";

export type GalleryImageSpan =
  | "xl"   // 6 cols × 2 rows (12 celdas)
  | "lg"   // 4 cols × 2 rows (8 celdas)
  | "md"   // 3 cols × 2 rows (6 celdas)
  | "mh"   // 4 cols × 1 row  (4 celdas)
  | "sm"   // 3 cols × 1 row  (3 celdas)
  | "xs";  // 2 cols × 1 row  (2 celdas)

export interface GalleryImage {
  src: string;
  label: string;
  span: GalleryImageSpan;
  /** Opcional: color de fondo si la imagen tiene transparencia */
  bg?: string;
  /** Opcional: object-position custom (ej. "center top") */
  position?: string;
}

export interface ProjectContextAside {
  label: string;
  value: string;
}

export interface ProjectQuote {
  text: string;
  attrName: string;
  attrRole: string;
}

export interface Project {
  /** URL slug (situa, bore, etc.) */
  slug: string;
  /** Nombre visible (con acentos, mayúsculas) */
  name: string;
  /** Descripción corta para meta y hero lead */
  lead: string;
  /** Meta 4-col del hero */
  meta: {
    client: string;
    year: string;
    services: string;
    role: string;
  };
  /** Color signature del proyecto (hex). Se aplica al cover full-bleed. */
  accent: string;
  /** Imagen principal para el cover full-bleed */
  coverImage: string;

  /** Sección Contexto */
  context: {
    title: string;                    // "Una marca con credibilidad,\nsin lectores."
    paragraphs: string[];             // 2-3 párrafos
    aside: ProjectContextAside[];     // 3-4 items (Sector, Sede, etc.)
  };

  /** Billboard — tagline en negro full-bleed */
  billboard: {
    lines: string[];                  // ["Donde", "la búsqueda", "cobra", "sentido"]
  };

  /** Galería con fotos reales */
  gallery: GalleryImage[];

  /** Quote opcional (solo Sitúa por ahora) */
  quote?: ProjectQuote;

  /** Slug del siguiente proyecto para el loop circular */
  nextSlug: string;
}

export interface Client {
  name: string;
}

export interface ProcessStage {
  id: StarburstId;
  name: string;
  description: string;
  starburstSrc: string;
}

export interface ServiceLine {
  eyebrow: string;
  title: string;
  bodyText: string;
  items: string[];
  ctaLabel: string;
  ctaHref: string;
  variant: "bone" | "ice";
}
