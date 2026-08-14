import type { Metadata } from "next";
import { Descansador } from "@/components/demo/Descansador";

/**
 * DEMO — no es una página del sitio.
 *
 * Acá el descansador está siempre encendido para poder verlo. Si se decide
 * usarlo de verdad, el paso siguiente es dispararlo por inactividad (montar
 * el componente a pantalla completa después de N segundos sin mouse ni
 * teclado) y desmontarlo al primer movimiento.
 *
 * No está en el menú ni en el mapa del sitio, y va con noindex.
 */
export const metadata: Metadata = {
  title: "Demo · Descansador de pantalla",
  robots: { index: false, follow: false },
};

export default function DemoDescansadorPage() {
  return (
    <div className="bg-ink-pure">
      <div className="h-[100svh] w-full">
        <Descansador />
      </div>

      <div className="mx-auto max-w-[720px] px-[clamp(1rem,3vw,3rem)] py-[clamp(3rem,6vw,6rem)] text-white/70">
        <span className="font-mono text-xs uppercase tracking-kicker text-white/50">
          Demo
        </span>
        <h1 className="mt-3 font-display text-display-xl font-normal text-white">
          Descansador de pantalla.
        </h1>
        <p className="mt-4 text-body-sm">
          El isotipo rebota contra los bordes y alterna entre blanco y celeste
          en cada rebote. Limpio, sin rastro.
        </p>
        <p className="mt-4 text-body-sm">
          Es una prueba: no está en el menú ni se indexa. Falta decidir si se
          dispara solo tras un rato de inactividad.
        </p>
      </div>
    </div>
  );
}
