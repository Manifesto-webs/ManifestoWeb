import type { Metadata } from "next";
import { ProcessStar } from "@/components/landing/ProcessStar";
import { DecisionFinanciera } from "@/components/landing/DecisionFinanciera";
import { Instrumentos } from "@/components/landing/Instrumentos";

const TITLE = "Metodología";
const DESCRIPTION =
  "Un método en cuatro fases: diagnóstico, definición, diseño y activación. Cada fase cierra una decisión y ninguna avanza sin la anterior.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

/**
 * El método vivía en la landing. "Textos web v3" lo saca a sección propia
 * junto con los dos bloques que lo sostienen: por qué el branding es una
 * decisión financiera (que el doc mete dentro de la fase 1) y los cinco
 * instrumentos de dirección.
 *
 * El ancla #proceso se conserva dentro de ProcessStar, así que los enlaces
 * viejos a /#proceso siguen llegando a algún lado.
 */
export default function MetodologiaPage() {
  return (
    // El nav es fijo: este padding evita que se coma el arranque de la sección en mobile.
    <div
      className="pt-[clamp(4rem,7vw,5.5rem)]"
      style={{ backgroundColor: "#282e32" }}
    >
      <ProcessStar />
      <DecisionFinanciera />
      <Instrumentos />
    </div>
  );
}
