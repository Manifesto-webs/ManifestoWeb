import type { Metadata } from "next";
import { Servicios } from "@/components/landing/Servicios";
import { Preguntas } from "@/components/landing/Preguntas";

const TITLE = "Servicios";
const DESCRIPTION =
  "Cuatro frentes, una sola marca: universo de marca, cultura y talento, experiencia de cliente y universo digital.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

/**
 * La página decía tres veces qué hace el estudio, con tres taxonomías
 * distintas: "Tres frentes" (QueHacemos), "ADN + Experiencias digitales"
 * (Lines) y "Cuatro frentes" (Servicios). Las dos primeras eran restos de v2;
 * el documento de textos v3 solo tiene los cuatro frentes, así que quedan
 * ellos y las preguntas.
 *
 * QueHacemos.tsx y Lines.tsx NO se borraron: siguen en disco sin usarse, como
 * el resto de los componentes viejos.
 *
 * "El universo de marca" tampoco se repite acá: esa sección vive en la landing
 * (components/landing/Universe.tsx).
 */
export default function ServiciosPage() {
  return (
    // El nav es fijo: este padding evita que se coma el arranque de la sección
    // en mobile. En blanco, que es con lo que abre la página ahora que salió
    // la sección en ice que estaba arriba.
    <div className="bg-paper-bone pt-[clamp(4rem,7vw,5.5rem)]">
      <Servicios />
      <Preguntas />
    </div>
  );
}
