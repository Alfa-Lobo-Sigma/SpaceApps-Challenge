import type { SurfaceType, GeologyProfile } from '../types'

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
    surfaceComposition:
      'Precambrian crystalline basement—primarily granitic to granodioritic batholiths with interlayered metamorphic belts. High silica content and competent rock strength.',
    groundStability: {
      rating: 'High',
      explanation:
        'Competent crystalline bedrock resists deformation and provides excellent load-bearing support, allowing shock waves to propagate efficiently.',
    },
    impactModeling:
      'Expect well-defined transient craters with pronounced melt sheets. Minimal energy loss into substrate; overpressure remains high over continental interiors.',
    hazardAdjustments: {
      shock: 1.1,
      thermal: 1,
      seismic: 1.05,
    },
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
    surfaceComposition:
      'Basaltic oceanic crust overlain by several kilometers of seawater with pelagic sediments draped across abyssal plains.',
    groundStability: {
      rating: 'Moderate',
      explanation:
        'Basaltic basement is strong but unconsolidated sediments plus the fluid ocean layer absorb shock and reduce surface coupling.',
    },
    impactModeling:
      'Atmospheric devastation is muted but water excavation yields towering tsunami waves and efficient coupling into the water column.',
    hazardAdjustments: {
      shock: 0.7,
      thermal: 0.65,
      seismic: 1.15,
      tsunami: 1.8,
    },
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
    surfaceComposition:
      'Thick sequences of clastic and carbonate sediments—sandstones, shales, evaporites—often water-saturated in the upper kilometers.',
    groundStability: {
      rating: 'Moderate',
      explanation:
        'Layered, weaker sediments compact readily and lose shear strength, leading to slumping and greater crater wall collapse.',
    },
    impactModeling:
      'Expect enlarged transient craters with muted ejecta velocities. Energy couples into ground as seismic shaking and ground failure.',
    hazardAdjustments: {
      shock: 0.95,
      thermal: 0.9,
      seismic: 1.1,
    },
  },
}
