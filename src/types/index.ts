export type SurfaceType = 'continental' | 'oceanic' | 'sedimentary'

export interface ImpactParams {
  diameter: number  // meters
  velocity: number  // km/s
  density: number   // kg/m³
  target: SurfaceType
}

export type ImpactSeverityCategory = 'minimal' | 'moderate' | 'severe' | 'extreme'
export type ImpactCascadeLevel = 'localized' | 'regional' | 'global'
export type ResponseLevel = 'monitor' | 'coordinate' | 'mobilize'

export interface PopulationImpact {
  exposed: number  // people
  displaced: number  // people
  fatalities: number  // people
}

export interface EconomicImpact {
  directDamage: number  // USD
  infrastructureLoss: number  // USD
  recoveryYears: number  // years
}

export interface EnvironmentalImpact {
  severityIndex: number  // 0-100 scale
  airQualityIndex: number  // 0-100 scale
  waterQualityIndex: number  // 0-100 scale
  category: ImpactSeverityCategory
}

export interface MultiImpactScenario {
  classification: ImpactCascadeLevel
  cascadingRisk: number  // 0-100 scale
  responseLevel: ResponseLevel
}

export interface ImpactResults {
  mass: number  // kg
  energy: number  // joules
  energyMT: number  // megatons TNT
  devastationRadius: number  // km
  craterDiameter: number  // km
  population: PopulationImpact
  economic: EconomicImpact
  environmental: EnvironmentalImpact
  multiImpact: MultiImpactScenario
}

export interface NEO {
  id: string
  name: string
  estimated_diameter?: {
    meters: {
      estimated_diameter_min: number
      estimated_diameter_max: number
    }
  }
  is_potentially_hazardous_asteroid?: boolean
  orbital_data?: {
    semi_major_axis: string
    eccentricity: string
    inclination: string
    ascending_node_longitude: string
    perihelion_argument: string
  }
  close_approach_data?: Array<{
    close_approach_date?: string
    relative_velocity: {
      kilometers_per_second: string
    }
    miss_distance?: {
      kilometers?: string
    }
  }>
  impact_scenario?: {
    probability: number
    impact_date: string
    location: [number, number]  // [lat, lng]
    surface_type: SurfaceType
    material_density?: number
    narrative: string
  }
}

export interface OrbitalData {
  a: number  // semi-major axis (AU)
  e: number  // eccentricity
  i: number  // inclination (radians)
  omega: number  // longitude of ascending node (radians)
  w: number  // argument of perihelion (radians)
}

export * from './geology'
