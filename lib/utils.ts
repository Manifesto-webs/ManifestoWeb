/**
 * Utilidades comunes.
 */

/**
 * Concatena classnames ignorando falsy values.
 * Uso: cn("btn", isActive && "btn--active", className)
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Traduce un span de galería a las clases Tailwind del grid.
 * Ver types/project.ts para la definición de spans.
 */
export const GALLERY_SPAN_CLASSES: Record<string, string> = {
  xl: "col-span-6 row-span-2 min-h-[740px] max-lg:col-span-2 max-lg:row-span-1 max-lg:min-h-[420px] max-sm:col-span-1",
  lg: "col-span-4 row-span-2 min-h-[580px] max-lg:col-span-1 max-lg:row-span-1 max-lg:min-h-[380px] max-sm:col-span-1",
  md: "col-span-3 row-span-2 min-h-[540px] max-lg:col-span-1 max-lg:row-span-1 max-lg:min-h-[380px] max-sm:col-span-1",
  mh: "col-span-4 row-span-1 min-h-[360px] max-lg:col-span-2 max-lg:min-h-[420px] max-sm:col-span-1",
  sm: "col-span-3 row-span-1 min-h-[360px] max-lg:col-span-1 max-lg:min-h-[380px] max-sm:col-span-1",
  xs: "col-span-2 row-span-1 min-h-[360px] max-lg:col-span-1 max-lg:min-h-[380px] max-sm:col-span-1",
};
