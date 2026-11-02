"use client";

import { useEffect, useState } from "react";
import { heroStats } from "@/lib/data";
import { ACTS, SECTIONS, fmtMin, minutesFor, setReadingMode, useReadingMode } from "@/lib/reading";
import { HERO_GATES, Venue3D, useHeroCallout } from "./Venue3D";

const FICHA = [
  ["Proyecto", "Event Intelligence"],
  ["Para", "OCESA · propuesta"],
  ["Escala", "60,000 personas · 8 accesos"],
  ["Programa", "6 áreas en un solo mapa"],
  ["Tecnología", "Datos que ya existen + IA"],
  ["Año", "2026"],
];

function useTicker() {
  const [n, setN] = useState({ inside: 42942, scans: 548, wait: 18.4, t: 0 });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setN((s) => ({
        inside: s.inside >= 59400 ? 42942 : s.inside + Math.round(380 + Math.random() * 220),
        scans: Math.round(520 + Math.random() * 70),
        wait: Math.max(4, Math.min(22, s.wait + (Math.random() - 0.55) * 1.2)),
        t: s.t + 1,
      }));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return n;
}

export function Hero() {
  const n = useTicker();
  const mode = useReadingMode();
  const { callout, index, total } = useHeroCallout();
  const clock = new Date((19 * 3600 + 44 * 60 + 52 + n.t) * 1000).toISOString().slice(11, 19);

  return (
    <section id="inicio" className="px-3 pb-4 pt-16 sm:px-6 sm:pt-20">
      <div className="sheet mx-auto max-w-6xl px-5 pb-10 pt-8 sm:px-12 sm:pt-10">
        <div className="tracked-sm flex items-center justify-between text-[10px] text-muted sm:text-[11px]">
          <span>Event Intelligence · ShipbayOS</span>
          <span className="tabular">EI 00/{SECTIONS.length}</span>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <h1 className="tracked text-xl leading-[1.6] sm:text-[2.1rem]">
              Del boleto al asiento,
              <br />
              <span className="caret">y de vuelta a los datos</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-ink-2 sm:text-[15px]">
              El negocio en vivo crece por lo que pasa dentro del recinto. Event Intelligence convierte cada puerta, fila, barra y spot comercial en
              información que se opera en vivo y se vende con números.
            </p>
          </div>
          <dl className="border-t border-ink text-xs">
            {FICHA.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-line py-2">
                <dt className="uppercase tracking-[0.16em] text-muted">{k}</dt>
                <dd className="text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Lámina principal: el estadio en vivo */}
        <figure className="mt-10">
          <div className="crop relative border border-ink bg-[var(--map-paper)]">
            <Venue3D mode="hero" gates={HERO_GATES} density={0.8} bars={[2, 4, 3, 9, 3, 2]} callouts={[callout]} className="aspect-[4/3] w-full sm:aspect-[16/9]" />
            <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 bg-[rgba(251,250,247,0.9)] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-ink-2">
              <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-signal" />
              <span className="tabular">{clock}</span>
              <span className="text-muted">· simulación</span>
            </div>
            <div className="pointer-events-none absolute right-3 top-3 flex gap-1" aria-hidden>
              {Array.from({ length: total }, (_, k) => (
                <span key={k} className={`h-1 w-5 ${k === index ? "bg-ink" : "bg-[var(--baseline)]"}`} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 border-x border-b border-line sm:grid-cols-4">
            {[
              { k: "Dentro del recinto", v: n.inside.toLocaleString("es-MX") },
              { k: "Escaneos / min", v: String(n.scans) },
              { k: "Puerta C · espera", v: `${n.wait.toFixed(1)} min`, alert: true },
              { k: "Áreas conectadas", v: "6" },
            ].map((x, i) => (
              <div key={x.k} className={`px-4 py-3 ${i ? "border-l border-line" : ""} ${i === 2 ? "max-sm:border-l-0 max-sm:border-t" : ""} ${i === 3 ? "max-sm:border-t" : ""}`}>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{x.k}</p>
                <p className={`tabular display mt-1 text-lg font-bold sm:text-xl ${x.alert ? "text-signal" : ""}`}>{x.v}</p>
              </div>
            ))}
          </div>
          <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-[11px] text-muted">
            <span>
              <span className="font-semibold text-ink">Fig. 01</span> — El estadio en vivo: flujos por 8 accesos, la puerta C se satura y el copiloto actúa.
            </span>
            <span>Datos sintéticos, ilustrativos</span>
          </figcaption>
        </figure>

        {/* Cómo leer este documento */}
        <div className="mt-12 grid gap-6 border-t border-ink pt-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="tracked-sm text-[11px] text-muted">Cómo leer este documento</p>
            <div className="mt-4 grid grid-cols-2 border border-ink" role="group" aria-label="Modo de lectura">
              {(["express", "completo"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mode === m}
                  onClick={() => setReadingMode(m)}
                  className={`px-4 py-3 text-left ${mode === m ? "bg-ink text-surface" : "hover:bg-surface-2"}`}
                >
                  <span className="block text-[11px] uppercase tracking-[0.18em]">{m === "express" ? "Recorrido express" : "Lectura completa"}</span>
                  <span className="tabular display mt-1 block text-2xl font-bold">≈ {fmtMin(minutesFor(m))}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs font-light text-ink-2">
              Express muestra lo esencial de cada lámina; el detalle se abre donde te interese. Puedes cambiar de modo en cualquier momento desde la barra.
            </p>
          </div>
          <ol className="grid gap-px border border-line bg-[var(--border)] sm:grid-cols-3">
            {ACTS.map((a) => {
              const secs = SECTIONS.filter((s) => s.act === a.n);
              const mins = secs.reduce((acc, s) => acc + (mode === "completo" ? s.full : s.express), 0);
              return (
                <li key={a.id} className="bg-surface">
                  <a href={`#${a.id}`} className="flex h-full flex-col p-4 hover:bg-surface-2">
                    <span className="tabular text-[11px] text-muted">Acto {["I", "II", "III"][a.n - 1]} · ≈ {fmtMin(mins)}</span>
                    <span className="tracked-sm mt-2 text-[12px]">{a.title}</span>
                    <span className="mt-3 space-y-1 text-xs font-light text-ink-2">
                      {secs.map((s) => (
                        <span key={s.id} className="block">
                          <span className="tabular text-muted">{String(s.index).padStart(2, "0")}</span> {s.short}
                        </span>
                      ))}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Tres datos reales */}
        <ol className="mt-12 grid gap-px border-t border-ink sm:grid-cols-3">
          {heroStats.map((s, i) => (
            <li key={s.label} className="border-b border-line py-5 sm:border-b-0 sm:pr-6">
              <p className="tabular text-[11px] text-muted">0{i + 1}</p>
              <p className="display mt-2 text-5xl font-bold">{s.value}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.14em]">{s.label}</p>
              <p className="mt-2 text-xs font-light text-ink-2">{s.detail}</p>
              <a href={s.source.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-[10px] uppercase tracking-[0.16em] text-muted underline underline-offset-4 hover:text-ink">
                {s.source.label} ↗
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
