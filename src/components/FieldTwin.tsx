"use client";

import { useState } from "react";
import { areas } from "@/lib/data";
import { Section } from "./ui";
import { TwinCanvas } from "./TwinCanvas";

export function FieldTwin() {
  const [i, setI] = useState(0);
  const a = areas[i];

  return (
    <Section
      id="gemelo"
      index={5}
      eyebrow="Gemelo digital en campo"
      title="Un mismo recinto, seis formas de verlo"
      lead="Cada área entra al mismo gemelo digital y ve sólo lo suyo: dónde mirar, qué decidir y con qué número rendir cuentas. Arrastra para girar el estadio. Ilustración con datos sintéticos."
    >
      <div role="tablist" aria-label="Áreas" className="-mx-1 flex gap-1 overflow-x-auto pb-1">
        {areas.map((x, k) => (
          <button
            key={x.layer}
            type="button"
            role="tab"
            aria-selected={i === k}
            onClick={() => setI(k)}
            className={`shrink-0 border px-3 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors ${
              i === k ? "border-ink bg-ink text-surface" : "border-line text-ink-2 hover:border-ink hover:text-ink"
            }`}
          >
            <span className="tabular mr-2 opacity-70">0{k + 1}</span>
            {x.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        <div className="crop blueprint relative overflow-hidden border border-line bg-[#f7f6f2]">
          <TwinCanvas mode="layers" layer={a.layer} className="h-[420px] w-full sm:h-[540px]" />
          <div className="pointer-events-none absolute left-4 top-4 text-[10px] uppercase tracking-[0.2em] text-ink-2">
            Capa · <span className="text-accent">{a.name}</span>
          </div>
          <div className="pointer-events-none absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.2em] text-muted">Arrastra para girar ↻</div>
        </div>

        <div key={a.layer} className="flex animate-[fadein_0.5s_ease] flex-col border border-line">
          <div className="border-b border-line p-5">
            <p className="tracked-sm text-[10px] text-muted">Quién</p>
            <p className="mt-1 text-sm text-ink">{a.who}</p>
          </div>
          <dl className="divide-y divide-[var(--border)]">
            {[
              ["Qué ve", a.sees],
              ["Qué decide", a.decides],
              ["Su número", a.kpi],
              ["Tecnología en campo", a.tech],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 px-5 py-3">
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted">{k}</dt>
                <dd className="text-sm font-light text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto grid grid-cols-2 border-t border-line">
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Hoy</p>
              <p className="mt-2 text-sm font-light text-ink-2">{a.before}</p>
            </div>
            <div className="border-l border-line bg-accent-soft p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-accent">Con Event Intelligence</p>
              <p className="mt-2 text-sm text-ink">{a.after}</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
