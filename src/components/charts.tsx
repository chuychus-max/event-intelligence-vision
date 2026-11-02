"use client";

import { useState } from "react";
import { useInView } from "./ui";

// Gráficas en HTML/CSS: barras ≤24px con extremo de 4px redondeado y base recta,
// rejilla en hairline, etiqueta de valor en la punta, tooltip en hover y foco.

function niceMax(v: number): number {
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / exp;
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((s) => n <= s) ?? 10;
  return step * exp;
}

// 4 o 5 divisiones, la que dé un paso "redondo" (1, 2, 2.5 o 5 × 10^k).
function ticksFor(max: number): number[] {
  const isNice = (x: number) => {
    const n = x / Math.pow(10, Math.floor(Math.log10(x)));
    return [1, 2, 2.5, 5].some((k) => Math.abs(n - k) < 1e-9);
  };
  const count = [4, 5].find((c) => isNice(max / c)) ?? 4;
  return Array.from({ length: count + 1 }, (_, i) => (max / count) * i);
}

interface Tip {
  x: number;
  y: number;
  value: string;
  label: string;
}

function Tooltip({ tip }: { tip: Tip | null }) {
  if (!tip) return null;
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-surface px-3 py-2 shadow-lg"
      style={{ left: tip.x, top: tip.y - 8 }}
    >
      <p className="tabular text-sm font-semibold text-ink">{tip.value}</p>
      <p className="max-w-56 text-xs text-ink-2">{tip.label}</p>
    </div>
  );
}

// Espacio reservado a la derecha para la etiqueta de valor en la punta de la barra.
const LABEL_SPACE = "6rem";

export interface BarDatum {
  label: string;
  value: number;
  sublabel?: string;
  color?: string; // variable CSS de la serie, p. ej. "var(--series-2)"
  display?: string;
}

export function HBarChart({
  data,
  format,
  axisFormat,
  legend,
  onBarClick,
}: {
  data: BarDatum[];
  format: (v: number) => string;
  axisFormat?: (v: number) => string;
  legend?: { label: string; color: string }[];
  onBarClick?: (label: string) => void;
}) {
  const [tip, setTip] = useState<Tip | null>(null);
  const [viewRef, inView] = useInView<HTMLDivElement>(0.3);
  const max = niceMax(Math.max(...data.map((d) => d.value)));
  const ticks = ticksFor(max);
  const fmtAxis = axisFormat ?? format;

  function show(e: React.SyntheticEvent<HTMLElement>, d: BarDatum) {
    const el = e.currentTarget;
    const parent = el.closest("[data-chart]") as HTMLElement;
    const r = el.getBoundingClientRect();
    const pr = parent.getBoundingClientRect();
    setTip({
      x: r.left - pr.left + r.width / 2,
      y: r.top - pr.top,
      value: d.display ?? format(d.value),
      label: d.sublabel ? `${d.label} · ${d.sublabel}` : d.label,
    });
  }

  return (
    <div data-chart ref={viewRef} className="relative">
      {legend && (
        <ul className="mb-4 flex flex-wrap gap-4 text-xs text-ink-2">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-1.5">
              <span aria-hidden className="h-2.5 w-2.5 rounded-sm" style={{ background: l.color }} />
              {l.label}
            </li>
          ))}
        </ul>
      )}
      <div className="space-y-3">
        {data.map((d) => {
          const full = (d.value / max) * 100;
          const pct = inView ? full : 0;
          return (
            <div key={d.label} className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,38%)_1fr] sm:items-center sm:gap-4">
              <div className="min-w-0 text-sm leading-snug text-ink-2">
                {d.label}
                {d.sublabel && <span className="block text-xs text-muted">{d.sublabel}</span>}
              </div>
              <div className="relative h-7" style={{ marginRight: LABEL_SPACE }}>
                {ticks.map((t) => (
                  <span
                    key={t}
                    aria-hidden
                    className="absolute inset-y-0 w-px"
                    style={{ left: `${(t / max) * 100}%`, background: t === 0 ? "var(--baseline)" : "var(--grid)" }}
                  />
                ))}
                <button
                  type="button"
                  aria-label={`${d.label}: ${d.display ?? format(d.value)}`}
                  onMouseEnter={(e) => show(e, d)}
                  onFocus={(e) => show(e, d)}
                  onMouseLeave={() => setTip(null)}
                  onBlur={() => setTip(null)}
                  onClick={() => onBarClick?.(d.label)}
                  className={`grow-bar absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-r-[4px] outline-offset-2 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-accent ${onBarClick ? "cursor-pointer" : ""}`}
                  style={{ width: `${Math.max(pct, 0.5)}%`, background: d.color ?? "var(--series-1)" }}
                />
                <span
                  className="tabular pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-2 text-xs font-medium text-ink"
                  style={{ left: `${pct}%`, transition: "left 1.3s cubic-bezier(0.2,0.7,0.1,1)" }}
                >
                  {d.display ?? format(d.value)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 hidden sm:grid sm:grid-cols-[minmax(0,38%)_1fr] sm:gap-4">
        <span />
        <div className="relative h-4" style={{ marginRight: LABEL_SPACE }}>
          {ticks.map((t, i) => (
            <span
              key={t}
              className="tabular absolute text-[11px] text-muted"
              style={{
                left: `${(t / max) * 100}%`,
                transform: i === 0 ? "none" : i === ticks.length - 1 ? "translateX(-100%)" : "translateX(-50%)",
              }}
            >
              {fmtAxis(t)}
            </span>
          ))}
        </div>
      </div>
      <Tooltip tip={tip} />
    </div>
  );
}

// Dos momentos por categoría (antes → después) en una sola escala.
export function DumbbellChart({
  data,
  fromLabel,
  toLabel,
  format,
  max = 100,
  fromColor = "var(--series-muted)",
  toColor = "var(--series-1)",
  onRowClick,
  selected,
  axisFormat,
}: {
  data: { label: string; from: number; to: number }[];
  fromLabel: string;
  toLabel: string;
  format: (v: number) => string;
  max?: number;
  fromColor?: string;
  toColor?: string;
  onRowClick?: (label: string) => void;
  selected?: string;
  axisFormat?: (v: number) => string;
}) {
  const [tip, setTip] = useState<Tip | null>(null);
  const [viewRef, inView] = useInView<HTMLDivElement>(0.12);
  const ticks = max === 5 ? [0, 1, 2, 3, 4, 5] : ticksFor(max);

  function show(e: React.SyntheticEvent<HTMLElement>, label: string, v: number, which: string) {
    const el = e.currentTarget;
    const parent = el.closest("[data-chart]") as HTMLElement;
    const r = el.getBoundingClientRect();
    const pr = parent.getBoundingClientRect();
    setTip({ x: r.left - pr.left + r.width / 2, y: r.top - pr.top, value: format(v), label: `${label} · ${which}` });
  }

  return (
    <div data-chart ref={viewRef} className="relative">
      <ul className="mb-4 flex flex-wrap gap-4 text-xs text-ink-2">
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: fromColor }} />
          {fromLabel}
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: toColor }} />
          {toLabel}
        </li>
      </ul>
      <div className="space-y-5">
        {data.map((d) => {
          const toShown = inView ? d.to : d.from;
          const isSel = selected === d.label;
          return (
            <div
              key={d.label}
              onClick={() => onRowClick?.(d.label)}
              className={`${onRowClick ? "-mx-2 cursor-pointer px-2 py-1.5 hover:bg-surface-2" : ""} ${isSel ? "bg-surface-2" : ""}`}
            >
              <div className="mb-2 flex items-baseline justify-between gap-2 text-sm">
                <span className={isSel ? "font-semibold text-ink" : "text-ink-2"}>{d.label}</span>
                <span className="tabular text-xs text-muted">
                  {format(d.from)} → <span className="font-semibold text-ink">{format(d.to)}</span>
                </span>
              </div>
              <div className="relative h-6">
                {ticks.map((t) => (
                  <span key={t} aria-hidden className="absolute inset-y-0 w-px" style={{ left: `${(t / max) * 100}%`, background: t === 0 ? "var(--baseline)" : "var(--grid)" }} />
                ))}
                <span
                  aria-hidden
                  className="absolute top-1/2 h-0.5 -translate-y-1/2"
                  style={{
                    left: `${(Math.min(d.from, toShown) / max) * 100}%`,
                    width: `${(Math.abs(d.from - toShown) / max) * 100}%`,
                    background: "var(--baseline)",
                    transition: "all 1.3s cubic-bezier(0.2,0.7,0.1,1)",
                  }}
                />
                {[
                  { v: d.to, shown: toShown, color: toColor, which: toLabel },
                  { v: d.from, shown: d.from, color: fromColor, which: fromLabel },
                ].map((p) => (
                  <button
                    key={p.which}
                    type="button"
                    aria-label={`${d.label}, ${p.which}: ${format(p.v)}`}
                    onMouseEnter={(e) => show(e, d.label, p.v, p.which)}
                    onFocus={(e) => show(e, d.label, p.v, p.which)}
                    onMouseLeave={() => setTip(null)}
                    onBlur={() => setTip(null)}
                    className="absolute top-1/2 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-accent"
                    style={{ left: `${(p.shown / max) * 100}%`, transition: "left 1.3s cubic-bezier(0.2,0.7,0.1,1)" }}
                  >
                    <span className="block h-3 w-3 rounded-full ring-2 ring-[var(--surface-1)]" style={{ background: p.color }} />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative mt-2 h-4">
        {ticks.map((t, i) => (
          <span
            key={t}
            className="tabular absolute text-[11px] text-muted"
            style={{ left: `${(t / max) * 100}%`, transform: i === 0 ? "none" : i === ticks.length - 1 ? "translateX(-100%)" : "translateX(-50%)" }}
          >
            {(axisFormat ?? format)(t)}
          </span>
        ))}
      </div>
      <Tooltip tip={tip} />
    </div>
  );
}
