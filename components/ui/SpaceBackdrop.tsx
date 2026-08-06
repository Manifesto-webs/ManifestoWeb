/**
 * Fondo espacial reutilizable: destellos radiales + campo de estrellas tenue.
 * Posiciones deterministas (sin Math.random) para evitar desajustes de hidratación.
 * Solo usa la paleta de marca: ice (#d6e2ed), corinto (#5f0000), sand (#dcddca).
 */

// [x%, y%, tamaño px, delay s]
const STARS: [number, number, number, number][] = [
  [6, 18, 2, 0], [14, 62, 3, 1.2], [21, 34, 2, 0.5], [27, 82, 2, 2.1],
  [33, 12, 3, 0.8], [39, 48, 2, 1.7], [46, 74, 2, 0.3], [52, 22, 3, 2.4],
  [58, 58, 2, 1.1], [63, 88, 2, 0.6], [69, 30, 3, 1.9], [74, 68, 2, 0.9],
  [80, 14, 2, 2.2], [85, 52, 3, 0.4], [90, 78, 2, 1.5], [94, 36, 2, 2.0],
  [11, 90, 2, 1.3], [43, 92, 2, 0.7], [66, 8, 2, 1.6], [88, 94, 3, 0.2],
];

interface SpaceBackdropProps {
  /** Color del destello principal. */
  glow?: "corinto" | "ice" | "dual";
  /**
   * Sobre qué fondo se dibuja.
   *
   * `space` (por defecto) es el original: pensado para el #282e32, con el
   * corinto dando profundidad y todo a muy baja opacidad porque sobre oscuro
   * un 6% ya se ve.
   *
   * `paper` es para fondos claros: fuera todo el corinto —sobre blanco el
   * rojo llama demasiado— y sube la opacidad, porque ese mismo 6% de ice
   * sobre blanco no se ve. Los anillos y las estrellas quedan en ice, que es
   * el azul de la paleta.
   */
  variant?: "space" | "paper";
  className?: string;
}

export function SpaceBackdrop({
  glow = "dual",
  variant = "space",
  className = "",
}: SpaceBackdropProps) {
  const paper = variant === "paper";

  /* Sobre claro no hay destello corinto: el rojo es lo que se pidió sacar. */
  const showCorintoGlow = !paper && (glow === "corinto" || glow === "dual");
  /* ...y el destello de ice pasa a estar siempre, porque es el único que queda. */
  const showIceGlow = paper || glow === "ice" || glow === "dual";

  const iceGlow = paper
    ? "radial-gradient(circle, rgba(214,226,237,0.75) 0%, transparent 68%)"
    : "radial-gradient(circle, rgba(214,226,237,0.18) 0%, transparent 68%)";

  const ring = paper
    ? ["rgba(214,226,237,0.9)", "rgba(214,226,237,0.75)", "rgba(214,226,237,0.6)"]
    : ["rgba(214,226,237,0.06)", "rgba(214,226,237,0.05)", "rgba(95,0,0,0.10)"];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Destello corinto (profundidad) */}
      {showCorintoGlow && (
        <div
          className="absolute -left-[10%] top-[8%] h-[60vmin] w-[60vmin] rounded-full blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(95,0,0,0.35) 0%, transparent 65%)" }}
        />
      )}
      {/* Destello ice (frío/espacial) */}
      {showIceGlow && (
        <div
          className="absolute -right-[8%] bottom-[6%] h-[55vmin] w-[55vmin] rounded-full blur-[90px]"
          style={{ background: iceGlow }}
        />
      )}
      {/* Sobre claro el segundo destello va del otro lado, para que el bloque
          no quede pesado de un solo costado al faltarle el corinto. */}
      {paper && (
        <div
          className="absolute -left-[10%] top-[8%] h-[60vmin] w-[60vmin] rounded-full blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(214,226,237,0.6) 0%, transparent 65%)" }}
        />
      )}

      {/* Anillos orbitales tenues */}
      <svg
        className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.5]"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="30" stroke={ring[0]} strokeWidth="0.15" />
        <circle cx="50" cy="50" r="42" stroke={ring[1]} strokeWidth="0.15" />
        <circle cx="50" cy="50" r="49" stroke={ring[2]} strokeWidth="0.15" />
      </svg>

      {/* Estrellas */}
      {STARS.map(([x, y, s, d], i) => (
        <span
          key={i}
          className="animate-twinkle absolute block rounded-full"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            height: `${s}px`,
            width: `${s}px`,
            /* Sobre oscuro una de cada cinco va en corinto; sobre claro son
               todas ice, que es el azul de la paleta. */
            background: !paper && i % 5 === 0 ? "#5f0000" : "#d6e2ed",
            animationDelay: `${d}s`,
          }}
        />
      ))}
    </div>
  );
}
