import type { Metadata } from "next";
import { Somos } from "@/components/landing/Somos";
import { PorQue } from "@/components/landing/PorQue";

const TITLE = "Nosotros";
const DESCRIPTION =
  "Manifesto nació en 2019, pero el equipo lleva más de quince años construyendo marcas. Estructura y sensibilidad, análisis y creatividad.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function NosotrosPage() {
  return (
    /* ───────────────────────────────────────────────────────────────────
       FONDO COMPLETO DE LA PÁGINA /nosotros
       Es este `bg-paper-bone` (blanco). Pinta la franja de arriba —la que
       queda bajo el nav fijo— y cualquier hueco que las secciones no
       cubran con su propio fondo.

       EL FONDO DE CADA SECCIÓN VA APARTE, en su propio componente:
         · Nosotros / las tres tarjetas → components/landing/Somos.tsx
         · Por qué Manifesto            → components/landing/PorQue.tsx
       Cambiar este de acá NO cambia el de las secciones: cada una pinta
       el suyo encima. Para que la página cambie de color de verdad hay
       que tocar los tres.

       El padding-top es porque el nav es fijo: sin eso se come el
       arranque de la primera sección en mobile.
       ─────────────────────────────────────────────────────────────────── */
    <div className="bg-paper-bone pt-[clamp(4rem,7vw,5.5rem)]">
      <Somos />
      <PorQue />
    </div>
  );
}
