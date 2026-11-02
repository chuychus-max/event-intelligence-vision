"use client";

import { ACTS, SECTIONS, fmtMin, useReadingMode } from "@/lib/reading";
import { ActDivider } from "./ui";

export function ActBanner({ n }: { n: 1 | 2 | 3 }) {
  const mode = useReadingMode();
  const act = ACTS[n - 1];
  const mins = SECTIONS.filter((s) => s.act === n).reduce((a, s) => a + (mode === "completo" ? s.full : s.express), 0);
  return <ActDivider n={n} id={act.id} title={act.title} subtitle={act.subtitle} minutes={`≈ ${fmtMin(mins)} · ${mode === "completo" ? "lectura completa" : "recorrido express"}`} />;
}
