/**
 * Fondo espacial reutilizable: destellos radiales + campo de estrellas tenue.
 * Posiciones deterministas (sin Math.random) para evitar desajustes de hidratación.
 *
 * Paleta: ice (#d6e2ed) y sand (#dcddca). NO hay corinto acá.
 * El destello y las estrellas en #5f0000 sobre el #282e32 eran el caso más
 * repetido de rojo sobre azul del sitio —esta pieza va en clientes, servicios,
 * preguntas e instrumentos—, y en oscuro ese rojo no aporta profundidad: se ve
 * como una mancha sucia. El sand cumple el mismo papel de segundo tono cálido
 * sin salirse de la familia fría.
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
  /**
   * Segundo destello, el que da profundidad.
   * `corinto` se mantiene como valor aceptado para no romper las llamadas
   * existentes, pero ya no pinta rojo: se resuelve como el destello sand.
   */
  glow?: "corinto" | "ice" | "dual";
  /**
   * Sobre qué fondo se dibuja.
   *
   * `space` (por defecto) es el del #282e32: todo a muy baja opacidad, porque
   * sobre oscuro un 6% ya se ve.
   *
   * `paper` es para fondos claros: sube la opacidad, porque ese mismo 6% de
   * ice sobre blanco no se ve.
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

  /* El segundo destello (el que estaba en corinto) ahora va en sand. */
  const showSandGlow = !paper && (glow === "corinto" || glow === "dual");
  const showIceGlow = paper || glow === "ice" || glow === "dual";

  const iceGlow = paper
    ? "radial-gradient(circle, rgba(214,226,237,0.75) 0%, transparent 68%)"
    : "radial-gradient(circle, rgba(214,226,237,0.18) 0%, transparent 68%)";

  const ring = paper
    ? ["rgba(214,226,237,0.9)", "rgba(214,226,237,0.75)", "rgba(214,226,237,0.6)"]
    // Aros de las secciones oscuras. Subidos (antes 0.06/0.05/0.05) para que se
    // vean más de fondo. Si se quieren más marcados, subir estos alfas; más
    // tenues, bajarlos.
    : ["rgba(214,226,237,0.15)", "rgba(214,226,237,0.12)", "rgba(220,221,202,0.11)"];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Destello sand (profundidad). Era corinto: rojo sobre azul. */}
      {showSandGlow && (
        <div
          className="absolute -left-[10%] top-[8%] h-[60vmin] w-[60vmin] rounded-full blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(220,221,202,0.10) 0%, transparent 65%)" }}
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
        className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.85]"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="30" stroke={ring[0]} strokeWidth="0.2" />
        <circle cx="50" cy="50" r="42" stroke={ring[1]} strokeWidth="0.2" />
        <circle cx="50" cy="50" r="49" stroke={ring[2]} strokeWidth="0.2" />
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
            /* Una de cada cinco va en sand, para que el campo no quede de un
               solo tono. Antes esa quinta era corinto: sobre el #282e32 se
               leía como un punto sucio, no como una estrella. */
            background: !paper && i % 5 === 0 ? "#dcddca" : "#d6e2ed",
            animationDelay: `${d}s`,
          }}
        />
      ))}
    </div>
  );
}
