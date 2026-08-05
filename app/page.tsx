import { HeroAstral } from "@/components/landing/HeroAstral";
import { Bento } from "@/components/landing/Bento";
// import { Marquee } from "@/components/landing/Marquee"; // desactivado: no va en la web por ahora
import { Universe } from "@/components/landing/Universe";
import { ProcessStar } from "@/components/landing/ProcessStar";
import { Quote } from "@/components/landing/Quote";
import { Clients } from "@/components/landing/Clients";
import { Contact } from "@/components/landing/Contact";

/**
 * Landing (/): hero, portafolio, universo de marca, método, clientes y contacto.
 * "Nosotros" vive en /nosotros y los servicios (ADN, digital y los cuatro
 * frentes) en /servicios.
 */
export default function HomePage() {
  return (
    <>
      <HeroAstral />
      <Bento />
      {/* el marquee queda desactivado a pedido; lo dejo comentado por si se retoma */}
      {/* <Marquee /> */}
      {/* Bloque 3 del doc de textos. Va en paper-ice: corta la corrida de
          cuatro secciones claras y hace de transición al método oscuro. */}
      <Universe />
      <ProcessStar />
      <Quote />
      <Clients />
      <Contact />
    </>
  );
}
