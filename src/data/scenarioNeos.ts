import type { NEO } from '../types'

export const IMPACTOR_2025: NEO = {
  id: 'impactor-2025',
  name: 'Impactor-2025 (scenario)',
  is_potentially_hazardous_asteroid: true,
  estimated_diameter: {
    meters: {
      estimated_diameter_min: 330,
      estimated_diameter_max: 350,
    },
  },
  close_approach_data: [
    {
      close_approach_date: '2025-10-17',
      relative_velocity: {
        kilometers_per_second: '19.8',
      },
      miss_distance: {
        kilometers: '0',
      },
    },
  ],
  orbital_data: {
    semi_major_axis: '1.021',
    eccentricity: '0.18',
    inclination: '4.2',
    ascending_node_longitude: '85.3',
    perihelion_argument: '132.5',
  },
  impact_scenario: {
    probability: 1,
    impact_date: '2025-10-17T14:22:00Z',
    location: [29.07, -105.56],
    surface_type: 'continental',
    material_density: 3200,
    narrative:
      'Scenario exercise: modeled impact trajectory derived from NeoWs elements with forced Earth intercept on 17 Oct 2025. '
      + 'Used to stress-test mitigation workflows; not an actual NASA impact prediction.',
  },
}

const APOPHIS: NEO = {
  id: '99942',
  name: '99942 Apophis',
  is_potentially_hazardous_asteroid: true,
  estimated_diameter: {
    meters: {
      estimated_diameter_min: 340,
      estimated_diameter_max: 370,
    },
  },
  close_approach_data: [
    {
      close_approach_date: '2029-04-13',
      relative_velocity: {
        kilometers_per_second: '7.42',
      },
      miss_distance: {
        kilometers: '38000',
      },
    },
  ],
  orbital_data: {
    semi_major_axis: '0.922419',
    eccentricity: '0.191207',
    inclination: '3.331',
    ascending_node_longitude: '204.45',
    perihelion_argument: '126.4',
  },
}

const BENNU: NEO = {
  id: '101955',
  name: '101955 Bennu (1999 RQ36)',
  is_potentially_hazardous_asteroid: true,
  estimated_diameter: {
    meters: {
      estimated_diameter_min: 480,
      estimated_diameter_max: 511,
    },
  },
  close_approach_data: [
    {
      close_approach_date: '2135-09-24',
      relative_velocity: {
        kilometers_per_second: '12.7',
      },
      miss_distance: {
        kilometers: '760000',
      },
    },
  ],
  orbital_data: {
    semi_major_axis: '1.1264',
    eccentricity: '0.2037',
    inclination: '6.034',
    ascending_node_longitude: '2.0608',
    perihelion_argument: '66.2231',
  },
}

export const FALLBACK_NEOS: NEO[] = [IMPACTOR_2025, APOPHIS, BENNU]

export const FALLBACK_NEO_MAP = new Map(FALLBACK_NEOS.map((neo) => [neo.id, neo]))
