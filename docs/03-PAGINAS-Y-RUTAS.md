# 03 — Páginas y rutas

## Mapa de rutas

| Ruta | Archivo | Tipo |
|---|---|---|
| `/` | `app/page.tsx` | Static (SSG) |
| `/proyectos/[slug]` | `app/proyectos/[slug]/page.tsx` | Static — cada slug pre-renderizado por `generateStaticParams` |

Los anchors dentro de la landing (`#trabajo`, `#proceso`, `#contacto`, `#adn`, `#digital`) apuntan a secciones — no son rutas.

## Landing (`/`)

Composición en orden vertical:

1. `<Hero>` — headline "Nuestro valor está en lo que tenemos para contar."
2. `<Bento>` — 6 tiles clickeables con fotos reales
3. `<Marquee>` — "marca · propósito" en loop
4. `<About>` — manifiesto largo + cards de stats
5. `<Lines>` — 2 líneas de servicio (ADN + Digital)
6. `<Process>` — 5 etapas con starbursts
7. `<Quote>` — testimonio grande sobre fondo oscuro
8. `<Clients>` — grid 6×N de clientes
9. `<Contact>` — formulario

Cada uno vive en `components/landing/` y no depende de props externos — todo lo consumen de `data/`.

## Caso de estudio (`/proyectos/[slug]`)

Composición:

1. `<ProjectHero>` — breadcrumb, kicker, título, meta (cliente/año/lugar/rol)
2. `<ProjectCover>` — imagen principal 16:9
3. `<ProjectContext>` — copy largo + aside con highlights
4. `<ProjectBillboard>` — frase-manifiesto sobre fondo oscuro
5. `<ProjectGallery>` — grid bento de fotos
6. `<ProjectQuote>` — testimonio del cliente (opcional)
7. `<ProjectNext>` — link circular al siguiente proyecto

Cada componente recibe `project: Project` como único prop.

## Cómo agregar un proyecto

**Paso 1 — assets.** Poné todas las imágenes en `public/projects/<slug>/`. Idealmente:

- `cover.jpg` — hero (>= 1600px de ancho, 16:9)
- `01.jpg` … `08.jpg` — gallery

**Paso 2 — datos.** Abrí `data/projects.ts` y agregá al array:

```ts
{
  slug: "mi-proyecto",
  name: "Mi Proyecto",
  client: "Cliente SA",
  year: "2026",
  location: "Guatemala",
  role: "identidad · sistema",
  category: "identidad corporativa",
  tagline: "Una línea que resume el porqué.",
  coverImage: "/projects/mi-proyecto/cover.jpg",
  contextKicker: "el motivo",
  contextHeadline: "Por qué existió este proyecto.",
  contextParagraphs: [
    "Primer párrafo.",
    "Segundo párrafo.",
  ],
  contextAside: [
    { label: "año", value: "2026", variant: "sage" },
    { label: "equipo", value: "3 personas", variant: "ice" },
  ],
  billboardLines: [
    "Una línea.",
    "Segunda línea en vino.",
    "Cierre.",
  ],
  gallery: [
    { src: "/projects/mi-proyecto/01.jpg", alt: "…", span: "lg" },
    // …
  ],
  quote: {
    text: "Cita del cliente.",
    author: "Nombre",
    role: "cargo",
  },
  nextSlug: "situa",
}
```

**Paso 3 — loop circular.** Si querés que el proyecto anterior linkee al nuevo, actualizá `nextSlug` en el proyecto anterior.

**Paso 4 — bento del home (opcional).** Si va en el homepage, agregá una entrada en `TILE_LAYOUT` en `components/landing/Bento.tsx` con el slug y el span. Recordá que los spans deben sumar 24 en total (6 cols × 4 rows).

**Paso 5.** `pnpm typecheck` — si algo faltó, TypeScript te lo dice.

## Gallery spans

Definidos en `lib/utils.ts` → `GALLERY_SPAN_CLASSES`:

| Span | Cols × Rows | Notas |
|---|---|---|
| `xl` | 6 × 2 | Full width, doble alto |
| `lg` | 4 × 2 | Grande vertical |
| `md` | 3 × 2 | Cuadrado grande |
| `mh` | 3 × 1 | Cuadrado horizontal |
| `sm` | 2 × 1 | Mitad |
| `xs` | 2 × 1 | Mismo que sm — reservado para variante |

Podés mezclarlos libremente — el `grid-auto-flow: dense` acomoda los huecos.
