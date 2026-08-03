import Link from "next/link";
import { ManifestoLogo } from "@/components/icons/ManifestoLogo";
import { ManifestoWordmark } from "@/components/icons/ManifestoWordmark";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-pure px-[clamp(1rem,3vw,3rem)] pt-[clamp(4rem,8vw,7rem)] text-paper-bone">
      <div className="relative z-10 grid grid-cols-1 gap-[clamp(2rem,5vw,5rem)] md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <ManifestoLogo size={40} className="text-paper-bone" />
          
          <p className="max-w-[22ch] font-display text-display-lg font-normal">
    Marcas con propósito, diseñadas para evolucionar.
  </p>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="mb-3 font-mono text-xs uppercase tracking-kicker text-paper-bone/60">
            Contacto
          </h5>
          <a
            href={`mailto:${SITE.email}`}
            className="font-display text-lead font-normal transition-colors hover:text-accent-clay"
          >
            {SITE.email}
          </a>
          <p className="mt-2 text-base opacity-70">{SITE.phone}</p>
          <p className="text-base opacity-70">{SITE.city}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="mb-3 font-mono text-xs uppercase tracking-kicker text-paper-bone/60">
            Síguenos
          </h5>
          {Object.entries(SITE.socials).map(([name, url]) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base transition-colors hover:text-accent-clay"
            >
              {name}
            </a>
          ))}

        </div>
      </div>

      <div className="relative z-10 mt-[clamp(2.5rem,5vw,4rem)] flex items-center justify-center border-t border-paper-bone/[0.14] py-6 font-mono text-xs uppercase tracking-kicker text-paper-bone/55">
        © 2026 manifesto
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none relative mx-auto mt-10 block w-[min(560px,60%)] select-none pb-[clamp(1.5rem,3vw,2.5rem)] text-paper-bone/55"
      >
        <ManifestoWordmark className="h-auto w-full fill-current" />
      </div>
    </footer>
  );
}
