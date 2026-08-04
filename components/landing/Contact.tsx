"use client";

import { useState, type FormEvent } from "react";
import { SITE } from "@/lib/constants";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        setError(json.error ?? `No pudimos enviarlo. Escríbenos a ${SITE.email}`);
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      // Falla de red: el mensaje no se perdió por culpa del visitante, así
      // que se le da la vía alterna en lugar de un error técnico.
      setError(`No pudimos enviarlo. Escríbenos a ${SITE.email}`);
      setStatus("error");
    }
  }

  return (
    <section
      id="contacto"
      className="bg-paper-sage px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,10vw,12rem)]"
    >
      <div className="mx-auto grid max-w-[980px] gap-12 max-sm:gap-8">
        <div className="grid gap-4">
          {/* Copy de "Textos web v2" (julio 2026) — bloque Contacto. */}
          <h2 className="m-0 font-display text-display-2xl font-normal text-ink-900 max-sm:text-[clamp(2rem,8vw,3rem)]">
            ¿Tienes una marca que necesita dirección?
          </h2>
          <p className="m-0 max-w-[56ch] text-body-sm text-ink-700">
            Escríbenos. La primera conversación no cuesta nada y casi siempre aclara algo.
          </p>
        </div>

        <form onSubmit={onSubmit} className="grid w-full max-w-[720px] gap-4" noValidate>
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 ">
            <Field id="name" label="Nombre" type="text" placeholder="Tu nombre" required />
            <Field id="org" label="Organización" type="text" placeholder="Empresa o proyecto" />
          </div>
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <Field id="email" label="Correo" type="email" placeholder="mensaje@manifesto.gt" required />
            <Field id="budget" label="Presupuesto estimado" type="text" placeholder="USD — orientativo" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="msg" className="font-mono text-xs uppercase tracking-kicker text-ink-700">
              El motivo
            </label>
            <textarea
              id="msg"
              name="msg"
              placeholder="¿Qué necesitas resolver? Cuéntanos el contexto y los plazos."
              className="min-h-[140px] resize-y rounded-2xl border border-ink-900/20 bg-paper-bone px-6 py-4 text-base leading-[1.5] text-ink-900 outline-none transition-colors focus:border-ink-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent-clay max-sm:px-4 max-sm:py-3 max-sm:text-[0.95rem]"

            />
          </div>
          {/* Honeypot: invisible para personas, tentador para bots. Si viene
              relleno, el servidor descarta el envío. aria-hidden + tabIndex
              para que ningún lector de pantalla ni el teclado lo encuentren. */}
          <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="website">No llenar</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {/* justify-self-start, no self-start: el form es grid, así que
              self-* cae en el eje vertical y el botón se estiraba a todo el
              ancho pese al inline-flex. */}
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="group inline-flex items-center gap-3 rounded-2xl bg-ink-900 px-8 py-4 font-body text-base font-medium text-paper-bone transition-colors duration-200 ease-out hover:bg-accent-clay active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 max-sm:px-6 max-sm:py-3 max-sm:text-[0.95rem]"
            >
              {status === "sending" ? "Enviando…" : status === "sent" ? "Recibido" : "Enviar manifiesto"}
              {/* La flecha se desplaza con transform; antes se animaba el gap
                  del flex, que obliga a recalcular layout en cada frame. */}
              <span className="font-mono transition-transform duration-200 ease-out group-hover:translate-x-1">
                →
              </span>
            </button>

            {/* El resultado se anuncia junto al botón, que es donde ocurrió
                la acción. aria-live para que también se escuche. */}
            <p aria-live="polite" className="m-0 text-base">
              {status === "sent" && (
                <span className="text-ink-700">
                  Gracias. Te respondemos al correo que dejaste.
                </span>
              )}
              {status === "error" && <span className="text-accent-corinto">{error}</span>}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
}

function Field({ id, label, type, placeholder, required }: FieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="font-mono text-xs uppercase tracking-kicker text-ink-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className="rounded-2xl border border-ink-900/20 bg-paper-bone px-6 py-4 text-base text-ink-900 outline-none transition-colors focus:border-ink-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent-clay max-sm:px-4 max-sm:py-3 max-sm:text-[0.95rem]"
      />
    </div>
  );
}
