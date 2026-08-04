/**
 * Constantes globales del sitio.
 */

export const SITE = {
  name: "Manifesto",
  tagline: "marca motivo",
  domain: "manifesto.gt",
  /**
   * URL canónica. Ojo: el apex (manifesto.gt) hace 301 a www, así que el
   * canonical tiene que apuntar a www o estaríamos declarando como preferida
   * una URL que redirige.
   */
  url: "https://www.manifesto.gt",
  email: "mensaje@manifesto.gt",
  /** TODO: placeholder. No se renderiza en ningún lado ni va al JSON-LD
   *  hasta tener el número real. Ver comentario en layout/Footer.tsx. */
  phone: "+502 5000 0000",
  city: "ciudad de guatemala",

  /** Año de fundación del estudio. */
  founded: "2019",

  footerText:
    "Marcas con propósito, diseñadas para evolucionar.",

  description:
    "Manifesto es un estudio de consultoría en estrategia y branding con sede en Guatemala. Marcas con propósito, diseñadas para evolucionar.",

  /**
   * Descripción larga para structured data y respuestas de buscadores con IA.
   * Dice qué hace el estudio, dónde y cómo — en una sola lectura.
   */
  descriptionLong:
    "Manifesto es un estudio de branding y comunicación estratégica con sede en Ciudad de Guatemala. " +
    "Convertimos lo que una empresa es en decisiones que el mercado entiende: estrategia de marca, " +
    "identidad visual y verbal, cultura organizacional, experiencia de cliente y productos digitales. " +
    "Trabajamos con un método de cuatro fases —diagnóstico, definición, diseño y activación— donde " +
    "cada fase cierra una decisión antes de avanzar a la siguiente.",

  socials: {
    instagram: "https://www.instagram.com/manifesto__gt/",
    linkedin: "https://www.linkedin.com/company/manifestogt/",
    facebook: "https://www.facebook.com/manifesto.gt",
  },
} as const;

/**
 * Áreas de servicio del estudio. Alimentan el `hasOfferCatalog` del JSON-LD:
 * es lo que permite que un buscador con IA responda "qué hace Manifesto"
 * sin tener que inferirlo del copy de la landing.
 */
export const SERVICE_AREAS = [
  {
    name: "Universo de marca",
    description:
      "Definimos qué es la marca y cómo se ve, se escucha y se comporta: dirección estratégica, arquitectura de portafolio, narrativa, naming, identidad visual y activación.",
  },
  {
    name: "Cultura y talento",
    description:
      "La marca empieza adentro. Propuesta de valor para el talento (EVP), comunicación para equipos de alto rendimiento y experiencias de activación cultural.",
  },
  {
    name: "Experiencia de cliente",
    description:
      "Alineamos cada punto de contacto con lo que la marca dice ser: estrategia de experiencia B2B y B2C, mapeo de recorrido y plan integral de experiencia.",
  },
  {
    name: "Crecimiento y visibilidad",
    description:
      "Campañas y activos digitales que abren demanda sin diluir la marca: estrategia de lanzamientos y eventos, gestión de activos digitales y planificación de visibilidad.",
  },
  {
    name: "Universo digital",
    description:
      "Diseñamos y construimos los productos digitales donde la marca opera: estrategia y arquitectura, diseño UX/UI, desarrollo de sitios y aplicaciones, e integración de MarTech.",
  },
] as const;

export const NAV_LINKS = [
  { href: "/#about", label: "about" },
  { href: "/#adn", label: "adn" },
  { href: "/#digital", label: "digital" },
  { href: "/#universo", label: "universo" },
  { href: "/#proceso", label: "proceso" },
  { href: "/#trabajo", label: "trabajo" },
] as const;
