"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { TitleReveal } from "@/components/ui/TitleReveal";

/* -------------------------------------------------------------------------- */
/*  Por qué el branding es una decisión financiera — copy de "Textos web v3"   */
/*                                                                            */
/*  El doc lo mete dentro de la fase 1 (Diagnóstico). Acá va como sección      */
/*  propia justo después del método: es el argumento que sostiene toda la      */
/*  fase, y adentro de una fila plegable no se leería.                        */
/*                                                                            */
/*  Fondo claro a propósito. Es el único bloque de la página que argumenta     */
/*  con datos, y en blanco se lee como un informe y no como más marca.        */
/*                                                                            */
/*  ── Por qué se pliega ───────────────────────────────────────────────────   */
/*  Los tres argumentos venían enteros y abiertos: tres columnas de texto      */
/*  seguidas, y el 02 solo ya son cuarenta palabras con una cita académica     */
/*  adentro. En una página que ya trae el método y los cinco instrumentos,     */
/*  eso se saltea. Ahora se ven las tres AFIRMACIONES —que es el argumento     */
/*  completo, y se leen de un vistazo— y la evidencia se abre en la que        */
/*  interese. Quien quiera el dato lo tiene a un clic; quien no, igual se      */
/*  llevó las tres ideas.                                                     */
/* -------------------------------------------------------------------------- */

interface Argumento {
  id: string;
  /** Frase que carga el argumento; va destacada. */
  claim: string;
  /** El desarrollo, incluida la evidencia cuando la hay. */
  body: string;
  /** Etiqueta de lo que hay debajo: dice qué se va a abrir. */
  prueba: string;
}

const ARGUMENTOS: Argumento[] = [
  {
    id: "01",
    claim: "Una marca fuerte reduce la sensibilidad al precio.",
    body: "Los clientes aceptan pagar más por lo mismo cuando confían en quién lo vende.",
    prueba: "Por qué",
  },
  {
    id: "02",
    claim: "La marca cambia la percepción del producto, no solo la preferencia.",
    body: "El estudio de McClure y colegas (Neuron, 2004) demostró con resonancia magnética que conocer la marca altera la respuesta cerebral ante un producto idéntico. La decisión empieza antes del argumento racional.",
    prueba: "La evidencia",
  },
  {
    id: "03",
    claim: "Las marcas fuertes mejoran la unidad económica.",
    body: "Mayor valor de vida del cliente, menor costo de adquisición y más resistencia en crisis. Se compra más barato lo que ya se conoce.",
    prueba: "Por qué",
  },
];

export function DecisionFinanciera() {
  /** Cuál está abierto. null = todos cerrados; volver a tocar cierra. */
  const [abierto, setAbierto] = useState<number | null>(null);

  return (
    <section
      id="decision-financiera"
      /* ═══════════════════════════════════════════════════════════════════
         COLOR DE FONDO — SECCIÓN "DECISIÓN FINANCIERA"
         Es este `bg-paper-bone`. Cambiando esta clase cambia solo esta
         sección; las otras dos tienen la suya.
         ═══════════════════════════════════════════════════════════════════ */
      className="bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[clamp(3rem,7vw,8rem)]"
    >
      <Reveal className="mb-[clamp(1.5rem,3vw,2.75rem)] flex flex-col gap-3">
        <span className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-px w-[clamp(1.5rem,4vw,3.5rem)] bg-ink-900/35"
          />
          <span className="font-mono text-xs uppercase tracking-kicker text-ink-700">
            Dentro del diagnóstico
          </span>
        </span>
        <h2 className="m-0 max-w-[20ch] font-display text-display-2xl font-normal text-ink-900 text-balance">
          <TitleReveal text="Por qué el branding es una decisión financiera." />
        </h2>
      </Reveal>

      <ol className="m-0 grid list-none gap-[clamp(1rem,2vw,2rem)] p-0 md:grid-cols-3">
        {ARGUMENTOS.map((a, i) => {
          const on = abierto === i;
          return (
            <Reveal key={a.id} delay={i * 110}>
              <li className="h-full">
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`arg-${a.id}`}
                  onClick={() => setAbierto(on ? null : i)}
                  className="group relative flex h-full w-full flex-col gap-3 border-t pt-5 text-left transition-[border-color] duration-500"
                  style={{ borderColor: on ? "#282e32" : "rgba(45,52,54,0.15)" }}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span
                      className="font-mono text-xs tabular-nums tracking-kicker transition-colors duration-500"
                      style={{ color: on ? "#2D3436" : "#757A7D" }}
                    >
                      {a.id}
                    </span>
                    {/* Dice QUÉ hay debajo, no solo que hay algo. "La
                        evidencia" y "Por qué" invitan distinto que un "+"
                        suelto, y el visitante elige con criterio si abre. */}
                    <span
                      className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-kicker transition-colors duration-500"
                      style={{ color: on ? "#2D3436" : "#757A7D" }}
                    >
                      {a.prueba}
                      <span
                        aria-hidden="true"
                        className="inline-block text-sm leading-none transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ transform: on ? "rotate(135deg)" : "rotate(0deg)" }}
                      >
                        +
                      </span>
                    </span>
                  </span>

                  <span className="m-0 block max-w-[24ch] font-display text-display-md font-normal text-ink-900 text-pretty">
                    {a.claim}
                  </span>

                  {/* Mismo plegado que el resto del sitio: el hueco se abre
                      con grid-template-rows y el texto entra después, ya a su
                      tamaño final. */}
                  <span
                    id={`arg-${a.id}`}
                    className="grid transition-[grid-template-rows] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                  >
                    <span className="overflow-hidden">
                      <span
                        className="block max-w-[42ch] pt-1 text-body-sm text-ink-700 transition-[opacity,transform,filter] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-pretty"
                        style={{
                          opacity: on ? 1 : 0,
                          transform: on ? "translateY(0)" : "translateY(-6px)",
                          filter: on ? "blur(0)" : "blur(3px)",
                          transitionDelay: on ? "120ms" : "0ms",
                        }}
                      >
                        {a.body}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            </Reveal>
          );
        })}
      </ol>

      {/* Cierre: es la conclusión operativa, no un cuarto argumento. */}
      <Reveal delay={240}>
        <p
          className="mx-auto mt-[clamp(2rem,4vw,4rem)] max-w-[62ch] border-l-[3px] pl-6 font-display text-display-md font-normal text-ink-900 text-pretty"
          style={{ borderColor: "#282e32" }}
        >
          Por eso el diagnóstico incluye un informe ejecutivo que estima cómo la
          marca va a mover tus números: precio, fidelidad y expansión. Antes de
          diseñar nada.
        </p>
      </Reveal>
    </section>
  );
}
