import { type CSSProperties } from "react";

/**
 * Fondo "magic rings" ESTÁTICO: un glow central, tres guías concéntricas y unas
 * estrellas, todo quieto. Antes tenía anillos que se expandían y un parallax que
 * seguía el mouse; se quitaron porque, combinados con el `backdrop-blur` de las
 * tarjetas, obligaban al navegador a redibujar el fondo continuamente y hacían
 * lenta la página. Ahora es pura decoración estática: cero animación, cero
 * trabajo por frame. El color se cambia con la prop `color`.
 */

const STARS: [number, number, number][] = [
  [10, 24, 2], [22, 70, 4], [34, 16, 3], [48, 84, 2],
  [60, 30, 2], [72, 66, 3], [84, 20, 2], [90, 74, 2],
  [16, 88, 2], [66, 90, 2],
];

interface MagicRingsProps {
  /** Color de los anillos y el glow (cualquier color CSS). */
  color?: string;
  /**
   * Sobre qué fondo se dibuja. `dark` (por defecto) mantiene los valores
   * originales, pensados para el #282e32. `light` sube las opacidades: las
   * guías van al 6-10%, que sobre oscuro alcanza y sobre blanco desaparece.
   */
  tone?: "dark" | "light";
  className?: string;
}

export function MagicRings({
  color = "#de2f2f",
  tone = "dark",
  className = "",
}: MagicRingsProps) {
  const light = tone === "light";
  /** Opacidad de las tres guías estáticas, de adentro hacia afuera. */
  const guide = light ? [0.55, 0.45, 0.35] : [0.26, 0.2, 0.16];
  /** Alfa del glow central, en hexadecimal sobre el color. */
  const glowAlpha = light ? "aa" : "55";

  const style = { "--ring-color": color } as CSSProperties;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={style}
      aria-hidden="true"
    >
      {/* Glow central (estático) */}
      <div
        className="absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
        style={{
          background: `radial-gradient(circle, ${color}${glowAlpha} 0%, transparent 66%)`,
        }}
      />

      {/* Guías estáticas */}
      <div className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2">
        <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="20" stroke={color} strokeOpacity={guide[0]} strokeWidth="0.2" />
          <circle cx="50" cy="50" r="34" stroke={color} strokeOpacity={guide[1]} strokeWidth="0.2" />
          <circle cx="50" cy="50" r="47" stroke={color} strokeOpacity={guide[2]} strokeWidth="0.2" />
        </svg>
      </div>

      {/* Estrellas (estáticas) */}
      <div className="absolute inset-0">
        {STARS.map(([x, y, s], i) => (
          <span
            key={i}
            className="absolute block rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              height: `${s}px`,
              width: `${s}px`,
              background: "#d6e2ed",
            }}
          />
        ))}
      </div>
    </div>
  );
}
