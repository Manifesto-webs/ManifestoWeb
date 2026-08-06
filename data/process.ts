import type { ProcessStage } from "@/types/project";

/**
 * Las 4 fases del método Manifesto — copy de "Textos web v3".
 *
 * Antes eran cinco etapas con otros nombres (Descubrimiento, Ordenamiento,
 * Conceptualización, Creación, Lanzamiento), que venían de v2. El documento
 * las reemplaza por cuatro, y además es lo que el JSON-LD del sitio ya
 * declaraba: "diagnóstico, definición, diseño y activación".
 *
 * Los starburst siguen numerados del 01 al 04; el 05 quedó sin usar acá pero
 * no se borra: la cita de la landing lo sigue mostrando de fondo.
 */
export const processStages: ProcessStage[] = [
  {
    id: "01",
    name: "Diagnóstico",
    tagline: "Entender el terreno",
    description:
      "Cultura, mercado y audiencias. Salimos con una lectura clara de dónde está parada la marca y contra quién compite de verdad. El arranque mapea dónde vive el valor del negocio, quién paga por él y qué lo sostiene.",
    starburstSrc: "/graphics/starburst-01-discovery.png",
  },
  {
    id: "02",
    name: "Definición",
    tagline: "Decidir qué representa",
    description:
      "Propósito, posicionamiento, personalidad y narrativa. Se construye con tu equipo en la sala, no se presenta terminado.",
    starburstSrc: "/graphics/starburst-02-order.png",
  },
  {
    id: "03",
    name: "Diseño",
    tagline: "Hacerlo visible",
    description:
      "Identidad visual, verbal y sensorial. El sistema que traduce la estrategia en algo que se reconoce sin leer el logo.",
    starburstSrc: "/graphics/starburst-03-conceptualization.png",
  },
  {
    id: "04",
    name: "Activación",
    tagline: "Ponerlo a funcionar",
    description:
      "Herramientas, capacitación y acompañamiento para que la marca sobreviva y evolucione al día a día.",
    starburstSrc: "/graphics/starburst-04-creation.png",
  },
];
