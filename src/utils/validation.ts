import type { ImpactParams } from '../types'

export type NumericImpactParam = 'diameter' | 'velocity' | 'density'

interface ImpactParamLimit {
  min: number
  max: number
  step?: number
}

export const IMPACT_PARAM_LIMITS: Record<NumericImpactParam, ImpactParamLimit> = {
  diameter: { min: 1, max: 100_000, step: 1 },
  velocity: { min: 0.1, max: 72, step: 0.1 },
  density: { min: 200, max: 15_000, step: 50 }
}

export function clampImpactParam(param: NumericImpactParam, value: number): number {
  const { min, max } = IMPACT_PARAM_LIMITS[param]
  if (!Number.isFinite(value)) {
    return min
  }
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

export function normalizeImpactParams(params: ImpactParams): ImpactParams {
  return {
    ...params,
    diameter: clampImpactParam('diameter', params.diameter),
    velocity: clampImpactParam('velocity', params.velocity),
    density: clampImpactParam('density', params.density)
  }
}

export function mergeImpactParams(
  base: ImpactParams,
  update: Partial<ImpactParams>
): ImpactParams {
  const next: ImpactParams = { ...base, ...update }
  return normalizeImpactParams(next)
}
