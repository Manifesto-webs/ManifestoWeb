import Link from "next/link";
import { ManifestoWordmark } from "@/components/icons/ManifestoWordmark";
import { SITE, NAV_LINKS } from "@/lib/constants";

/* -------------------------------------------------------------------------- */
/*  Footer                                                                     */
/*                                                                            */
/*  Qué cambió y por qué:                                                      */
/*                                                                            */
/*  · Fondo. Era #000 puro, el único negro del sitio: cortaba la página en     */
/*    seco justo al final. Ahora va en space-deep, que es el mismo azul de     */
/*    marca un paso más abajo — cierra la página dentro de la misma familia.   */
/*                                                                            */
/*  · Los hover en rojo (accent-clay #4A0010) sobre ese fondo eran ilegibles:  */
/*    1.3:1 de contraste, o sea el enlace DESAPARECÍA al pasar el mouse, que   */
/*    es exactamente lo contrario de lo que tiene que hacer un hover. Ahora    */
/*    todos responden en ice con una línea que crece: se lee sobre oscuro y no */
/*    mete rojo sobre azul.                                                    */
/*                                                                            */
/*  · Estructura. Antes eran tres columnas sueltas y un wordmark gigante       */
/*    colgado abajo sin relación con nada. Ahora hay jerarquía: la frase de    */
/*    marca arriba con el correo como acción principal, los índices al costado */
/*    y el wordmark como cierre —marca de agua, no elemento suelto.            */
/* -------------------------------------------------------------------------- */

/** Puntos tenues del fondo. Fijos (sin Math.random) para no romper la hidratación. */
const POLVO: [number, number, number][] = [
  [8, 22, 2], [17, 68, 1.5], [26, 40, 2], [34, 84, 1.5],
  [43, 16, 2], [52, 58, 1.5], [61, 30, 2], [69, 76, 1.5],
  [78, 44, 2], [86, 20, 1.5], [93, 64, 2], [12, 90, 1.5],
];

export function Footer() {
  return (
    /* Compacto a propósito. Antes medía ~940 px de alto: la frase llegaba a
       51 px, el wordmark ocupaba todo el ancho y los bloques iban separados
       por 6 rem. Un footer no puede pesar como una sección — es el cierre,
       no un capítulo. Todos los pasos de abajo bajaron entre un tercio y la
       mitad. */
    <footer className="relative isolate overflow-hidden bg-space-deep px-[clamp(1rem,3vw,3rem)] pt-[clamp(2.5rem,5vw,4rem)] text-paper-bone">
      {/* Campo tenue: la misma idea de cielo del hero, al mínimo. Ice y sand,
          sin corinto — el rojo sobre este azul es justo lo que se sacó. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {POLVO.map(([x, y, s], i) => (
          <span
            key={i}
            className="animate-twinkle absolute block rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              height: `${s}px`,
              width: `${s}px`,
              background: i % 4 === 0 ? "#dcddca" : "#d6e2ed",
              opacity: 0.4,
              animationDelay: `${(i % 5) * 0.7}s`,
            }}
          />
        ))}
        {/* Un solo destello frío, abajo a la derecha, para que el bloque no
            quede plano. */}
        <div
          className="absolute -right-[10%] bottom-0 h-[50vmin] w-[50vmin] rounded-full blur-[90px]"
          style={{
            background: "radial-gradient(circle, rgba(214,226,237,0.10) 0%, transparent 68%)",
          }}
        />
      </div>

      {/* ── Bloque superior: la frase y el correo ───────────────────────── */}
      <div className="grid gap-[clamp(1.5rem,3vw,2.5rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <span className="font-mono text-xs uppercase tracking-kicker text-[rgba(214,226,237,0.5)]">
            {SITE.name} · {SITE.city}
          </span>
          <p className="mt-3 mb-0 max-w-[22ch] font-display text-[clamp(1.25rem,2.1vw,1.9rem)] font-normal leading-[1.14] tracking-[-0.025em] text-balance">
            {SITE.footerText}
          </p>
        </div>

        {/* El correo es la acción del footer, así que se trata como tal: con
            la línea que se retrae y vuelve a entrar desde la izquierda al
            pasar el mouse. */}
        <div className="lg:justify-self-end lg:text-right">
          <span className="font-mono text-xs uppercase tracking-kicker text-[rgba(214,226,237,0.5)]">
            Escríbenos
          </span>
          <a
            href={`mailto:${SITE.email}`}
            data-cursor="estrella"
            className="group mt-2.5 block font-display text-[clamp(1.1rem,1.7vw,1.5rem)] font-normal tracking-[-0.02em] text-paper-bone transition-colors duration-300 hover:text-[#d6e2ed]"
          >
            {SITE.email}
            <span
              aria-hidden="true"
              className="mt-1 block h-px w-full origin-right scale-x-100 bg-[rgba(214,226,237,0.35)] transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:bg-[#d6e2ed]"
            />
          </a>
        </div>
      </div>

      {/* ── Índices ─────────────────────────────────────────────────────── */}
      <div className="mt-[clamp(2rem,3.5vw,3rem)] grid gap-[clamp(1.5rem,3vw,2.5rem)] border-t border-[rgba(214,226,237,0.14)] pt-[clamp(1.5rem,2.5vw,2rem)] sm:grid-cols-2 lg:grid-cols-3">
        <nav aria-label="Secciones">
          <h2 className="m-0 mb-4 font-mono text-xs uppercase tracking-kicker text-[rgba(214,226,237,0.5)]">
            Navegación
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <EnlaceFooter href={link.href}>{link.label}</EnlaceFooter>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="m-0 mb-4 font-mono text-xs uppercase tracking-kicker text-[rgba(214,226,237,0.5)]">
            Síguenos
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {Object.entries(SITE.socials).map(([name, url]) => (
              <li key={name}>
                <EnlaceFooter href={url} externo>
                  {name}
                </EnlaceFooter>
              </li>
            ))}
          </ul>
        </div>

        {/* Teléfono y ciudad ocultos a pedido: el teléfono de constants es un
            placeholder (+502 5000 0000). Cuando esté el número real, va acá y
            se suma `telephone` al JSON-LD. */}
        <div className="lg:justify-self-end">
          <h2 className="m-0 mb-4 font-mono text-xs uppercase tracking-kicker text-[rgba(214,226,237,0.5)]">
            Estudio
          </h2>
          <p className="m-0 max-w-[30ch] text-body-sm leading-[1.6] text-[rgba(214,226,237,0.62)]">
            Estudio de estrategia y branding en Ciudad de Guatemala. Desde{" "}
            {SITE.founded}.
          </p>
        </div>
      </div>

      {/* ── Cierre: wordmark como marca de agua ─────────────────────────── */}
      <div
        aria-hidden="true"
        /* Marca de agua, no protagonista: al 10% de opacidad y acotado a
           420 px. A todo el ancho sumaba solo alto —en 1440 px el wordmark
           medía 240 px de alto él solo— sin decir nada nuevo. */
        className="pointer-events-none relative mx-auto mt-[clamp(1.75rem,3vw,2.5rem)] block w-[min(420px,52%)] select-none text-[rgba(214,226,237,0.10)]"
      >
        <ManifestoWordmark className="h-auto w-full fill-current" />
      </div>

      <div className="relative mt-[clamp(1.5rem,2.5vw,2rem)] flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(214,226,237,0.14)] py-4 font-mono text-xs uppercase tracking-kicker text-[rgba(214,226,237,0.5)]">
        <span>© 2026 {SITE.name}</span>
        <a
          href="#top"
          className="group inline-flex items-center gap-2 transition-colors duration-300 hover:text-[#d6e2ed]"
        >
          Volver arriba
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
          >
            ↑
          </span>
        </a>
      </div>
    </footer>
  );
}

interface EnlaceFooterProps {
  href: string;
  externo?: boolean;
  children: React.ReactNode;
}

/**
 * Enlace del footer: responde en ice con una línea que crece desde la
 * izquierda. Reemplaza al `hover:text-accent-clay`, que sobre este fondo
 * dejaba el texto casi invisible.
 */
function EnlaceFooter({ href, externo, children }: EnlaceFooterProps) {
  const clase =
    "group relative inline-flex w-fit items-center gap-1.5 py-0.5 text-base text-[rgba(214,226,237,0.72)] transition-colors duration-300 hover:text-paper-bone";

  const contenido = (
    <>
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#d6e2ed] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        />
      </span>
      {externo ? (
        <span
          aria-hidden="true"
          className="font-mono text-[0.7em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
        >
          ↗
        </span>
      ) : null}
    </>
  );

  if (externo) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={clase}>
        {contenido}
      </a>
    );
  }

  return (
    <Link href={href} className={clase}>
      {contenido}
    </Link>
  );
}
