import type { ImpactParams, ImpactResults, NEO, SurfaceType, ConfidenceLevel, GeologyProfile, GeologyRegion, HazardModifiers } from '../types'
import { GEOLOGY_PROFILES } from '../data/usgsGeology'
import { GEOLOGY_REGIONS } from '../data/usgsRegions'

const normalizeLng = (lng: number) => {
  const normalized = ((lng + 180) % 360 + 360) % 360 - 180
  return Number.isFinite(normalized) ? normalized : lng
}

const within = ([min, max]: [number, number], value: number) => {
  const lower = Math.min(min, max)
  const upper = Math.max(min, max)
  return value >= lower && value <= upper
}

const LAND_BOUNDS: { lat: [number, number]; lng: [number, number] }[] = [
  { lat: [-60, 72], lng: [-170, -30] }, // North & South America
  { lat: [-40, 70], lng: [-20, 50] }, // Africa & Europe
  { lat: [5, 75], lng: [45, 180] }, // Asia
  { lat: [-50, -10], lng: [110, 180] }, // Australia & Oceania
  { lat: [-90, -60], lng: [-180, 180] }, // Antarctica
]

const isLikelyLand = (lat: number, lng: number) =>
  LAND_BOUNDS.some((box) => within(box.lat, lat) && within(box.lng, lng))

const sortByPriority = (regions: GeologyRegion[]) =>
  [...regions].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))

const findRegion = (lat: number, lng: number): GeologyRegion | null => {
  const normalizedLng = normalizeLng(lng)
  const prioritized = sortByPriority(
    GEOLOGY_REGIONS.filter((region) => region.kind !== 'fallback-land' && region.kind !== 'fallback-ocean')
  )

  for (const region of prioritized) {
    if (within(region.bounds.lat, lat) && within(region.bounds.lng, normalizedLng)) {
      return region
    }
  }

  const likelyLand = isLikelyLand(lat, normalizedLng)
  const fallbackKind: 'fallback-land' | 'fallback-ocean' = likelyLand ? 'fallback-land' : 'fallback-ocean'

  const fallback = sortByPriority(
    GEOLOGY_REGIONS.filter((region) => region.kind === fallbackKind)
  )[0]

  return fallback ?? null
}

export type GeologySource = 'scenario' | 'regional' | 'manual'

export interface GeologyAssessment {
  surfaceType: SurfaceType
  profile: GeologyProfile
  region: GeologyRegion | null
  source: GeologySource
  confidence: ConfidenceLevel
  multipliers: {
    devastation: number
    crater: number
  }
  hazardAdjustments: HazardModifiers
  groundStability: {
    rating: ConfidenceLevel
    explanation: string
  }
  appliedTerrain: boolean
  notes: string[]
}

export interface GeologyAdjustedResults {
  baseline: ImpactResults
  adjustedDevastationRadius: number
  adjustedCraterDiameter: number
  multipliers: {
    devastation: number
    crater: number
  }
  hazardAdjustments: HazardModifiers
  appliedTerrain: boolean
}

interface AnalyzeGeologyInput {
  location: [number, number]
  params: ImpactParams
  neo: NEO | null
}

const combineHazardAdjustments = (
  profile: GeologyProfile,
  region: GeologyRegion | null,
  appliedTerrain: boolean
): HazardModifiers => {
  const overrides = appliedTerrain ? region?.hazardOverrides ?? {} : {}
  const result: HazardModifiers = {
    shock: profile.hazardAdjustments.shock * (overrides.shock ?? 1),
    thermal: profile.hazardAdjustments.thermal * (overrides.thermal ?? 1),
    seismic: profile.hazardAdjustments.seismic * (overrides.seismic ?? 1),
  }

  if (profile.hazardAdjustments.tsunami !== undefined || overrides.tsunami !== undefined) {
    result.tsunami = (profile.hazardAdjustments.tsunami ?? 1) * (overrides.tsunami ?? 1)
  }

  return result
}

const resolveGroundStability = (
  profile: GeologyProfile,
  region: GeologyRegion | null,
  appliedTerrain: boolean
): { rating: ConfidenceLevel; explanation: string } => {
  if (appliedTerrain && region?.stabilityOverride) {
    return {
      rating: region.stabilityOverride.rating ?? profile.groundStability.rating,
      explanation: region.stabilityOverride.explanation ?? profile.groundStability.explanation,
    }
  }

  return profile.groundStability
}

const makeMultipliers = (
  profile: GeologyProfile,
  region: GeologyRegion | null,
  appliedTerrain: boolean
): { devastation: number; crater: number } => {
  const terrain = appliedTerrain ? region?.terrainModifiers ?? {} : {}
  return {
    devastation: profile.devastationMultiplier * (terrain.devastation ?? 1),
    crater: profile.craterMultiplier * (terrain.crater ?? 1),
  }
}

export const analyzeGeology = ({ location, params, neo }: AnalyzeGeologyInput): GeologyAssessment | null => {
  const profile = GEOLOGY_PROFILES[params.target]
  if (!profile) {
    return null
  }

  const [lat, lng] = location
  const region = findRegion(lat, lng)
  const scenarioSurface = neo?.impact_scenario?.surface_type
  const notes: string[] = []

  let source: GeologySource = 'manual'
  let confidence: ConfidenceLevel = 'Moderate'

  if (scenarioSurface) {
    if (scenarioSurface === params.target) {
      source = 'scenario'
      confidence = 'High'
    } else {
      source = 'manual'
      confidence = 'Moderate'
      notes.push(
        `Scenario dataset specifies a ${scenarioSurface} impact. Manual override is using ${params.target} properties.`
      )
    }
  } else if (region) {
    source = 'regional'
    confidence = region.surfaceType === params.target ? region.confidence : 'Low'
  } else {
    confidence = 'Low'
  }

  const appliedTerrain = Boolean(region && region.surfaceType === params.target)

  if (region) {
    notes.push(`${region.name}: ${region.description}`)
    if (region.notes) {
      notes.push(...region.notes)
    }
    if (!appliedTerrain) {
      notes.push(
        'Terrain modifiers are shown for situational awareness but are not applied because the selected surface type differs from the inferred USGS unit.'
      )
    }
  } else {
    notes.push('No detailed USGS regional mapping embedded for this coordinate—using global averages.')
  }

  const multipliers = makeMultipliers(profile, region, appliedTerrain)
  const hazardAdjustments = combineHazardAdjustments(profile, region, appliedTerrain)
  const groundStability = resolveGroundStability(profile, region, appliedTerrain)

  return {
    surfaceType: params.target,
    profile,
    region,
    source,
    confidence,
    multipliers,
    hazardAdjustments,
    groundStability,
    appliedTerrain,
    notes,
  }
}

export const adjustImpactResults = (
  results: ImpactResults | null,
  assessment: GeologyAssessment | null
): GeologyAdjustedResults | null => {
  if (!results || !assessment) {
    return null
  }

  const adjustedDevastationRadius = results.devastationRadius * assessment.multipliers.devastation
  const adjustedCraterDiameter = results.craterDiameter * assessment.multipliers.crater

  return {
    baseline: results,
    adjustedDevastationRadius,
    adjustedCraterDiameter,
    multipliers: assessment.multipliers,
    hazardAdjustments: assessment.hazardAdjustments,
    appliedTerrain: assessment.appliedTerrain,
  }
}
