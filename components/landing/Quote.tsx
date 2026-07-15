import Image from "next/image";

export function Quote() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 px-[clamp(1rem,3vw,3rem)] py-[clamp(7rem,14vw,14rem)] text-paper-bone">
      <Image
        src="/graphics/starburst-05-launch.png"
        alt=""
        aria-hidden="true"
        width={1200}
        height={1200}
        className="animate-spin-slow pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[200vw] max-w-none translate-x-[-50%] translate-y-[-50%] opacity-[0.06] [filter:brightness(0)_invert(1)]"
        unoptimized
      />
     
      <p className="max-w-[24ch] text-balance m-0 font-display text-[clamp(2rem,5vw,5.2rem)] font-normal leading-[1.05] tracking-[-0.03em]">
        La diferencia entre comunicación y comunicación consciente es el compromiso basado en el autodescubrimiento y la definición de objetivos.
      </p>
    </section>
  );
}
