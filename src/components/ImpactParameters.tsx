import { useEffect, useState } from 'react'
import type { ImpactParams, ImpactResults } from '../types'
import {
  calculateImpactResults,
  formatMass,
  formatEnergy,
  formatKm,
  formatMT,
  formatPopulation,
  formatCurrency,
  formatYears,
  formatIndex
} from '../utils/physics'
import { useLanguage } from '../contexts/LanguageContext'
import { IMPACT_PARAM_LIMITS } from '../utils/validation'
import PhysicsTooltip from './PhysicsTooltip'

type NumericField = 'diameter' | 'velocity' | 'density'

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

  const [inputValues, setInputValues] = useState<Record<NumericField, string>>({
    diameter: params.diameter.toString(),
    velocity: params.velocity.toString(),
    density: params.density.toString()
  })
  const [errors, setErrors] = useState<Record<NumericField, string | undefined>>({
    diameter: undefined,
    velocity: undefined,
    density: undefined
  })

  useEffect(() => {
    setInputValues({
      diameter: params.diameter.toString(),
      velocity: params.velocity.toString(),
      density: params.density.toString()
    })
    setErrors({ diameter: undefined, velocity: undefined, density: undefined })
  }, [params.diameter, params.velocity, params.density])

  const handleNumericChange = (field: NumericField) => (value: string) => {
    setInputValues(prev => ({ ...prev, [field]: value }))

    if (value.trim() === '') {
      setErrors(prev => ({ ...prev, [field]: t('impactParams.validation.required') }))
      return
    }

    const numeric = Number(value)
    if (!Number.isFinite(numeric)) {
      setErrors(prev => ({ ...prev, [field]: t('impactParams.validation.number') }))
      return
    }

    const { min, max } = IMPACT_PARAM_LIMITS[field]
    if (numeric < min || numeric > max) {
      const rangeKey =
        field === 'diameter'
          ? 'diameterRange'
          : field === 'velocity'
            ? 'velocityRange'
            : 'densityRange'
      setErrors(prev => ({ ...prev, [field]: t(`impactParams.validation.${rangeKey}`) }))
      return
    }

    setErrors(prev => ({ ...prev, [field]: undefined }))
    onParamsChange({ ...params, [field]: numeric })
  }
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
          <label className="label mb-1 flex items-center gap-1 text-xs">
            {t('impactParams.diameter')}
            <PhysicsTooltip term="diameter" />
          </label>
          <input
            type="number"
            inputMode="decimal"
            min={IMPACT_PARAM_LIMITS.diameter.min}
            max={IMPACT_PARAM_LIMITS.diameter.max}
            step={IMPACT_PARAM_LIMITS.diameter.step}
            value={inputValues.diameter}
            onChange={(e) => handleNumericChange('diameter')(e.target.value)}
            aria-invalid={Boolean(errors.diameter)}
            aria-describedby="diameter-error"
            className={`w-full rounded-lg p-2 bg-black/30 border focus:outline-none transition-colors text-sm ${
              errors.diameter
                ? 'border-red-500/60 focus:border-red-400'
                : 'border-white/10 focus:border-white/30'
            }`}
          />
          {errors.diameter && (
            <p id="diameter-error" className="mt-1 text-xs text-red-400">
              {errors.diameter}
            </p>
          )}
        </div>
        <div>
          <label className="label mb-1 flex items-center gap-1 text-xs">
            {t('impactParams.velocity')}
            <PhysicsTooltip term="velocity" />
          </label>
          <input
            type="number"
            inputMode="decimal"
            min={IMPACT_PARAM_LIMITS.velocity.min}
            max={IMPACT_PARAM_LIMITS.velocity.max}
            step={IMPACT_PARAM_LIMITS.velocity.step}
            value={inputValues.velocity}
            onChange={(e) => handleNumericChange('velocity')(e.target.value)}
            aria-invalid={Boolean(errors.velocity)}
            aria-describedby="velocity-error"
            className={`w-full rounded-lg p-2 bg-black/30 border focus:outline-none transition-colors text-sm ${
              errors.velocity
                ? 'border-red-500/60 focus:border-red-400'
                : 'border-white/10 focus:border-white/30'
            }`}
          />
          {errors.velocity && (
            <p id="velocity-error" className="mt-1 text-xs text-red-400">
              {errors.velocity}
            </p>
          )}
        </div>
        <div>
          <label className="label mb-1 flex items-center gap-1 text-xs">
            {t('impactParams.density')}
            <PhysicsTooltip term="density" />
          </label>
          <input
            type="number"
            inputMode="decimal"
            min={IMPACT_PARAM_LIMITS.density.min}
            max={IMPACT_PARAM_LIMITS.density.max}
            step={IMPACT_PARAM_LIMITS.density.step}
            value={inputValues.density}
            onChange={(e) => handleNumericChange('density')(e.target.value)}
            aria-invalid={Boolean(errors.density)}
            aria-describedby="density-error"
            className={`w-full rounded-lg p-2 bg-black/30 border focus:outline-none transition-colors text-sm ${
              errors.density
                ? 'border-red-500/60 focus:border-red-400'
                : 'border-white/10 focus:border-white/30'
            }`}
          />
          {errors.density && (
            <p id="density-error" className="mt-1 text-xs text-red-400">
              {errors.density}
            </p>
          )}
        </div>
        <div>
          <label className="label mb-1 flex items-center gap-1 text-xs">
            {t('impactParams.target')}
            <PhysicsTooltip term="target" />
          </label>
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
          <div className="label flex items-center gap-1 text-xs">
            {t('impactParams.mass')}
            <PhysicsTooltip term="mass" />
          </div>
          <div className="text-base sm:text-lg font-semibold">{formatMass(results.mass)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label flex items-center gap-1 text-xs">
            {t('impactParams.energy')}
            <PhysicsTooltip term="energy" />
          </div>
          <div className="text-base sm:text-lg font-semibold">{formatEnergy(results.energy)}</div>
          <div className="label text-[10px] sm:text-[11px]">{formatMT(results.energyMT)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label flex items-center gap-1 text-xs">
            {t('impactParams.devastation')}
            <PhysicsTooltip term="devastationRadius" />
          </div>
          <div className="text-base sm:text-lg font-semibold">{formatKm(results.devastationRadius)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label flex items-center gap-1 text-xs">
            {t('impactParams.crater')}
            <PhysicsTooltip term="craterDiameter" />
          </div>
          <div className="text-base sm:text-lg font-semibold">{formatKm(results.craterDiameter)}</div>
        </div>
      </div>

      <h3 className="text-base sm:text-lg font-semibold pt-4">{t('impactParams.population.title')}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.population.exposed')}</div>
          <div className="text-base sm:text-lg font-semibold">{formatPopulation(results.population.exposed)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.population.displaced')}</div>
          <div className="text-base sm:text-lg font-semibold">{formatPopulation(results.population.displaced)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.population.fatalities')}</div>
          <div className="text-base sm:text-lg font-semibold">{formatPopulation(results.population.fatalities)}</div>
        </div>
      </div>

      <h3 className="text-base sm:text-lg font-semibold pt-4">{t('impactParams.economic.title')}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.economic.directDamage')}</div>
          <div className="text-base sm:text-lg font-semibold">{formatCurrency(results.economic.directDamage)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.economic.infrastructureLoss')}</div>
          <div className="text-base sm:text-lg font-semibold">{formatCurrency(results.economic.infrastructureLoss)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.economic.recovery')}</div>
          <div className="text-base sm:text-lg font-semibold">{formatYears(results.economic.recoveryYears)}</div>
        </div>
      </div>

      <h3 className="text-base sm:text-lg font-semibold pt-4">{t('impactParams.environmental.title')}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 text-sm">
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.environmental.severity')}</div>
          <div className="text-base sm:text-lg font-semibold">{formatIndex(results.environmental.severityIndex)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.environmental.air')}</div>
          <div className="text-base sm:text-lg font-semibold">{formatIndex(results.environmental.airQualityIndex)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.environmental.water')}</div>
          <div className="text-base sm:text-lg font-semibold">{formatIndex(results.environmental.waterQualityIndex)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.environmental.category.label')}</div>
          <div className="text-base sm:text-lg font-semibold">
            {t(`impactParams.environmental.category.${results.environmental.category}`)}
          </div>
        </div>
      </div>

      <h3 className="text-base sm:text-lg font-semibold pt-4">{t('impactParams.multiImpact.title')}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.multiImpact.classification')}</div>
          <div className="text-base sm:text-lg font-semibold">
            {t(`impactParams.multiImpact.level.${results.multiImpact.classification}`)}
          </div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.multiImpact.risk')}</div>
          <div className="text-base sm:text-lg font-semibold">{formatIndex(results.multiImpact.cascadingRisk)}</div>
        </div>
        <div className="metric rounded-xl p-3">
          <div className="label text-xs">{t('impactParams.multiImpact.response')}</div>
          <div className="text-base sm:text-lg font-semibold">
            {t(`impactParams.multiImpact.responseLevel.${results.multiImpact.responseLevel}`)}
          </div>
        </div>
      </div>
    </div>
  )
}
