import Script from "next/script";

/**
 * Google Analytics 4.
 *
 * El ID sale de NEXT_PUBLIC_GA_ID y no está fijo en el código: así el sitio
 * en Railway mide, y cualquier build local o de prueba no manda visitas
 * falsas a las métricas. Si la variable no está, no se inyecta nada.
 *
 * `afterInteractive` en lugar del `async` del snippet oficial: Next carga el
 * script una vez que la página ya es usable, así analytics nunca compite con
 * el contenido por el hilo principal.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
