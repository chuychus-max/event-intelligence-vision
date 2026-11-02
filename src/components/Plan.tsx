import { candidates, criteria, phases } from "@/lib/data";
import { KeyFacts, Section, Stars } from "./ui";

const VERDICT = {
  construir: { label: "Construir", className: "bg-ink text-surface" },
  capa: { label: "Capa / después", className: "bg-accent-soft text-ink" },
  no: { label: "No", className: "border border-line text-muted" },
} as const;

export function Plan() {
  return (
    <Section
      id="plan"
      index={11}
      summary={<KeyFacts items={[{ value: "4", label: "Módulos de un solo producto" }, { value: "5", label: "Fases, de 6 semanas a 2 años" }, { value: "0–6 sem", label: "Primer entregable, sin tocar la operación" }]} note="Empezamos con el análisis de 3 eventos pasados; el piloto en vivo llega a los 2–3 meses." />}
      eyebrow="Qué construimos y cuándo"
      title="Un producto, cuatro módulos, cinco fases"
      lead="Evaluamos ocho opciones con seis criterios (de * a * * * * *). El núcleo es el copiloto con pronóstico y cumplimiento. El ROI de patrocinio le da ingreso al área comercial. El agente para fans y el hardware se descartan: alguien más ya los tiene o no es nuestro negocio."
    >
      <div className="overflow-x-auto border border-line bg-surface">
        <table className="w-full min-w-[720px] text-sm">
          <caption className="sr-only">Evaluación de candidatos por criterio</caption>
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">Opción</th>
              {criteria.map((c) => (
                <th key={c} className="px-2 py-3 text-center font-medium">
                  {c}
                </th>
              ))}
              <th className="px-3 py-3 text-center font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Decisión</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => {
              const total = c.scores.reduce((a, b) => a + b, 0);
              return (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <th scope="row" className="px-4 py-2.5 text-left font-medium">
                    <span className="mr-2 text-muted">{c.id}</span>
                    {c.name}
                  </th>
                  {c.scores.map((s, i) => (
                    <td key={i} className="px-2 py-3 text-center text-xs">
                      <Stars value={s} label={`${criteria[i]}: ${s} de 5`} />
                    </td>
                  ))}
                  <td className="tabular px-3 text-center text-base font-semibold">{total}</td>
                  <td className="px-4">
                    <span className={`whitespace-nowrap px-2 py-1 text-[11px] font-medium uppercase tracking-[0.12em] ${VERDICT[c.verdict].className}`}>{VERDICT[c.verdict].label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h3 className="tracked-sm mt-12 text-[11px] text-muted">Fases</h3>
      <ol className="mt-4 grid gap-3 md:grid-cols-5">
        {phases.map((p, i) => (
          <li key={p.name} className={`flex flex-col border p-4 ${i === 0 ? "border-ink bg-surface-2" : "border-line bg-surface"}`}>
            <p className="text-sm font-semibold">{p.name}</p>
            <p className="tabular text-xs text-muted">{p.time}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">{p.what}</p>
            <p className="mt-auto pt-3 text-xs text-muted">
              <span className="font-medium text-ink-2">Necesitamos:</span> {p.need}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
