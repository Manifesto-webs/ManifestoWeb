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
    /* ═══════════════════════════════════════════════════════════════════════
       DÓNDE SE CAMBIA EL COLOR DE FONDO DE ESTA PÁGINA

       El color NO se pone acá. Cada sección pinta el suyo, así que hay tres
       lugares, uno por sección, y se cambian por separado:

         1. El método          → components/landing/ProcessStar.tsx
            (esta sección recibe el color por la prop `tone` de abajo:
             tone="light" = blanco, tone="dark" = el #282e32 original)
         2. Decisión financiera → components/landing/DecisionFinanciera.tsx
         3. Instrumentos        → components/landing/Instrumentos.tsx

       En los tres, la línea a tocar está marcada con un comentario igual a
       este que dice COLOR DE FONDO — SECCIÓN ...

       Este div solo pone el espacio de arriba: el nav es fijo y sin esto se
       come el arranque de la primera sección en celular.
       ═══════════════════════════════════════════════════════════════════════ */
    <div className="pt-[clamp(4rem,7vw,5.5rem)]">
      <ProcessStar tone="light" />
      <DecisionFinanciera />
      <Instrumentos />
    </div>
  );
}
