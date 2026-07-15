import type { ProcessStage } from "@/types/project";

/**
 * Las 5 etapas del proceso Manifesto.
 * Cada etapa tiene su starburst asociado (el motivo visual recurrente).
 */
export const processStages: ProcessStage[] = [
  {
    id: "01",
    name: "Descubrimiento",
    description:
      "Auditoría de marca, entrevistas con liderazgo, mapeo competitivo y de audiencia.",
    starburstSrc: "/graphics/starburst-01-discovery.png",
  },
  {
    id: "02",
    name: "Ordenamiento",
    description:
      "Sintetizamos hallazgos. Definimos territorios, prioridades y la promesa central.",
    starburstSrc: "/graphics/starburst-02-order.png",
  },
  {
    id: "03",
    name: "Conceptualización",
    description:
      "El concepto de marca: una idea fuerza que organiza voz, sistema visual y experiencia.",
    starburstSrc: "/graphics/starburst-03-conceptualization.png",
  },
  {
    id: "04",
    name: "Creación",
    description:
      "Identidad, narrativa y aplicaciones. Construimos el sistema y sus reglas de juego.",
    starburstSrc: "/graphics/starburst-04-creation.png",
  },
  {
    id: "05",
    name: "Lanzamiento",
    description:
      "Activación interna, lanzamiento público y métricas de adopción del sistema.",
    starburstSrc: "/graphics/starburst-05-launch.png",
  },
];
