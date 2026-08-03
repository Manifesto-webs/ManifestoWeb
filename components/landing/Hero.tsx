import Link from "next/link";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[clamp(640px,100vh,960px)] flex-col justify-center gap-[clamp(2.5rem,5vh,5rem)] overflow-hidden bg-paper-bone px-[clamp(1rem,3vw,3rem)] pt-[clamp(8rem,16vh,12rem)] pb-[clamp(3rem,5vh,5rem)]"
    >
      <h1 className="relative z-10 max-w-[18ch] font-display text-display-3xl font-medium text-ink-900">
        Nuestro valor
        <br />
        está en lo que
        <br />
        tenemos para
        <br />
        contar<span className="text-accent-clay">.</span>
      </h1>

      <div className="flex flex-wrap items-center gap-2 max-md:flex-col max-md:items-start">
        <Link
          href="/#adn"
          className="inline-flex items-center gap-2 rounded-pill border border-ink-900/20 bg-paper-bone px-4 py-2 text-base text-ink-900 transition-colors duration-300 hover:bg-ink-900 hover:text-paper-bone"
        >
          ADN de marca
        </Link>
        <Link
          href="/#digital"
          className="inline-flex items-center gap-2 rounded-pill border border-ink-900/20 bg-paper-bone px-4 py-2 text-base text-ink-900 transition-colors duration-300 hover:bg-ink-900 hover:text-paper-bone"
        >
          Experiencias digitales
        </Link>
        <Link
          href="/#trabajo"
          className="group inline-flex items-center gap-2 rounded-pill border border-ink-900 bg-ink-900 px-4 py-2 text-base text-paper-bone transition-colors duration-300 hover:border-accent-clay hover:bg-accent-clay"
        >
          Marcas con propósito
          <span className="font-mono transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">↗</span>
        </Link>
      </div>
    </section>
  );
}
