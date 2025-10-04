import type { SurfaceType } from '../types'

export interface GeologyProfile {
  id: SurfaceType
  label: string
  description: string
  craterMultiplier: number
  devastationMultiplier: number
  usgsSource: string
}

export const GEOLOGY_PROFILES: Record<SurfaceType, GeologyProfile> = {
  continental: {
    id: 'continental',
    label: 'Continental shield / crystalline crust',
    description:
      'Simplified from the USGS Global Lithological Map (GLiM) which catalogs exposed continental crust dominated by igneous and metamorphic rocks. '
      + 'Dense, cohesive materials transmit shock efficiently, sustaining larger craters and broad damage footprints.',
    craterMultiplier: 1.05,
    devastationMultiplier: 1.1,
    usgsSource: 'GLiM v1.0 (USGS / BGR / UNESCO, Hartmann & Moosdorf 2012)',
  },
  oceanic: {
    id: 'oceanic',
    label: 'Deep oceanic basin',
    description:
      'Derived from USGS global bathymetry compilations showing thin basaltic crust overlain by seawater. '
      + 'Water column absorbs energy, lowering atmospheric blast effects but amplifying tsunami risk.',
    craterMultiplier: 0.65,
    devastationMultiplier: 0.75,
    usgsSource: 'USGS Coastal & Marine Hazards / Global Multi-Resolution Topography (GMRT) synthesis',
  },
  sedimentary: {
    id: 'sedimentary',
    label: 'Sedimentary platform / basin',
    description:
      'Mapped in GLiM as unconsolidated to weakly lithified sediments. '
      + 'Lower strength substrates tend to dampen ejecta but can enlarge transient craters due to easier excavation.',
    craterMultiplier: 1.15,
    devastationMultiplier: 0.95,
    usgsSource: 'GLiM v1.0 (USGS / BGR / UNESCO, Hartmann & Moosdorf 2012)',
  },
}
