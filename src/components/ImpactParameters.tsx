import { useEffect } from 'react'
import type { ImpactParams, ImpactResults } from '../types'
import { calculateImpactResults, formatMass, formatEnergy, formatKm, formatMT } from '../utils/physics'
import { useLanguage } from '../contexts/LanguageContext'

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
  const { t } = useLanguage()
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
      <h2 className="text-base sm:text-lg font-semibold pt-2">{t('impactParams.title')}</h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <label className="label block mb-1 text-xs">{t('impactParams.diameter')}</label>
          <input
            type="number"
            value={params.diameter}
            onChange={(e) => onParamsChange({ ...params, diameter: Number(e.target.value) })}
            className="w-full rounded-lg p-2 bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="label block mb-1 text-xs">{t('impactParams.velocity')}</label>
          <input
            type="number"
            step="0.1"
            value={params.velocity}
            onChange={(e) => onParamsChange({ ...params, velocity: Number(e.target.value) })}
            className="w-full rounded-lg p-2 bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="label block mb-1 text-xs">{t('impactParams.density')}</label>
          <input
            type="number"
            value={params.density}
            onChange={(e) => onParamsChange({ ...params, density: Number(e.target.value) })}
            className="w-full rounded-lg p-2 bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="label block mb-1 text-xs">{t('impactParams.target')}</label>
          <select
            value={params.target}
            onChange={(e) => onParamsChange({ ...params, target: e.target.value as any })}
            className="w-full rounded-lg p-2 bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-sm"
          >
            <option value="continental">{t('impactParams.continental')}</option>
            <option value="oceanic">{t('impactParams.oceanic')}</option>
            <option value="sedimentary">{t('impactParams.sedimentary')}</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleRecalculate}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
        >
          {t('impactParams.recalculate')}
        </button>
      </div>

      <h2 className="text-base sm:text-lg font-semibold pt-2">{t('impactParams.results')}</h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.mass')}</div>
          <div className="text-base sm:text-lg font-semibold">{formatMass(results.mass)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.energy')}</div>
          <div className="text-base sm:text-lg font-semibold">{formatEnergy(results.energy)}</div>
          <div className="label text-[10px] sm:text-[11px]">{formatMT(results.energyMT)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.devastation')}</div>
          <div className="text-base sm:text-lg font-semibold">{formatKm(results.devastationRadius)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.crater')}</div>
          <div className="text-base sm:text-lg font-semibold">{formatKm(results.craterDiameter)}</div>
        </div>
      </div>
    </div>
  )
}
