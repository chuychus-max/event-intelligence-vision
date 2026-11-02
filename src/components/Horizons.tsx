import { horizons } from "@/lib/data";
import { KeyFacts, Section } from "./ui";

export function Horizons() {
  return (
    <Section
      id="horizontes"
      index={10}
      summary={<KeyFacts items={[{ value: "2 años", label: "El boleto se vuelve el recinto" }, { value: "5 años", label: "Punto azul sin hardware" }, { value: "10 años", label: "El mapa como infraestructura" }]} note="Las interfaces cambian; el dato del recinto, en estándar y al día, se queda." />}
      eyebrow="Horizontes · 2, 5 y 10 años"
      title="Las interfaces cambian; el dato del recinto se queda"
      lead="Lo que pasa en el mundo y cómo se conecta nuestra capa en cada horizonte. Las proyecciones a 5 y 10 años son opinión, no pronóstico: la idea es construir algo que sirva sin importar qué interfaz gane."
    >
      <ol className="relative grid gap-4 lg:grid-cols-3">
        <span aria-hidden className="absolute left-0 right-0 top-[1.15rem] hidden h-px bg-[var(--baseline)] lg:block" />
        {horizons.map((h, i) => (
          <li key={h.when} className="relative flex flex-col">
            <div className="flex items-center gap-3">
              <span
                className="relative z-10 grid h-9 w-9 place-items-center rounded-full border border-ink bg-surface text-sm font-semibold text-ink"
                style={{ background: ["var(--surface-1)", "var(--surface-3)", "var(--ink)"][i], color: i === 2 ? "var(--surface-1)" : undefined }}
              >
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold">{h.when}</p>
                <p className="text-xs text-muted">{h.year}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-1 flex-col border border-line bg-surface p-5">
              <h3 className="text-lg font-semibold leading-snug">{h.title}</h3>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">En el mundo</p>
              <ul className="mt-2 space-y-1.5">
                {h.world.map((w) => (
                  <li key={w} className="flex gap-2 text-sm text-ink-2">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                    {w}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-5">
                <div className="border-l-2 border-ink bg-surface-2 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">Nuestra capa</p>
                  <p className="mt-1 text-sm">{h.us}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
