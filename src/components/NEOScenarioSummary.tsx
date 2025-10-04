import type { NEO, ImpactResults } from '../types'
import { formatEnergy, formatMT, formatKm } from '../utils/physics'
import type { GeologyAdjustedResults, GeologyAssessment } from '../utils/geology'
import PhysicsTooltip from './PhysicsTooltip'

interface NEOScenarioSummaryProps {
  neo: NEO | null
  impactResults: ImpactResults | null
  adjustedResults: GeologyAdjustedResults | null
  geology: GeologyAssessment | null
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

export default function NEOScenarioSummary({
  neo,
  impactResults,
  adjustedResults,
  geology,
  location,
}: NEOScenarioSummaryProps) {
  if (!neo) {
    return null
  }

  const scenario = neo.impact_scenario
  const approach = neo.close_approach_data?.[0]
  const diameter = neo.estimated_diameter?.meters

  const locationStr = `${location[0].toFixed(2)}°, ${location[1].toFixed(2)}°`
  const devastationValue = adjustedResults?.adjustedDevastationRadius ?? impactResults?.devastationRadius ?? null
  const craterValue = adjustedResults?.adjustedCraterDiameter ?? impactResults?.craterDiameter ?? null

  const hazardLabel = adjustedResults
    ? `Shock ${adjustedResults.hazardAdjustments.shock.toFixed(2)}× • Thermal ${adjustedResults.hazardAdjustments.thermal.toFixed(2)}× • Seismic ${adjustedResults.hazardAdjustments.seismic.toFixed(2)}×`
    : null
  const tsunamiLabel = adjustedResults?.hazardAdjustments.tsunami
    ? ` • Tsunami ${adjustedResults.hazardAdjustments.tsunami.toFixed(2)}×`
    : ''

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
            <div className="text-sm font-semibold">{geology.profile.label}</div>
            <div className="text-[11px] label">
              {geology.region ? `${geology.region.name} • ` : ''}Confidence {geology.confidence}
            </div>
            <div className="text-[11px] label">{geology.profile.usgsSource}</div>
          </div>
        ) : null}
      </div>

      {impactResults ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="metric rounded-lg p-3">
          <div className="label flex items-center gap-1 text-xs">
            Energy release
            <PhysicsTooltip term="energy" />
          </div>
          <div className="text-sm font-semibold">{formatEnergy(impactResults.energy)}</div>
          <div className="text-[11px] label">{formatMT(impactResults.energyMT)}</div>
        </div>
        <div className="metric rounded-lg p-3">
          <div className="label flex items-center gap-1 text-xs">
            Modeled devastation radius*
            <PhysicsTooltip term="devastationRadius" />
          </div>
          <div className="text-sm font-semibold">{devastationValue ? formatKm(devastationValue) : '—'}</div>
            {geology && adjustedResults ? (
              <div className="text-[11px] label">
                Terrain multiplier ×{adjustedResults.multipliers.devastation.toFixed(2)}
              </div>
            ) : geology ? (
              <div className="text-[11px] label">Geology profile {geology.profile.label}</div>
            ) : (
              <div className="text-[11px] label">Baseline heuristic</div>
            )}
          </div>
        <div className="metric rounded-lg p-3 sm:col-span-2">
          <div className="label flex items-center gap-1 text-xs">
            Crater diameter*
            <PhysicsTooltip term="craterDiameter" />
          </div>
          <div className="text-sm font-semibold">{craterValue ? formatKm(craterValue) : '—'}</div>
            {geology && adjustedResults ? (
              <div className="text-[11px] label">
                Surface response ×{adjustedResults.multipliers.crater.toFixed(2)}
              </div>
            ) : geology ? (
              <div className="text-[11px] label">Geology profile {geology.profile.label}</div>
            ) : (
              <div className="text-[11px] label">Baseline heuristic</div>
            )}
          </div>
          {hazardLabel ? (
            <div className="metric rounded-lg p-3 sm:col-span-2">
              <div className="label text-xs">Hazard channel modifiers</div>
              <div className="text-sm font-semibold">
                {hazardLabel}
                {tsunamiLabel}
              </div>
              {!geology?.appliedTerrain ? (
                <div className="text-[11px] label">
                  Align the selected surface type with the inferred terrain to activate regional overrides.
                </div>
              ) : null}
            </div>
          ) : null}
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
