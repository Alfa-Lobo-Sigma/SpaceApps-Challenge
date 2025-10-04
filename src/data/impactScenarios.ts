import type { ImpactParams, NEO } from '../types'
import { IMPACTOR_2025, FALLBACK_NEO_MAP } from './scenarioNeos'

export interface ImpactScenario {
  id: string
  title: string
  subtitle: string
  description: string
  timeline: string
  keyImpacts: string[]
  focusAreas: string[]
  neo: NEO
  paramOverrides?: Partial<ImpactParams>
}

const apophisTemplate: NEO =
  FALLBACK_NEO_MAP.get('99942') ?? {
    id: '99942',
    name: '99942 Apophis',
    is_potentially_hazardous_asteroid: true,
    estimated_diameter: {
      meters: {
        estimated_diameter_min: 340,
        estimated_diameter_max: 370,
      },
    },
    orbital_data: {
      semi_major_axis: '0.922',
      eccentricity: '0.191',
      inclination: '3.331',
      ascending_node_longitude: '204.45',
      perihelion_argument: '126.4',
    },
    close_approach_data: [
      {
        close_approach_date: '2029-04-13',
        relative_velocity: {
          kilometers_per_second: '7.42',
        },
      },
    ],
  }

const bennuTemplate: NEO =
  FALLBACK_NEO_MAP.get('101955') ?? {
    id: '101955',
    name: '101955 Bennu (1999 RQ36)',
    is_potentially_hazardous_asteroid: true,
    estimated_diameter: {
      meters: {
        estimated_diameter_min: 480,
        estimated_diameter_max: 511,
      },
    },
    orbital_data: {
      semi_major_axis: '1.1264',
      eccentricity: '0.2037',
      inclination: '6.034',
      ascending_node_longitude: '2.0608',
      perihelion_argument: '66.2231',
    },
    close_approach_data: [
      {
        close_approach_date: '2135-09-24',
        relative_velocity: {
          kilometers_per_second: '12.7',
        },
      },
    ],
  }

export const IMPACTOR_2025_SCENARIO: ImpactScenario = {
  id: 'impactor-2025',
  title: 'Impactor-2025 city strike drill',
  subtitle: 'High-energy continental impact with limited warning time',
  description:
    'Baseline scenario for the application: Impactor-2025 is inserted into NeoWs listings to stress-test multi-agency coordination for a direct strike on Chihuahua City, Mexico.',
  timeline: '17 October 2025 • 3-day late warning',
  keyImpacts: [
    'Urban core destruction and trans-border supply-chain disruption',
    'Thermal pulse and blast wave affecting 3+ million residents',
    'Regional seismic shaking impacting oil & gas infrastructure',
  ],
  focusAreas: [
    'Cross-border emergency coordination between Mexico and the United States',
    'Prioritization of resilient communications and power restoration',
    'Rapid deployment of international urban search and rescue teams',
  ],
  neo: IMPACTOR_2025,
  paramOverrides: {
    density: IMPACTOR_2025.impact_scenario?.material_density,
    target: IMPACTOR_2025.impact_scenario?.surface_type,
  },
}

const apophisScenario: ImpactScenario = {
  id: 'apophis-drill',
  title: 'Apophis 2029 coastal impact drill',
  subtitle: 'Low-probability but high-consequence strike during the 2029 flyby',
  description:
    'Planetary defense teams exercise an Apophis deflection failure that redirects the asteroid toward the northeastern Pacific. Coastal megacities drill for tsunami sequencing and mass evacuation.',
  timeline: '13 April 2029 (UTC) • simulated wave arrival 25–45 minutes post-impact',
  keyImpacts: [
    'Modeled ocean entry ~400 km off the U.S. West Coast',
    'Primary hazards: tsunami run-up and coastal infrastructure collapse',
    'Secondary hazards: atmospheric shock damage to offshore assets',
  ],
  focusAreas: [
    'Validate evacuation timing and blue water fleet dispersal',
    'Test international alert coordination across the Pacific Rim',
    'Assess maritime debris fields for port re-entry planning',
  ],
  neo: {
    ...apophisTemplate,
    impact_scenario: {
      probability: 0.002,
      impact_date: '2029-04-13T22:15:00Z',
      location: [41.5, -127.4],
      surface_type: 'oceanic',
      material_density: 3000,
      narrative:
        'Training scenario: Apophis deflection failure results in a deep-water impact in the Cascadia Subduction Zone, triggering a trans-Pacific tsunami response.',
    },
  },
  paramOverrides: {
    density: 3000,
    target: 'oceanic',
  },
}

const bennuScenario: ImpactScenario = {
  id: 'bennu-2135',
  title: 'Bennu 2135 corridor watch',
  subtitle: 'Far-term monitoring of keyhole passages and contingency payloads',
  description:
    'Analysts test rapid catalog updates and kinetic impactor deployment timelines if Bennu passes through a 2135 gravitational keyhole that sets up a late-2100s impact trajectory.',
  timeline: '24 September 2135 • 60-year observational campaign horizon',
  keyImpacts: [
    'High-precision tracking required to resolve keyhole entry risk',
    'Long-lead mission planning with multiple launch windows',
    'Community preparedness messaging for a multigenerational threat',
  ],
  focusAreas: [
    'Compare kinetic impactor and gravity tractor mission architectures',
    'Model policy triggers for transitioning from monitoring to mitigation',
    'Develop archival data products for future planetary defense teams',
  ],
  neo: {
    ...bennuTemplate,
    impact_scenario: {
      probability: 0.0001,
      impact_date: '2189-09-12T08:00:00Z',
      location: [32.1, -98.6],
      surface_type: 'continental',
      material_density: 1260,
      narrative:
        'Strategic planning exercise: Bennu threads a 2135 keyhole leading to a late-century land impact over North America. Used to evaluate readiness for decades-long mitigation campaigns.',
    },
  },
  paramOverrides: {
    density: 1260,
    target: 'continental',
  },
}

const didymosScenarioNeo: NEO = {
  id: '65803',
  name: '65803 Didymos system',
  estimated_diameter: {
    meters: {
      estimated_diameter_min: 780,
      estimated_diameter_max: 820,
    },
  },
  is_potentially_hazardous_asteroid: true,
  orbital_data: {
    semi_major_axis: '1.644',
    eccentricity: '0.383',
    inclination: '3.4',
    ascending_node_longitude: '73.2',
    perihelion_argument: '319.3',
  },
  close_approach_data: [
    {
      close_approach_date: '2182-10-04',
      relative_velocity: {
        kilometers_per_second: '23.6',
      },
    },
  ],
  impact_scenario: {
    probability: 0.05,
    impact_date: '2182-10-04T15:30:00Z',
    location: [-23.8, 134.2],
    surface_type: 'continental',
    material_density: 2400,
    narrative:
      'What-if follow-up to the DART demonstration: an unmitigated Didymos trajectory intersects central Australia, used to explore coordinated evacuation of sparse populations and mining infrastructure hardening.',
  },
}

const didymosScenario: ImpactScenario = {
  id: 'didymos-contingency',
  title: 'Didymos contingency planning',
  subtitle: 'Translating kinetic impact test data into full-scale response playbooks',
  description:
    'Emergency managers extrapolate from the DART kinetic impact test to rehearse a future Didymos-class object on a collision course with remote communities and mineral operations.',
  timeline: '4 October 2182 • 6-hour warning-to-impact window',
  keyImpacts: [
    'Short-notice evacuation logistics for remote settlements',
    'Protection of critical mineral supply chains and communications links',
    'Post-impact dust loading and atmospheric recovery scenarios',
  ],
  focusAreas: [
    'Use real DART data to tune impact physics assumptions',
    'Integrate satellite-derived mineral maps for infrastructure triage',
    'Coordinate with aviation authorities for rapid airspace clearance',
  ],
  neo: didymosScenarioNeo,
  paramOverrides: {
    density: 2400,
    target: 'continental',
  },
}

export const ORDERED_IMPACT_SCENARIOS: ImpactScenario[] = [
  IMPACTOR_2025_SCENARIO,
  apophisScenario,
  bennuScenario,
  didymosScenario,
]

export const IMPACT_SCENARIOS = ORDERED_IMPACT_SCENARIOS
