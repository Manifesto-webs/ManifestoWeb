import { z } from "zod";
import disposableList from "disposable-email-domains";
import { promises as dns } from "node:dns";
import { SITE } from "@/lib/constants";

/**
 * Filtro de basura del formulario de contacto.
 *
 * Ninguna capa alcanza sola, y eso se midió:
 *  - example.com TIENE registros MX, así que el chequeo de DNS no lo detiene.
 *  - a.com y test.com no tienen MX: ahí sí lo detiene.
 *  - mailinator.com y yopmail.com tienen MX y son reales: los para la lista
 *    de desechables.
 * Por eso van encadenadas.
 *
 * Criterio de fondo: bloquear a un cliente real es peor que recibir un spam.
 * Ante la duda —DNS caído, consulta lenta— se deja pasar, y los mensajes de
 * error siempre ofrecen el correo directo como salida.
 */

/** Reservados por RFC 2606 y 6761. No reciben correo real jamás. */
const RESERVED_DOMAINS = new Set([
  "example.com",
  "example.net",
  "example.org",
  "example.edu",
  "test.com",
  "domain.com",
  "email.com",
  "correo.com",
]);

/** TLDs reservados: nada que termine así puede recibir correo. */
const RESERVED_TLDS = ["test", "invalid", "localhost", "example", "local"];

/** Desechables frecuentes que la lista grande no trae. */
const EXTRA_DISPOSABLE = new Set([
  "tempmail.com",
  "temp-mail.org",
  "tempmail.net",
  "throwawaymail.com",
  "fakeinbox.com",
]);

const DISPOSABLE = new Set(disposableList);

/** Milisegundos mínimos entre que se pinta el formulario y se envía. */
const MIN_FILL_MS = 3000;

const schema = z.object({
  name: z.string().trim().min(2, "corto").max(120),
  email: z.email().max(200),
  org: z.string().trim().max(160).optional().default(""),
  budget: z.string().trim().max(80).optional().default(""),
  msg: z.string().trim().min(15, "corto").max(4000),
  /** Honeypot: lo maneja la ruta, acá sólo se tolera. */
  website: z.string().max(200).optional().default(""),
  /** Milisegundos que el formulario estuvo en pantalla. */
  elapsed: z.coerce.number().nonnegative().optional(),
});

export type ContactData = {
  name: string;
  email: string;
  org: string;
  budget: string;
  msg: string;
};

export type Verdict =
  | { ok: true; data: ContactData }
  | { ok: false; status: number; error: string; reason: string };

/** Mensaje genérico + salida directa, para no enseñarle al spammer qué regla saltó. */
const generic = (reason: string): Verdict => ({
  ok: false,
  status: 400,
  error: `No pudimos procesar el mensaje. Escríbenos a ${SITE.email}`,
  reason,
});

/**
 * ¿El dominio acepta correo? `null` = no se pudo determinar, y en ese caso
 * NO se bloquea: un DNS lento no puede costarnos un cliente.
 */
async function domainAcceptsMail(domain: string): Promise<boolean | null> {
  try {
    const mx = await Promise.race([
      dns.resolveMx(domain),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 2500)),
    ]);
    return Array.isArray(mx) && mx.length > 0;
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code;
    // Sólo estos dos significan "este dominio no recibe correo".
    if (code === "ENOTFOUND" || code === "ENODATA") return false;
    return null; // timeout, SERVFAIL, red caída: se deja pasar.
  }
}

/** Cuenta enlaces en el mensaje. Más de dos es patrón de spam, no de consulta. */
const countLinks = (s: string) => (s.match(/https?:\/\/|www\.[a-z0-9-]+\./gi) ?? []).length;

/** Detecta relleno tipo "aaaaaaaaaa" o "..........". */
const hasLongRun = (s: string) => /(.)\1{9,}/.test(s);

/** Un mensaje sin una sola letra no es una consulta. */
const hasLetters = (s: string) => /\p{L}/u.test(s);

export async function validateContact(input: unknown): Promise<Verdict> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue?.path[0];

    if (field === "email") {
      return { ok: false, status: 400, error: "Ese correo no parece válido.", reason: "formato-email" };
    }
    if (field === "msg") {
      return {
        ok: false,
        status: 400,
        error: "Contanos un poco más: el mensaje es demasiado corto.",
        reason: "mensaje-corto",
      };
    }
    if (field === "name") {
      return { ok: false, status: 400, error: "Falta tu nombre.", reason: "nombre" };
    }
    return { ok: false, status: 400, error: "Faltan nombre, correo o mensaje.", reason: "campos" };
  }

  const { name, email, org, budget, msg, elapsed } = parsed.data;

  // Enviado demasiado rápido: nadie escribe una consulta en menos de 3s.
  if (elapsed !== undefined && elapsed < MIN_FILL_MS) {
    return generic("demasiado-rapido");
  }

  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  const tld = domain.split(".").pop() ?? "";

  if (RESERVED_TLDS.includes(tld) || RESERVED_DOMAINS.has(domain)) {
    return {
      ok: false,
      status: 400,
      error: "Ese correo es de ejemplo. Usá uno real para poder responderte.",
      reason: `dominio-reservado:${domain}`,
    };
  }

  if (DISPOSABLE.has(domain) || EXTRA_DISPOSABLE.has(domain)) {
    return {
      ok: false,
      status: 400,
      error: "Ese correo es temporal. Usá uno donde podamos responderte.",
      reason: `dominio-desechable:${domain}`,
    };
  }

  // Contenido: patrones de spam, no de consulta.
  if (countLinks(msg) > 2) return generic("exceso-enlaces");
  if (countLinks(name) > 0) return generic("enlace-en-nombre");
  if (hasLongRun(msg) || !hasLetters(msg)) return generic("relleno");

  // Última capa, la más cara: ¿el dominio existe y recibe correo?
  const accepts = await domainAcceptsMail(domain);
  if (accepts === false) {
    return {
      ok: false,
      status: 400,
      error: "Ese dominio de correo no existe. Revisá que esté bien escrito.",
      reason: `sin-mx:${domain}`,
    };
  }

  return { ok: true, data: { name, email, org, budget, msg } };
}
