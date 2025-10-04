import type { NEO, ImpactResults } from '../types'
import { formatEnergy, formatMT, formatKm } from '../utils/physics'
import { GEOLOGY_PROFILES } from '../data/usgsGeology'

interface NEOScenarioSummaryProps {
  neo: NEO | null
  impactResults: ImpactResults | null
  location: [number, number]
}

const formatRange = (min?: number, max?: number) => {
  if (!min || !max) return '—'
  if (Math.abs(min - max) < 1) {
    return `${min.toFixed(0)} m`
  }
  return `${min.toFixed(0)}–${max.toFixed(0)} m`
}

const formatProbability = (value?: number) => {
  if (value === undefined) return 'Unknown'
  return `${Math.round(value * 100)}%`
}

export default function NEOScenarioSummary({ neo, impactResults, location }: NEOScenarioSummaryProps) {
  if (!neo) {
    return null
  }

  const scenario = neo.impact_scenario
  const approach = neo.close_approach_data?.[0]
  const diameter = neo.estimated_diameter?.meters
  const geology = scenario ? GEOLOGY_PROFILES[scenario.surface_type] : null

  const adjustedDevastation =
    impactResults && geology
      ? impactResults.devastationRadius * geology.devastationMultiplier
      : impactResults?.devastationRadius

  const adjustedCrater =
    impactResults && geology
      ? impactResults.craterDiameter * geology.craterMultiplier
      : impactResults?.craterDiameter

  const locationStr = `${location[0].toFixed(2)}°, ${location[1].toFixed(2)}°`

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold">Scenario focus</h3>
          <p className="text-xs label">
            Impactor‑2025 is a hypothetical threat-track inserted for planning drills. Real NeoWs objects remain selectable below.
          </p>
        </div>
        {scenario ? (
          <span className="rounded-full bg-red-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-200">
            {formatProbability(scenario.probability)} impact
          </span>
        ) : neo.is_potentially_hazardous_asteroid ? (
          <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-yellow-200">
            PHA
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="metric rounded-lg p-3">
          <div className="label text-xs">Object</div>
          <div className="text-sm font-semibold">{neo.name}</div>
          <div className="text-[11px] label">Diameter {formatRange(diameter?.estimated_diameter_min, diameter?.estimated_diameter_max)}</div>
        </div>
        <div className="metric rounded-lg p-3">
          <div className="label text-xs">Nominal velocity</div>
          <div className="text-sm font-semibold">
            {approach?.relative_velocity?.kilometers_per_second
              ? `${Number(approach.relative_velocity.kilometers_per_second).toFixed(1)} km/s`
              : '—'}
          </div>
          <div className="text-[11px] label">Closest approach {approach?.close_approach_date ?? '—'}</div>
        </div>
        <div className="metric rounded-lg p-3">
          <div className="label text-xs">Impact site (lat, lon)</div>
          <div className="text-sm font-semibold">{locationStr}</div>
          <div className="text-[11px] label">
            {scenario?.narrative ?? 'Drag marker on the map to explore alternative impact points.'}
          </div>
        </div>
        {geology ? (
          <div className="metric rounded-lg p-3">
            <div className="label text-xs">Surface geology context</div>
            <div className="text-sm font-semibold">{geology.label}</div>
            <div className="text-[11px] label">{geology.usgsSource}</div>
          </div>
        ) : null}
      </div>

      {impactResults ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="metric rounded-lg p-3">
            <div className="label text-xs">Energy release</div>
            <div className="text-sm font-semibold">{formatEnergy(impactResults.energy)}</div>
            <div className="text-[11px] label">{formatMT(impactResults.energyMT)}</div>
          </div>
          <div className="metric rounded-lg p-3">
            <div className="label text-xs">Modeled devastation radius*</div>
            <div className="text-sm font-semibold">{adjustedDevastation ? formatKm(adjustedDevastation) : '—'}</div>
            {geology ? (
              <div className="text-[11px] label">USGS geology modifier ×{geology.devastationMultiplier.toFixed(2)}</div>
            ) : (
              <div className="text-[11px] label">Baseline heuristic</div>
            )}
          </div>
          <div className="metric rounded-lg p-3 sm:col-span-2">
            <div className="label text-xs">Crater diameter*</div>
            <div className="text-sm font-semibold">{adjustedCrater ? formatKm(adjustedCrater) : '—'}</div>
            {geology ? (
              <div className="text-[11px] label">Scaled by surface response ×{geology.craterMultiplier.toFixed(2)}</div>
            ) : (
              <div className="text-[11px] label">Baseline heuristic</div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs label">Adjust parameters to compute energy release and crater size.</p>
      )}

      <p className="text-[11px] label">
        *Order-of-magnitude estimates for educational use. Calibrate against validated impact models before operational deployment.
      </p>
    </div>
  )
}
