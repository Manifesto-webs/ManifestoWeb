import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/lib/constants";

/**
 * Imagen de Open Graph del sitio.
 *
 * Se genera en build (la ruta es estática) con Clash Display, la misma
 * display del sitio, para que la tarjeta compartida no se vea como una
 * plantilla genérica.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Manifesto — Estudio de branding y comunicación estratégica en Guatemala";

export default async function OpengraphImage() {
  const clash = await readFile(
    join(process.cwd(), "public/fonts/clash/ClashDisplay-Medium.otf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#2D3436",
          padding: "80px",
          fontFamily: "Clash Display",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "9999px",
              background: "#4A0010",
            }}
          />
          <div
            style={{
              fontSize: "26px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#C2C5C7",
            }}
          >
            {SITE.domain}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div
            style={{
              fontSize: "104px",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              color: "#FFFFFF",
              maxWidth: "1000px",
            }}
          >
            Las marcas se construyen. Los valores se revelan.
          </div>
          <div
            style={{
              fontSize: "34px",
              lineHeight: 1.3,
              color: "#C2C5C7",
              maxWidth: "900px",
            }}
          >
            Estudio de branding y comunicación estratégica · Ciudad de Guatemala
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Clash Display", data: clash, style: "normal", weight: 500 }],
    },
  );
}
