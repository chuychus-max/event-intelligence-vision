"use client";

import { evoFacts, evoFlow, evoQuestions, evoSuccess, mexicoPayStats, mexicoPosMix } from "@/lib/data";
import { CountUp, KeyFacts, QualityBadge, Section, SourceLink, useInView } from "./ui";
import { HBarChart } from "./charts";

const FICHA = [
  ["Empresa", "EVO Payments · parte de Global Payments desde mar 2023 (≈US$4 mil M)"],
  ["En México", "Adquirente de Banamex desde 2015 (“Servicios de Pago Banamex, operado por EVO”)"],
  ["Con OCESA", "Banamex es el socio cashless de festivales, F1 y EDC. Procesador de las pulseras: por confirmar"],
  ["En el mundo", "Global Payments + Worldpay: 6 M+ comercios, 175+ países"],
  ["En recintos", "160 estadios y recintos; POS de recinto Genius"],
];

const CORPUS = [
  { v: 5, f: (x: number) => `${Math.round(x)}`, k: "Documentos de investigación" },
  { v: 245, f: (x: number) => `${Math.round(x)}`, k: "Fuentes citadas" },
  { v: 170, f: (x: number) => `${Math.round(x)}`, k: "Dominios distintos" },
  { v: 17800, f: (x: number) => `${(Math.round(x / 100) * 100).toLocaleString("es-MX")}`, k: "Palabras de análisis" },
];

function Flow() {
  const [ref, inView] = useInView<HTMLOListElement>(0.3);
  return (
    <ol ref={ref} className="relative grid gap-px border border-line bg-[var(--border)] sm:grid-cols-3 lg:grid-cols-6">
      {evoFlow.map((s, i) => (
        <li
          key={s.step}
          className={`relative bg-surface p-4 transition-colors duration-700 ${inView ? "" : ""}`}
          style={{ transitionDelay: `${i * 180}ms`, background: inView && (s.step === "EVO · Global Payments" || s.step === "Event Intelligence") ? "var(--surface-2)" : undefined }}
        >
          <p className="tabular text-[10px] text-muted">0{i + 1}</p>
          <p className="tracked-sm mt-3 text-[11px] leading-relaxed">{s.step}</p>
          <p className="mt-2 text-xs font-light leading-snug text-ink-2">{s.detail}</p>
          {i < evoFlow.length - 1 && (
            <span aria-hidden className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 bg-surface px-0.5 text-ink lg:block">
              →
            </span>
          )}
        </li>
      ))}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-0.5 bg-ink"
        style={{ width: inView ? "100%" : "0%", transition: "width 2.4s cubic-bezier(0.2,0.7,0.1,1)" }}
      />
    </ol>
  );
}

export function EvoKnowledge() {
  return (
    <Section
      id="evo"
      index={8}
      summary={<KeyFacts items={[{ value: "~900 M", label: "Transacciones/año de EVO en México" }, { value: "160", label: "Recintos con Global Payments" }, { value: "35%", label: "Pagos en efectivo en punto de venta MX" }]} note="EVO es el adquirente de Banamex, socio cashless de OCESA: el dato de pago ya existe y su dueño ya está en la mesa." />}
      eyebrow="Base de conocimiento · EVO Payments"
      title="El pago es el sensor más preciso del recinto"
      lead="Todo lo que ya sabemos de EVO Payments y Global Payments, y por qué eso hace viable el proyecto: el dato de pago existe, tiene dueño identificable y el socio ya está sentado con OCESA."
    >
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <dl className="border-t border-ink text-xs">
          {FICHA.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-line py-2.5">
              <dt className="uppercase tracking-[0.16em] text-muted">{k}</dt>
              <dd className="leading-relaxed text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="grid grid-cols-2 gap-px border border-line bg-[var(--border)]">
          {evoFacts.map((f) => (
            <div key={f.label} className="flex flex-col bg-surface p-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted">{f.label}</p>
              <p className="display mt-2 text-2xl font-bold">{f.value}</p>
              <p className="mt-2 text-[11px] font-light leading-snug text-ink-2">{f.detail}</p>
              <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                <QualityBadge quality={f.quality} />
                <SourceLink source={f.source} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="tracked-sm mt-14 text-[11px] text-muted">Cómo fluye un pago hasta una decisión</h3>
      <div className="mt-4">
        <Flow />
      </div>
      <p className="mt-3 text-[11px] text-muted">
        <span className="font-semibold text-ink">Fig. 08</span> — Del tap en la barra a la decisión en el centro de mando. El dato sale de EVO/Banamex en
        agregado; Event Intelligence lo cruza con el mapa del recinto, los escaneos y el horario.
      </p>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="tracked-sm text-[11px] text-muted">México · cómo se paga en punto de venta (2024)</p>
          <div className="mt-5">
            <HBarChart data={mexicoPosMix.map((m) => ({ label: m.label, value: m.value, color: "var(--ink)" }))} format={(v) => `${Math.round(v)}%`} />
          </div>
          <p className="mt-2 text-[11px] text-muted">
            Fuente: Worldpay Global Payments Report 2025 vía{" "}
            <SourceLink source={{ label: "Payments CMI", url: "https://paymentscmi.com/insights/main-payment-methods-latin-america-brazil-mexico-chile-peru-colombia-argentina/" }} />
          </p>
          <div className="mt-6 grid gap-px border border-line bg-[var(--border)] sm:grid-cols-3">
            {mexicoPayStats.map((s) => (
              <div key={s.label} className="bg-surface p-4">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted">{s.label}</p>
                <p className="display mt-1 text-xl font-bold">{s.value}</p>
                <p className="mt-1 text-[11px] font-light leading-snug text-ink-2">{s.detail}</p>
                <div className="mt-2">
                  <SourceLink source={s.source} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="tracked-sm text-[11px] text-muted">Por qué este conocimiento hace viable el proyecto</p>
          <ol className="mt-5">
            {evoSuccess.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-line py-3">
                <span className="tabular text-sm text-muted">{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="mt-0.5 text-xs font-light leading-relaxed text-ink-2">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="tracked-sm text-[11px] text-muted">Lo que confirmamos en la primera reunión</p>
          <ol className="mt-4 border-t border-ink">
            {evoQuestions.map((q, i) => (
              <li key={q} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-line py-2.5 text-sm">
                <span className="tabular text-muted">{String(i + 1).padStart(2, "0")}</span>
                {q}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[11px] text-muted">
            Los datos de pago son financieros: sólo trabajamos con agregados o tokenizados, previa revisión legal (LFPDPPP).
          </p>
        </div>
        <div className="invert p-6">
          <p className="tracked-sm text-[10px] text-muted">Base de conocimiento del proyecto</p>
          <div className="mt-5 grid grid-cols-2 gap-6">
            {CORPUS.map((c) => (
              <div key={c.k}>
                <p className="display text-3xl font-bold">
                  <CountUp value={c.v} format={c.f} />
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted">{c.k}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 border-t border-line pt-4 text-xs font-light leading-relaxed text-ink-2">
            Mercado, tecnología global, OCESA y Ticketmaster, benchmark México–mundo, regulación 2025–2026, competencia y EVO/Global Payments. Cada cifra
            con su fuente y su calidad.
          </p>
        </div>
      </div>
    </Section>
  );
}
