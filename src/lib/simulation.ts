// Simulación sintética del ingreso a un estadio de ~60k personas. No usa datos de
// OCESA ni de Ticketmaster: sirve para mostrar cómo se vería el producto.
//
// Modelo: las llegadas por minuto siguen una curva que se concentra cerca del
// show (en la referencia de Georgia Tech, 48.7% llega en los últimos 30 min).
// Cada puerta atiende hasta `lanes × rate` personas por minuto; lo que no alcanza
// a pasar se queda en fila. Espera estimada = fila / capacidad.

export const DOORS_OPEN = 16 * 60; // 16:00
export const SHOW_START = 20 * 60 + 30; // 20:30
export const MINUTES = SHOW_START - DOORS_OPEN + 1;
export const ATTENDANCE = 60000;

export interface Gate {
  id: string;
  name: string;
  share: number; // fracción de asistentes asignados a la puerta
  lanes: number;
  angle: number; // posición en el croquis (grados, 0 = derecha)
}

export const GATES: Gate[] = [
  { id: "A", name: "Puerta A", share: 0.12, lanes: 9, angle: 200 },
  { id: "B", name: "Puerta B", share: 0.11, lanes: 9, angle: 240 },
  { id: "C", name: "Puerta C", share: 0.17, lanes: 7, angle: 280 },
  { id: "D", name: "Puerta D", share: 0.12, lanes: 9, angle: 320 },
  { id: "E", name: "Puerta E", share: 0.12, lanes: 8, angle: 40 },
  { id: "F", name: "Puerta F", share: 0.12, lanes: 9, angle: 80 },
  { id: "G", name: "Puerta G", share: 0.12, lanes: 9, angle: 120 },
  { id: "H", name: "Puerta H", share: 0.12, lanes: 9, angle: 160 },
];

export const SCANS_PER_LANE_PER_MIN = 8;
export const EXTRA_LANES_ON_INTERVENTION = 5;

// PRNG determinista para que la demo se vea igual en cada carga.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Curva de llegada esperada (pronóstico), normalizada a ATTENDANCE.
function expectedCurve(): number[] {
  const raw: number[] = [];
  for (let m = 0; m < MINUTES; m++) {
    const toShow = MINUTES - 1 - m; // minutos antes del show
    // Base temprana + pico gaussiano 20–30 min antes del show.
    const early = 0.25 * Math.exp(-((m - 60) ** 2) / (2 * 50 ** 2));
    const peak = 1.6 * Math.exp(-((toShow - 25) ** 2) / (2 * 30 ** 2));
    const ramp = 0.35 * Math.min(1, m / 120);
    raw.push(early + peak + ramp);
  }
  const total = raw.reduce((a, b) => a + b, 0);
  return raw.map((v) => (v / total) * ATTENDANCE);
}

export interface Snapshot {
  minute: number; // índice desde DOORS_OPEN
  actual: number; // escaneos totales en el minuto
  forecast: number;
  gates: { id: string; arrivals: number; served: number; queue: number; wait: number; lanes: number }[];
}

export function simulate(intervention: { gate: string; fromMinute: number } | null): Snapshot[] {
  const rand = mulberry32(2026);
  const forecast = expectedCurve();
  const queues = Object.fromEntries(GATES.map((g) => [g.id, 0]));
  const out: Snapshot[] = [];

  for (let m = 0; m < MINUTES; m++) {
    // Llegadas reales: el pronóstico con ruido y una ola tardía ~45 min antes
    // (p. ej. un tren que llega lleno).
    const surge = m > MINUTES - 60 && m < MINUTES - 35 ? 1.18 : 1;
    const noise = 0.85 + rand() * 0.3;
    const arrivalsTotal = forecast[m] * noise * surge;

    let servedTotal = 0;
    const gates = GATES.map((g) => {
      const extra = intervention && intervention.gate === g.id && m >= intervention.fromMinute ? EXTRA_LANES_ON_INTERVENTION : 0;
      const lanes = g.lanes + extra;
      const capacity = lanes * SCANS_PER_LANE_PER_MIN;
      const arrivals = arrivalsTotal * g.share;
      const backlog = queues[g.id] + arrivals;
      const served = Math.min(backlog, capacity);
      queues[g.id] = backlog - served;
      servedTotal += served;
      return {
        id: g.id,
        arrivals,
        served,
        queue: queues[g.id],
        wait: queues[g.id] / capacity,
        lanes,
      };
    });

    out.push({ minute: m, actual: servedTotal, forecast: forecast[m], gates });
  }
  return out;
}

export type GateStatus = "good" | "warning" | "serious" | "critical";

export function statusForWait(wait: number): GateStatus {
  if (wait < 5) return "good";
  if (wait < 12) return "warning";
  if (wait < 20) return "serious";
  return "critical";
}

export const STATUS_LABEL: Record<GateStatus, string> = {
  good: "Fluido",
  warning: "Atención",
  serious: "Saturado",
  critical: "Crítico",
};

export function clock(minuteIndex: number): string {
  const t = DOORS_OPEN + minuteIndex;
  const h = Math.floor(t / 60);
  const m = t % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Primer minuto en que una puerta pasa de 12 min de espera: ahí el copiloto sugiere intervenir.
export function firstAlertMinute(snaps: Snapshot[], gate: string, threshold = 12): number | null {
  for (const s of snaps) {
    const g = s.gates.find((x) => x.id === gate)!;
    if (g.wait >= threshold) return s.minute;
  }
  return null;
}

export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx];
}
