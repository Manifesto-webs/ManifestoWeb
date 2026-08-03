export function About() {
  return (
    <section
      id="about"
      className="bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,10vw,12rem)]"
    >
      <div className="grid grid-cols-1 items-start gap-[clamp(2rem,6vw,6rem)] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <h2 className="m-0 font-display text-display-xl font-normal text-ink-900 text-pretty">
            Tratamos a la marca como activo estratégico, no como un entregable estético.
          </h2>
          <p className="max-w-[56ch] text-body-sm text-ink-700">
            Manifesto es un estudio de consultoría en estrategia y branding con sede en Guatemala.
            Trabajamos con organizaciones que entienden que una marca bien gestionada se convierte
            en el diferenciador clave a mediano y largo plazo — el lugar donde la promesa, la cultura
            y el producto convergen.
          </p>
          <p className="max-w-[56ch] text-body-sm text-ink-700">
            Nuestro proceso no empieza en el logotipo. Empieza en la conversación que nadie tuvo:
            por qué existen, para quién, en qué se diferencian. Lo demás es consecuencia disciplinada
            de esa respuesta.
          </p>
          <blockquote className="mt-4 border-l-[3px] border-accent-clay pl-5 font-display text-display-md font-normal text-ink-900 before:content-['“'] before:opacity-40 after:content-['”'] after:opacity-40">
            De dónde venimos, por qué y a dónde vamos: creemos firmemente que las historias
            marcan vidas.
          </blockquote>
        </div>

        <aside className="sticky top-24 flex flex-col gap-4 max-md:static">
          <StatCard label="operación" period="2019 — 2026" num="07" desc="años trabajando con marcas que prefieren el camino lento y bien pensado." variant="sage" />
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <StatCard label="proyectos" num="48" desc="identidades, sistemas y lanzamientos completados." variant="sage" />
            <StatCard label="territorios" num="06" desc="países en latinoamérica donde viven las marcas que hemos diseñado." variant="ice" />
          </div>
        </aside>
      </div>
    </section>
  );
}

interface StatCardProps {
  label: string;
  period?: string;
  num: string;
  desc: string;
  variant: "sage" | "ice";
}

function StatCard({ label, period, num, desc, variant }: StatCardProps) {
  const bg = variant === "sage" ? "bg-paper-sage" : "bg-paper-ice";
  return (
    <div className={`flex flex-col gap-3 rounded-tile p-6 ${bg}`}>
      <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-kicker text-ink-700">
        <span>{label}</span>
        {period && <span>{period}</span>}
      </div>
      <div className="font-display text-stat font-bold text-ink-900">
        {num}
      </div>
      <p className="text-base leading-[1.5] text-ink-700">{desc}</p>
    </div>
  );
}
