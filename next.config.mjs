import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

/* Raíz de rastreo de archivos, fijada a esta carpeta a mano.
   Hay un package-lock.json suelto en el home del usuario (C:\Users\karla, de
   otro mini-proyecto que usa pptxgenjs). Sin esto, Next detectaba varios
   lockfiles, infería ESA carpeta como raíz del workspace y avisaba en cada
   build/dev. Fijar la raíz acá mantiene el file tracing dentro del proyecto y
   calla el warning, sin tocar nada fuera de esta carpeta. */
const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  images: {
    // Habilitá esto si algún día se sirven fotos desde un CMS/CDN externo.
    // Ver docs/04-DEPLOY.md.
    remotePatterns: [],
  },
  experimental: {
    // typedRoutes: true, // habilitar cuando esté estable en 15.x
  },
};

export default nextConfig;
