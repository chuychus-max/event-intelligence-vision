"use client";

import { useState, type ReactNode } from "react";
import { genZBarriers, regulatoryTimeline, spendSignals } from "@/lib/data";
import { CountUp, KeyFacts, Section, SourceLink, Stars, useInView } from "./ui";
import { DumbbellChart, HBarChart } from "./charts";

function Meter({ value, label }: { value: number; label: string }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between text-xs text-ink-2">
        <span>{label}</span>
        <span className="tabular font-semibold text-ink">{value}%</span>
      </div>
      <div className="mt-2 h-3 w-full bg-[var(--seq-1)]" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label={label}>
        <div className="grow-bar h-full bg-accent" style={{ width: inView ? `${value}%` : "0%" }} />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted">
        <span>Apertura de puertas</span>
        <span>Últimos 30 min</span>
      </div>
    </div>
  );
}

function ColumnPair({ a, b }: { a: { label: string; value: number }; b: { label: string; value: number } }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const max = 40;
  const col = (d: { label: string; value: number }, color: string) => (
    <div className="flex flex-1 flex-col items-center justify-end gap-2">
      <span className="tabular text-sm font-semibold">US${d.value.toFixed(1)} mil M</span>
      <div className="relative w-full max-w-[64px]" style={{ height: 180 }}>
        <div
          className="absolute bottom-0 w-full rounded-t-[4px]"
          style={{ height: inView ? `${(d.value / max) * 100}%` : "0%", background: color, transition: "height 1.3s cubic-bezier(0.2,0.7,0.1,1)" }}
        />
      </div>
      <span className="tabular text-xs text-muted">{d.label}</span>
    </div>
  );
  return (
    <div ref={ref} className="flex items-end gap-6 border-b border-[var(--baseline)] px-4">
      {col(a, "var(--series-muted)")}
      {col(b, "var(--series-1)")}
    </div>
  );
}

interface Idea {
  title: string;
  stars: number;
  hero: ReactNode;
  heroLabel: string;
  text: string;
  meaning: string;
  chartTitle: string;
  chart: ReactNode;
  source: { label: string; url: string };
}

const IDEAS: Idea[] = [
  {
    title: "Cada año va más gente a conciertos",
    stars: 3,
    hero: <CountUp value={159} format={(v) => `${Math.round(v)} M`} />,
    heroLabel: "personas fueron a un evento de Live Nation en 2025 (+5% contra 2024)",
    text: "Y 2026 va mejor: la venta de boletos ya va 11% arriba. El precio pesa cada vez menos: en EE.UU., los jóvenes de la Gen Z gastan US$101 al mes en música en vivo, más que cualquier otra generación.",
    meaning: "La gente va a seguir llegando. Lo que va a diferenciar a un recinto es qué tan bien la pasa adentro.",
    chartTitle: "Jóvenes Gen Z en EE.UU. que dicen que esto les impide ir a un concierto",
    chart: (
      <DumbbellChart
        data={genZBarriers.map((b) => ({ label: b.label, from: b.y2024, to: b.y2026 }))}
        fromLabel="2024"
        toLabel="2026"
        format={(v) => `${Math.round(v)}%`}
      />
    ),
    source: { label: "Live Nation 2T 2026 · Luminate", url: "https://news.livenationentertainment.com/news/live-nation-entertainment-reports-second-quarter-2026-results" },
  },
  {
    title: "El dinero ya se gana adentro, no en la taquilla",
    stars: 3,
    hero: <CountUp value={3} format={(v) => `×${Math.max(1, Math.round(v))}`} />,
    heroLabel: "creció el gasto por persona dentro del Estadio GNP Seguros tras su remodelación",
    text: "Lo que más crece no es el boleto: es la comida, la bebida, las zonas premium y el patrocinio. Lo reporta Live Nation en México y en el mundo.",
    meaning: "Cada minuto en una fila es un minuto sin comprar. Operar mejor el recinto es vender más.",
    chartTitle: "Cuánto creció el gasto dentro del recinto · cada barra es un caso distinto",
    chart: (
      <HBarChart
        data={spendSignals.map((s) => ({ label: s.label, value: s.value, display: s.note ? `+${s.value}% (${s.note})` : `+${s.value}%` }))}
        format={(v) => `+${Math.round(v)}%`}
        axisFormat={(v) => `${Math.round(v)}%`}
      />
    ),
    source: { label: "Live Nation 3T 2025 · 2T 2026", url: "https://news.livenationentertainment.com/news/live-nation-entertainment-third-quarter-2025-results" },
  },
  {
    title: "Casi todos llegan en la misma media hora",
    stars: 2,
    hero: <CountUp value={48.7} format={(v) => `${v.toFixed(1)}%`} />,
    heroLabel: "de la gente llega en los últimos 30 minutos antes del inicio (estudio en un estadio de EE.UU.)",
    text: "En esa media hora se forman las filas, se pierden ventas y sube el riesgo. Además, en México hubo cinco cambios de reglas entre 2025 y 2026 que piden demostrar cómo se opera cada evento.",
    meaning: "Hace falta ver el recinto en vivo, decidir a tiempo y dejar evidencia de lo que se hizo.",
    chartTitle: "Cuándo llega la gente y qué cambió en las reglas en México",
    chart: (
      <div className="space-y-6">
        <Meter value={48.7} label="Llega en los últimos 30 minutos" />
        <ol className="relative border-l border-[var(--baseline)] pl-5">
          {regulatoryTimeline.map((r) => (
            <li key={r.date} className="relative pb-4 last:pb-0">
              <span aria-hidden className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-accent" />
              <p className="tabular text-[11px] uppercase tracking-[0.14em] text-muted">{r.date}</p>
              <p className="text-sm font-semibold">{r.title}</p>
              <p className="text-xs font-light text-ink-2">{r.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    ),
    source: { label: "Georgia Tech · Profeco · CDMX", url: "https://capstone.isye.gatech.edu/node/6060" },
  },
  {
    title: "La tecnología para estadios ya es un mercado grande",
    stars: 3,
    hero: <CountUp value={14.4} format={(v) => `${v.toFixed(1)}%`} />,
    heroLabel: "crece cada año el mercado mundial de tecnología para estadios, hasta 2030",
    text: "Pasa de US$18.1 a US$39.6 mil millones entre 2024 y 2030: más del doble. Lo que más crece es el software. Sólo el de manejo de multitudes vale ~US$2–2.8 mil millones en 2026 y crece ~20% al año.",
    meaning: "No hay que inventar el mercado: hay que llegar primero en México.",
    chartTitle: "Mercado mundial de tecnología para estadios (smart stadium)",
    chart: <ColumnPair a={{ label: "2024", value: 18.1 }} b={{ label: "2030", value: 39.6 }} />,
    source: { label: "Grand View Research · 360iResearch", url: "https://www.securityworldmarket.com/int/News/Business-News/smart-stadiums-predicted-for-almost-40-billion-by-2030" },
  },
];

export function Market() {
  const [active, setActive] = useState(0);
  const idea = IDEAS[active];

  return (
    <Section
      id="mercado"
      index={1}
      summary={<KeyFacts items={[{ value: "159 M", label: "Personas en eventos de Live Nation 2025 (+5%)" }, { value: "×3", label: "Gasto por persona dentro del Estadio GNP" }, { value: "48.7%", label: "Llega en los últimos 30 minutos" }, { value: "14.4%", label: "Crece al año la tecnología para estadios" }]} note="Va más gente, gasta más adentro y llega toda junta. Quien opere mejor esa media hora vende más y corre menos riesgo." />}
      eyebrow="Mercado"
      title="El mercado en cuatro ideas"
      lead="Cuatro razones, en lenguaje simple, de por qué esto vale ahora. Elige una: verás el número clave, qué significa y una gráfica que lo explica."
    >
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <ol className="space-y-1" role="tablist" aria-label="Ideas del mercado">
          {IDEAS.map((it, i) => (
            <li key={it.title}>
              <button
                type="button"
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={`group grid w-full grid-cols-[2rem_1fr_auto] items-baseline gap-3 border-b border-line py-4 text-left transition-colors ${
                  active === i ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                <span className={`tabular text-sm ${active === i ? "text-accent" : ""}`}>{i + 1}</span>
                <span className={`text-sm sm:text-base ${active === i ? "font-semibold" : "font-light italic"}`}>{it.title}</span>
                <Stars value={it.stars} max={3} label={`Impacto ${it.stars} de 3`} />
              </button>
            </li>
          ))}
          <li className="pt-4 text-[11px] uppercase tracking-[0.16em] text-muted">
            <span className="tabular">
              {active + 1}/{IDEAS.length}
            </span>{" "}
            ·{" "}
            <button type="button" className="underline underline-offset-4 hover:text-accent" onClick={() => setActive((active + 1) % IDEAS.length)}>
              Siguiente idea →
            </button>
          </li>
        </ol>

        <div key={active} className="animate-[fadein_0.6s_ease] space-y-6" role="tabpanel">
          <div>
            <p className="display text-6xl font-bold text-ink sm:text-7xl">{idea.hero}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-ink-2">{idea.heroLabel}</p>
          </div>
          <p className="max-w-xl text-sm font-light leading-relaxed text-ink-2">{idea.text}</p>
          <p className="max-w-xl border-l-2 border-signal pl-3 text-sm leading-relaxed text-ink">
            <span className="mr-1 text-[10px] uppercase tracking-[0.16em] text-muted">Qué significa</span> {idea.meaning}
          </p>
          <div className="border-t border-line pt-6">
            <p className="mb-4 text-[11px] uppercase tracking-[0.14em] text-muted">{idea.chartTitle}</p>
            {idea.chart}
          </div>
          <p className="text-[11px] text-muted">
            Fuente: <SourceLink source={idea.source} />
          </p>
        </div>
      </div>
    </Section>
  );
}
