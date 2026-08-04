import { SITE } from "@/lib/constants";
import { contactEmailHtml, contactEmailText } from "@/lib/contact-email";
import { validateContact } from "@/lib/contact-validation";

/**
 * POST /api/contact — envía el formulario de contacto por Mailtrap.
 *
 * El token vive solo en MAILTRAP_API_TOKEN (Railway > Variables). Nunca en el
 * repo ni en el bundle del cliente: esta ruta corre en el servidor.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Remitente. Tiene que ser del dominio verificado en Mailtrap. */
const FROM = { email: "web@manifesto.gt", name: "Manifesto — web" };

/**
 * Destinatarios. Salen de CONTACT_TO, que acepta varios separados por coma
 * o punto y coma. Vive en la variable de entorno y no en el código a
 * propósito: sumar o quitar a alguien del equipo es cambiar la variable en
 * Railway, sin tocar el repo ni esperar un deploy.
 *
 * Si CONTACT_TO no está, cae a la casilla del sitio para que el formulario
 * nunca quede enviando al vacío.
 */
function recipients(): string[] {
  const raw = process.env.CONTACT_TO?.split(/[,;]/) ?? [];
  const list = raw.map((s) => s.trim()).filter((s) => s && looksLikeEmail(s));
  // Set para que un duplicado en la variable no mande el correo dos veces.
  return list.length ? [...new Set(list)] : [SITE.email];
}

/**
 * Límite por IP. En memoria a propósito: con una réplica alcanza y evita
 * meter una dependencia. Se reinicia en cada deploy, que para este caso es
 * aceptable.
 */
const WINDOW_MS = 10 * 60 * 1000;
/** Ajustable con CONTACT_RATE_LIMIT por si hace falta afinarlo sin deploy. */
const MAX_PER_WINDOW = Number(process.env.CONTACT_RATE_LIMIT) || 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Poda para que el Map no crezca sin techo.
  if (hits.size > 500) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

/** Sólo se usa para el honeypot; el resto lo valida validateContact. */
const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/** Suficiente para descartar basura; la validación real la hace el envío. */
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function POST(request: Request) {
  const token = process.env.MAILTRAP_API_TOKEN;
  if (!token) {
    console.error("[contact] falta MAILTRAP_API_TOKEN");
    return Response.json(
      { ok: false, error: "El formulario no está configurado. Escríbenos a " + SITE.email },
      { status: 500 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "desconocida";

  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Demasiados envíos seguidos. Probá en unos minutos." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  // Honeypot: un campo invisible que sólo un bot rellena. Se responde ok
  // para no darle señal de que fue detectado, pero no se envía nada.
  if (clean(body.website, 200)) {
    return Response.json({ ok: true });
  }

  // Formato, dominios de ejemplo, desechables, patrones de spam y existencia
  // real del dominio. Ver lib/contact-validation.ts.
  const verdict = await validateContact(body);
  if (!verdict.ok) {
    // El motivo queda en el log para poder afinar las reglas; al visitante
    // se le devuelve sólo el mensaje.
    console.warn(`[contact] rechazado (${verdict.reason}) desde ${ip}`);
    return Response.json({ ok: false, error: verdict.error }, { status: verdict.status });
  }

  const payload = verdict.data;
  const { name, email, org } = payload;

  const res = await fetch("https://send.api.mailtrap.io/api/send", {
    method: "POST",
    headers: { "Api-Token": token, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      // `addr` y no `email`: ese nombre ya es el del visitante y confundirlo
      // acá mandaría el aviso a quien escribió en vez de al equipo.
      to: recipients().map((addr) => ({ email: addr })),
      // Responder al correo va directo a quien escribió, sin copiar la dirección.
      reply_to: { email, name },
      subject: `Nuevo mensaje del sitio — ${name}${org ? ` (${org})` : ""}`,
      text: contactEmailText(payload),
      html: contactEmailHtml(payload),
      category: "formulario-contacto",
    }),
  });

  if (!res.ok) {
    // El detalle queda en los logs del servidor; al visitante se le da una
    // salida útil en vez del error crudo del proveedor.
    console.error("[contact] Mailtrap respondió", res.status, await res.text().catch(() => ""));
    return Response.json(
      { ok: false, error: `No pudimos enviarlo. Escríbenos a ${SITE.email}` },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
