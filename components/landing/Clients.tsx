import { clients } from "@/data/clients";

export function Clients() {
  return (
    <section className="border-t border-ink-900/10 bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,10vw,12rem)]">
      <div className="mb-[clamp(2.5rem,4vw,4rem)] flex flex-col gap-4">
        <h2 className="m-0 font-display text-display-3xl font-normal text-ink-900">
          Confían en el motivo.
        </h2>
      </div>
      <div className="grid grid-cols-6 border-t border-ink-900/20 max-md:grid-cols-3 max-sm:grid-cols-2">
        {clients.map((c, i) => (
          <span
            key={c.name}
            className={`group grid min-h-[110px] place-items-center border-b border-r border-ink-900/10 px-2 py-6 text-center font-display text-display-md font-medium text-ink-700 transition-colors duration-300 hover:bg-ink-900 hover:text-paper-bone max-md:min-h-[84px] max-md:px-1 max-md:py-5 max-md:text-base max-sm:min-h-[72px] max-sm:text-[0.95rem] ${
              // Bordes: quitar el right border en la última columna
              (i + 1) % 6 === 0 ? "md:!border-r-0" : ""
            } ${
              (i + 1) % 3 === 0 ? "max-md:!border-r-0" : ""
            } ${
              (i + 1) % 2 === 0 ? "max-sm:!border-r-0" : ""
            }`}
          >
            {c.name}
          </span>
        ))}
      </div>
    </section>
  );
}
