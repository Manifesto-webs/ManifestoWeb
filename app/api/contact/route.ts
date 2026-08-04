import { SITE } from "@/lib/constants";

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
 * Destinatario. Por defecto la casilla del sitio; CONTACT_TO permite
 * redirigirlo (pruebas, o si mañana entra a un CRM) sin tocar código.
 */
const recipient = () => process.env.CONTACT_TO || SITE.email;

const MAX = { name: 120, org: 160, email: 200, budget: 80, msg: 4000 } as const;

/**
 * Límite por IP. En memoria a propósito: con una réplica alcanza y evita
 * meter una dependencia. Se reinicia en cada deploy, que para este caso es
 * aceptable.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
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

  const name = clean(body.name, MAX.name);
  const org = clean(body.org, MAX.org);
  const email = clean(body.email, MAX.email);
  const budget = clean(body.budget, MAX.budget);
  const msg = clean(body.msg, MAX.msg);

  if (!name || !email || !msg) {
    return Response.json(
      { ok: false, error: "Faltan nombre, correo o mensaje." },
      { status: 400 },
    );
  }
  if (!looksLikeEmail(email)) {
    return Response.json({ ok: false, error: "Ese correo no parece válido." }, { status: 400 });
  }

  const lines = [
    `Nombre:       ${name}`,
    `Correo:       ${email}`,
    org && `Organización: ${org}`,
    budget && `Presupuesto:  ${budget}`,
    "",
    "El motivo:",
    msg,
  ].filter(Boolean);

  const res = await fetch("https://send.api.mailtrap.io/api/send", {
    method: "POST",
    headers: { "Api-Token": token, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [{ email: recipient() }],
      // Responder al correo va directo a quien escribió, sin copiar la dirección.
      reply_to: { email, name },
      subject: `Nuevo mensaje del sitio — ${name}${org ? ` (${org})` : ""}`,
      text: lines.join("\n"),
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
