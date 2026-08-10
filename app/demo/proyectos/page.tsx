import type { Metadata } from "next";
import { CorredorProyectos } from "@/components/demo/CorredorProyectos";

/**
 * DEMO — no es una página del sitio.
 *
 * Existe para ver cómo se siente el portafolio en corredor antes de decidir
 * si reemplaza al bento del inicio. No está en el menú ni en el mapa del
 * sitio, y va con noindex para que no se indexe por accidente.
 *
 * Si la idea se descarta, se borra esta carpeta y el componente y no queda
 * nada colgando.
 */
export const metadata: Metadata = {
  title: "Demo · Proyectos en corredor",
  robots: { index: false, follow: false },
};

export default function DemoProyectosPage() {
  return (
    <div className="bg-ink-pure">
      <CorredorProyectos />

      {/* Nota al pie, solo para esta demo. */}
      <div className="mx-auto max-w-[720px] px-[clamp(1rem,3vw,3rem)] py-[clamp(3rem,6vw,6rem)] text-white/70">
        <span className="font-mono text-xs uppercase tracking-kicker text-white/50">
          Demo
        </span>
        <h1 className="mt-3 font-display text-display-xl font-normal text-white">
          Proyectos en corredor.
        </h1>
        <p className="mt-4 text-body-sm">
          Las piezas avanzan solas por el pasillo. Moviendo el mouse hacia
          arriba dentro de la sección se frena y da marcha atrás; hacia abajo,
          acelera. Al soltar vuelve a su ritmo. Un clic abre el proyecto.
        </p>
        <p className="mt-4 text-body-sm">
          Es una prueba: no está en el menú ni se indexa. El portafolio del
          inicio sigue siendo el bento de siempre.
        </p>
      </div>
    </div>
  );
}
