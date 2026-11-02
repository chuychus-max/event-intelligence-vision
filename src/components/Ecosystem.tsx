import {
  ArrowRight,
  Building2,
  Camera,
  ClipboardCheck,
  CreditCard,
  Handshake,
  Landmark,
  Map,
  MessageSquare,
  ScanLine,
  ShoppingBag,
  Smartphone,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { KeyFacts, Section } from "./ui";

interface Node {
  icon: LucideIcon;
  title: string;
  detail: string;
}

const INPUTS: Node[] = [
  { icon: ScanLine, title: "Escaneos de acceso", detail: "Ticketmaster SafeTix: hora y puerta" },
  { icon: ShoppingBag, title: "Ventas por stand", detail: "OVG Hospitality (punto de venta)" },
  { icon: CreditCard, title: "Pagos", detail: "Banamex · EVO / Global Payments (agregado)" },
  { icon: Wifi, title: "Red del recinto", detail: "Wi-Fi / socio de telecom" },
  { icon: Camera, title: "Video y sensores", detail: "Cámaras existentes, LiDAR si se instala" },
  { icon: MessageSquare, title: "Reportes de staff", detail: "WhatsApp, voz, formularios" },
  { icon: Map, title: "Planos del recinto", detail: "CAD → mapa IMDF, secciones → puertas" },
];

const OUTPUTS: Node[] = [
  { icon: Building2, title: "Operaciones", detail: "Tablero en vivo, pronóstico, alertas" },
  { icon: ClipboardCheck, title: "Seguridad y Protección Civil", detail: "Bitácora con evidencia, reporte a la autoridad" },
  { icon: Handshake, title: "Comercial y patrocinadores", detail: "ROI por activación, misma metodología cada año" },
  { icon: Landmark, title: "Gobierno y concesiones", detail: "Reporte de impacto verificado" },
  { icon: Smartphone, title: "Ignite / Venue Agent", detail: "Les damos el mapa y los datos del recinto" },
];

const CORE = [
  "Ingesta y limpieza de cada fuente",
  "Modelo del recinto (mapa IMDF + grafo de puertas)",
  "Pronóstico de llegadas y filas",
  "Copiloto con IA (agente + RAG de protocolos)",
  "Reportes automáticos",
];

function NodeCard({ n }: { n: Node }) {
  const Icon = n.icon;
  return (
    <li className="flex items-start gap-3 border border-line bg-surface px-3 py-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-2" aria-hidden />
      <span>
        <span className="block text-sm font-medium">{n.title}</span>
        <span className="block text-xs text-ink-2">{n.detail}</span>
      </span>
    </li>
  );
}

export function Ecosystem() {
  return (
    <Section
      id="ecosistema"
      index={9}
      summary={<KeyFacts items={[{ value: "7", label: "Fuentes que ya existen" }, { value: "1", label: "Capa de inteligencia" }, { value: "5", label: "Áreas que la usan" }]} note="Sólo software, sin hardware propio; le damos el mapa y los datos del recinto a Ignite y al Venue Agent." />}
      eyebrow="Cómo nos incorporamos"
      title="No somos otra app: somos la capa que conecta lo que ya existe"
      lead="Ticketmaster ya tiene la app del fan (Ignite) y Live Nation ya tiene un agente para preguntas (Venue Agent). Nosotros nos sentamos detrás: leemos las fuentes que hoy están separadas y entregamos decisiones y evidencia a quien opera, vende y responde ante la autoridad."
    >
      <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1.1fr_auto_1fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Fuentes que ya existen</p>
          <ul className="space-y-2">
            {INPUTS.map((n) => (
              <NodeCard key={n.title} n={n} />
            ))}
          </ul>
        </div>

        <div aria-hidden className="flex items-center justify-center text-muted">
          <ArrowRight className="h-6 w-6 rotate-90 lg:rotate-0" />
        </div>

        <div className="invert relative flex flex-col justify-center overflow-hidden p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Capa ShipbayOS</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">Event Intelligence</h3>
          <p className="mt-2 text-sm text-ink-2">Sólo software. Sin hardware propio. Los datos se quedan en agregado y anónimos.</p>
          <ol className="mt-5 space-y-2">
            {CORE.map((c, i) => (
              <li key={c} className="flex items-start gap-3 text-sm">
                <span className="tabular w-5 shrink-0 text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                {c}
              </li>
            ))}
          </ol>
          <p className="mt-5 border-t border-line pt-4 text-xs text-ink-2">
            Sobre la arquitectura de agentes de ShipbayOS: agente de IA + ingesta + SQL + RAG + reportes.
          </p>
        </div>

        <div aria-hidden className="flex items-center justify-center text-muted">
          <ArrowRight className="h-6 w-6 rotate-90 lg:rotate-0" />
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Quién lo usa</p>
          <ul className="space-y-2">
            {OUTPUTS.map((n) => (
              <NodeCard key={n.title} n={n} />
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
