import { CircleCheck, CircleDashed, CircleHelp, Users } from "lucide-react";
import { gaps, nextSteps, sourceGroups, type GapStatus } from "@/lib/data";
import { Section } from "./ui";

const STATUS: Record<GapStatus, { label: string; icon: typeof CircleCheck; color: string }> = {
  resuelto: { label: "Resuelto", icon: CircleCheck, color: "var(--good)" },
  parcial: { label: "Parcial", icon: CircleDashed, color: "var(--warning)" },
  abierto: { label: "Abierto", icon: CircleHelp, color: "var(--muted)" },
  cliente: { label: "Sólo con OCESA", icon: Users, color: "var(--accent)" },
};

export function Gaps() {
  return (
    <Section
      id="huecos"
      index={12}
      eyebrow="Siguientes pasos"
      title="Lo que sigue y lo que falta confirmar"
      lead="Casi todo lo que falta se resuelve hablando con OCESA o viendo un evento por dentro."
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="border border-line bg-surface">
          <ul>
            {gaps.map((g) => {
              const s = STATUS[g.status];
              const Icon = s.icon;
              return (
                <li key={g.question} className="flex items-start gap-3 border-b border-line px-4 py-3 last:border-0">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: s.color }} aria-hidden />
                  <span className="flex-1 text-sm">
                    <span className="mr-2 text-xs text-muted">{g.area}</span>
                    {g.question}
                  </span>
                  <span className="shrink-0 text-xs text-ink-2">{s.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Siguientes pasos</p>
          {nextSteps.map((n, i) => (
            <div key={n.title} className="border border-line bg-surface p-4">
              <p className="text-sm font-semibold">
                <span className="tabular mr-2 text-accent">{i + 1}</span>
                {n.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">{n.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Sources() {
  return (
    <section id="fuentes" className="screen border-t border-line text-ink">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-lg font-semibold">Fuentes</h2>
        <p className="mt-1 max-w-3xl text-sm text-ink-2">
          Investigación de escritorio, oct 2026. Muchas cifras vienen de proveedores o de fuentes secundarias; cada tarjeta indica la calidad de su
          fuente.
        </p>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {sourceGroups.map((g) => (
            <div key={g.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{g.title}</h3>
              <ul className="mt-3 space-y-2">
                {g.items.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="text-sm text-ink-2 underline decoration-line underline-offset-2 hover:text-ink">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-12 text-xs text-muted">
          ShipbayOS · Borrador de visión, no es una propuesta comercial. No contiene datos internos de OCESA, Ticketmaster ni Live Nation; la demo usa
          datos sintéticos.
        </p>
      </div>
    </section>
  );
}
