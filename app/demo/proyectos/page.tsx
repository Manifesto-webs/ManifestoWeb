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
  title: "Demo · Proyectos en caja 3D",
  robots: { index: false, follow: false },
};

export default function DemoProyectosPage() {
  return (
    <div className="bg-paper-bone">
      <CorredorProyectos />

      {/* Nota al pie, solo para esta demo. */}
      <div className="mx-auto max-w-[720px] px-[clamp(1rem,3vw,3rem)] py-[clamp(3rem,6vw,6rem)] text-ink-700">
        <span className="font-mono text-xs uppercase tracking-kicker text-ink-500">
          Demo
        </span>
        <h1 className="mt-3 font-display text-display-xl font-normal text-ink-900">
          Proyectos en caja 3D.
        </h1>
        <p className="mt-4 text-body-sm">
          Carrusel vertical: la pieza del centro está de frente y, al llegar a
          los bordes de la pantalla, las de arriba y abajo se pliegan contra el
          techo y el piso de la caja. Lo maneja el scroll: la sección queda
          fija mientras se la recorre y cada punto de ese recorrido es una
          posición exacta del carrusel, así que volver hacia arriba devuelve
          donde se estaba. Un clic abre el proyecto.
        </p>
        <p className="mt-4 text-body-sm">
          Es una prueba: no está en el menú ni se indexa. El portafolio del
          inicio sigue siendo el bento de siempre.
        </p>
      </div>
    </div>
  );
}
