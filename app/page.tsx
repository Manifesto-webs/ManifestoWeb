import { HeroAstral } from "@/components/landing/HeroAstral";
import { CorredorProyectos } from "@/components/demo/CorredorProyectos";
// import { Marquee } from "@/components/landing/Marquee"; // desactivado: no va en la web por ahora
import { Universe } from "@/components/landing/Universe";
import { Quote } from "@/components/landing/Quote";
import { Clients } from "@/components/landing/Clients";
import { Contact } from "@/components/landing/Contact";

/**
 * Landing (/): hero, portafolio, universo de marca, cita, clientes y contacto.
 *
 * El método salió de acá: "Textos web v3" lo pone en sección propia y ahora
 * vive en /metodologia junto con la decisión financiera y los instrumentos
 * de dirección. "Nosotros" vive en /nosotros y los servicios en /servicios.
 */
export default function HomePage() {
  return (
    <>
      <HeroAstral />
      {/* Portafolio: la caja 3D es ahora la sección de proyectos (reemplazó al
          bento "Trabajo seleccionado", que se conserva en disco). Cada pieza
          abre su proyecto.

          La sección se ancla sola: mide varias pantallas de alto y el scroll
          de la página recorre el carrusel. Ya no hace falta decirle si puede
          atrapar el scroll —nunca lo atrapa—, así que esa prop se fue. */}
      <CorredorProyectos id="trabajo" />
      {/* el marquee queda desactivado a pedido; lo dejo comentado por si se retoma */}
      {/* <Marquee /> */}
      {/* Bloque 3 del doc de textos. Va en paper-ice: corta la corrida de
          cuatro secciones claras y hace de transición al método oscuro. */}
      <Universe />
      <Quote />
      <Clients />
      <Contact />
    </>
  );
}
