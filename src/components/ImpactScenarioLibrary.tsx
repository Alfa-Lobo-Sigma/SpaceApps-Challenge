import { useState } from 'react'
import type { ImpactScenario } from '../data/impactScenarios'

interface ImpactScenarioLibraryProps {
  scenarios: ImpactScenario[]
  onSelectScenario: (scenario: ImpactScenario) => void
  className?: string
}

export default function ImpactScenarioLibrary({
  scenarios,
  onSelectScenario,
  className,
}: ImpactScenarioLibraryProps) {
  const [activeId, setActiveId] = useState<string | null>(scenarios[0]?.id ?? null)

  if (scenarios.length === 0) {
    return null
  }

  return (
    <div className={`space-y-3 ${className ?? ''}`.trim()}>
      <div>
        <h2 className="text-base sm:text-lg font-semibold">Impact scenario library</h2>
        <p className="label text-xs">Curated drills and what-if cases built on NASA NeoWs objects.</p>
      </div>
      <div className="space-y-2">
        {scenarios.map((scenario) => {
          const isActive = scenario.id === activeId
          const impact = scenario.neo.impact_scenario

          return (
            <article
              key={scenario.id}
              className={`rounded-xl border border-white/10 bg-black/25 transition-colors ${
                isActive ? 'ring-1 ring-white/30 bg-white/5' : 'hover:bg-white/5'
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveId((prev) => (prev === scenario.id ? null : scenario.id))}
                className="w-full px-3 py-3 text-left"
                aria-expanded={isActive}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{scenario.title}</span>
                    {impact ? (
                      <span className="rounded-full bg-red-500/10 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-red-200">
                        {impact.probability ? `${Math.round(impact.probability * 1000) / 10}%` : 'Scenario'}
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-500/20 px-2 py-[2px] text-[10px] uppercase tracking-wide text-slate-200">
                        Reference
                      </span>
                    )}
                  </div>
                  <p className="label text-[11px]">{scenario.subtitle}</p>
                  {impact ? (
                    <p className="label text-[10px]">
                      {new Date(impact.impact_date).toUTCString()} • {impact.surface_type} surface
                    </p>
                  ) : null}
                </div>
              </button>
              {isActive ? (
                <div className="space-y-3 border-t border-white/10 px-4 pb-4 text-xs">
                  <p className="pt-3 leading-snug text-white/90">{scenario.description}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-black/40 p-3">
                      <div className="label text-[10px] uppercase tracking-wide">Timeline</div>
                      <div className="mt-1 text-[13px] font-semibold text-white">{scenario.timeline}</div>
                      {impact ? (
                        <div className="mt-2 text-[11px] text-white/70">
                          Impact latitude {impact.location[0].toFixed(2)}°, longitude {impact.location[1].toFixed(2)}°
                        </div>
                      ) : null}
                    </div>
                    <div className="rounded-lg bg-black/40 p-3">
                      <div className="label text-[10px] uppercase tracking-wide">Key parameters</div>
                      <ul className="mt-1 space-y-1 text-[11px] text-white/80">
                        <li>Diameter window: {formatDiameterRange(scenario.neo)}</li>
                        <li>
                          Modeled velocity:{' '}
                          {scenario.neo.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second
                            ? `${Number(
                                scenario.neo.close_approach_data[0].relative_velocity.kilometers_per_second
                              ).toFixed(1)} km/s`
                            : '—'}
                        </li>
                        <li>Surface type: {impact?.surface_type ?? '—'}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-black/40 p-3">
                      <div className="label text-[10px] uppercase tracking-wide">Impact storylines</div>
                      <ul className="mt-1 space-y-1 text-[11px] text-white/80">
                        {scenario.keyImpacts.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/60" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg bg-black/40 p-3">
                      <div className="label text-[10px] uppercase tracking-wide">Response focus</div>
                      <ul className="mt-1 space-y-1 text-[11px] text-white/80">
                        {scenario.focusAreas.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400/80" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="label text-[11px] text-white/70">
                      Loading a scenario sets the orbit, map focus, and recommended physics parameters.
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectScenario(scenario)}
                      className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-white/20"
                    >
                      Load scenario
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}

function formatDiameterRange(neo: ImpactScenario['neo']): string {
  const diameter = neo.estimated_diameter?.meters
  if (!diameter) return '—'
  const min = diameter.estimated_diameter_min
  const max = diameter.estimated_diameter_max
  if (!min || !max) return '—'
  if (Math.abs(min - max) < 1) {
    return `${min.toFixed(0)} m`
  }
  return `${min.toFixed(0)}–${max.toFixed(0)} m`
}
