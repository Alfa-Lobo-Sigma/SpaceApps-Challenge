import { useEffect } from 'react'
import type { ImpactParams, ImpactResults } from '../types'
import { calculateImpactResults, formatMass, formatEnergy, formatKm, formatMT } from '../utils/physics'

interface ImpactParametersProps {
  params: ImpactParams
  onParamsChange: (params: ImpactParams) => void
  onCalculate: (results: ImpactResults) => void
}

export default function ImpactParameters({
  params,
  onParamsChange,
  onCalculate
}: ImpactParametersProps) {
  const handleRecalculate = () => {
    const results = calculateImpactResults(params)
    onCalculate(results)
  }

  // Auto-calculate on params change
  useEffect(() => {
    handleRecalculate()
  }, [params])

  const results = calculateImpactResults(params)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold pt-2">2) Impact parameters (editable)</h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <label className="label block mb-1">Diameter (m)</label>
          <input
            type="number"
            value={params.diameter}
            onChange={(e) => onParamsChange({ ...params, diameter: Number(e.target.value) })}
            className="w-full rounded-lg p-2 bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <div>
          <label className="label block mb-1">Velocity (km/s)</label>
          <input
            type="number"
            step="0.1"
            value={params.velocity}
            onChange={(e) => onParamsChange({ ...params, velocity: Number(e.target.value) })}
            className="w-full rounded-lg p-2 bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <div>
          <label className="label block mb-1">Density (kg/m³)</label>
          <input
            type="number"
            value={params.density}
            onChange={(e) => onParamsChange({ ...params, density: Number(e.target.value) })}
            className="w-full rounded-lg p-2 bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <div>
          <label className="label block mb-1">Target surface</label>
          <select
            value={params.target}
            onChange={(e) => onParamsChange({ ...params, target: e.target.value as any })}
            className="w-full rounded-lg p-2 bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
          >
            <option value="continental">Continental</option>
            <option value="oceanic">Ocean</option>
            <option value="sedimentary">Sedimentary</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleRecalculate}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          Recalculate
        </button>
      </div>

      <h2 className="text-lg font-semibold pt-2">Outputs (order‑of‑magnitude)</h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">Mass</div>
          <div className="text-lg font-semibold">{formatMass(results.mass)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">Kinetic Energy</div>
          <div className="text-lg font-semibold">{formatEnergy(results.energy)}</div>
          <div className="label text-[11px]">{formatMT(results.energyMT)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">Devastation radius*</div>
          <div className="text-lg font-semibold">{formatKm(results.devastationRadius)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">Crater diameter*</div>
          <div className="text-lg font-semibold">{formatKm(results.craterDiameter)}</div>
        </div>
      </div>
      <p className="text-xs label">
        *Heuristic scalings for this demo; replace with validated laws in production.
      </p>
    </div>
  )
}
