const DOT_COLORS = [
  "bg-accent-clay",
  "bg-ink-500",
  "bg-ink-300",
  "bg-ink-900",
  "bg-accent-clay",
  "bg-ink-500",
  "bg-ink-300",
  "bg-ink-900",
] as const;

const WORDS = ["marca", "propósito", "marca", "propósito", "marca", "propósito", "marca", "propósito"];

export function Marquee() {
  // repito la lista dos veces para que el scroll no corte al volver al inicio
  const loop = [...WORDS, ...WORDS];

  return (
    <section
      aria-hidden="true"
      className="overflow-hidden border-y border-ink-900/10 bg-paper-bone py-[clamp(1.1rem,1.8vw,1.8rem)]"
    >
      <div className="animate-marquee inline-flex items-center gap-10 whitespace-nowrap font-display text-[clamp(2.5rem,6vw,6rem)] font-medium leading-none tracking-[-0.03em] text-ink-900 [will-change:transform]">
        {loop.map((word, i) => (
          <span key={i} className="inline-flex items-center gap-10">
            <span>{word}</span>
            <span className={`inline-block h-[0.5em] w-[0.5em] rounded-full ${DOT_COLORS[i % DOT_COLORS.length]}`} />
          </span>
        ))}
      </div>
    </section>
  );
}
