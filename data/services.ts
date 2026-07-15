import type { ServiceLine } from "@/types/project";

export const serviceLines: ServiceLine[] = [
  {
    eyebrow: "Identidad",
    title: "ADN de marca.",
    bodyText:
      "Identidad como sistema, no como portada. Definimos quién es la marca, cómo se ordena y cómo se sostiene en el tiempo.",
    items: [
      "Identidad corporativa y sistema visual",
      "Arquitectura y narrativa de marca",
      "Identidad en espacios y eventos",
      "Estrategias de posicionamiento",
      "Comunicación y comercialización",
    ],
    ctaLabel: "Ver casos de ADN",
    ctaHref: "#trabajo",
    variant: "bone",
  },
  {
    eyebrow: "Arquitectura",
    title: "Experiencias digitales.",
    bodyText:
      "La marca habita pantallas. Diseñamos productos digitales que respiran su carácter, su ritmo y su criterio editorial.",
    items: [
      "Diseño y desarrollo web",
      "Estrategia y gestión de redes sociales",
      "Gestión de pauta digital",
      "Sistemas de contenido editorial",
      "Medición y reporte de marca",
    ],
    ctaLabel: "Ver casos digitales",
    ctaHref: "#trabajo",
    variant: "ice",
  },
];
