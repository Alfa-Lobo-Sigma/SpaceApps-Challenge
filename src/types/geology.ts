import type { SurfaceType } from '.'

export type ConfidenceLevel = 'Low' | 'Moderate' | 'High'

export interface HazardModifiers {
  shock: number
  thermal: number
  seismic: number
  tsunami?: number
}

export interface GeologyProfile {
  id: SurfaceType
  label: string
  description: string
  craterMultiplier: number
  devastationMultiplier: number
  usgsSource: string
  surfaceComposition: string
  groundStability: {
    rating: ConfidenceLevel
    explanation: string
  }
  impactModeling: string
  hazardAdjustments: HazardModifiers
}

export interface TerrainModifiers {
  devastation?: number
  crater?: number
}

export interface GeologyRegion {
  id: string
  name: string
  description: string
  surfaceType: SurfaceType
  bounds: {
    lat: [number, number]
    lng: [number, number]
  }
  confidence: ConfidenceLevel
  terrainModifiers?: TerrainModifiers
  hazardOverrides?: Partial<HazardModifiers>
  stabilityOverride?: {
    rating?: ConfidenceLevel
    explanation?: string
  }
  notes?: string[]
  priority?: number
  kind?: 'regional' | 'fallback-land' | 'fallback-ocean'
}
