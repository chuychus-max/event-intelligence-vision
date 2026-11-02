"use client";

import { useSyncExternalStore } from "react";

// Recorrido: 3 actos, 12 láminas. Los minutos son estimados a mano (~200 palabras
// por minuto en completo; en express sólo cuenta el resumen). Ajustar si cambia el texto.

export type Mode = "express" | "completo";

export interface SectionMeta {
  id: string;
  index: number;
  act: 1 | 2 | 3;
  short: string;
  full: number;
  express: number;
}

export const ACTS = [
  { n: 1, id: "acto-1", title: "El contexto", subtitle: "Mercado, benchmark y quién tiene qué" },
  { n: 2, id: "acto-2", title: "La solución", subtitle: "Centro de mando, gemelo, spots y datos" },
  { n: 3, id: "acto-3", title: "Cómo lo hacemos", subtitle: "EVO, ecosistema, futuro y plan" },
] as const;

export const SECTIONS: SectionMeta[] = [
  { id: "mercado", index: 1, act: 1, short: "Mercado", full: 2, express: 0.5 },
  { id: "benchmark", index: 2, act: 1, short: "Benchmark", full: 3, express: 0.5 },
  { id: "quien", index: 3, act: 1, short: "Quién tiene qué", full: 2, express: 0.5 },
  { id: "demo", index: 4, act: 2, short: "Centro de mando", full: 3, express: 3 },
  { id: "gemelo", index: 5, act: 2, short: "Gemelo por áreas", full: 1.5, express: 1.5 },
  { id: "spots", index: 6, act: 2, short: "Spots comerciales", full: 2, express: 0.5 },
  { id: "datos", index: 7, act: 2, short: "Datos no obvios", full: 3, express: 0.5 },
  { id: "evo", index: 8, act: 3, short: "EVO Payments", full: 3, express: 0.5 },
  { id: "ecosistema", index: 9, act: 3, short: "Ecosistema", full: 1, express: 0.5 },
  { id: "horizontes", index: 10, act: 3, short: "Futuro", full: 2, express: 0.5 },
  { id: "plan", index: 11, act: 3, short: "Plan", full: 2, express: 0.5 },
  { id: "huecos", index: 12, act: 3, short: "Siguientes pasos", full: 1, express: 1 },
];

export const TOTAL = SECTIONS.length;

export function sectionMeta(id: string) {
  return SECTIONS.find((s) => s.id === id);
}

export function minutesFor(mode: Mode, from = 1) {
  return SECTIONS.filter((s) => s.index >= from).reduce((a, s) => a + (mode === "completo" ? s.full : s.express), 0);
}

export function fmtMin(m: number) {
  return m < 1 ? "<1 min" : `${Math.round(m)} min`;
}

// Modo de lectura compartido sin provider (store mínimo).
let mode: Mode = "express";
const listeners = new Set<() => void>();

export function setReadingMode(m: Mode) {
  mode = m;
  try {
    localStorage.setItem("reading-mode", m);
  } catch {
    // Sin almacenamiento: el modo vale sólo para esta visita.
  }
  listeners.forEach((l) => l());
}

export function initReadingMode() {
  try {
    const saved = localStorage.getItem("reading-mode");
    if (saved === "express" || saved === "completo") setReadingMode(saved);
  } catch {
    // Ignorado: se queda en express.
  }
}

export function useReadingMode(): Mode {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => mode,
    () => "express",
  );
}
