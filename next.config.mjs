/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
