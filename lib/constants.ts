/**
 * Constantes globales del sitio.
 */

export const SITE = {
  name: "Manifesto",
  tagline: "marca motivo",
  domain: "manifesto.gt",
  url: "https://manifesto.gt",
  email: "mensaje@manifesto.gt",
  phone: "+502 5000 0000",
  city: "ciudad de guatemala",

  footerText:
    "Marcas con propósito, diseñadas para evolucionar.",
    
  description:
    "Manifesto es un estudio de consultoría en estrategia y branding con sede en Guatemala. Marcas con propósito, diseñadas para evolucionar.",
  socials: {
    instagram: "https://www.instagram.com/manifesto__gt/",
    linkedin: "https://www.linkedin.com/company/manifestogt/",
    facebook: "https://www.facebook.com/manifesto.gt",
  },
} as const;

export const NAV_LINKS = [
  { href: "/#about", label: "about" },
  { href: "/#adn", label: "adn" },
  { href: "/#digital", label: "digital" },
  { href: "/#proceso", label: "proceso" },
  { href: "/#trabajo", label: "trabajo" },
] as const;
