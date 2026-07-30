import { HeroAstral } from "@/components/landing/HeroAstral";
import { Bento } from "@/components/landing/Bento";
// import { Marquee } from "@/components/landing/Marquee"; // desactivado: no va en la web por ahora
import { About } from "@/components/landing/About";
import { Lines } from "@/components/landing/Lines";
import { ProcessStar } from "@/components/landing/ProcessStar";
import { Quote } from "@/components/landing/Quote";
import { Clients } from "@/components/landing/Clients";
import { Contact } from "@/components/landing/Contact";

export default function HomePage() {
  return (
    <>
      <HeroAstral />
      <Bento />
      {/* el marquee queda desactivado a pedido; lo dejo comentado por si se retoma */}
      {/* <Marquee /> */}
      <About />
      <Lines />
      <ProcessStar />
      <Quote />
      <Clients />
      <Contact />
    </>
  );
}
