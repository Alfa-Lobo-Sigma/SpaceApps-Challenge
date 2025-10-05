import type { GeologyAdjustedResults, GeologyAssessment } from '../utils/geology'
import { formatKm } from '../utils/physics'

interface GeologyInsightsProps {
  assessment: GeologyAssessment | null
  adjustedResults: GeologyAdjustedResults | null
}

const formatMultiplier = (value: number) => `×${value.toFixed(2)}`

const sourceLabel: Record<GeologyAssessment['source'], string> = {
  scenario: 'Scenario override',
  regional: 'USGS regional inference',
  manual: 'Manual selection',
}

const hazardEntries = (modifiers: GeologyAdjustedResults['hazardAdjustments']) => {
  const entries: Array<{ label: string; value: number }> = [
    { label: 'Shock', value: modifiers.shock },
    { label: 'Thermal', value: modifiers.thermal },
    { label: 'Seismic', value: modifiers.seismic },
  ]

  if (modifiers.tsunami !== undefined) {
    entries.push({ label: 'Tsunami', value: modifiers.tsunami })
  }

  return entries
}

const GeologyInsights = ({ assessment, adjustedResults }: GeologyInsightsProps) => {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold">Enhanced USGS geology</h3>
        {assessment ? (
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide">
            <span className="rounded-full bg-white/10 px-2 py-[2px] text-white/80">
              Confidence: {assessment.confidence}
            </span>
            <span
              className={`rounded-full px-2 py-[2px] ${
                assessment.appliedTerrain
                  ? 'bg-emerald-500/20 text-emerald-200'
                  : 'bg-amber-500/20 text-amber-100'
              }`}
            >
              {assessment.appliedTerrain ? 'Terrain modifiers active' : 'Surface override'}
            </span>
          </div>
        ) : null}
      </div>
      <p className="mt-1 text-xs label">
        Surface composition analysis, stability assessment, and hazard modifiers derived from embedded USGS GLiM & GMRT
        datasets.
      </p>

      {assessment ? (
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-[11px] uppercase tracking-wide text-white/60">Surface composition analysis</h4>
            <p className="mt-1 leading-relaxed text-[13px] text-white/90">
              {assessment.profile.surfaceComposition}
            </p>
            {assessment.region ? (
              <p className="mt-2 text-[11px] text-white/60">
                Regional context: <span className="font-medium text-white/80">{assessment.region.name}</span>.{' '}
                {assessment.region.description}
              </p>
            ) : null}
            <p className="mt-1 text-[11px] text-white/50">
              Source: {sourceLabel[assessment.source] ?? assessment.source} • {assessment.profile.usgsSource}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-wide text-white/60">Ground stability assessment</h4>
            <p className="mt-1 text-[13px] text-white/90">
              <span className="font-semibold text-white">{assessment.groundStability.rating}</span> —{' '}
              {assessment.groundStability.explanation}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-wide text-white/60">Geological impact modeling</h4>
            <p className="mt-1 leading-relaxed text-[13px] text-white/90">
              {assessment.profile.impactModeling}
            </p>
            {assessment.notes.length ? (
              <ul className="mt-2 space-y-1 text-[11px] text-white/60">
                {assessment.notes.map((note, index) => (
                  <li key={`${note}-${index}`}>• {note}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-wide text-white/60">Terrain-based devastation modifiers</h4>
            {adjustedResults ? (
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="metric rounded-lg p-3">
                  <div className="label text-[11px]">Devastation radius</div>
                  <div className="text-sm font-semibold">
                    {formatKm(adjustedResults.adjustedDevastationRadius)}
                  </div>
                  <div className="label text-[11px]">
                    Baseline {formatKm(adjustedResults.baseline.devastationRadius)} •{' '}
                    {formatMultiplier(adjustedResults.multipliers.devastation)}
                  </div>
                </div>
                <div className="metric rounded-lg p-3">
                  <div className="label text-[11px]">Crater diameter</div>
                  <div className="text-sm font-semibold">
                    {formatKm(adjustedResults.adjustedCraterDiameter)}
                  </div>
                  <div className="label text-[11px]">
                    Baseline {formatKm(adjustedResults.baseline.craterDiameter)} •{' '}
                    {formatMultiplier(adjustedResults.multipliers.crater)}
                  </div>
                </div>
                <div className="metric rounded-lg p-3 sm:col-span-2">
                  <div className="label text-[11px]">Hazard amplification</div>
                  <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-white/70">
                    {hazardEntries(adjustedResults.hazardAdjustments).map((entry) => (
                      <span key={entry.label}>
                        {entry.label} {formatMultiplier(entry.value)}
                      </span>
                    ))}
                  </div>
                  {!assessment.appliedTerrain ? (
                    <div className="mt-2 text-[11px] text-amber-200">
                      Terrain multipliers reflect the selected surface defaults. Align the surface type with the inferred USGS
                      unit to apply regional adjustments.
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-[12px] text-white/60">
                Adjust impact parameters to compute terrain-modified devastation estimates.
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-xs text-white/60">
          Select a NEO and map location to unlock terrain-aware impact adjustments.
        </p>
      )}
    </div>
  )
}

export default GeologyInsights
