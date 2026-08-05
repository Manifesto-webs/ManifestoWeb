import type { Metadata } from "next";
import { QueHacemos } from "@/components/landing/QueHacemos";
import { Lines } from "@/components/landing/Lines";
import { Servicios } from "@/components/landing/Servicios";

const TITLE = "Servicios";
const DESCRIPTION =
  "Estrategia, identidad y activación. ADN de marca y experiencias digitales: cuatro frentes, una sola marca.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

/**
 * "El universo de marca" no se repite acá: esa sección vive en la landing
 * (components/landing/Universe.tsx) y no se toca.
 */
export default function ServiciosPage() {
  return (
    <>
      {/* El nav es fijo: este padding evita que se coma el arranque de la sección en mobile. */}
      <div
        className="pt-[clamp(4rem,7vw,5.5rem)]"
        style={{ backgroundColor: "#d6e2ed" }}
      >
        <QueHacemos />
      </div>
      <Lines />
      <Servicios />
    </>
  );
}
