# 01 — Arquitectura

## Stack

| Capa | Elección | Por qué |
|---|---|---|
| Framework | Next.js 15 · App Router | SSR/SSG por default, dynamic routes triviales, la migración a un CMS más adelante no requiere reescribir componentes |
| Lenguaje | TypeScript strict | Los datos de proyectos son estructurados; strict evita divergencia entre `data/projects.ts` y los componentes que lo consumen |
| Estilos | Tailwind CSS 4 | Sin `tailwind.config.js` — todos los tokens viven en `app/globals.css` bajo `@theme`. Menos archivos que sincronizar |
| Runtime | React 19 | Server Components por default; solo `Contact.tsx` es `"use client"` |
| Build | Next 15 built-in | Turbopack en dev, webpack en build. Sin config extra |

## Server-first, cliente solo cuando hace falta

Todos los componentes son **Server Components** excepto `components/landing/Contact.tsx`, que es cliente porque maneja `useState` y `onSubmit`. Si más adelante necesitás interactividad en algún tile o menú móvil, marcá ese componente como `"use client"` — no todo el árbol.

## Datos como fuente única de verdad

`data/projects.ts` es un array tipado. La ruta `/proyectos/[slug]` lo consulta, y `generateStaticParams()` lo usa para pre-renderizar cada página en build time. Cuando el CMS entre, reemplazá `projects` por un `async function getProjects()` — la interfaz `Project` en `types/project.ts` no cambia.

## Rutas

```
/                         → app/page.tsx           (landing)
/proyectos/[slug]         → app/proyectos/[slug]/page.tsx  (caso de estudio)
```

No hay más rutas. Los anchor links del nav (`#trabajo`, `#proceso`, `#contacto`) apuntan a secciones de la landing.

## Convenciones de código

- **Path aliases:** `@/components`, `@/data`, `@/lib`, `@/types` (ver `tsconfig.json`).
- **Nombres de archivo:** PascalCase para componentes, kebab-case para datos y utilidades.
- **Sin `default export`** para componentes salvo `page.tsx` y `layout.tsx` (Next lo requiere).
- **Sin comentarios explicativos de lo obvio.** Solo comentá el *por qué* cuando no sea evidente (ver `Bento.tsx` para un ejemplo real).

## Rendimiento

- `next/image` se usa en todos los assets con `sizes` correctos. Excepción: los starbursts y el wordmark del footer llevan `unoptimized` porque son PNG chicos que no ganan nada con la conversión a WebP.
- Fuentes locales en `public/fonts/` con `font-display: swap` y sin CDN externo.
- El marquee del homepage usa una animación CSS pura (no JS) para respetar `prefers-reduced-motion` (agregalo si el diseño lo pide).

## Qué NO hicimos y por qué

- **Sin `tailwind.config.js`:** Tailwind 4 permite todos los tokens dentro de `@theme` en el CSS. Un solo archivo de fuente de verdad.
- **Sin `next-themes` ni dark mode:** el diseño es exclusivamente claro por decisión de marca.
- **Sin state manager global** (Redux/Zustand): la app es estática, no lo necesita.
- **Sin `.env` requerido para correr en local:** todo el contenido vive en el repo.
