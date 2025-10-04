import type {
  ImpactParams,
  ImpactResults,
  ImpactSeverityCategory,
  ImpactCascadeLevel,
  ResponseLevel
} from '../types'

const TARGET_FACTORS = {
  continental: {
    populationDensity: 380, // people per km^2
    gdpDensity: 1.6e9, // USD per km^2
    envSensitivity: 0.9,
    displacementFactor: 0.65
  },
  sedimentary: {
    populationDensity: 180,
    gdpDensity: 1.1e9,
    envSensitivity: 1.1,
    displacementFactor: 0.55
  },
  oceanic: {
    populationDensity: 12,
    gdpDensity: 0.45e9,
    envSensitivity: 1.4,
    displacementFactor: 0.35
  }
} as const

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const classifyEnvironmental = (severity: number): ImpactSeverityCategory => {
  if (severity >= 85) return 'extreme'
  if (severity >= 65) return 'severe'
  if (severity >= 40) return 'moderate'
  return 'minimal'
}

const classifyCascade = (score: number): ImpactCascadeLevel => {
  if (score >= 75) return 'global'
  if (score >= 45) return 'regional'
  return 'localized'
}

const classifyResponse = (score: number): ResponseLevel => {
  if (score >= 80) return 'mobilize'
  if (score >= 45) return 'coordinate'
  return 'monitor'
}

export function calculateImpactResults(params: ImpactParams): ImpactResults {
  const { diameter, velocity, density, target } = params

  // Calculate mass (sphere volume * density)
  const radius = diameter / 2
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3)
  const mass = volume * density

  // Calculate kinetic energy (0.5 * m * v^2)
  const velocityMs = velocity * 1000 // convert km/s to m/s
  const energy = 0.5 * mass * Math.pow(velocityMs, 2)

  // Convert to megatons TNT (1 MT = 4.184e15 J)
  const energyMT = energy / 4.184e15

  // Heuristic devastation radius (km)
  const devastationRadius = 1.2 * Math.cbrt(energyMT)

  // Heuristic crater diameter (km)
  const craterDiameter = 1.1 * Math.pow(energyMT, 0.25)

  const devastationArea = Math.PI * Math.pow(devastationRadius, 2) // km^2
  const factors = TARGET_FACTORS[target]

  const exposedPopulation = devastationArea * factors.populationDensity
  const fatalityRate = clamp(0.08 + Math.pow(energyMT, 0.28) / 25, 0.02, 0.4)
  const displacedRate = clamp(factors.displacementFactor + fatalityRate / 2, 0.15, 0.85)

  const fatalities = exposedPopulation * fatalityRate
  const displaced = exposedPopulation * displacedRate

  const energySeverity = Math.pow(energyMT, 0.36)
  const economicScalar = clamp(0.75 + energySeverity / 18, 0.8, 3)
  const directDamage = devastationArea * factors.gdpDensity * economicScalar
  const infrastructureLoss = directDamage * clamp(0.35 + energySeverity / 30, 0.4, 0.85)
  const recoveryYears = clamp(1.5 + energySeverity / 6, 0.5, 25)

  const baseEnv = clamp(Math.pow(energyMT, 0.32) * 18, 5, 110)
  const severityIndex = clamp(baseEnv * factors.envSensitivity, 0, 100)
  const airQualityIndex = clamp(severityIndex * (target === 'continental' ? 1.05 : 0.9), 0, 100)
  const waterQualityIndex = clamp(
    severityIndex * (target === 'oceanic' ? 1.2 : target === 'sedimentary' ? 1.0 : 0.85),
    0,
    100
  )
  const environmentalCategory = classifyEnvironmental(severityIndex)

  const cascadeBase = clamp(
    (exposedPopulation / 1_000_000) * 9 + (directDamage / 1e12) * 14 + severityIndex * 0.45,
    0,
    120
  )
  const cascadingRisk = clamp(cascadeBase, 0, 100)
  const cascadeClassification = classifyCascade(cascadingRisk)
  const responseLevel = classifyResponse(cascadingRisk)

  return {
    mass,
    energy,
    energyMT,
    devastationRadius,
    craterDiameter,
    population: {
      exposed: exposedPopulation,
      displaced,
      fatalities
    },
    economic: {
      directDamage,
      infrastructureLoss,
      recoveryYears
    },
    environmental: {
      severityIndex,
      airQualityIndex,
      waterQualityIndex,
      category: environmentalCategory
    },
    multiImpact: {
      classification: cascadeClassification,
      cascadingRisk,
      responseLevel
    }
  }
}

export function formatMass(mass: number): string {
  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
  return `${fmt.format(mass)} kg`
}

export function formatEnergy(energy: number): string {
  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
  if (energy >= 1e15) {
    return `${fmt.format(energy / 1e15)} PJ`
  } else if (energy >= 1e12) {
    return `${fmt.format(energy / 1e12)} TJ`
  } else {
    return `${fmt.format(energy)} J`
  }
}

export function formatKm(value: number): string {
  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
  return `${fmt.format(value)} km`
}

export function formatMT(value: number): string {
  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
  return `${fmt.format(value)} Mt TNT`
}

export function formatPopulation(value: number): string {
  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })
  return fmt.format(Math.round(value))
}

export function formatCurrency(value: number): string {
  const fmt = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  })
  return fmt.format(Math.round(value))
}

export function formatYears(value: number): string {
  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 })
  return `${fmt.format(value)} yrs`
}

export function formatIndex(value: number): string {
  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })
  return `${fmt.format(value)} / 100`
}
