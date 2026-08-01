/**
 * Inyecta un bloque JSON-LD en el HTML.
 *
 * Se serializa con JSON.stringify y se escapa `<` para que ningún string del
 * contenido pueda cerrar el <script> antes de tiempo.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // El contenido es nuestro y determinista; el escape cubre el borde de
      // que algún copy traiga un "</script>".
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
