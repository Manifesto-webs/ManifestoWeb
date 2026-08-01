import { projects } from "@/data/projects";
import { SITE, SERVICE_AREAS } from "@/lib/constants";

/**
 * /llms.txt
 *
 * Convención emergente (llmstxt.org): un resumen en markdown, sin JS ni
 * maquetación, para que un modelo entienda el sitio de una lectura.
 *
 * Aviso honesto: NO es un estándar adoptado — ningún buscador con IA lo
 * consume oficialmente hoy. Se incluye porque cuesta casi nada y el sitio ya
 * tiene toda la data estructurada; si la convención cuaja, ya estamos.
 *
 * Se genera desde `projects` y `SERVICE_AREAS`, así que no se desactualiza.
 */
export const dynamic = "force-static";

export function GET() {
  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.descriptionLong}

Fundado en ${SITE.founded}. Sede en Ciudad de Guatemala. Contacto: ${SITE.email}

## Servicios

${SERVICE_AREAS.map((a) => `- **${a.name}** — ${a.description}`).join("\n")}

## Método

Cuatro fases. Cada fase cierra una decisión y ninguna avanza sin la anterior.

1. **Diagnóstico** — Cultura, mercado y audiencias. Una lectura clara de dónde está la marca y contra quién compite de verdad.
2. **Definición** — Propósito, posicionamiento, personalidad y narrativa, construidos con el equipo del cliente en la sala.
3. **Diseño** — Identidad visual, verbal y sensorial: el sistema que traduce la estrategia en algo reconocible.
4. **Activación** — Herramientas, capacitación y acompañamiento para que la marca sobreviva al día a día.

## Casos

${projects
  .map((p) => `- [${p.name}](${SITE.url}/proyectos/${p.slug}) (${p.meta.year}) — ${p.lead}`)
  .join("\n")}

## Enlaces

- [Sitio](${SITE.url})
- [Instagram](${SITE.socials.instagram})
- [LinkedIn](${SITE.socials.linkedin})
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
