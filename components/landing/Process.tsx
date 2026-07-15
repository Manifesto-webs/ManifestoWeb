import { processStages } from "@/data/process";
import { StarburstImg } from "@/components/icons/StarburstImg";

export function Process() {
  return (
    <section
      id="proceso"
      className="bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,10vw,12rem)]"
    >
      <div className="mb-[clamp(2.5rem,4vw,4rem)] flex flex-col gap-3">
        <h2 className="m-0 font-display text-[clamp(2rem,5.5vw,6rem)] font-normal leading-[0.92] tracking-[-0.035em] text-ink-900">
          Cinco etapas, un mismo motivo.
        </h2>
      </div>

      <div className="flex flex-col border-t border-ink-900">
        {processStages.map((stage) => (
          <div
            key={stage.id}
            className="group relative isolate grid grid-cols-[1.4fr_1fr_140px] items-center gap-5 overflow-hidden border-b border-ink-900/20 py-[clamp(1.4rem,2.5vw,2.2rem)] transition-[padding] duration-300 max-lg:grid-cols-[46px_1fr_56px] max-sm:grid-cols-[40px_1fr_44px] max-sm:gap-3s"
          >
            <div className="absolute inset-0 -z-10 -translate-x-full bg-paper-sage transition-transform duration-300 group-hover:translate-x-0" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-700 max-lg:text-[0.7rem] hidden">
              {stage.id} 
            </span>
            <span className="font-display text-[clamp(2rem,4.2vw,4.2rem)] font-normal leading-[0.95] tracking-[-0.035em] text-ink-900 max-lg:text-[clamp(1.5rem,5vw,2rem)] max-sm:text-[1.35rem]">
              {stage.name}
            </span>
            <span className="max-w-[38ch] text-base leading-[1.5] text-ink-700 max-lg:hidden">
              {stage.description}
            </span>
            <div className="aspect-square w-[clamp(60px,6vw,100px)] justify-self-end transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:scale-[1.08] max-lg:w-[48px] max-sm:w-[40px]">
              <StarburstImg id={stage.id} className="h-full w-full object-contain opacity-85 mix-blend-multiply" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
