"use client";

import { useState } from "react";
import { sponsorContext, spots, type Spot } from "@/lib/data";
import { KeyFacts, Section, SourceLink, Stars, QualityBadge } from "./ui";
import { HBarChart } from "./charts";

const HOURS = ["16", "17", "18", "19", "20", "21", "22", "23"];
const TIER_STARS: Record<Spot["tier"], number> = { Oro: 3, Plata: 2, Bronce: 1 };

function VenueMap({ selected, onSelect }: { selected: number; onSelect: (id: number) => void }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Croquis del recinto con seis spots comerciales">
      <defs>
        <radialGradient id="spotglow">
          <stop offset="0%" stopColor="#1b1b1a" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#1b1b1a" stopOpacity="0" />
        </radialGradient>
        <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M4 0H0V4" fill="none" stroke="rgba(22,22,21,0.06)" strokeWidth="0.2" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid)" />
      <ellipse cx="50" cy="50" rx="42" ry="40" fill="none" stroke="rgba(22,22,21,0.35)" strokeWidth="0.25" strokeDasharray="1 1.5" />
      <ellipse cx="50" cy="50" rx="33" ry="30" fill="#fbfaf7" stroke="#1b1b1a" strokeWidth="0.3" />
      <ellipse cx="50" cy="50" rx="20" ry="17" fill="#efede7" stroke="rgba(22,22,21,0.45)" strokeWidth="0.2" />
      <rect x="27" y="45" width="5" height="10" fill="#1b1b1a" />
      <text x="29.5" y="60" textAnchor="middle" fontSize="2.4" fill="#8a8882" fontFamily="var(--font-mono)">
        ESCENARIO
      </text>
      {/* flujos hacia los spots */}
      {spots.map((s) => (
        <line
          key={`f${s.id}`}
          x1={50 + (s.x - 50) * 1.35}
          y1={50 + (s.y - 50) * 1.35}
          x2={s.x}
          y2={s.y}
          stroke="#1b1b1a"
          strokeOpacity={0.15 + (s.index / 100) * 0.45}
          strokeWidth="0.4"
          className="flow-line"
        />
      ))}
      {spots.map((s) => {
        const r = 2 + (s.index / 100) * 5;
        const isSel = s.id === selected;
        return (
          <g
            key={s.id}
            role="button"
            tabIndex={0}
            aria-label={`Spot ${s.id}, ${s.name}: índice ${s.index}`}
            onClick={() => onSelect(s.id)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(s.id)}
            className="cursor-pointer outline-none"
          >
            <circle cx={s.x} cy={s.y} r={r * 2.4} fill="url(#spotglow)" />
            <circle cx={s.x} cy={s.y} r={r} fill="none" stroke="#1b1b1a" strokeWidth="0.25" className="ping" />
            <circle cx={s.x} cy={s.y} r={isSel ? 2.6 : 2} fill={isSel ? "#1b1b1a" : "#fbfaf7"} stroke="#1b1b1a" strokeWidth="0.35" />
            <text x={s.x} y={s.y + 0.9} textAnchor="middle" fontSize="2.4" fontWeight="700" fill={isSel ? "#fbfaf7" : "#1b1b1a"} fontFamily="var(--font-mono)">
              {s.id}
            </text>
            <circle cx={s.x} cy={s.y} r="6" fill="transparent" />
          </g>
        );
      })}
    </svg>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const w = 240;
  const h = 64;
  const x = (i: number) => (i / (values.length - 1)) * w;
  const y = (v: number) => h - 4 - (v / 100) * (h - 8);
  const d = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const peak = values.indexOf(Math.max(...values));
  return (
    <svg viewBox={`0 0 ${w} ${h + 14}`} className="w-full" role="img" aria-label={`Tráfico relativo por hora; pico a las ${HOURS[peak]}:00`}>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="var(--accent)" opacity="0.1" />
      <line x1="0" x2={w} y1={h} y2={h} stroke="var(--baseline)" strokeWidth="1" />
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(peak)} cy={y(values[peak])} r="4" fill="var(--accent)" stroke="var(--surface-1)" strokeWidth="2" />
      {HOURS.map((hh, i) => (
        <text key={hh} x={x(i)} y={h + 12} textAnchor={i === 0 ? "start" : i === HOURS.length - 1 ? "end" : "middle"} fontSize="7" fill="var(--muted)" className="tabular">
          {hh}h
        </text>
      ))}
    </svg>
  );
}

export function SponsorSpots() {
  const [sel, setSel] = useState(1);
  const s = spots.find((x) => x.id === sel)!;

  return (
    <Section
      id="spots"
      index={6}
      summary={<KeyFacts items={[{ value: "US$845 M", label: "Patrocinio Live Nation 2025 (+11%)" }, { value: "6", label: "Spots medidos por recinto" }, { value: "4", label: "Pasos: medir, atribuir, reportar, renovar" }]} note="Cada spot con tráfico, permanencia, impresiones y ventas atribuidas: el patrocinio se renueva con números." />}
      eyebrow="Spots comerciales"
      title="Cada metro cuadrado del recinto es inventario que se puede medir"
      lead="Hoy el patrocinio se vende por ubicación e intuición. Con el gemelo, cada spot tiene tráfico, permanencia, impresiones y ventas atribuidas, medidos igual cada año. Así se pone precio y se renueva con números."
    >
      <div className="grid gap-px border border-line bg-[var(--border)] sm:grid-cols-3">
        {sponsorContext.map((c) => (
          <div key={c.label} className="flex flex-col bg-surface p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{c.label}</p>
            <p className="display mt-2 text-2xl font-bold">{c.value}</p>
            <p className="mt-2 text-xs font-light leading-relaxed text-ink-2">{c.detail}</p>
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
              <QualityBadge quality={c.quality} />
              <SourceLink source={c.source} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="crop blueprint relative aspect-square overflow-hidden border border-line bg-[#f7f6f2] text-ink">
          <VenueMap selected={sel} onSelect={setSel} />
          <p className="pointer-events-none absolute left-4 top-4 text-[10px] uppercase tracking-[0.2em] text-ink-2">Mapa de valor · toca un spot</p>
          <p className="pointer-events-none absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.2em] text-muted">Ejemplo con datos sintéticos</p>
        </div>

        <div key={s.id} className="flex animate-[fadein_0.5s_ease] flex-col border border-line">
          <div className="flex items-start justify-between gap-4 border-b border-line p-5">
            <div>
              <p className="tabular text-[11px] text-muted">SPOT {String(s.id).padStart(2, "0")} · {s.zone.toUpperCase()}</p>
              <h3 className="tracked mt-2 text-sm">{s.name}</h3>
            </div>
            <div className="text-right">
              <p className="display text-4xl font-bold">{s.index}</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Índice de valor</p>
            </div>
          </div>
          <dl className="grid grid-cols-2 border-b border-line">
            {[
              ["Tráfico pico", `${s.peak.toLocaleString("es-MX")}/h`],
              ["Permanencia", `${s.dwell} min`],
              ["Impresiones", s.impressions.toLocaleString("es-MX")],
              ["Ventas atribuidas", `${s.conversion}%`],
            ].map(([k, v], i) => (
              <div key={k} className={`p-4 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line" : ""}`}>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted">{k}</dt>
                <dd className="tabular mt-1 text-lg font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="border-b border-line p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Tráfico relativo por hora</p>
            <div className="mt-3">
              <Sparkline values={s.hourly} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 p-5">
            <p className="text-sm font-light italic text-ink-2">{s.insight}</p>
            <div className="shrink-0 text-right">
              <Stars value={TIER_STARS[s.tier]} max={3} label={`Nivel ${s.tier}`} />
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted">{s.tier}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="tracked-sm text-[11px] text-muted">Ranking de spots · índice de valor</p>
          <div className="mt-5">
            <HBarChart
              data={[...spots]
                .sort((a, b) => b.index - a.index)
                .map((x) => ({ label: `${x.id} · ${x.name}`, value: x.index, color: x.id === sel ? "var(--accent)" : "var(--series-muted)" }))}
              format={(v) => `${Math.round(v)}`}
              onBarClick={(label) => setSel(Number(label.split(" · ")[0]))}
            />
          </div>
          <p className="mt-3 text-[11px] text-muted">Índice = tráfico × permanencia × ventas atribuidas, normalizado a 100. Ejemplo ilustrativo.</p>
        </div>
        <div>
          <p className="tracked-sm text-[11px] text-muted">Lo que recibe la marca</p>
          <ol className="mt-5 space-y-0">
            {[
              ["Medir", "Tráfico, permanencia e impresiones del spot, por hora"],
              ["Atribuir", "Ventas en la barra de la marca (cashless) y escaneos QR/NFC"],
              ["Reportar", "Reporte automático al día siguiente, misma metodología siempre"],
              ["Renovar", "Precio por nivel (Oro, Plata, Bronce) con la evidencia del año"],
            ].map(([k, v], i) => (
              <li key={k} className="grid grid-cols-[2rem_6rem_1fr] items-baseline gap-3 border-b border-line py-3">
                <span className="tabular text-sm text-accent">{i + 1}</span>
                <span className="text-sm font-semibold">{k}</span>
                <span className="text-sm font-light text-ink-2">{v}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
