"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { Project } from "@/types/project";
import { GALLERY_SPAN_CLASSES } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Galería WebGL (three.js)                                                    */
/*                                                                            */
/*  El layout lo hace el CSS grid de siempre (responsive, con sus spans). Cada */
/*  tile del DOM queda como capa de accesibilidad/SEO y como MEDIDA: leemos su  */
/*  posición y tamaño y montamos un plano WebGL exactamente encima. Así el      */
/*  three.js hereda el grid creativo gratis y le suma las animaciones.         */
/*                                                                            */
/*  Animaciones: entrada en cascada al entrar en viewport, hover con brillo +   */
/*  un pelo de escala, y parallax suave con el mouse. Esquinas redondeadas por  */
/*  shader. El canvas va con pointer-events:none: el hover lo maneja el tile    */
/*  del DOM que está debajo.                                                   */
/*                                                                            */
/*  Fallback: si no hay WebGL o el sistema pide menos movimiento, se queda el   */
/*  grid del DOM tal cual (sin canvas).                                        */
/* -------------------------------------------------------------------------- */

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  uniform sampler2D uTex;
  uniform float uImgAspect;
  uniform float uPlaneAspect;
  uniform float uReveal;
  uniform float uHover;
  uniform vec2  uSize;
  uniform float uRadius;
  uniform bool  uHasTex;
  varying vec2 vUv;

  // SDF de rectángulo redondeado (en px, centrado)
  float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + r;
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
  }

  void main() {
    // UV tipo object-cover
    vec2 uv = vUv;
    if (uImgAspect > uPlaneAspect) {
      float s = uPlaneAspect / uImgAspect;
      uv.x = (uv.x - 0.5) * s + 0.5;
    } else {
      float s = uImgAspect / uPlaneAspect;
      uv.y = (uv.y - 0.5) * s + 0.5;
    }

    vec3 base;
    if (uHasTex) {
      vec3 tex = texture2D(uTex, uv).rgb;
      float lum = dot(tex, vec3(0.299, 0.587, 0.114));
      vec3 desat = mix(vec3(lum), tex, 0.74) * 0.98;   // look apagado en reposo
      base = mix(desat, tex, uHover);                  // se aviva al hover
      base *= mix(1.0, 1.06, uHover);
    } else {
      base = vec3(0.86, 0.88, 0.905);                  // placeholder ice mientras carga
    }

    // Máscara de esquinas redondeadas
    vec2 p = (vUv - 0.5) * uSize;
    float d = sdRoundRect(p, uSize * 0.5, uRadius);
    float mask = 1.0 - smoothstep(-1.0, 1.0, d);

    gl_FragColor = vec4(base, uReveal * mask);
  }
`;

interface TileState {
  mesh: THREE.Mesh;
  mat: THREE.ShaderMaterial;
  baseX: number;
  baseY: number;
  w: number;
  h: number;
  depth: number;
  reveal: number;
  hover: number;
  t0: number;
  loaded: boolean;
}

interface ProjectGalleryProps {
  project: Project;
}

export function ProjectGallery({ project }: ProjectGalleryProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoveredRef = useRef(-1);
  const enViewRef = useRef(false);
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const grid = gridRef.current;
    if (!container || !grid) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // fallback: grid del DOM

    // El renderer crea su propio canvas y lo montamos en el contenedor. Así el
    // doble montaje de React Strict Mode (dev) no reusa un canvas cuyo contexto
    // ya se liberó en el cleanup: cada montaje estrena canvas.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; // fallback
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    const glCanvas = renderer.domElement;
    glCanvas.style.position = "absolute";
    glCanvas.style.inset = "0";
    glCanvas.style.width = "100%";
    glCanvas.style.height = "100%";
    glCanvas.style.display = "block";
    container.appendChild(glCanvas);

    setWebgl(true);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100);
    const geo = new THREE.PlaneGeometry(1, 1);
    const loader = new THREE.TextureLoader();

    const tiles = tileRefs.current.filter(Boolean) as HTMLDivElement[];
    const estados: TileState[] = [];

    tiles.forEach((tile, i) => {
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTex: { value: null },
          uImgAspect: { value: 1 },
          uPlaneAspect: { value: 1 },
          uReveal: { value: 0 },
          uHover: { value: 0 },
          uSize: { value: new THREE.Vector2(1, 1) },
          uRadius: { value: 14 },
          uHasTex: { value: false },
        },
      });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      const st: TileState = {
        mesh,
        mat,
        baseX: 0,
        baseY: 0,
        w: 1,
        h: 1,
        depth: 0.4 + Math.random() * 0.9,
        reveal: 0,
        hover: 0,
        t0: -1,
        loaded: false,
      };
      estados.push(st);

      const src = project.gallery[i]?.src;
      if (src) {
        loader.load(src, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          const img = tex.image as HTMLImageElement;
          mat.uniforms.uTex.value = tex;
          mat.uniforms.uImgAspect.value =
            img && img.height ? img.width / img.height : 1;
          mat.uniforms.uHasTex.value = true;
          st.loaded = true;
        });
      } else {
        st.loaded = true;
      }
    });

    // Coloca/redimensiona cada plano leyendo el tile del DOM que tiene debajo.
    let W = 0;
    let H = 0;
    const medir = () => {
      W = grid.offsetWidth;
      H = grid.offsetHeight;
      renderer.setSize(W, H, false);
      camera.left = -W / 2;
      camera.right = W / 2;
      camera.top = H / 2;
      camera.bottom = -H / 2;
      camera.updateProjectionMatrix();

      tiles.forEach((tile, i) => {
        const st = estados[i];
        const w = tile.offsetWidth;
        const h = tile.offsetHeight;
        const cx = tile.offsetLeft + w / 2;
        const cy = tile.offsetTop + h / 2;
        st.w = w;
        st.h = h;
        st.baseX = cx - W / 2;
        st.baseY = H / 2 - cy;
        st.mat.uniforms.uPlaneAspect.value = h ? w / h : 1;
        st.mat.uniforms.uSize.value.set(w, h);
      });
    };
    medir();

    // Hover: lo dictan los tiles del DOM (el canvas no recibe puntero).
    const enter = (i: number) => () => (hoveredRef.current = i);
    const leave = (i: number) => () => {
      if (hoveredRef.current === i) hoveredRef.current = -1;
    };
    tiles.forEach((tile, i) => {
      tile.addEventListener("pointerenter", enter(i));
      tile.addEventListener("pointerleave", leave(i));
    });

    // Parallax con el mouse (suave, se lerpea).
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      const r = grid.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    grid.addEventListener("pointermove", onMove, { passive: true });
    const onLeaveGrid = () => {
      mouse.tx = 0;
      mouse.ty = 0;
      hoveredRef.current = -1;
    };
    grid.addEventListener("pointerleave", onLeaveGrid);

    // Reveal + pausa fuera de viewport
    const io = new IntersectionObserver(
      ([e]) => (enViewRef.current = e.isIntersecting),
      { threshold: 0.08 },
    );
    io.observe(grid);

    const ro = new ResizeObserver(medir);
    ro.observe(grid);

    let raf = 0;
    const loop = (t: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      estados.forEach((st, i) => {
        if (st.loaded && enViewRef.current && st.t0 < 0) st.t0 = t + i * 75;
        const target = st.t0 >= 0 && t >= st.t0 ? 1 : 0;
        st.reveal += (target - st.reveal) * 0.09;
        const h = hoveredRef.current === i ? 1 : 0;
        st.hover += (h - st.hover) * 0.12;

        st.mat.uniforms.uReveal.value = st.reveal;
        st.mat.uniforms.uHover.value = st.hover;

        const s = 0.92 + 0.08 * st.reveal + 0.045 * st.hover;
        st.mesh.scale.set(st.w * s, st.h * s, 1);
        st.mesh.position.x = st.baseX + mouse.x * st.depth * 16;
        st.mesh.position.y =
          st.baseY + mouse.y * st.depth * 16 + (1 - st.reveal) * 34;
        st.mesh.renderOrder = st.hover > 0.01 ? 1 : 0;
      });

      if (enViewRef.current) renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", onLeaveGrid);
      tiles.forEach((tile, i) => {
        tile.removeEventListener("pointerenter", enter(i));
        tile.removeEventListener("pointerleave", leave(i));
      });
      estados.forEach((st) => {
        st.mat.uniforms.uTex.value?.dispose?.();
        st.mat.dispose();
      });
      geo.dispose();
      renderer.dispose();
      if (glCanvas.parentNode === container) container.removeChild(glCanvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.slug]);

  return (
    <section className="bg-paper-bone px-[clamp(1rem,3vw,3rem)] py-[clamp(4rem,8vw,8rem)]">
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-[clamp(2rem,4vw,4rem)] flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-kicker text-ink-700">
            selección visual
          </span>
          <h2 className="m-0 font-display text-display-xl font-normal text-ink-900">
            Aplicaciones del sistema.
          </h2>
        </header>

        <div className="relative">
          {/* Grid del DOM: layout + accesibilidad + fallback. Cuando corre el
              WebGL se atenúa y el canvas de arriba muestra la versión animada. */}
          <div
            ref={gridRef}
            className={`grid auto-rows-[minmax(240px,auto)] grid-cols-6 gap-[clamp(0.5rem,0.8vw,1rem)] [grid-auto-flow:dense] transition-opacity duration-700 max-md:grid-cols-2 max-sm:grid-cols-1 ${
              webgl ? "opacity-0" : "opacity-100"
            }`}
          >
            {project.gallery.map((img, i) => (
              <div
                key={i}
                ref={(el) => {
                  tileRefs.current[i] = el;
                }}
                className={`relative isolate overflow-hidden rounded-tile bg-paper-ice ${GALLERY_SPAN_CLASSES[img.span]}`}
              >
                <Image
                  src={img.src}
                  alt={img.label}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectPosition: img.position ?? "center" }}
                  className="object-cover [filter:saturate(0.74)_brightness(0.98)]"
                />
                {img.label && (
                  <span className="absolute inset-x-4 bottom-4 z-[2] font-mono text-xs uppercase tracking-kicker text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]">
                    {img.label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Canvas WebGL: encima del grid, sin capturar el puntero (el hover lo
              maneja el tile del DOM de abajo). aria-hidden porque el contenido
              real y accesible es el grid. */}
          <div
            ref={containerRef}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
              webgl ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </section>
  );
}
