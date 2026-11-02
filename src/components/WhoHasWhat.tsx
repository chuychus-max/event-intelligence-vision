"use client";

import { useState } from "react";
import { capabilities, players, type Have } from "@/lib/data";
import { KeyFacts, Section } from "./ui";

const MARK: Record<Have, { sym: string; label: string; className: string }> = {
  si: { sym: "●", label: "Lo tiene", className: "text-ink" },
  parcial: { sym: "◐", label: "Parcial o fuera de México", className: "text-ink-2" },
  "no-visto": { sym: "·", label: "No visto en fuentes públicas", className: "text-muted" },
  nuevo: { sym: "✦", label: "Lo aportamos nosotros", className: "text-accent" },
};

export function WhoHasWhat() {
  const [onlyNew, setOnlyNew] = useState(false);
  const rows = onlyNew ? capabilities.filter((c) => c.us === "nuevo") : capabilities;

  return (
    <Section
      id="quien"
      index={3}
      summary={<KeyFacts items={[{ value: "OCESA", label: "Tiene el recinto y el evento" }, { value: "TM · LN", label: "Tienen el boleto y el fan" }, { value: "7 ✦", label: "Capacidades nuevas que aportamos" }]} note="No competimos con ninguno: unimos sus datos y entregamos operación, cumplimiento y patrocinio medidos." />}
      eyebrow="Quién tiene qué"
      title="Ellos tienen el recinto y el boleto. Nosotros, la inteligencia que los une"
      lead="No competimos con OCESA ni con Ticketmaster: nos sentamos encima de lo que ya tienen y entregamos algo que hoy no se ve en el mercado mexicano."
    >
      <div className="grid gap-px border border-line bg-[var(--border)] md:grid-cols-3">
        {players.map((p, i) => (
          <div key={p.id} className={`flex flex-col p-6 ${p.id === "us" ? "invert" : "bg-surface"}`}>
            <p className="tabular text-[11px] text-muted">0{i + 1}</p>
            <h3 className="tracked mt-4 text-sm">{p.name}</h3>
            <p className={`mt-1 text-xs italic ${p.id === "us" ? "text-accent" : "text-ink-2"}`}>{p.tagline}</p>
            <ul className="mt-6 space-y-2.5">
              {p.owns.map((o) => (
                <li key={o} className="flex gap-3 text-sm font-light leading-snug">
                  <span aria-hidden className={p.id === "us" ? "text-accent" : "text-ink"}>
                    {p.id === "us" ? "✦" : "●"}
                  </span>
                  <span className={p.id === "us" ? "text-ink" : "text-ink-2"}>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-ink-2">
          {(Object.keys(MARK) as Have[]).map((k) => (
            <li key={k} className="flex items-center gap-1.5">
              <span aria-hidden className={`text-base leading-none ${MARK[k].className}`}>
                {MARK[k].sym}
              </span>
              {MARK[k].label}
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-pressed={onlyNew}
          onClick={() => setOnlyNew((v) => !v)}
          className={`border px-3 py-2 text-[11px] uppercase tracking-[0.16em] ${onlyNew ? "border-ink bg-ink text-surface" : "border-line hover:border-ink"}`}
        >
          {onlyNew ? "Ver todo" : "Ver sólo lo nuevo ✦"}
        </button>
      </div>

      <div className="mt-4 overflow-x-auto border-t border-ink">
        <table className="w-full min-w-[640px] text-sm">
          <caption className="sr-only">Capacidades por actor</caption>
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-muted">
              <th className="py-3 pr-4 font-medium">Capacidad</th>
              <th className="w-28 py-3 text-center font-medium">OCESA</th>
              <th className="w-28 py-3 text-center font-medium">TM · LN</th>
              <th className="w-28 py-3 text-center font-semibold text-ink">ShipbayOS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={c.name} className={`border-t border-line ${c.us === "nuevo" ? "bg-accent-soft" : ""}`}>
                <th scope="row" className="py-3 pr-4 text-left font-normal">
                  <span className="tabular mr-3 text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  {c.name}
                  {c.note && <span className="mt-0.5 block pl-8 text-[11px] font-light italic text-muted">{c.note}</span>}
                </th>
                {(["ocesa", "tm", "us"] as const).map((k) => (
                  <td key={k} className="py-3 text-center">
                    <span aria-label={MARK[c[k]].label} className={`text-lg ${MARK[c[k]].className}`}>
                      {MARK[c[k]].sym}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-muted">
        &ldquo;No visto&rdquo; significa que no apareció en fuentes públicas; puede existir de forma interna. Lo confirmamos en la primera reunión.
      </p>
    </Section>
  );
}
