# 04 — Deploy y backend

## Deploy — recomendado: Vercel

Next.js 15 corre nativo en Vercel sin config. Pasos:

1. Push del repo a GitHub/GitLab/Bitbucket.
2. En Vercel: **Add New Project** → importar el repo.
3. Framework: **Next.js** (auto-detectado).
4. Build command: `pnpm build` (auto).
5. Output: `.next` (auto).
6. Deploy.

Custom domain: `manifesto.gt` → apuntá el DNS a `cname.vercel-dns.com`.

## Deploy — alternativas

| Plataforma | Notas |
|---|---|
| **Netlify** | Funciona. Requiere `@netlify/plugin-nextjs` (auto en su UI) |
| **Cloudflare Pages** | Funciona. Usar el runtime `edge` si querés SSR en el edge (no lo necesitamos ahora — este sitio es SSG puro) |
| **Self-host** | `pnpm build && pnpm start` corre en cualquier VPS con Node 20+. Poné nginx/caddy delante |

## Variables de entorno

**Ahora mismo no hay ninguna requerida.** Todo el contenido vive en `data/`. Cuando aparezca un CMS o formulario real, agregá un `.env.example` documentando cada variable.

Ejemplo típico cuando toque:

```
# .env.local (nunca commitear)
CONTACT_ENDPOINT=https://formspree.io/f/xxxxxx
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXX
```

## Formulario de contacto — 3 opciones

El componente vive en `components/landing/Contact.tsx` y tiene un `TODO` explícito.

### Opción 1 — Formspree (cero código servidor)

```tsx
async function onSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const res = await fetch("https://formspree.io/f/YOUR_ID", {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
  });
  if (res.ok) setSubmitted(true);
}
```

### Opción 2 — Netlify Forms (si desplegás en Netlify)

Agregá `data-netlify="true"` y un honeypot al `<form>`. Netlify captura los envíos y los expone en su dashboard.

### Opción 3 — Route Handler propia

Creá `app/api/contact/route.ts`:

```ts
export async function POST(req: Request) {
  const data = await req.formData();
  // …validación, sanitización, envío a Resend/SendGrid/SMTP
  return Response.json({ ok: true });
}
```

Y en `Contact.tsx`: `await fetch('/api/contact', { method: 'POST', body: data })`.

## CMS — cuando entre

El componente que consume los proyectos es `app/proyectos/[slug]/page.tsx`. Hoy hace:

```ts
const project = projects.find((p) => p.slug === slug);
```

Reemplazá `projects` por un `async function getProjects()` que golpee tu CMS (Sanity, Payload, Directus, etc.). Devolvé el mismo shape que la interfaz `Project` en `types/project.ts` y el resto del árbol funciona sin tocarse.

Además, cambiá `generateStaticParams()` para leer los slugs del CMS:

```ts
export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}
```

Considerá `revalidate` en las rutas para ISR si los editores publican seguido:

```ts
export const revalidate = 60; // segundos
```

## Analytics

No hay analytics instalado. Opciones:

- **Vercel Analytics** (built-in, gratis en Pro): `pnpm add @vercel/analytics` + `<Analytics />` en `layout.tsx`.
- **Plausible / Fathom / Umami**: agregá el `<script>` en el `<head>` desde `layout.tsx`.

Evitá GA4 si el equipo puede — es más pesado y menos preciso para el uso real que tendrá el sitio.

## Checklist antes de producción

- [ ] `pnpm build` corre sin errores
- [ ] `pnpm typecheck` corre sin errores
- [ ] `pnpm lint` corre sin errores
- [ ] Todas las imágenes en `public/projects/` existen y pesan < 300 KB cada una
- [ ] `SITE.url` en `lib/constants.ts` apunta al dominio final
- [ ] Endpoint del formulario reemplazado
- [ ] Meta `metadataBase` en `app/layout.tsx` con el dominio final
- [ ] `robots.txt` y `sitemap.xml` (agregá `app/sitemap.ts` cuando toque)
