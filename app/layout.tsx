import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/constants";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, organizationSchema, websiteSchema } from "@/lib/schema";

/**
 * El título por defecto dice qué es Manifesto y dónde opera, no solo el
 * nombre: "Manifesto" a secas no compite por "estudio de branding Guatemala".
 */
const HOME_TITLE = "Manifesto — Estudio de branding y estrategia en Guatemala";

const HOME_DESCRIPTION =
  "Estudio de branding y comunicación estratégica en Ciudad de Guatemala. " +
  "Convertimos lo que una empresa es en decisiones que el mercado entiende.";

export const metadata: Metadata = {
  title: {
    default: HOME_TITLE,
    template: `%s — ${SITE.name}`,
  },
  description: HOME_DESCRIPTION,
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE.url,
    siteName: SITE.name,
    locale: "es_GT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Design",
};

export const viewport = {
  themeColor: "#2D3436",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-GT" className="scroll-smooth">
      <body className="bg-paper-bone text-ink-900 antialiased">
        {/* Un solo bloque JSON-LD para toda la identidad del sitio. Las
            páginas internas referencian estos nodos por @id. */}
        <JsonLd data={graph(organizationSchema(), websiteSchema())} />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
