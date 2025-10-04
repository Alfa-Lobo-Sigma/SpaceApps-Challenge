export type SurfaceType = 'continental' | 'oceanic' | 'sedimentary'

export interface ImpactParams {
  diameter: number  // meters
  velocity: number  // km/s
  density: number   // kg/m³
  target: SurfaceType
}

export interface ImpactResults {
  mass: number  // kg
  energy: number  // joules
  energyMT: number  // megatons TNT
  devastationRadius: number  // km
  craterDiameter: number  // km
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
