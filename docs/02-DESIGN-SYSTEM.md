# 02 — Design System

Todos los tokens viven en `app/globals.css` dentro del bloque `@theme`. Tailwind 4 los expone automáticamente como utilidades (`bg-paper-bone`, `text-ink-900`, `font-display`, etc.).

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `paper-bone` | `#FFFFFF` | Fondo primario |
| `paper-sage` | `#DDD8C4` | Beige — bloques de énfasis, cards |
| `paper-ice` | `#DAE1E7` | Azul-gris — variante secundaria |
| `ink-900` | `#2D3436` | Texto primario, fondos oscuros |
| `ink-pure` | `#0A0F0F` | Footer, contraste máximo |
| `ink-700` | `#6C7A7D` | Texto secundario |
| `ink-500` | `#96A2A5` | Metadata, kickers |
| `ink-300` | `#C7CDD0` | Bordes suaves, dots |
| `ink-100` | `#EDEFF0` | Placeholders de imágenes |
| `accent-clay` | `#4A0010` | Vino borgoña — acentos, hover CTA, punto tras logo |

**Regla:** el vino se usa como puntuación (el punto tras "manifesto"), no como fondo de bloques enteros.

## Tipografía

| Familia | Peso disponible | Uso |
|---|---|---|
| **Clash Display** | Extralight · Light · Regular · Medium · Semibold · Bold | **Todos** los headers, wordmarks, números grandes |
| **Calibre** | Light · Regular · Medium · Bold (+ italics) | Body copy, formularios, botones |
| **Courier New** | Regular · Italic | Kickers, metadata, labels con `tracking-[0.22em]` |

**Regla dura del cliente:** los headers no cambian de familia. Nada de "y otra parte en Calibre italic" para dar énfasis. Si hace falta contraste, se cambia el peso o el color.

## Radios

- `rounded-tile` → `32px` — tiles del bento, cards grandes
- `rounded-pill` → `999px` — botones, pills, campos redondeados

## Animaciones

Todas definidas en `@theme` de `globals.css`:

- `animate-marquee` → loop horizontal infinito (20s)
- `animate-spin-slow` → rotación lenta del starburst decorativo (60s)
- `animate-tile-reveal` → aparición inicial de los tiles del bento (usar con `IntersectionObserver` si querés lazy — opcional)

## Utilities custom

- `container-manifesto` — padding horizontal con clamp y ancho máx.
- `kicker` — combina font-mono, uppercase, tracking y color; equivalente a las labels `01 · TÍTULO`

## Layouts recurrentes

- **Bento del homepage:** grid 6 cols × 4 rows = 24 celdas. Cada tile suma exacto a 24. Si agregás/removés uno, recalculá spans para mantener la aritmética.
- **Grid de proyecto:** 6 cols con spans mapeados en `GALLERY_SPAN_CLASSES` (`lib/utils.ts`). Los valores válidos son `xl · lg · md · mh · sm · xs`.

## Reglas de imagen

Todas las fotos llevan `filter: saturate(0.72) brightness(0.98) contrast(0.96)` — el cliente pidió bajar saturación. En hover el filtro se acerca a 1 pero nunca llega a 1.0.

## Accesibilidad

- Todas las imágenes decorativas usan `aria-hidden="true"` y `alt=""`.
- Los links de nav tienen `aria-label` en el logo.
- Los inputs tienen `<label htmlFor>` explícito.
- Contraste WCAG AA verificado para `ink-900 sobre paper-bone` y `paper-bone sobre ink-900`.

## Cuándo tocar cada archivo

| Cambio | Archivo |
|---|---|
| Nuevo color o token | `app/globals.css` → `@theme` |
| Nueva fuente | `app/globals.css` → `@font-face` + entrada en `@theme` |
| Nueva animación | `app/globals.css` → `@theme --animate-*` + `@keyframes` |
| Nuevo layout de gallery | `types/project.ts` → agregar valor a `GalleryImageSpan` y mapearlo en `lib/utils.ts` |
