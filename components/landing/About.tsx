"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { MagicRings } from "@/components/ui/MagicRings";
import { Creencias } from "@/components/landing/Creencias";

/* -------------------------------------------------------------------------- */
/*  Número que cuenta solo al entrar en viewport                               */
/* -------------------------------------------------------------------------- */

function CountUp({ to, pad = 2 }: { to: number; pad?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1300;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(to * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return <span ref={ref}>{String(n).padStart(pad, "0")}</span>;
}

/* -------------------------------------------------------------------------- */
/*  Nosotros — vive en /nosotros                                               */
/* -------------------------------------------------------------------------- */

export function About() {
  const asideRef = useRef<HTMLDivElement>(null);

  // Parallax suave en las tarjetas de datos.
  useEffect(() => {
    const el = asideRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const off = (rect.top + rect.height / 2 - vh / 2) / vh;
        el.style.transform = `translateY(${off * -46}px)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="about"
      className="relative overflow-hidden px-[clamp(1rem,3vw,3rem)] py-[clamp(4.5rem,11vw,13rem)]"
      style={{ backgroundColor: "#282e32" }}
    >
      {/* Fondo "magic rings" — cambiá el color con la prop `color` (ej. "#d6e2ed" ice, "#5f0000" corinto) */}
      <MagicRings color="#5f0000" />

      <Reveal className="relative z-10 mb-[clamp(2.5rem,4vw,4rem)]">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(214,226,237,0.55)]">
          Nosotros
        </span>
      </Reveal>

      {/* Quiénes somos */}
      <div className="relative z-10 grid grid-cols-1 items-start gap-[clamp(2rem,6vw,6rem)] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <Reveal>
            <h2 className="m-0 max-w-[22ch] font-display text-[clamp(1.9rem,3.6vw,3.6rem)] font-normal leading-[1.03] tracking-[-0.03em] text-white text-pretty">
              Tratamos a la marca como activo estratégico, no como un entregable
              estético.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-[56ch] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-[1.65] text-[rgba(214,226,237,0.7)]">
              Manifesto nació en 2019, pero el equipo lleva más de quince años
              construyendo marcas junto a empresas que necesitan claridad y
              quieren capitalizar su identidad.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <blockquote
              className="mt-4 border-l-[3px] pl-5 font-display text-[clamp(1.15rem,1.8vw,1.8rem)] font-normal leading-[1.25] text-white before:content-['“'] before:opacity-40 after:content-['”'] after:opacity-40"
              style={{ borderColor: "#5f0000" }}
            >
              De dónde venimos, por qué y a dónde vamos: creemos firmemente que
              las historias marcan vidas.
            </blockquote>
          </Reveal>
        </div>

        <div ref={asideRef} className="flex flex-col gap-4 will-change-transform">
          <StatCard label="operación" period="2019 — 2026" to={7} desc="años trabajando con marcas que prefieren el camino lento y bien pensado." />
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <StatCard label="proyectos" to={48} desc="identidades, sistemas y lanzamientos completados." />
            <StatCard label="territorios" to={6} desc="países en latinoamérica donde viven las marcas que hemos diseñado." accent />
          </div>
        </div>
      </div>

      {/* Qué creemos — relleno de texto al hacer scroll */}
      <Creencias />

      {/* Nuestro equipo */}
      <Reveal className="relative z-10 mt-[clamp(4rem,8vw,9rem)]">
        <div
          className="grid gap-6 rounded-tile border border-[rgba(214,226,237,0.18)] p-[clamp(1.5rem,4vw,4rem)]"
          style={{
            backgroundColor: "rgba(0,0,0,0.35)",
            boxShadow: "0 40px 90px -50px rgba(95,0,0,0.7)",
          }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(214,226,237,0.6)]">
            Nuestro equipo
          </span>
          <p className="m-0 max-w-[24ch] font-display text-[clamp(1.6rem,3.6vw,3.4rem)] font-normal leading-[1.08] tracking-[-0.03em] text-white">
            Estructura y sensibilidad. Análisis y creatividad.
          </p>
          <p className="m-0 max-w-[52ch] text-[clamp(0.95rem,1.1vw,1.15rem)] leading-[1.6] text-[rgba(214,226,237,0.75)]">
            Trabajamos como socios, no como proveedores. Las buenas ideas rara vez
            llegan solas.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

interface StatCardProps {
  label: string;
  period?: string;
  to: number;
  desc: string;
  /** Resalta el número en ice (si no, en blanco). */
  accent?: boolean;
}

function StatCard({ label, period, to, desc, accent }: StatCardProps) {
  return (
    <div
      className="flex flex-col gap-3 rounded-tile border border-[rgba(214,226,237,0.16)] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(214,226,237,0.4)]"
      style={{ boxShadow: "0 30px 60px -40px rgba(95,0,0,0.6)" }}
    >
      <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-[0.2em] text-[rgba(214,226,237,0.55)]">
        <span>{label}</span>
        {period && <span>{period}</span>}
      </div>
      <div
        className="font-display text-[clamp(4.5rem,7.5vw,8rem)] font-bold leading-[0.9] tracking-[-0.055em]"
        style={{
          color: accent ? "#d6e2ed" : "#ffffff",
          textShadow: accent ? "0 0 30px rgba(214,226,237,0.4)" : "none",
        }}
      >
        <CountUp to={to} />
      </div>
      <p className="text-base leading-[1.5] text-[rgba(214,226,237,0.65)]">{desc}</p>
    </div>
  );
}
