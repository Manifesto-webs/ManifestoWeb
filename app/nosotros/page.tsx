import type { Metadata } from "next";
import { About } from "@/components/landing/About";

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
    // El nav es fijo: este padding evita que se coma el arranque de la sección en mobile.
    <div
      className="pt-[clamp(4rem,7vw,5.5rem)]"
      style={{ backgroundColor: "#282e32" }}
    >
      <About />
    </div>
  );
}
