"use client";

import { useState } from "react";
import Link from "next/link";
import { serviceLines } from "@/data/services";
import { Reveal } from "@/components/ui/Reveal";
import { SpaceBackdrop } from "@/components/ui/SpaceBackdrop";

/** Marca de agua: isotipo Manifesto (mismas rutas del kit). */
function MarkWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 51"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M0.64 51V36.1118C3.09333 36.1118 8 38.3292 8 43.3975C8 48.4658 3.09333 50.8944 0.64 51Z" />
      <path d="M16 0H0L24.64 50.3665H40.96L16 0Z" />
      <path d="M77.44 0H48.96V50.3665H64V13.3043H77.44V0Z" />
      <path d="M96 40.5466C96 35.1615 91.2 31.677 87.36 31.677C82.88 31.677 78.08 35.1615 78.08 40.5466C78.08 45.9317 82.56 49.7329 87.36 49.7329C91.84 49.7329 96 45.9317 96 40.5466Z" />
    </svg>
  );
}

export function Lines() {
  return (
    <section
      className="relative overflow-hidden px-[clamp(1rem,3vw,3rem)] py-[clamp(4.5rem,11vw,13rem)]"
      style={{ backgroundColor: "#282e32" }}
    >
      <SpaceBackdrop glow="dual" />

      <div className="relative z-10 grid gap-[clamp(1rem,2vw,2rem)] md:grid-cols-2">
        {serviceLines.map((line, i) => {
          const anchor = line.variant === "bone" ? "adn" : "digital";
          const accent = line.variant === "bone" ? "#5f0000" : "#d6e2ed";
          return (
            <Reveal key={line.title} delay={i * 140}>
              <Panel line={line} anchor={anchor} accent={accent} index={i} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

interface PanelProps {
  line: (typeof serviceLines)[number];
  anchor: string;
  accent: string;
  index: number;
}

function Panel({ line, anchor, accent, index }: PanelProps) {
  const [hover, setHover] = useState(false);
  const [row, setRow] = useState<number | null>(null);

  return (
    <div
      id={anchor}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setRow(null);
      }}
      className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-tile border p-[clamp(1.5rem,3.5vw,3.5rem)] backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        backgroundColor: hover ? "rgba(0,0,0,0.32)" : "rgba(255,255,255,0.03)",
        borderColor: hover ? "rgba(214,226,237,0.45)" : "rgba(214,226,237,0.12)",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hover
          ? `0 40px 80px -40px ${accent}88, inset 0 0 0 1px rgba(214,226,237,0.06)`
          : "0 0 0 rgba(0,0,0,0)",
      }}
    >
      {/* Marca de agua (isotipo) */}
      <span
        className="pointer-events-none absolute -right-6 -top-8 h-[clamp(90px,14vw,180px)]"
        aria-hidden="true"
        style={{
          color: accent,
          opacity: hover ? 0.22 : 0.08,
          transform: hover ? "rotate(-8deg) scale(1.05)" : "rotate(0deg) scale(1)",
          transition: "opacity .6s, transform .7s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <MarkWatermark className="h-full w-auto" />
      </span>

      <div className="relative flex flex-col gap-4">
        <span
          className="font-mono text-xs uppercase tracking-[0.28em] transition-colors duration-500"
          style={{ color: hover ? "#d6e2ed" : "rgba(214,226,237,0.5)" }}
        >
          {line.eyebrow}
        </span>
        <h3
          className="m-0 font-display text-[clamp(2.1rem,4.6vw,4.4rem)] font-normal leading-[0.96] tracking-[-0.035em] transition-all duration-500"
          style={{
            color: "#ffffff",
            textShadow: hover ? "0 0 34px rgba(214,226,237,0.35)" : "none",
          }}
        >
          {line.title}
        </h3>
        <p className="max-w-[46ch] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.6] text-[rgba(214,226,237,0.72)]">
          {line.bodyText}
        </p>
      </div>

      {/* Lista de servicios */}
      <ul className="relative flex flex-col border-t border-[rgba(214,226,237,0.14)]">
        {line.items.map((item, idx) => {
          const on = row === idx;
          return (
            <li
              key={item}
              onMouseEnter={() => setRow(idx)}
              className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[rgba(214,226,237,0.1)] py-[clamp(0.7rem,1.4vw,1rem)] transition-all duration-300"
              style={{
                color: on ? "#ffffff" : "rgba(214,226,237,0.78)",
                paddingLeft: on ? "0.6rem" : "0",
              }}
            >
              <span className="font-display text-[clamp(1rem,1.5vw,1.35rem)] tracking-[-0.01em]">
                {item}
              </span>
              <span
                className="font-mono text-lg transition-transform duration-300"
                style={{
                  color: on ? "#d6e2ed" : "rgba(214,226,237,0.4)",
                  transform: on ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                +
              </span>
            </li>
          );
        })}
      </ul>

      <Link
        href={line.ctaHref}
        className="group/cta relative mt-auto inline-flex items-center gap-2 self-start pb-1 text-base transition-all duration-300"
        style={{ color: "#ffffff" }}
      >
        <span
          className="absolute -bottom-0 left-0 h-[1px] transition-all duration-500"
          style={{ width: hover ? "100%" : "38%", background: accent }}
        />
        {line.ctaLabel}
        <span className="font-mono transition-transform duration-300 group-hover/cta:translate-x-1">
          →
        </span>
      </Link>
    </div>
  );
}
