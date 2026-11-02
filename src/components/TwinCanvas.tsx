"use client";

import { useEffect, useRef, useState } from "react";
import type { Layer, ProjectedLabel, TwinLabel, VenueTwin } from "@/lib/twin";

const TONE: Record<TwinLabel["tone"], string> = {
  good: "#4f7d5c",
  warn: "#c08a1e",
  bad: "#b4442c",
  info: "#4c4b47",
};
const TONE_TEXT: Record<TwinLabel["tone"], string> = {
  good: "OK",
  warn: "ATENCIÓN",
  bad: "CRÍTICO",
  info: "DATO",
};

// Lienzo WebGL con el gemelo digital. Se carga Three.js sólo en el navegador, se
// pausa fuera de pantalla y respeta "reducir movimiento" (imagen fija).
export function TwinCanvas({
  mode,
  layer = "ops",
  className = "",
  showLabels = true,
}: {
  mode: "hero" | "layers";
  layer?: Layer;
  className?: string;
  showLabels?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const twinRef = useRef<VenueTwin | null>(null);
  const labelEls = useRef<Record<string, HTMLDivElement | null>>({});
  const [labels, setLabels] = useState<TwinLabel[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = window.innerWidth < 700 || (navigator.hardwareConcurrency ?? 8) <= 4;

    import("@/lib/twin")
      .then(({ VenueTwin }) => {
        if (disposed || !canvasRef.current || !wrapRef.current) return;
        let twin: VenueTwin;
        try {
          twin = new VenueTwin(canvasRef.current, {
            mode,
            lowPower,
            onLabels: showLabels
              ? (pts: ProjectedLabel[]) => {
                  const w = wrapRef.current?.clientWidth ?? 0;
                  for (const p of pts) {
                    const el = labelEls.current[p.id];
                    if (!el) continue;
                    const half = el.offsetWidth / 2 + 8;
                    const x = Math.min(Math.max(p.x, half), w - half);
                    el.style.transform = `translate(${x}px, ${p.y}px) translate(-50%, -100%)`;
                    el.style.opacity = String(p.alpha);
                  }
                }
              : undefined,
          });
        } catch {
          setFailed(true);
          return;
        }
        twinRef.current = twin;
        twin.setLayer(layer);
        setLabels(twin.labels);
        const wrap = wrapRef.current;
        ro = new ResizeObserver(([e]) => twin.resize(Math.max(1, e.contentRect.width), Math.max(1, e.contentRect.height)));
        ro.observe(wrap);
        twin.resize(wrap.clientWidth, wrap.clientHeight);
        if (reduced) {
          twin.renderStill();
          return;
        }
        io = new IntersectionObserver(([e]) => twin.setRunning(e.isIntersecting), { threshold: 0.02 });
        io.observe(wrap);
      })
      .catch(() => setFailed(true));

    return () => {
      disposed = true;
      io?.disconnect();
      ro?.disconnect();
      twinRef.current?.dispose();
      twinRef.current = null;
    };
    // El modo no cambia en vida del componente; la capa se aplica en el efecto de abajo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, showLabels]);

  useEffect(() => {
    twinRef.current?.setLayer(layer);
  }, [layer]);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      {failed ? (
        <div className="grid h-full place-items-center p-6 text-center text-sm text-ink-2">
          Tu navegador no pudo iniciar WebGL. El gemelo digital necesita aceleración gráfica.
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="block h-full w-full cursor-grab active:cursor-grabbing"
          role="img"
          aria-label="Gemelo digital ilustrativo de un estadio: personas entrando por ocho puertas y capas de información por área. Arrastra para girar."
        />
      )}
      {showLabels &&
        labels.map((l) => (
          <div
            key={l.id}
            ref={(el) => {
              labelEls.current[l.id] = el;
            }}
            className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-300"
            style={{ willChange: "transform" }}
          >
            <div className="whitespace-nowrap border border-[var(--ink)] bg-[rgba(251,250,247,0.94)] px-2 py-1.5 font-mono text-[10px] leading-tight text-ink">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: TONE[l.tone] }} />
                <span className="uppercase tracking-[0.14em] text-ink-2">{l.title}</span>
              </div>
              <div className="mt-0.5 font-semibold">{l.value}</div>
              <span className="sr-only">{TONE_TEXT[l.tone]}</span>
            </div>
            <div className="mx-auto h-4 w-px bg-[var(--ink)]" />
          </div>
        ))}
    </div>
  );
}
