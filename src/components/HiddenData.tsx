"use client";

import { useState } from "react";
import { hiddenData, type Buyer } from "@/lib/data";
import { KeyFacts, Section } from "./ui";

const BUYERS: (Buyer | "Todos")[] = ["Todos", "Dirección", "Operaciones", "Comercial", "A&B", "Seguridad · PC", "ASG"];

export function HiddenData() {
  const [buyer, setBuyer] = useState<Buyer | "Todos">("Todos");
  const [onlyPay, setOnlyPay] = useState(false);
  const rows = hiddenData.filter((d) => (buyer === "Todos" || d.buyers.includes(buyer)) && (!onlyPay || d.payments));

  return (
    <Section
      id="datos"
      index={7}
      summary={<KeyFacts items={[{ value: "12", label: "Datos que no salen en ningún reporte" }, { value: "10", label: "Salen del dato de pago" }, { value: "6", label: "Áreas que los compran" }]} note="Ejemplos: costo de la fila en pesos, minuto de oro, aforo óptimo y derrama verificada." />}
      eyebrow="Datos que nadie está mirando"
      title="Doce datos que no salen en ningún reporte"
      lead="Lo obvio es contar gente y ventas. Lo valioso es cruzar fuentes que hoy viven separadas: escaneo con pago, pago con horario, horario con flujo. Cada dato responde una pregunta que alguien en OCESA o en la marca ya se hace, y casi todos salen de información que ya existe."
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filtrar por área" className="flex flex-wrap gap-1">
          {BUYERS.map((b) => (
            <button
              key={b}
              type="button"
              aria-pressed={buyer === b}
              onClick={() => setBuyer(b)}
              className={`border px-2.5 py-1.5 text-[11px] uppercase tracking-[0.14em] ${buyer === b ? "border-ink bg-ink text-surface" : "border-line text-ink-2 hover:border-ink"}`}
            >
              {b}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-[11px] uppercase tracking-[0.14em]">
          <input type="checkbox" checked={onlyPay} onChange={(e) => setOnlyPay(e.target.checked)} className="h-3.5 w-3.5 accent-[var(--ink)]" />
          Sólo los que salen del pago ◆
        </label>
      </div>

      <ol className="mt-8 grid gap-px border border-line bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((d) => (
          <li key={d.n} className="flex animate-[fadein_0.4s_ease] flex-col bg-surface p-5">
            <div className="flex items-baseline justify-between">
              <span className="display tabular text-3xl font-bold text-[var(--baseline)]">{String(d.n).padStart(2, "0")}</span>
              {d.payments && (
                <span className="text-[10px] uppercase tracking-[0.14em] text-ink-2" title="Sale del dato de pago (EVO · Global Payments / Banamex)">
                  ◆ Dato de pago
                </span>
              )}
            </div>
            <h3 className="tracked-sm mt-4 text-[12px] leading-relaxed">{d.name}</h3>
            <p className="mt-3 text-sm italic leading-snug text-ink">“{d.question}”</p>
            <dl className="mt-4 space-y-2 border-t border-line pt-3 text-xs">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.14em] text-muted">Por qué no es obvio</dt>
                <dd className="mt-0.5 font-light text-ink-2">{d.why}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.14em] text-muted">Sale de</dt>
                <dd className="mt-0.5 font-light text-ink-2">{d.from}</dd>
              </div>
            </dl>
            <p className="mt-auto flex flex-wrap gap-1 pt-4">
              {d.buyers.map((b) => (
                <span key={b} className="border border-line px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-ink-2">
                  {b}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[11px] text-muted">
        <span className="font-semibold text-ink">Fig. 07</span> — Propuesta de productos de datos. Los marcados ◆ dependen del convenio de datos de pago (ver
        EVO · Global Payments). Todo en agregado y sin datos personales.
      </p>
    </Section>
  );
}
