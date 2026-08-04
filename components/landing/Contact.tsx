"use client";

import { useState, type FormEvent } from "react";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // TODO: reemplazar con endpoint real. Ver docs/04-DEPLOY.md.
    // Opciones sugeridas:
    //   - Formspree:      const res = await fetch('https://formspree.io/f/YOUR_ID', { ... })
    //   - Netlify Forms:  <form data-netlify="true"> + <input name="bot-field" type="hidden">
    //   - API propia:     const res = await fetch('/api/contact', { method: 'POST', body: formData })
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2400);
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
          {/* justify-self-start, no self-start: el form es grid, así que
              self-* cae en el eje vertical y el botón se estiraba a todo el
              ancho pese al inline-flex. */}
          <button
            type="submit"
            className="group mt-2 inline-flex items-center gap-3 justify-self-start rounded-2xl bg-ink-900 px-8 py-4 font-body text-base font-medium text-paper-bone transition-colors duration-200 ease-out hover:bg-accent-clay active:scale-[0.98] max-sm:px-6 max-sm:py-3 max-sm:text-[0.95rem]"
          >
            {submitted ? "Recibido " : "Enviar manifiesto"}
            {/* La flecha se desplaza con transform; antes se animaba el gap
                del flex, que obliga a recalcular layout en cada frame. */}
            <span className="font-mono transition-transform duration-200 ease-out group-hover:translate-x-1">
              →
            </span>
          </button>
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
