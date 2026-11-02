"use client";

import { useEffect, useState } from "react";
import { ACTS, SECTIONS, TOTAL, fmtMin, initReadingMode, setReadingMode, useReadingMode } from "@/lib/reading";

// Barra de recorrido: dónde estás, cuánto falta, modo de lectura e índice.
export function Nav() {
  const mode = useReadingMode();
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    initReadingMode();
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
      let cur: string | null = null;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = s.id;
      }
      setCurrent(cur);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const cur = SECTIONS.find((s) => s.id === current);
  const remaining = SECTIONS.filter((s) => !cur || s.index >= cur.index).reduce((a, s) => a + (mode === "completo" ? s.full : s.express), 0);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-[rgba(236,230,220,0.9)] backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-6xl items-center gap-3 px-4 sm:gap-5 sm:px-6">
          <a href="#inicio" className="tracked-sm shrink-0 text-[11px] text-ink">
            E·I <span className="text-muted">/</span> <span className="hidden sm:inline">SHIPBAYOS</span>
          </a>
          <button type="button" onClick={() => setOpen(true)} className="min-w-0 flex-1 truncate text-left text-[11px] uppercase tracking-[0.16em] text-ink-2 hover:text-ink">
            {cur ? (
              <>
                <span className="tabular text-muted">
                  Acto {["I", "II", "III"][cur.act - 1]} · {String(cur.index).padStart(2, "0")}/{TOTAL}
                </span>{" "}
                {cur.short}
              </>
            ) : (
              <span>Índice del recorrido</span>
            )}
            <span className="ml-2 text-muted">▾</span>
          </button>
          <span className="tabular hidden shrink-0 text-[11px] text-muted md:inline">quedan ≈ {fmtMin(remaining)}</span>
          <div role="group" aria-label="Modo de lectura" className="flex shrink-0 border border-ink text-[10px] uppercase tracking-[0.12em]">
            {(["express", "completo"] as const).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setReadingMode(m)} className={`px-2 py-1 ${mode === m ? "bg-ink text-surface" : "hover:bg-surface-2"}`}>
                {m === "express" ? "Express" : "Completo"}
              </button>
            ))}
          </div>
        </div>
        <div aria-hidden className="h-0.5 bg-signal" style={{ width: `${progress * 100}%` }} />
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-[rgba(22,22,21,0.35)] px-3 pt-16" onClick={() => setOpen(false)}>
          <div role="dialog" aria-label="Índice del recorrido" className="sheet w-full max-w-3xl animate-[fadein_0.3s_ease] p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="tracked-sm text-[11px] text-muted">Índice · {mode === "completo" ? "lectura completa" : "recorrido express"}</p>
              <button type="button" onClick={() => setOpen(false)} className="text-[11px] uppercase tracking-[0.16em] text-ink-2 hover:text-ink" aria-label="Cerrar índice">
                Cerrar ✕
              </button>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {ACTS.map((a) => (
                <div key={a.id}>
                  <p className="tabular text-[11px] text-muted">Acto {["I", "II", "III"][a.n - 1]}</p>
                  <p className="tracked-sm mt-1 text-[12px]">{a.title}</p>
                  <ol className="mt-3 border-t border-ink">
                    {SECTIONS.filter((s) => s.act === a.n).map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          onClick={() => setOpen(false)}
                          className={`grid grid-cols-[2rem_1fr_auto] items-baseline gap-2 border-b border-line py-2 text-sm hover:bg-surface-2 ${current === s.id ? "font-semibold" : ""}`}
                        >
                          <span className="tabular text-[11px] text-muted">{String(s.index).padStart(2, "0")}</span>
                          <span>{s.short}</span>
                          <span className="tabular text-[11px] text-muted">{fmtMin(mode === "completo" ? s.full : s.express)}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
