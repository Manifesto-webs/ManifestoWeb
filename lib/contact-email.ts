import { SITE } from "@/lib/constants";

/**
 * Plantilla del correo que llega cuando alguien escribe por el formulario.
 *
 * Restricciones de email, que no son las de la web:
 *  - Tablas y estilos inline. Nada de flex, grid ni clases: Gmail borra el
 *    <style> del <head> y no entiende layout moderno.
 *  - Sin webfonts. Clash Display y Satoshi no cargan en clientes de correo,
 *    así que el display cae a Helvetica. Lo que SÍ sobrevive es Courier New,
 *    que es justo la mono del sitio: los kickers se ven idénticos.
 *  - Las imágenes vienen bloqueadas por defecto, así que el correo tiene que
 *    leerse completo sin ninguna.
 */

const C = {
  ink: "#2D3436",
  ink700: "#4A5054",
  ink500: "#757A7D",
  bone: "#FFFFFF",
  sage: "#DDD8C4",
  ice: "#DAE1E7",
  corinto: "#b3243b",
} as const;

const DISPLAY = "Helvetica Neue, Helvetica, Arial, sans-serif";
const MONO = "Courier New, Courier, monospace";

/** Todo lo que escribe el visitante pasa por acá antes de entrar al HTML. */
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Conserva los saltos de línea del mensaje original. */
const nl2br = (s: string) => esc(s).replace(/\r?\n/g, "<br>");

export interface ContactPayload {
  name: string;
  email: string;
  org?: string;
  budget?: string;
  msg: string;
}

/** Etiqueta en mono, igual que los kickers del sitio. */
const kicker = (text: string) =>
  `<div style="margin:0 0 6px;font-family:${MONO};font-size:11px;line-height:1.4;letter-spacing:0.18em;text-transform:uppercase;color:${C.ink500};">${esc(
    text,
  )}</div>`;

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:0 0 20px;">
      ${kicker(label)}
      <div style="font-family:${DISPLAY};font-size:16px;line-height:1.5;color:${C.ink};">${value}</div>
    </td>
  </tr>`;

export function contactEmailHtml(d: ContactPayload) {
  const meta = [d.org, d.budget].filter(Boolean).map((s) => esc(s!)).join("&nbsp;&nbsp;·&nbsp;&nbsp;");

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>Nuevo mensaje del sitio</title>
</head>
<body style="margin:0;padding:0;background:${C.ice};">
  <!-- Preheader: lo que se ve en la lista de correos, antes de abrir. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(d.name)} escribió desde ${SITE.domain} — ${esc(d.msg.slice(0, 90))}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.ice};">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:${C.bone};border-radius:24px;overflow:hidden;">

          <!-- Cabecera -->
          <tr>
            <td style="background:${C.ink};padding:28px 32px;">
              <div style="font-family:${DISPLAY};font-size:20px;font-weight:600;letter-spacing:-0.02em;color:${C.bone};">
                manifesto<span style="color:${C.corinto};">.</span>
              </div>
              <div style="margin-top:10px;font-family:${MONO};font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#9AA3A8;">
                Nuevo mensaje del sitio
              </div>
            </td>
          </tr>

          <!-- Quién escribe -->
          <tr>
            <td style="padding:32px 32px 8px;">
              <div style="font-family:${DISPLAY};font-size:30px;line-height:1.15;letter-spacing:-0.02em;color:${C.ink};">${esc(d.name)}</div>
              ${
                meta
                  ? `<div style="margin-top:8px;font-family:${MONO};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${C.ink500};">${meta}</div>`
                  : ""
              }
            </td>
          </tr>

          <!-- Datos -->
          <tr>
            <td style="padding:24px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${row(
                  "Correo",
                  `<a href="mailto:${esc(d.email)}" style="color:${C.ink};text-decoration:underline;">${esc(d.email)}</a>`,
                )}
              </table>
            </td>
          </tr>

          <!-- El motivo -->
          <tr>
            <td style="padding:0 32px;">
              ${kicker("El motivo")}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.sage};border-radius:16px;">
                <tr>
                  <td style="padding:20px 22px;font-family:${DISPLAY};font-size:16px;line-height:1.6;color:${C.ink};">
                    ${nl2br(d.msg)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Responder -->
          <tr>
            <td style="padding:28px 32px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:${C.ink};border-radius:14px;">
                    <a href="mailto:${esc(d.email)}?subject=${encodeURIComponent(`Re: tu mensaje a ${SITE.name}`)}"
                       style="display:inline-block;padding:14px 28px;font-family:${DISPLAY};font-size:15px;font-weight:600;color:${C.bone};text-decoration:none;">
                      Responder a ${esc(d.name.split(" ")[0])} &nbsp;→
                    </a>
                  </td>
                </tr>
              </table>
              <div style="margin-top:14px;font-family:${DISPLAY};font-size:13px;line-height:1.5;color:${C.ink500};">
                Responder este correo también llega directo a quien escribió.
              </div>
            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td style="border-top:1px solid rgba(45,52,54,0.12);padding:20px 32px;">
              <div style="font-family:${MONO};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${C.ink500};">
                ${SITE.domain} &nbsp;·&nbsp; formulario de contacto
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Versión en texto plano. No es un descarte: es lo que ven los clientes que
 *  bloquean HTML, y ayuda a que el correo no caiga en spam. */
export function contactEmailText(d: ContactPayload) {
  return [
    "NUEVO MENSAJE DEL SITIO",
    "",
    `Nombre:       ${d.name}`,
    `Correo:       ${d.email}`,
    d.org && `Organización: ${d.org}`,
    d.budget && `Presupuesto:  ${d.budget}`,
    "",
    "El motivo:",
    d.msg,
    "",
    "—",
    `Responder este correo llega directo a ${d.email}.`,
    `${SITE.domain} · formulario de contacto`,
  ]
    .filter(Boolean)
    .join("\n");
}
