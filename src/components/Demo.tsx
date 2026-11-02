"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CircleAlert,
  CircleCheck,
  ClipboardCheck,
  FileText,
  Handshake,
  OctagonAlert,
  Pause,
  Play,
  RotateCcw,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import {
  ATTENDANCE,
  EXTRA_LANES_ON_INTERVENTION,
  GATES,
  MINUTES,
  STATUS_LABEL,
  clock,
  firstAlertMinute,
  simulate,
  statusForWait,
  type GateStatus,
  type Snapshot,
} from "@/lib/simulation";
import { Section } from "./ui";
import { MapLegend, Venue3D, type MapCallout, type MapStatus } from "./Venue3D";

// ─── Estado visual ─────────────────────────────────────────────────────────

const STATUS_ICON: Record<GateStatus, LucideIcon> = {
  good: CircleCheck,
  warning: TriangleAlert,
  serious: CircleAlert,
  critical: OctagonAlert,
};
const STATUS_COLOR: Record<GateStatus, string> = {
  good: "var(--good)",
  warning: "var(--warning)",
  serious: "var(--serious)",
  critical: "var(--critical)",
};

function StatusPill({ status }: { status: GateStatus }) {
  const Icon = STATUS_ICON[status];
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-ink">
      <Icon className="h-3.5 w-3.5" style={{ color: STATUS_COLOR[status] }} aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}

// ─── Bitácora: eventos de todas las áreas ──────────────────────────────────

type Area = "OPS" | "SEG" | "AYB" | "COM" | "PC" | "FAN";
const AREA_LABEL: Record<Area, string> = {
  OPS: "Operaciones",
  SEG: "Seguridad",
  AYB: "Alimentos y bebidas",
  COM: "Comercial",
  PC: "Protección Civil",
  FAN: "Fan",
};
type Kind = "alerta" | "accion" | "aviso" | "dato" | "resuelto";

interface FeedEvent {
  id: string;
  minute: number;
  area: Area;
  kind: Kind;
  text: string;
  severity?: GateStatus;
  actionId?: string; // acciones que se pueden aprobar
}

const at = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m - 16 * 60;
};

// Guion sintético por área. Las alertas de puertas salen de la simulación.
const SCRIPT: FeedEvent[] = [
  { id: "s1", minute: at("16:00"), area: "OPS", kind: "aviso", text: "Apertura de puertas · 8 accesos, 71 carriles activos" },
  { id: "s2", minute: at("16:05"), area: "PC", kind: "dato", text: "Checklist previo firmado: 3 de 4 controles" },
  { id: "s3", minute: at("16:20"), area: "PC", kind: "resuelto", text: "Inspección de gradas temporales firmada · foto y responsable" },
  { id: "s4", minute: at("17:10"), area: "COM", kind: "dato", text: "Spot 1 · Explanada supera 5,000 personas/h" },
  { id: "s5", minute: at("17:30"), area: "OPS", kind: "aviso", text: "Pronóstico: pico de llegadas 20:05 (±10 min)" },
  { id: "s6", minute: at("18:00"), area: "FAN", kind: "aviso", text: "Recordatorio enviado: puerta y hora sugerida · 58,000 boletos" },
  { id: "s7", minute: at("18:40"), area: "AYB", kind: "accion", severity: "warning", text: "Barra 4 · fila 9 min → abrir caja 2", actionId: "a-bar4" },
  { id: "s8", minute: at("18:50"), area: "COM", kind: "dato", text: "Spot 4 · Barra principal: conversión 11.8%, máximo del día" },
  { id: "s9", minute: at("19:00"), area: "PC", kind: "dato", text: "Aforo 50% · rutas de evacuación libres" },
  { id: "s10", minute: at("19:20"), area: "SEG", kind: "aviso", severity: "warning", text: "Pista frente al escenario · 2.8 personas/m²" },
  { id: "s11", minute: at("19:30"), area: "AYB", kind: "accion", severity: "warning", text: "Barra 2 · cerveza al 20% → reponer desde almacén norte", actionId: "a-bar2" },
  { id: "s12", minute: at("20:12"), area: "SEG", kind: "accion", severity: "critical", text: "Pista frente al escenario · 4.1 p/m² → abrir válvula de alivio lateral", actionId: "a-valve" },
  { id: "s13", minute: at("20:25"), area: "COM", kind: "aviso", text: "Reporte de patrocinadores listo para el cierre" },
  { id: "s14", minute: at("20:28"), area: "PC", kind: "dato", text: "Aforo 97% · bitácora actualizada para la autoridad" },
  { id: "s15", minute: at("18:45"), area: "PC", kind: "resuelto", text: "Prueba de radio con brigadas · 12 de 12 responden" },
  { id: "s16", minute: at("19:05"), area: "OPS", kind: "accion", severity: "warning", text: "Staff Puerta E por WhatsApp: lector del carril 3 falla → enviar técnico", actionId: "a-reader" },
  { id: "s17", minute: at("19:08"), area: "SEG", kind: "resuelto", text: "Objeto olvidado en Acceso B revisado y liberado" },
  { id: "s18", minute: at("19:10"), area: "OPS", kind: "aviso", text: "Pronóstico actualizado: pico 20:07 · 610 llegadas/min" },
  { id: "s19", minute: at("19:25"), area: "FAN", kind: "dato", text: "320 consultas al bot en 10 min: “¿cuál es mi puerta?”" },
  { id: "s20", minute: at("19:35"), area: "COM", kind: "dato", text: "Spot 2 · Concourse sur: permanencia sube a 3.1 min" },
  { id: "s21", minute: at("19:40"), area: "OPS", kind: "aviso", text: "Pronóstico: Puerta C rebasará 15 min hacia las 19:55" },
  { id: "s22", minute: at("19:48"), area: "SEG", kind: "alerta", severity: "warning", text: "Acceso G · 14 boletos duplicados bloqueados (SafeTix)" },
  { id: "s23", minute: at("19:50"), area: "AYB", kind: "dato", text: "Barra 1 · venta por minuto récord del evento" },
  { id: "s24", minute: at("20:00"), area: "COM", kind: "dato", text: "Pantallas del concourse · 41,000 impresiones acumuladas" },
  { id: "s25", minute: at("20:05"), area: "FAN", kind: "aviso", text: "Aviso a rezagados: 25 min para el show · puertas con menos fila: B, H" },
  { id: "s26", minute: at("20:20"), area: "PC", kind: "dato", text: "Aforo 90% · pasillos de gradas despejados" },
];

const FOLLOWUPS: Record<string, { delay: number; area: Area; text: string }[]> = {
  "a-bar4": [{ delay: 4, area: "AYB", text: "Caja 2 abierta · fila de Barra 4 baja a 4 min" }],
  "a-bar2": [{ delay: 6, area: "AYB", text: "Barra 2 repuesta · 30 cajas" }],
  "a-valve": [{ delay: 4, area: "SEG", text: "Densidad frente al escenario baja a 3.2 p/m²" }],
  "a-reader": [{ delay: 7, area: "OPS", text: "Lector del carril 3 en Puerta E reparado" }],
  "a-gateC": [
    { delay: 1, area: "OPS", text: `+${EXTRA_LANES_ON_INTERVENTION} carriles abiertos en Puerta C · staff de B y H` },
    { delay: 2, area: "FAN", text: "1,240 fans de secciones 101–118 avisados: usar Puerta D" },
  ],
};

function gateEvents(snaps: Snapshot[]): FeedEvent[] {
  const out: FeedEvent[] = [];
  const last: Record<string, GateStatus> = {};
  for (const s of snaps) {
    for (const g of s.gates) {
      const st = statusForWait(g.wait);
      const prev = last[g.id] ?? "good";
      if (st !== prev) {
        out.push({
          id: `g-${g.id}-${s.minute}`,
          minute: s.minute,
          area: "OPS",
          kind: st === "good" ? "resuelto" : "alerta",
          severity: st,
          text: st === "good" ? `Puerta ${g.id} vuelve a fluir` : `Puerta ${g.id} · espera ${g.wait.toFixed(1)} min (${STATUS_LABEL[st].toLowerCase()})`,
        });
      }
      last[g.id] = st;
    }
  }
  return out;
}

// Hitos de aforo: 10k, 20k, … dentro del recinto.
function milestoneEvents(snaps: Snapshot[]): FeedEvent[] {
  const out: FeedEvent[] = [];
  let acc = 0;
  let next = 10000;
  for (const s of snaps) {
    acc += s.actual;
    while (acc >= next && next <= 60000) {
      out.push({ id: `m-${next}`, minute: s.minute, area: "OPS", kind: "dato", text: `${next.toLocaleString("es-MX")} personas dentro del recinto` });
      next += 10000;
    }
  }
  return out;
}

function percentileWeighted(pairs: { wait: number; weight: number }[], p: number) {
  const sorted = [...pairs].sort((a, b) => a.wait - b.wait);
  const total = sorted.reduce((a, x) => a + x.weight, 0);
  let acc = 0;
  for (const x of sorted) {
    acc += x.weight;
    if (acc >= (p / 100) * total) return x.wait;
  }
  return sorted.at(-1)?.wait ?? 0;
}

function summarize(snaps: Snapshot[]) {
  const pairs: { wait: number; weight: number }[] = [];
  let personMinutes = 0;
  let peak = { minute: 0, value: 0 };
  for (const s of snaps) {
    if (s.actual > peak.value) peak = { minute: s.minute, value: s.actual };
    for (const g of s.gates) {
      personMinutes += g.queue;
      pairs.push({ wait: g.wait, weight: g.arrivals });
    }
  }
  const total = pairs.reduce((a, p) => a + p.weight, 0);
  const mean = pairs.reduce((a, p) => a + p.wait * p.weight, 0) / total;
  return { personMinutes, mean, p95: percentileWeighted(pairs, 95), peak };
}

// ─── Mapa: ubica cada evento de la bitácora sobre la ilustración ────────────

function locate(e: FeedEvent): string | null {
  const gate = e.text.match(/(?:Puerta|Acceso) ([A-H])\b/);
  if (gate) return `gate:${gate[1]}`;
  const bar = e.text.match(/Barra (\d)/);
  if (bar) return `bar:${bar[1]}`;
  const spot = e.text.match(/Spot (\d)/);
  if (spot) return `spot:${spot[1]}`;
  if (e.text.startsWith("Pista")) return "pista";
  return null;
}

function toCallout(e: FeedEvent): MapCallout | null {
  const at = locate(e);
  if (!at) return null;
  const status: MapStatus = e.severity ?? (e.kind === "resuelto" ? "good" : e.kind === "accion" ? "warning" : "good");
  const text = e.text.replace(/^(Puerta|Acceso|Barra|Spot) \w+ · /, "").replace(/^Pista[^·]*· /, "");
  const [kind, id] = at.split(":");
  const place = kind === "gate" ? `Puerta ${id}` : kind === "bar" ? `Barra ${id}` : kind === "spot" ? `Spot ${id}` : "Pista";
  return { id: e.id, at, kicker: `${clock(e.minute)} · ${place} · ${AREA_LABEL[e.area]}`, text, status };
}

// ─── Mini gráficas ─────────────────────────────────────────────────────────

function Spark({ values }: { values: number[] }) {
  const w = 120;
  const h = 28;
  const max = Math.max(1, ...values);
  const d = values.map((v, i) => `${i ? "L" : "M"}${(i / Math.max(1, values.length - 1)) * w},${h - (v / max) * (h - 2)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-full" aria-hidden>
      <path d={d} fill="none" stroke="var(--ink)" strokeWidth="1.2" />
    </svg>
  );
}

function IngressChart({ snaps, upTo }: { snaps: Snapshot[]; upTo: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const height = 170;
  const pad = { l: 36, r: 12, t: 10, b: 24 };
  const w = Math.max(width, 280);
  const max = 700;
  const x = (m: number) => pad.l + (m / (MINUTES - 1)) * (w - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (height - pad.t - pad.b);
  const path = (key: "actual" | "forecast", data: Snapshot[]) =>
    data.map((s, i) => `${i === 0 ? "M" : "L"}${x(s.minute).toFixed(1)},${y(s[key]).toFixed(1)}`).join(" ");
  const ticks = w < 520 ? [0, 120, 240] : [0, 60, 120, 180, 240, MINUTES - 1];
  const h = hover !== null ? snaps[hover] : null;
  return (
    <div ref={ref} className="relative">
      <ul className="mb-2 flex flex-wrap gap-4 text-[11px] text-ink-2">
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="h-0.5 w-4" style={{ background: "var(--ink)" }} /> Escaneos reales por minuto
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="h-0.5 w-4" style={{ background: "var(--series-muted)" }} /> Pronóstico de llegadas
        </li>
      </ul>
      <svg
        viewBox={`0 0 ${w} ${height}`}
        width="100%"
        height={height}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const m = Math.round((((e.clientX - r.left) / r.width) * w - pad.l) / (w - pad.l - pad.r) * (MINUTES - 1));
          setHover(Math.max(0, Math.min(upTo, m)));
        }}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label="Escaneos por minuto contra pronóstico de llegadas"
      >
        {[0, 350, 700].map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? "var(--baseline)" : "var(--grid)"} />
            <text x={pad.l - 6} y={y(t) + 3} textAnchor="end" fontSize="9" fill="var(--muted)">
              {t}
            </text>
          </g>
        ))}
        {ticks.map((m) => (
          <text key={m} x={x(m)} y={height - 6} textAnchor={m === MINUTES - 1 ? "end" : "middle"} fontSize="9" fill="var(--muted)">
            {clock(m)}
          </text>
        ))}
        <path d={path("forecast", snaps)} fill="none" stroke="var(--series-muted)" strokeWidth="2" />
        <path d={path("actual", snaps.slice(0, upTo + 1))} fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round" />
        <line x1={x(upTo)} x2={x(upTo)} y1={pad.t} y2={height - pad.b} stroke="var(--ink)" strokeDasharray="0" strokeWidth="0.6" opacity="0.4" />
        {h && (
          <g>
            <line x1={x(h.minute)} x2={x(h.minute)} y1={pad.t} y2={height - pad.b} stroke="var(--ink-2)" />
            <circle cx={x(h.minute)} cy={y(h.actual)} r="4" fill="var(--ink)" stroke="var(--surface-1)" strokeWidth="2" />
            <circle cx={x(h.minute)} cy={y(h.forecast)} r="4" fill="var(--series-muted)" stroke="var(--surface-1)" strokeWidth="2" />
          </g>
        )}
      </svg>
      {h && (
        <div className="pointer-events-none absolute top-6 z-10 border border-ink bg-surface px-3 py-2 text-[11px]" style={{ left: Math.min(Math.max(x(h.minute) - 80, 0), width - 170) }}>
          <p className="text-ink-2">{clock(h.minute)}</p>
          <p>
            <span className="tabular font-semibold">{Math.round(h.actual)}</span> escaneos/min
          </p>
          <p className="text-ink-2">
            <span className="tabular">{Math.round(h.forecast)}</span> pronóstico
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Copiloto que escribe ──────────────────────────────────────────────────

function Typewriter({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(text.length);
      return;
    }
    const id = setInterval(() => setN((k) => (k >= text.length ? (clearInterval(id), k) : k + 2)), 18);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span aria-label={text}>
      <span aria-hidden>{text.slice(0, n)}</span>
      <span aria-hidden className="caret" />
    </span>
  );
}

const QUESTIONS = ["¿Qué puerta está peor?", "¿Cuánta gente falta?", "Resumen para Protección Civil", "¿Qué hizo el copiloto?"];

// ─── Centro de mando ───────────────────────────────────────────────────────

const SPEEDS = [
  { label: "1×", ms: 700 },
  { label: "4×", ms: 180 },
  { label: "10×", ms: 70 },
];
const START = at("19:00");

export function Demo() {
  const baseline = useMemo(() => simulate(null), []);
  const alertMinute = useMemo(() => firstAlertMinute(baseline, "C", 8) ?? at("19:45"), [baseline]);

  const [autopilot, setAutopilot] = useState(true);
  const [approvals, setApprovals] = useState<Record<string, number>>({});
  const [dismissed, setDismissed] = useState<Record<string, true>>({});
  const [minute, setMinute] = useState(START);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [filter, setFilter] = useState<Area | "ALL">("ALL");
  const [selected, setSelected] = useState("C");
  const [answer, setAnswer] = useState<{ q: string; a: string } | null>(null);
  const userPaused = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Arranca solo cuando el centro de mando entra en pantalla.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused.current) setPlaying(true);
      if (!e.isIntersecting) setPlaying(false);
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setMinute((m) => (m >= MINUTES - 1 ? START : m + 1)), SPEEDS[speed].ms);
    return () => clearInterval(id);
  }, [playing, speed]);

  // Momento en que se aplica la acción de la Puerta C (automática o aprobada).
  const gateCActionMinute = autopilot ? alertMinute : approvals["a-gateC"] ?? null;
  const snaps = useMemo(
    () => (gateCActionMinute === null ? baseline : simulate({ gate: "C", fromMinute: gateCActionMinute })),
    [baseline, gateCActionMinute],
  );
  const snap = snaps[minute];

  // Todos los eventos del evento (guion + puertas + acciones del copiloto).
  const allEvents = useMemo(() => {
    const evs: FeedEvent[] = [...SCRIPT, ...gateEvents(snaps), ...milestoneEvents(snaps)];
    evs.push({
      id: "c-gateC",
      minute: alertMinute,
      area: "OPS",
      kind: "accion",
      severity: "critical",
      text: `Puerta C · pronóstico 42 min a las 20:15 → abrir +${EXTRA_LANES_ON_INTERVENTION} carriles y desviar secciones 101–118 a D`,
      actionId: "a-gateC",
    });
    for (const e of evs.filter((x) => x.actionId)) {
      const doneAt = autopilot ? e.minute : approvals[e.actionId!];
      if (doneAt === undefined) continue;
      for (const f of FOLLOWUPS[e.actionId!] ?? []) {
        evs.push({ id: `${e.actionId}-${f.text}`, minute: doneAt + f.delay, area: f.area, kind: "resuelto", text: f.text });
      }
    }
    return evs.sort((a, b) => b.minute - a.minute || a.id.localeCompare(b.id));
  }, [snaps, alertMinute, autopilot, approvals]);

  const visible = allEvents.filter((e) => e.minute <= minute);
  const feed = (filter === "ALL" ? visible : visible.filter((e) => e.area === filter)).slice(0, 14);
  const actions = visible.filter((e) => e.actionId);
  const pending = autopilot ? [] : actions.filter((e) => approvals[e.actionId!] === undefined && !dismissed[e.actionId!]);
  const executed = actions.filter((e) => autopilot || approvals[e.actionId!] !== undefined).length;
  const openAlerts = snap.gates.filter((g) => statusForWait(g.wait) !== "good").length + (minute >= at("20:12") && minute < at("20:16") ? 1 : 0);
  const latestAction = actions[0];
  // Lo más reciente de la bitácora que tiene lugar en el mapa (últimos 10 min).
  const callouts = visible
    .filter((e) => minute - e.minute <= 10)
    .map(toCallout)
    .filter((c): c is MapCallout => c !== null)
    .slice(0, 2);
  const mapGates = Object.fromEntries(
    snap.gates.map((g) => [g.id, { status: statusForWait(g.wait) as MapStatus, flow: Math.min(1, g.arrivals / 70) }]),
  );

  const scanned = snaps.slice(0, minute + 1).reduce((a, s) => a + s.actual, 0);
  const inQueue = snap.gates.reduce((a, g) => a + g.queue, 0);
  const worst = [...snap.gates].sort((a, b) => b.wait - a.wait)[0];
  const sel = snap.gates.find((g) => g.id === selected)!;
  const spark = snaps.slice(Math.max(0, minute - 40), minute + 1).map((s) => s.actual);
  const fansNotified = 58000 * (minute >= at("18:00") ? 1 : 0) + (visible.some((e) => e.text.startsWith("1,240")) ? 1240 : 0);
  const densityLevel = minute < at("19:00") ? 0.1 : minute < at("20:12") ? 0.35 + (minute - at("19:00")) / 140 : (autopilot || approvals["a-valve"] !== undefined) && minute >= at("20:16") ? 0.55 : 0.95;
  const barQueues = Array.from({ length: 6 }, (_, i) => {
    const base = 2 + ((i * 3) % 5);
    if (i === 3 && minute >= at("18:30")) return autopilot || approvals["a-bar4"] !== undefined ? (minute >= at("18:44") ? 4 : 9) : 9;
    return base + Math.sin(minute / 9 + i) * 1.5;
  });

  // Lo que pasaría en 30 min con las acciones ya ejecutadas (no las futuras).
  const forecastSource = gateCActionMinute !== null && minute >= gateCActionMinute ? snaps : baseline;
  const forecast30 = forecastSource[Math.min(MINUTES - 1, minute + 30)].gates.map((g) => ({ id: g.id, wait: g.wait }));

  const sumBase = useMemo(() => summarize(baseline), [baseline]);
  const sumNow = useMemo(() => summarize(snaps), [snaps]);
  const savedHours = (sumBase.personMinutes - sumNow.personMinutes) / 60;

  function approve(id: string) {
    setApprovals((a) => ({ ...a, [id]: minute }));
  }

  function ask(q: string) {
    let a = "";
    if (q === QUESTIONS[0])
      a = `Puerta ${worst.id}: ${worst.wait.toFixed(1)} min de espera y ${Math.round(worst.queue).toLocaleString("es-MX")} personas en fila (${STATUS_LABEL[statusForWait(worst.wait)].toLowerCase()}).`;
    else if (q === QUESTIONS[1]) {
      const missing = Math.max(0, ATTENDANCE - scanned);
      a = `Faltan ${Math.round(missing).toLocaleString("es-MX")} personas (${((missing / ATTENDANCE) * 100).toFixed(0)}%) y quedan ${MINUTES - 1 - minute} min para el show.`;
    } else if (q === QUESTIONS[2])
      a = `${clock(minute)} · Aforo dentro ${Math.round(scanned).toLocaleString("es-MX")} de ${ATTENDANCE.toLocaleString("es-MX")}. Alertas abiertas: ${openAlerts}. Gradas temporales inspeccionadas y firmadas. Rutas libres.`;
    else a = `${executed} acciones ejecutadas hasta ahora. La más reciente: ${latestAction ? latestAction.text : "ninguna"}.`;
    setAnswer({ q, a });
  }

  const KIND_LABEL: Record<Kind, string> = { alerta: "Alerta", accion: "Acción", aviso: "Aviso", dato: "Dato", resuelto: "Resuelto" };

  return (
    <Section
      id="demo"
      index={4}
      eyebrow="Centro de mando"
      title="Todo el recinto, en una sola lámina"
      lead="El centro de mando corre solo: llegan alertas de todas las áreas, el copiloto propone y ejecuta acciones, y todo queda en la bitácora. Cambia la velocidad, apaga el copiloto automático para aprobar tú cada acción, o toca una puerta."
    >
      <div ref={rootRef} className="crop border border-ink">
        {/* Barra de control */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-ink bg-surface px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                userPaused.current = playing;
                setPlaying((p) => !p);
              }}
              className="grid h-9 w-9 place-items-center bg-ink text-surface hover:opacity-85"
              aria-label={playing ? "Pausar" : "Reproducir"}
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setMinute(START);
                setApprovals({});
                setDismissed({});
                setAnswer(null);
              }}
              className="grid h-9 w-9 place-items-center border border-ink hover:bg-surface-2"
              aria-label="Reiniciar"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
          <p className="display tabular text-3xl font-bold">{clock(minute)}</p>
          <div role="group" aria-label="Velocidad" className="flex border border-ink text-[11px]">
            {SPEEDS.map((s, i) => (
              <button key={s.label} type="button" aria-pressed={speed === i} onClick={() => setSpeed(i)} className={`px-2.5 py-1.5 ${speed === i ? "bg-ink text-surface" : "hover:bg-surface-2"}`}>
                {s.label}
              </button>
            ))}
          </div>
          <label className="ml-auto flex cursor-pointer items-center gap-3 text-[11px] uppercase tracking-[0.14em]">
            <span className="relative inline-flex">
              <input type="checkbox" className="peer sr-only" checked={autopilot} onChange={(e) => setAutopilot(e.target.checked)} />
              <span className="h-5 w-9 border border-ink bg-surface transition peer-checked:bg-ink peer-focus-visible:outline-2" />
              <span className="absolute left-1 top-1 h-3 w-3 bg-ink transition peer-checked:translate-x-4 peer-checked:bg-surface" />
            </span>
            Copiloto automático
          </label>
        </div>

        {/* Línea de tiempo con eventos */}
        <div className="relative border-b border-line bg-surface px-4 pb-3 pt-5">
          <div className="relative h-6">
            <div className="absolute inset-x-0 top-3 h-px bg-ink" />
            {allEvents.map((e) => (
              <span
                key={e.id}
                aria-hidden
                className="absolute top-1 h-4 w-px"
                style={{
                  left: `${(e.minute / (MINUTES - 1)) * 100}%`,
                  background: e.severity && e.severity !== "good" ? STATUS_COLOR[e.severity] : "var(--baseline)",
                  opacity: e.minute <= minute ? 1 : 0.4,
                }}
              />
            ))}
            <span className="absolute top-0 h-6 w-0.5 bg-ink" style={{ left: `${(minute / (MINUTES - 1)) * 100}%` }} />
          </div>
          <input
            type="range"
            min={0}
            max={MINUTES - 1}
            value={minute}
            onChange={(e) => {
              userPaused.current = true;
              setPlaying(false);
              setMinute(Number(e.target.value));
            }}
            className="absolute inset-x-4 top-4 h-6 opacity-0"
            aria-label="Hora del evento"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted">
            <span>16:00 · apertura</span>
            <span>20:30 · show</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[13rem_1fr_19rem]">
          {/* Indicadores */}
          <div className="grid grid-cols-2 border-b border-line lg:grid-cols-1 lg:border-b-0 lg:border-r">
            {[
              { k: "Dentro del recinto", v: Math.round(scanned).toLocaleString("es-MX"), extra: <div className="mt-2 h-1 bg-surface-3"><div className="h-full bg-ink" style={{ width: `${Math.min(100, (scanned / ATTENDANCE) * 100)}%` }} /></div> },
              { k: "Escaneos / min", v: Math.round(snap.actual).toLocaleString("es-MX"), extra: <Spark values={spark} /> },
              { k: "Puerta más lenta", v: `${worst.id} · ${worst.wait.toFixed(1)} min`, extra: <StatusPill status={statusForWait(worst.wait)} /> },
              { k: "Personas en fila", v: Math.round(inQueue).toLocaleString("es-MX") },
              { k: "Alertas abiertas", v: String(openAlerts) },
              { k: "Acciones ejecutadas", v: String(executed) },
              { k: "Fans avisados", v: fansNotified.toLocaleString("es-MX") },
            ].map((x, i) => (
              <div key={x.k} className={`border-line px-4 py-3 ${i ? "border-t" : ""} ${i % 2 ? "max-lg:border-l" : ""} ${i === 1 ? "max-lg:border-t-0" : ""}`}>
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted">{x.k}</p>
                <p className="tabular display mt-1 text-lg font-bold">{x.v}</p>
                {x.extra}
              </div>
            ))}
          </div>

          {/* Plano */}
          <div className="border-b border-line bg-[var(--map-paper)] lg:border-b-0">
            <div className="flex items-center justify-between px-4 pt-3 text-[10px] uppercase tracking-[0.16em] text-muted">
              <span>Estadio · vista del copiloto</span>
              <MapLegend />
            </div>
            <div className="mt-2 border-y border-line">
              <Venue3D
                mode="ops"
                gates={mapGates}
                density={densityLevel}
                bars={barQueues}
                callouts={callouts}
                selected={selected}
                onSelect={setSelected}
                className="aspect-[4/3] w-full"
              />
            </div>
            <div className="grid grid-cols-8 border-t border-line">
              {snap.gates.map((g, i) => {
                const st = statusForWait(g.wait);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelected(g.id)}
                    className={`px-1 py-2 text-center ${i ? "border-l border-line" : ""} ${selected === g.id ? "bg-surface" : "hover:bg-surface"}`}
                    aria-label={`Puerta ${g.id}: ${g.wait.toFixed(1)} minutos, ${STATUS_LABEL[st]}`}
                  >
                    <p className="text-[10px] font-semibold">{g.id}</p>
                    <p className="tabular text-[11px]" style={{ color: st === "good" ? "var(--ink-2)" : STATUS_COLOR[st] }}>
                      {g.wait.toFixed(1)}′
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="border-t border-line px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted">Pronóstico de espera a +30 min ({clock(Math.min(MINUTES - 1, minute + 30))})</p>
              <div className="mt-2 grid grid-cols-8 items-end gap-2" style={{ height: 64 }}>
                {forecast30.map((f) => {
                  const st = statusForWait(f.wait);
                  return (
                    <div key={f.id} className="flex h-full flex-col justify-end">
                      <span className="tabular mb-1 text-center text-[10px] text-ink-2">{f.wait < 1 ? "<1" : Math.round(f.wait)}′</span>
                      <span
                        className="grow-bar w-full"
                        style={{ height: `${Math.max(3, Math.min(100, (f.wait / 45) * 100))}%`, background: st === "good" ? "var(--seq-3)" : STATUS_COLOR[st] }}
                      />
                      <span className="mt-1 text-center text-[10px] font-semibold">{f.id}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="border-t border-line px-4 py-2 text-[11px] text-ink-2">
              <span className="font-semibold text-ink">{GATES.find((g) => g.id === selected)!.name}</span> · espera {sel.wait.toFixed(1)} min · {Math.round(sel.queue).toLocaleString("es-MX")} en fila · {sel.lanes} carriles
            </p>
          </div>

          {/* Bitácora */}
          <div className="flex flex-col lg:border-l lg:border-line">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="tracked-sm text-[10px]">Bitácora en vivo</p>
              <span className="flex items-center gap-1.5 text-[10px] text-muted">
                <span className={`h-1.5 w-1.5 rounded-full ${playing ? "live-dot bg-signal" : "bg-baseline bg-[var(--baseline)]"}`} />
                {playing ? "En vivo" : "Pausado"}
              </span>
            </div>
            <div role="group" aria-label="Filtrar bitácora" className="flex flex-wrap gap-1 border-b border-line px-3 py-2">
              {(["ALL", "OPS", "SEG", "AYB", "COM", "PC", "FAN"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  title={f === "ALL" ? "Todas las áreas" : AREA_LABEL[f]}
                  onClick={() => setFilter(f)}
                  className={`px-1.5 py-0.5 text-[10px] tracking-[0.1em] ${filter === f ? "bg-ink text-surface" : "text-ink-2 hover:bg-surface-2"}`}
                >
                  {f === "ALL" ? "TODO" : f}
                </button>
              ))}
            </div>
            <ol className="max-h-[560px] flex-1 overflow-y-auto" aria-live="polite">
              {feed.length === 0 && <li className="px-4 py-3 text-xs text-muted">Sin eventos todavía.</li>}
              {feed.map((e) => {
                const isPending = pending.some((p) => p.id === e.id);
                const done = e.actionId && (autopilot || approvals[e.actionId] !== undefined);
                const Icon = e.severity ? STATUS_ICON[e.severity] : e.kind === "resuelto" ? CircleCheck : null;
                return (
                  <li key={e.id} className="feed-in border-b border-line px-4 py-2.5">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-muted">
                      <span className="tabular text-ink">{clock(e.minute)}</span>
                      <span className="border border-line px-1">{e.area}</span>
                      <span>{KIND_LABEL[e.kind]}</span>
                      {Icon && <Icon className="ml-auto h-3.5 w-3.5" style={{ color: e.severity ? STATUS_COLOR[e.severity] : "var(--good)" }} aria-hidden />}
                    </div>
                    <p className="mt-1 text-[12px] leading-snug">{e.text}</p>
                    {e.actionId && (
                      <div className="mt-1.5 text-[10px] uppercase tracking-[0.12em]">
                        {done ? (
                          <span className="text-good">✓ {autopilot ? "Ejecutada por el copiloto" : "Aprobada"}</span>
                        ) : isPending ? (
                          <span className="flex gap-2">
                            <button type="button" onClick={() => approve(e.actionId!)} className="bg-ink px-2 py-1 text-surface">
                              Aprobar
                            </button>
                            <button type="button" onClick={() => setDismissed((d) => ({ ...d, [e.actionId!]: true }))} className="border border-line px-2 py-1">
                              Descartar
                            </button>
                          </span>
                        ) : (
                          <span className="text-muted">Descartada</span>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Copiloto */}
        <div className="grid border-t border-ink lg:grid-cols-[1fr_1fr]">
          <div className="invert px-5 py-4">
            <p className="tracked-sm text-[10px] text-muted">Copiloto · última recomendación</p>
            <p className="mt-2 min-h-[3rem] text-sm leading-relaxed">
              {latestAction ? <Typewriter text={latestAction.text} /> : "Sin recomendaciones por ahora. Observando 8 puertas, 6 barras, pista y 5 spots."}
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-muted">
              {pending.length > 0 ? `${pending.length} acción(es) esperan tu aprobación en la bitácora` : autopilot ? "Modo automático: ejecuta y documenta" : "Al día"}
            </p>
          </div>
          <div className="px-5 py-4">
            <div className="flex flex-wrap gap-1.5">
              {QUESTIONS.map((q) => (
                <button key={q} type="button" onClick={() => ask(q)} className="border border-ink px-2.5 py-1 text-[11px] hover:bg-ink hover:text-surface">
                  {q}
                </button>
              ))}
            </div>
            <p className="mt-3 min-h-[2.5rem] text-[12px] leading-relaxed text-ink-2" aria-live="polite">
              {answer ? (
                <>
                  <span className="font-semibold text-ink">{answer.q}</span> {answer.a}
                </>
              ) : (
                "Pregunta al copiloto; responde con el estado del recinto en este minuto."
              )}
            </p>
          </div>
        </div>

        <div className="border-t border-line bg-surface px-4 py-4">
          <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-muted">Ingreso: real contra pronóstico</p>
          <IngressChart snaps={snaps} upTo={minute} />
        </div>
      </div>
      <p className="mt-3 text-[11px] text-muted">
        <span className="font-semibold text-ink">Fig. 04</span> — Centro de mando con datos sintéticos: estadio de 60,000 personas, apertura 16:00, show 20:30.
        No son datos de OCESA ni de Ticketmaster.
      </p>

      {/* Al día siguiente */}
      <h3 className="tracked-sm mt-14 text-[11px] text-muted">Al día siguiente: reportes que hoy se arman a mano</h3>
      <div className="mt-4 grid gap-px border border-line bg-[var(--border)] lg:grid-cols-3">
        <div className="bg-surface p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <FileText className="h-4 w-4" aria-hidden /> Reporte post-evento
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {[
              ["Espera promedio", `${sumNow.mean.toFixed(1)} min`],
              ["Espera p95", `${sumNow.p95.toFixed(1)} min`],
              ["Minuto pico", clock(sumNow.peak.minute)],
              ["Horas-persona en fila", Math.round(sumNow.personMinutes / 60).toLocaleString("es-MX")],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">{k}</dt>
                <dd className="tabular display text-xl font-bold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 border-l-2 border-ink pl-3 text-xs">
            {savedHours > 1
              ? `La acción en la Puerta C ahorró ${Math.round(savedHours).toLocaleString("es-MX")} horas-persona de fila: tiempo que puede volverse consumo.`
              : "Sin la acción en la Puerta C, la fila habría costado cientos de horas-persona."}
          </p>
        </div>
        <div className="bg-surface p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Handshake className="h-4 w-4" aria-hidden /> ROI para el patrocinador
          </p>
          <p className="mt-1 text-[11px] text-muted">Formato de ejemplo</p>
          <ul className="mt-4 space-y-2 text-xs">
            {["Visitas al stand (QR/NFC)", "Permanencia en la activación", "Ventas en la barra de la marca", "Comparativo contra la edición anterior"].map((k) => (
              <li key={k} className="flex justify-between border-b border-line pb-2 last:border-0">
                <span className="text-ink-2">{k}</span>
                <span className="text-muted">—</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-surface p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <ClipboardCheck className="h-4 w-4" aria-hidden /> Bitácora de Protección Civil
          </p>
          <p className="mt-1 text-[11px] text-muted">Se genera sola desde la bitácora en vivo</p>
          <ul className="mt-4 space-y-2 text-xs">
            {allEvents
              .filter((e) => e.area === "PC")
              .slice()
              .reverse()
              .map((e) => (
                <li key={e.id} className="flex gap-3 border-b border-line pb-2 last:border-0">
                  <span className="tabular text-muted">{clock(e.minute)}</span>
                  <span className="text-ink-2">{e.text}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
