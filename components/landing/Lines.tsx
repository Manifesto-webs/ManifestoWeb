import Link from "next/link";
import { serviceLines } from "@/data/services";

export function Lines() {
  return (
    <section className="grid grid-cols-1 border-y border-ink-900 bg-paper-bone md:grid-cols-2">
      {serviceLines.map((line, i) => {
        const bg = line.variant === "bone" ? "bg-paper-bone" : "bg-paper-ice";
        const anchor = line.variant === "bone" ? "adn" : "digital";
        return (
          <div
            key={line.title}
            id={anchor}
            className={`relative flex flex-col gap-6 px-[clamp(1.5rem,4vw,4rem)] py-[clamp(3rem,7vw,6rem)] ${bg} ${i > 0 ? "max-md:border-t md:border-l border-ink-900" : ""} min-h-[clamp(560px,70vh,760px)]`}
          >
            <h3 className="m-0 font-display text-[clamp(2.5rem,5.5vw,5.5rem)] font-normal leading-[0.95] tracking-[-0.035em] text-ink-900">
              {line.title}
            </h3>
            <p className="max-w-[46ch] text-[clamp(0.95rem,1.05vw,1.1rem)] text-ink-700">
              {line.bodyText}
            </p>
            <ul className="flex flex-col border-t border-ink-900/20">
              {line.items.map((item, idx) => (
                <li
                  key={item}
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b border-ink-900/10 py-4 text-base text-ink-900"
                >
                  <span>{item}</span>
                  <span className="font-mono text-base text-ink-700 opacity-50 transition-[opacity,transform] duration-300 group-hover:rotate-90 group-hover:opacity-100">
                    +
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={line.ctaHref}
              className="group mt-auto inline-flex items-center gap-2 self-start border-b border-ink-900 pb-1 text-base text-ink-900 transition-[gap] duration-300 hover:gap-3"
            >
              {line.ctaLabel}
              <span className="font-mono">→</span>
            </Link>
          </div>
        );
      })}
    </section>
  );
}
