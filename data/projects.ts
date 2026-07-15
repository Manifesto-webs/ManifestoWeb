import type { Project } from "@/types/project";

/**
 * Data de los 6 proyectos activos + template equinoccio.
 *
 * Para agregar un proyecto nuevo:
 *   1. Copiá el object de otro similar (bore es un buen ejemplo compacto)
 *   2. Actualizá slug, name, meta, accent, coverImage, context, billboard, gallery
 *   3. Actualizá `nextSlug` — insertálo en el loop circular
 *   4. Agregá los assets a /public/projects/<slug>/
 *   5. Agregá el tile al bento del homepage (components/landing/Bento.tsx)
 */

export const projects: Project[] = [
  {
    slug: "situa",
    name: "Expo Sitúa",
    lead:
      "La primera edición de una feria que reúne aparta-mentos y vivienda nueva en Ciudad de Guatemala — con una marca que se mueve entre lo arquitectónico y lo emocional.",
    meta: {
      client: "Expo Sitúa",
      year: "2026",
      services: "Identidad · sistema · espacios · digital",
      role: "Estrategia + diseño + lanzamiento",
    },
    accent: "#5247E0",
    coverImage: "/projects/situa/04.jpg",
    context: {
      title: "Un mercado saturado\nde propuestas, sin lenguaje propio.",
      paragraphs: [
        "El mercado de vivienda en Guatemala está creciendo más rápido de lo que sus compradores logran procesar. Decenas de proyectos compiten por la misma atención, hablando todos al mismo tiempo y diciendo casi lo mismo: ubicación, amenidades, precio.",
        "Expo Sitúa nació para romper ese ruido. No es una feria más: es un curador. Reúne en dos días los aparta-mentos que vale la pena visitar, ordena la conversación entre desarrolladoras y compradores, y le pone marco emocional a la decisión más importante que toma una persona en su vida.",
        "La pregunta de partida fue: ¿cómo se diseña una marca para algo que ocurre una vez al año, dura 48 horas, y tiene que sentirse como un destino?",
      ],
      aside: [
        { label: "Sector", value: "Inmobiliario · evento" },
        { label: "Edición", value: "Primera · 30–31 mayo 2026" },
        { label: "Sede", value: "Épica Avia · zona 10, Guatemala" },
        { label: "Insight", value: "Búsqueda con sentido" },
      ],
    },
    billboard: {
      lines: ["Donde", "la búsqueda", "cobra", "sentido"],
    },
    gallery: [
      { src: "/projects/situa/stand-01.jpg", label: "Stand · render", span: "lg" },
      { src: "/projects/situa/banner.png", label: "Banner · web", span: "md", bg: "#2a25c6", position: "center top" },
      { src: "/projects/situa/stand-02.jpg", label: "Stand · ángulo 2", span: "sm" },
      { src: "/projects/situa/stand-03.jpg", label: "Stand · noche", span: "sm" },
      { src: "/projects/situa/01.jpg", label: "Identidad · digital", span: "md" },
      { src: "/projects/situa/stand-04.jpg", label: "Stand · detalle", span: "sm" },
      { src: "/projects/situa/stand-05.jpg", label: "Stand · perfil", span: "sm" },
      { src: "/projects/situa/02.jpg", label: "Flyer · pieza", span: "md" },
      { src: "/projects/situa/stand-06.jpg", label: "Stand · interior", span: "sm" },
      { src: "/projects/situa/05.jpg", label: "Detalle gráfico", span: "mh" },
      { src: "/projects/situa/03.jpg", label: "Postal", span: "xs" },
    ],
    quote: {
      text: "Sitúa tu historia. Tu hogar. Tu siguiente capítulo.",
      attrName: "Tagline campaña",
      attrRole: "Expo Sitúa · primera edición",
    },
    nextSlug: "bore",
  },

  {
    slug: "bore",
    name: "Boré",
    lead:
      "Un sistema corporativo que respeta el documento. Verde profundo + naranja como acento — la forma corporativa pensada como editorial.",
    meta: {
      client: "Boré",
      year: "2022",
      services: "Identidad corporativa · papelería",
      role: "Diseño + sistema",
    },
    accent: "#1F4F4D",
    coverImage: "/projects/bore/01.png",
    context: {
      title: "Corporativo\nno significa rígido.",
      paragraphs: [
        "Boré pidió una identidad que pudiera circular entre clientes, partners y reguladores sin perder presencia. La mayoría de competidores en su sector optan por azules genéricos y formas seguras.",
        "Trabajamos un verde profundo como color anclaje y un naranja terracota como acento puntual — suficiente para sostener jerarquía y respetar el documento. El sistema se aplica de la carpeta de archivo a la firma del PDF: misma malla, distinto rol.",
      ],
      aside: [
        { label: "Sector", value: "Corporativo" },
        { label: "Aplicaciones", value: "Carpeta · papelería · sello" },
        { label: "Sistema", value: "2 colores · 1 tipografía display" },
      ],
    },
    billboard: {
      lines: ["Documentación", "con carácter"],
    },
    gallery: [
      { src: "/projects/bore/01.png", label: "Papelería · sistema", span: "lg" },
      { src: "/projects/bore/02.png", label: "Carpeta · folio", span: "md" },
      { src: "/projects/bore/03.png", label: "Detalle · sello", span: "xl" },
    ],
    nextSlug: "decima",
  },

  {
    slug: "decima",
    name: "Décima Plaza",
    lead:
      "Identidad para una plaza con vocación premium. El sistema se construyó desde la sustracción: una D que se gana el silencio del papel.",
    meta: {
      client: "Décima Plaza",
      year: "2022",
      services: "Identidad · papelería · editorial",
      role: "Diseño + sistema",
    },
    accent: "#1A1A1A",
    coverImage: "/projects/decima/01.png",
    context: {
      title: "Menos signo,\nmás superficie.",
      paragraphs: [
        "Décima Plaza buscaba diferenciarse en un mercado saturado de logotipos opulentos. Construimos una marca que parte del blanco y negro absolutos y deja que el material —papel, sobre, tarjeta— haga el trabajo restante.",
        "La marca habita los espacios como un sello: discreta, repetida, reconocible. Cada pieza editorial respira con el mismo sistema tipográfico.",
      ],
      aside: [
        { label: "Sector", value: "Bienes raíces · premium" },
        { label: "Aplicaciones", value: "Papelería · sobre · tarjeta" },
        { label: "Insight", value: "Una D que dice el resto" },
      ],
    },
    billboard: {
      lines: ["Lo escaso", "también es lujo"],
    },
    gallery: [
      { src: "/projects/decima/01.png", label: "Sistema completo", span: "lg" },
      { src: "/projects/decima/02.png", label: "Detalle · sobre", span: "md" },
      { src: "/projects/decima/03.png", label: "Tarjeta · papelería", span: "xl" },
    ],
    nextSlug: "el-barretal",
  },

  {
    slug: "el-barretal",
    name: "El Barretal",
    lead:
      "Un sistema gráfico con vocación botánica: verde profundo, dorado contenido e ilustraciones florales como respiración entre piezas.",
    meta: {
      client: "El Barretal",
      year: "2023",
      services: "Identidad · sistema · papelería",
      role: "Estrategia + diseño",
    },
    accent: "#175E5C",
    coverImage: "/projects/el-barretal/01.png",
    context: {
      title: "Lo silvestre\ncomo lenguaje.",
      paragraphs: [
        "El Barretal nació con la inquietud de no parecerse a nada del sector. En vez de competir por modernidad, decidimos abrazar una estética orgánica: ilustraciones florales como motivo recurrente, papel craft como aliado táctil y dorado como acento ceremonial.",
        "El sistema se aplicó a papelería, packaging y carpeta institucional. Cada pieza siente que pertenece a un mismo jardín — distinto en composición, idéntico en lenguaje.",
      ],
      aside: [
        { label: "Sector", value: "Gastro · espacio" },
        { label: "Aplicaciones", value: "Papelería · carpeta · sobre" },
        { label: "Insight", value: "Lo silvestre como lenguaje" },
      ],
    },
    billboard: {
      lines: ["Un sistema", "que florece"],
    },
    gallery: [
      { src: "/projects/el-barretal/01.png", label: "Sistema · papelería", span: "lg" },
      { src: "/projects/el-barretal/02.png", label: "Detalle · ilustración", span: "md" },
      { src: "/projects/el-barretal/03.png", label: "Aplicación · carpeta", span: "xl" },
    ],
    nextSlug: "ark",
  },

  {
    slug: "ark",
    name: "Ark",
    lead:
      "Marca de baja saturación que comunica desde el material. Una tipografía geométrica en relieve, sobre papel cálido, que no necesita gritar para tener presencia.",
    meta: {
      client: "Ark",
      year: "2023",
      services: "Logotipo · sistema · papelería",
      role: "Diseño + sistema",
    },
    accent: "#C8B89A",
    coverImage: "/projects/ark/01.png",
    context: {
      title: "Lo esencial,\nimpreso.",
      paragraphs: [
        "Ark se mueve en un sector —arquitectura, construcción— donde abundan las marcas verticales y las paletas frías. Decidimos invertir el código: cálido, terroso, tipográfico, casi escultórico.",
        "La identidad se concentra en una sola pieza tipográfica que opera como marca. No hay isotipo separado. El relieve sobre papel, la luz lateral y el peso de la composición hacen el resto del trabajo.",
      ],
      aside: [
        { label: "Sector", value: "Arquitectura · proyectos" },
        { label: "Aplicaciones", value: "Logotipo · marca de agua · papelería" },
        { label: "Insight", value: "Presencia desde el material" },
      ],
    },
    billboard: {
      lines: ["Lo esencial", "impreso"],
    },
    gallery: [
      { src: "/projects/ark/01.png", label: "Logotipo · relieve", span: "lg" },
      { src: "/projects/ark/02.png", label: "Detalle · textura", span: "md" },
      { src: "/projects/ark/03.png", label: "Aplicación · sello", span: "xl" },
    ],
    nextSlug: "lando",
  },

  {
    slug: "lando",
    name: "Lando",
    lead:
      "Un trazo geométrico que cae como tela. Identidad pensada para vivir sobre superficie textil — azul nocturno, tipografía contenida.",
    meta: {
      client: "Lando",
      year: "2023",
      services: "Logotipo · sistema · aplicación textil",
      role: "Diseño + sistema",
    },
    accent: "#262E48",
    coverImage: "/projects/lando/01.png",
    context: {
      title: "Un trazo\nque cae como tela.",
      paragraphs: [
        "Lando opera en un cruce entre moda y diseño textil. Buscaba una marca que se sintiera cómoda tanto bordada como impresa, tanto a 8mm como a 80cm.",
        "Construimos un logotipo monolineal con vocación tipográfica — sin retornos ni ornamentos — que se siente igual de bien sobre algodón crudo, sobre etiqueta de papel o sobre fondo azul nocturno. Una sola firma, muchos vehículos.",
      ],
      aside: [
        { label: "Sector", value: "Moda · textil" },
        { label: "Aplicaciones", value: "Logotipo · etiqueta · packaging" },
        { label: "Insight", value: "Trazo que se viste" },
      ],
    },
    billboard: {
      lines: ["Una marca", "que se viste"],
    },
    gallery: [
      { src: "/projects/lando/01.png", label: "Logotipo · textura", span: "lg" },
      { src: "/projects/lando/02.png", label: "Aplicación · etiqueta", span: "md" },
      { src: "/projects/lando/03.png", label: "Sistema · detalle", span: "xl" },
    ],
    nextSlug: "situa",
  },
];

/** Helpers ------------------------------------------------- */

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project | undefined {
  const current = getProjectBySlug(slug);
  if (!current) return undefined;
  return getProjectBySlug(current.nextSlug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
