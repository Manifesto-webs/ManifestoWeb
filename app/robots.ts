import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

/**
 * robots.txt
 *
 * El sitio es público y queremos que se indexe entero, así que la regla base
 * es permitir todo. Los agentes de IA se listan explícitos a propósito: por
 * defecto ya entran con la regla `*`, pero dejarlos escritos documenta la
 * decisión y evita que un futuro "bloqueemos bots" los tumbe sin querer.
 *
 * Google-Extended y Applebot-Extended no son crawlers: son señales de opt-in
 * para que el contenido pueda usarse en respuestas generadas (AI Overviews,
 * Apple Intelligence). Permitirlos es justamente lo que buscamos acá.
 */
const AI_AGENTS = [
  "GPTBot", // OpenAI — entrenamiento
  "OAI-SearchBot", // OpenAI — búsqueda en ChatGPT
  "ChatGPT-User", // OpenAI — navegación a pedido del usuario
  "ClaudeBot", // Anthropic
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Gemini / AI Overviews
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "meta-externalagent",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AGENTS, allow: "/" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
