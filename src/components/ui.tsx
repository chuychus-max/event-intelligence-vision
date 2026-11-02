"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import type { Quality, Source, Stat } from "@/lib/data";
import { TOTAL, fmtMin, sectionMeta, useReadingMode } from "@/lib/reading";


// ─── Hooks ─────────────────────────────────────────────────────────────────

export function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

// Activa todas las hojas con data-reveal cuando entran en pantalla.
export function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return null;
}

// ─── Texto que se decodifica ───────────────────────────────────────────────

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";

export function Scramble({ text, className = "", as: Tag = "span" }: { text: string; className?: string; as?: "span" | "h1" | "h2" | "h3" | "p" }) {
  const [ref, inView] = useInView<HTMLElement>(0.4);
  const reduced = usePrefersReducedMotion();
  const [out, setOut] = useState(text);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || reduced || started.current) return;
    started.current = true;
    const dur = 900;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const reveal = Math.floor(p * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < reveal || ch === " " || ch === "," || ch === ".") s += ch;
        else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, text]);

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </Tag>
  );
}

export function CountUp({ value, format, className = "" }: { value: number; format: (v: number) => string; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.5);
  const reduced = usePrefersReducedMotion();
  const [v, setV] = useState(value);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || reduced || started.current) return;
    started.current = true;
    const t0 = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setV(value * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setV(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value]);
  return (
    <span ref={ref} className={`tabular ${className}`}>
      {format(v)}
    </span>
  );
}

// ─── Estructura ────────────────────────────────────────────────────────────

export function Section({
  id,
  index,
  eyebrow,
  title,
  lead,
  summary,
  alwaysOpen = false,
  children,
  variant = "sheet",
}: {
  id: string;
  index: number;
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  summary?: ReactNode;
  alwaysOpen?: boolean;
  children: ReactNode;
  variant?: "sheet" | "screen";
}) {
  const mode = useReadingMode();
  const [open, setOpen] = useState(false);
  const meta = sectionMeta(id);
  const collapsible = !!summary && !alwaysOpen;
  const showDetail = !collapsible || mode === "completo" || open;
  const minutes = meta ? (showDetail ? meta.full : meta.express) : null;
  const n = String(index).padStart(2, "0");
  const shell = variant === "sheet" ? "sheet" : "screen screen-panel text-ink";
  return (
    <section id={id} data-section={id} className="px-3 py-6 sm:px-6 sm:py-10">
      <div data-reveal className={`${shell} relative mx-auto max-w-6xl px-5 pb-14 pt-8 sm:px-12 sm:pb-16 sm:pt-10`}>
        <div className="tracked-sm flex items-center justify-between gap-4 text-[10px] text-muted sm:text-[11px]">
          <span>{eyebrow}</span>
          <span className="tabular flex items-center gap-3">
            {minutes !== null && <span className="font-normal normal-case tracking-normal">≈ {fmtMin(minutes)} de lectura</span>}
            <span>
              EI {n}/{TOTAL}
            </span>
          </span>
        </div>
        <Scramble as="h2" text={title} className="tracked mt-8 block max-w-4xl text-base sm:mt-10 sm:text-2xl" />
        {lead && <div className="mt-5 max-w-2xl text-sm font-light leading-relaxed text-ink-2 sm:text-[15px]">{lead}</div>}
        {summary && <div className="mt-8">{summary}</div>}
        {showDetail && <div className={`${summary ? "mt-12 border-t border-line pt-10" : "mt-10 sm:mt-12"} animate-[fadein_0.5s_ease]`}>{children}</div>}
        {collapsible && mode === "express" && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="mt-8 flex w-full items-center justify-between border-y border-ink py-3 text-[11px] uppercase tracking-[0.18em] hover:bg-surface-2"
          >
            <span>{open ? "Ocultar detalle" : "Ver detalle completo"}</span>
            <span className="tabular text-muted">
              {open ? "↑" : `≈ ${fmtMin(meta?.full ?? 1)} · ↓`}
            </span>
          </button>
        )}
        <p className="tabular absolute bottom-5 left-5 text-[11px] text-muted sm:left-12">
          <span className="font-semibold text-ink">EI</span> {n}/{TOTAL}
        </p>
      </div>
    </section>
  );
}

// Resumen de lectura rápida: tres o cuatro cifras con su etiqueta.
export function KeyFacts({ items, note }: { items: { value: string; label: string }[]; note?: string }) {
  return (
    <div>
      <dl className={`grid grid-cols-2 gap-px border border-line bg-[var(--border)] ${items.length > 3 ? "lg:grid-cols-4" : "sm:grid-cols-3"}`}>
        {items.map((it) => (
          <div key={it.label} className="bg-surface p-4 sm:p-5">
            <dd className="display text-2xl font-bold sm:text-3xl">{it.value}</dd>
            <dt className="mt-2 text-[11px] uppercase leading-snug tracking-[0.12em] text-ink-2">{it.label}</dt>
          </div>
        ))}
      </dl>
      {note && <p className="mt-3 max-w-3xl text-sm leading-relaxed">{note}</p>}
    </div>
  );
}

// Separador de acto.
export function ActDivider({ n, id, title, subtitle, minutes }: { n: number; id: string; title: string; subtitle: string; minutes: string }) {
  return (
    <div id={id} className="mx-auto max-w-6xl px-6 pb-2 pt-14 sm:px-10 sm:pt-20">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-4">
        <div>
          <p className="tabular text-[11px] text-muted">Acto {["I", "II", "III"][n - 1]}</p>
          <p className="tracked mt-2 text-xl sm:text-3xl">{title}</p>
        </div>
        <p className="text-right text-[11px] uppercase tracking-[0.16em] text-ink-2">
          {subtitle}
          <span className="tabular block text-muted normal-case tracking-normal">{minutes}</span>
        </p>
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`border border-line bg-surface p-5 sm:p-6 ${className}`}>{children}</div>;
}

const QUALITY_TEXT: Record<Quality, string> = {
  primaria: "Fuente primaria",
  secundaria: "Fuente secundaria",
  proyeccion: "Proyección propia",
};

export function QualityBadge({ quality }: { quality: Quality }) {
  const solid = quality === "primaria";
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] ${solid ? "text-ink" : "text-muted"}`}>
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${solid ? "bg-accent" : "border border-muted"}`} />
      {QUALITY_TEXT[quality]}
    </span>
  );
}

export function SourceLink({ source }: { source: Source }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-[11px] text-muted underline decoration-line underline-offset-2 hover:text-ink"
    >
      {source.label}
      <ExternalLink aria-hidden className="h-3 w-3" />
    </a>
  );
}

export function StatTile({ stat }: { stat: Stat }) {
  return (
    <Card className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-[0.14em] text-muted">{stat.label}</p>
      <p className="display text-3xl font-bold tracking-tight">{stat.value}</p>
      <p className="text-sm font-light leading-relaxed text-ink-2">{stat.detail}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-2">
        <QualityBadge quality={stat.quality} />
        <SourceLink source={stat.source} />
      </div>
    </Card>
  );
}

export function ChartCard({ title, subtitle, footnote, children }: { title: string; subtitle?: string; footnote?: ReactNode; children: ReactNode }) {
  return (
    <Card className="flex flex-col">
      <h3 className="text-sm font-semibold">{title}</h3>
      {subtitle && <p className="mt-1 text-xs font-light text-ink-2">{subtitle}</p>}
      <div className="mt-5">{children}</div>
      {footnote && <div className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-muted">{footnote}</div>}
    </Card>
  );
}

// Estrellas como en un dossier: * * * para niveles 1–5.
export function Stars({ value, max = 5, label }: { value: number; max?: number; label?: string }) {
  return (
    <span className="tabular whitespace-nowrap tracking-[0.3em]" aria-label={label ?? `${value} de ${max}`}>
      <span aria-hidden className="text-ink">{"*".repeat(value)}</span>
      <span aria-hidden className="text-line">{"*".repeat(Math.max(0, max - value))}</span>
    </span>
  );
}
