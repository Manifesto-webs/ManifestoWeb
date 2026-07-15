# Manifesto Web

Sitio institucional de [Manifesto](https://manifesto.gt) — estudio de consultoría en estrategia y branding con sede en Guatemala.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4.

---

## Requisitos

- **Node.js** ≥ 20.10
- **pnpm** ≥ 8 (recomendado) o `npm` / `yarn`

## Empezar

```bash
pnpm install
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo con HMR |
| `pnpm build` | Build de producción |
| `pnpm start` | Corre el build en modo prod |
| `pnpm lint` | ESLint (Next.js core-web-vitals) |
| `pnpm typecheck` | `tsc --noEmit` |

---

## Estructura

```
.
├── app/                     # App Router (Next.js 15)
│   ├── globals.css          # Tailwind 4 @theme + fuentes locales
│   ├── layout.tsx           # Root layout (Nav + Footer)
│   ├── page.tsx             # Landing
│   └── proyectos/[slug]/    # Casos de estudio dinámicos
├── components/
│   ├── icons/               # Logo, wordmark, starbursts
│   ├── layout/              # Nav, Footer
│   ├── landing/             # Hero, Bento, Marquee, About, Lines, Process, Quote, Clients, Contact
│   ├── project/             # ProjectHero, ProjectCover, ProjectContext, ProjectBillboard, ProjectGallery, ProjectQuote, ProjectNext
│   └── ui/                  # Primitivos reutilizables
├── data/                    # Fuente de verdad — proyectos, clientes, proceso, servicios
├── lib/                     # Utils + constantes
├── types/                   # Interfaces TypeScript
└── public/                  # Fuentes locales, fotos, gráficos
```

## Documentación

- [docs/01-ARQUITECTURA.md](docs/01-ARQUITECTURA.md) — decisiones técnicas y por qué
- [docs/02-DESIGN-SYSTEM.md](docs/02-DESIGN-SYSTEM.md) — tokens, tipografía, componentes
- [docs/03-PAGINAS-Y-RUTAS.md](docs/03-PAGINAS-Y-RUTAS.md) — mapa de rutas + cómo agregar un proyecto
- [docs/04-DEPLOY.md](docs/04-DEPLOY.md) — despliegue, backend, formularios

---

## Agregar un proyecto nuevo

1. Copiá las imágenes a `public/projects/<slug>/`.
2. Abrí `data/projects.ts` y agregá un objeto siguiendo la interfaz `Project` de `types/project.ts`.
3. Actualizá el `nextSlug` del proyecto anterior si querés incluirlo en el loop circular.
4. Si va al bento del homepage, agregalo también en el `TILE_LAYOUT` de `components/landing/Bento.tsx`.

La ruta `/proyectos/<slug>` se genera sola.

## Backend-ready

El formulario de contacto (`components/landing/Contact.tsx`) tiene un `TODO` con las tres opciones sugeridas: Formspree, Netlify Forms o una route handler propia. Ver [docs/04-DEPLOY.md](docs/04-DEPLOY.md) para el detalle.

Cuando el CMS entre, cambiá `data/projects.ts` por un `getProjects()` async que lea del backend — el resto del árbol no necesita cambios porque todo consume la misma interfaz `Project`.

---

## Licencia

Propiedad de Manifesto. Uso interno.
