"use client";

import { useEffect, useMemo, useState } from "react";
import { benchmark, mexicoWins } from "@/lib/data";
import { CountUp, KeyFacts, Section, SourceLink, usePrefersReducedMotion } from "./ui";

const FLAP = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789·";

// Celda de tablero de aeropuerto: las letras "voltean" hasta quedar fijas.
function Flap({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const target = text.toUpperCase();
  const [shown, setShown] = useState(target);
  useEffect(() => {
    if (reduced) {
      setShown(target);
      return;
    }
    let frame = 0;
    const total = 14 + Math.floor(delay / 40);
    const id = setInterval(() => {
      frame++;
      const settled = Math.floor((frame / total) * target.length);
      let s = "";
      for (let i = 0; i < target.length; i++) {
        if (i < settled || target[i] === " ") s += target[i];
        else s += FLAP[Math.floor(Math.random() * FLAP.length)];
      }
      setShown(s);
      if (frame >= total) {
        setShown(target);
        clearInterval(id);
      }
    }, 40);
    return () => clearInterval(id);
  }, [target, delay, reduced]);
  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{shown}</span>
    </span>
  );
}

type Group = "nivel" | "corta" | "oportunidad" | "libre";

// Cuatro grupos en lenguaje simple, según la distancia entre México y el mundo.
const GROUPS: { id: Group; title: string; plain: string; tone: string }[] = [
  { id: "nivel", title: "México ya está al nivel", plain: "Aquí nos conectamos con lo que ya existe; no competimos.", tone: "var(--surface-3)" },
  { id: "corta", title: "Brecha corta", plain: "Ya existe en México; falta medirlo y conectarlo.", tone: "#f3d9b8" },
  { id: "oportunidad", title: "Oportunidad clara", plain: "Existe en el mundo y poco en México: espacio para llegar primero.", tone: "#efb25e" },
  { id: "libre", title: "Nadie lo hace aún en México", plain: "Sin evidencia pública en México: terreno libre.", tone: "#e8841f" },
];

function groupOf(c: { world: number; mexico: number }): Group {
  if (c.mexico === 0) return "libre";
  const gap = c.world - c.mexico;
  if (gap <= 0) return "nivel";
  if (gap === 1) return "corta";
  return "oportunidad";
}

// Dos barras finas: México (tinta) contra el mejor referente del mundo (gris).
function Score({ world, mexico }: { world: number; mexico: number }) {
  return (
    <span className="mt-2 block space-y-1" aria-label={`México ${mexico} de 5, mundo ${world} de 5`}>
      {[
        { k: "MX", v: mexico, c: "var(--ink)" },
        { k: "Mundo", v: world, c: "var(--baseline)" },
      ].map((r) => (
        <span key={r.k} className="grid grid-cols-[2.6rem_1fr_1.2rem] items-center gap-2 text-[10px] text-muted">
          <span className="uppercase tracking-[0.12em]">{r.k}</span>
          <span className="h-1.5 bg-[var(--seq-1)]">
            <span className="grow-bar block h-full" style={{ width: `${(r.v / 5) * 100}%`, background: r.c }} />
          </span>
          <span className="tabular text-right text-ink">{r.v}</span>
        </span>
      ))}
    </span>
  );
}

export function Benchmark() {
  const [sel, setSel] = useState("sponsor");
  const cap = benchmark.find((c) => c.id === sel)!;
  const byGroup = useMemo(() => {
    const m: Record<Group, typeof benchmark> = { nivel: [], corta: [], oportunidad: [], libre: [] };
    for (const c of benchmark) m[groupOf(c)].push(c);
    for (const g of Object.values(m)) g.sort((a, b) => b.world - b.mexico - (a.world - a.mexico));
    return m;
  }, []);
  const g = GROUPS.find((x) => x.id === groupOf(cap))!;
  const n = (k: Group) => byGroup[k].length;
  const opp = n("oportunidad") + n("libre");

  return (
    <Section
      id="benchmark"
      index={2}
      summary={
        <KeyFacts
          items={[
            { value: "#3", label: "México en música en vivo del mundo" },
            { value: String(benchmark.length), label: "Capacidades comparadas" },
            { value: String(opp), label: "Oportunidades para llegar primero" },
            { value: String(n("libre")), label: "Que nadie hace aún en México" },
          ]}
          note="México ya compite en boleto digital y pagos sin efectivo. Se queda atrás en medir spots comerciales, densidad de gente y operación con IA."
        />
      }
      eyebrow="Benchmark · México y el mundo"
      title="Dónde está el mundo, dónde está México"
      lead={`Comparamos ${benchmark.length} cosas que hace un recinto moderno. México está al nivel del mundo en ${n("nivel")}, cerca en ${n("corta")} y tiene ${opp} oportunidades; en ${n("libre")} de ellas no encontramos a nadie haciéndolo en México. Toca una capacidad para ver quién la está haciendo.`}
    >
      {/* México ya compite */}
      <p className="tracked-sm text-[11px] text-muted">Punto de partida: México ya es potencia</p>
      <div className="mt-4 grid grid-cols-2 gap-px border border-line bg-[var(--border)] lg:grid-cols-4">
        {mexicoWins.map((w) => (
          <div key={w.label} className="flex flex-col bg-surface p-5">
            <p className="display text-4xl font-bold sm:text-5xl">
              <CountUp
                value={w.value}
                format={(v) =>
                  w.format === "rank" ? `#${Math.max(1, Math.round(v))}` : w.format === "int" ? Math.round(v).toLocaleString("es-MX") : `${Math.round(v)}${w.suffix ?? ""}`
                }
              />
            </p>
            <p className="mt-3 text-xs font-light leading-relaxed text-ink-2">{w.label}</p>
            <div className="mt-auto pt-3">
              <SourceLink source={w.source} />
            </div>
          </div>
        ))}
      </div>

      {/* Reporte en semáforo */}
      <div className="mt-14 flex flex-wrap items-baseline justify-between gap-3">
        <p className="tracked-sm text-[11px] text-muted">El reporte · {benchmark.length} capacidades en 4 grupos</p>
        <p className="text-[11px] text-muted">Calificación 0–5 · MX = México · Mundo = el mejor referente</p>
      </div>
      <div className="mt-4 grid gap-px border border-line bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
        {GROUPS.map((grp) => (
          <div key={grp.id} className="flex flex-col bg-surface">
            <div className="border-b border-line p-4">
              <div className="flex items-center gap-2">
                <span aria-hidden className="h-3 w-3 rounded-full border border-ink" style={{ background: grp.tone }} />
                <span className="display tabular text-2xl font-bold">{n(grp.id)}</span>
              </div>
              <p className="tracked-sm mt-2 text-[11px] leading-relaxed">{grp.title}</p>
              <p className="mt-1 text-xs font-light leading-snug text-ink-2">{grp.plain}</p>
            </div>
            <ul className="flex-1">
              {byGroup[grp.id].map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    aria-pressed={sel === c.id}
                    onClick={() => setSel(c.id)}
                    className={`block w-full border-b border-line px-4 py-3 text-left transition-colors last:border-b-0 ${sel === c.id ? "bg-ink text-surface" : "hover:bg-surface-2"}`}
                  >
                    <span className="flex items-baseline justify-between gap-2 text-sm">
                      {c.name}
                      <span aria-hidden className={sel === c.id ? "text-surface" : "text-muted"}>
                        →
                      </span>
                    </span>
                    {sel === c.id ? (
                      <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--baseline)]">
                        MX {c.mexico}/5 · Mundo {c.world}/5
                      </span>
                    ) : (
                      <Score world={c.world} mexico={c.mexico} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-muted">
        Evaluación propia a partir de fuentes públicas. 0 = no encontramos evidencia pública en México; no significa que no exista.
      </p>

      {/* Quién lo está haciendo */}
      <div className="crop screen screen-panel mt-8 overflow-hidden text-ink">
        <div className="grid gap-4 border-b border-line px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="tracked-sm text-[10px] text-muted">Quién lo está haciendo</p>
            <p className="mt-1 text-base font-semibold">{cap.name}</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="tabular">
              Mundo <b>{cap.world}/5</b> · México <b className="underline underline-offset-4">{cap.mexico}/5</b>
            </span>
            <span className="flex items-center gap-1.5 border border-ink px-2 py-1 text-[10px] uppercase tracking-[0.14em]">
              <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: g.tone }} />
              {g.title}
            </span>
          </div>
        </div>
        <ul className="grid gap-px bg-[var(--border)] sm:grid-cols-3">
          {cap.refs.map((r, i) => (
            <li key={`${cap.id}-${i}`} className={`flex flex-col p-4 ${r.mx ? "bg-[rgba(232,132,31,0.08)]" : "bg-[var(--surface-1)]"}`}>
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted">
                {r.mx && <span className="bg-ink px-1.5 py-0.5 font-semibold text-surface">MX</span>}
                <Flap text={r.city} delay={i * 120} />
                <span className="tabular ml-auto">{r.year}</span>
              </p>
              <Flap text={r.venue} delay={i * 120 + 60} className="mt-2 block font-mono text-sm text-ink" />
              <p className="mt-1 text-xs font-light text-ink-2">{r.what}</p>
              <p className="mt-auto pt-3 text-[11px] uppercase tracking-[0.12em] text-signal">▸ {r.fact}</p>
            </li>
          ))}
        </ul>
        <p className="border-t border-line px-4 py-3 text-sm text-ink">
          <span className="mr-1 text-[10px] uppercase tracking-[0.16em] text-muted">Qué significa</span> {g.plain}
        </p>
      </div>
    </Section>
  );
}
