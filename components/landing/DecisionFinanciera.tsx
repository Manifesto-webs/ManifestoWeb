import { Reveal } from "@/components/ui/Reveal";

/* -------------------------------------------------------------------------- */
/*  Por qué el branding es una decisión financiera — copy de "Textos web v3"   */
/*                                                                            */
/*  El doc lo mete dentro de la fase 1 (Diagnóstico). Acá va como sección      */
/*  propia justo después del método: es el argumento que sostiene toda la      */
/*  fase, y adentro de una fila plegable no se leería.                        */
/*                                                                            */
/*  Fondo claro a propósito. Es el único bloque de la página que argumenta     */
/*  con datos, y en blanco se lee como un informe y no como más marca.        */
/* -------------------------------------------------------------------------- */

interface Argumento {
  id: string;
  /** Frase que carga el argumento; va destacada. */
  claim: string;
  /** El desarrollo, incluida la evidencia cuando la hay. */
  body: string;
}

const ARGUMENTOS: Argumento[] = [
  {
    id: "01",
    claim: "Una marca fuerte reduce la sensibilidad al precio.",
    body: "Los clientes aceptan pagar más por lo mismo cuando confían en quién lo vende.",
  },
  {
    id: "02",
    claim: "La marca cambia la percepción del producto, no solo la preferencia.",
    body: "El estudio de McClure y colegas (Neuron, 2004) demostró con resonancia magnética que conocer la marca altera la respuesta cerebral ante un producto idéntico. La decisión empieza antes del argumento racional.",
  },
  {
    id: "03",
    claim: "Las marcas fuertes mejoran la unidad económica.",
    body: "Mayor valor de vida del cliente, menor costo de adquisición y más resistencia en crisis. Se compra más barato lo que ya se conoce.",
  },
];

export function DecisionFinanciera() {
  return (
    <section
      id="decision-financiera"
      className="bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[clamp(4.5rem,11vw,13rem)]"
    >
      <Reveal className="mb-[clamp(2.5rem,4vw,4rem)] flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-kicker text-ink-700">
          Dentro del diagnóstico
        </span>
        <h2 className="m-0 max-w-[20ch] font-display text-display-2xl font-normal text-ink-900 text-balance">
          Por qué el branding es una decisión financiera.
        </h2>
        <p className="m-0 max-w-[52ch] text-lead text-ink-700 text-pretty">
          Es la primera pregunta que respondemos, no la última.
        </p>
      </Reveal>

      <ol className="m-0 grid list-none gap-[clamp(1.5rem,3vw,3rem)] p-0 md:grid-cols-3">
        {ARGUMENTOS.map((a, i) => (
          <Reveal key={a.id} delay={i * 120}>
            <li className="flex h-full flex-col gap-4 border-t border-ink-900/15 pt-6">
              {/* El corinto no se lee como texto sobre oscuro, pero sobre
                  blanco es casi negro: acá sí puede ir en el número. */}
              <span
                className="font-mono text-xs tabular-nums tracking-kicker"
                style={{ color: "#5f0000" }}
              >
                {a.id}
              </span>
              <h3 className="m-0 max-w-[24ch] font-display text-display-md font-normal text-ink-900 text-pretty">
                {a.claim}
              </h3>
              <p className="m-0 max-w-[42ch] text-body-sm text-ink-700 text-pretty">
                {a.body}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>

      {/* Cierre: es la conclusión operativa, no un cuarto argumento. */}
      <Reveal delay={240}>
        <p
          className="mx-auto mt-[clamp(3rem,6vw,6rem)] max-w-[62ch] border-l-[3px] pl-6 font-display text-display-md font-normal text-ink-900 text-pretty"
          style={{ borderColor: "#5f0000" }}
        >
          Por eso el diagnóstico incluye un informe ejecutivo que estima cómo la
          marca va a mover tus números: precio, fidelidad y expansión. Antes de
          diseñar nada.
        </p>
      </Reveal>
    </section>
  );
}
