import type { GeologyRegion } from '../types'

const deg = (value: number) => value

export const GEOLOGY_REGIONS: GeologyRegion[] = [
  {
    id: 'sierra-madre-occidental',
    name: 'Sierra Madre Occidental Batholith',
    description:
      'USGS GLiM felsic plutonic belt spanning northern Mexico with elevated volcanic plateaus and welded ignimbrites.',
    surfaceType: 'continental',
    bounds: {
      lat: [deg(20), deg(31.5)],
      lng: [deg(-112), deg(-102)],
    },
    confidence: 'High',
    terrainModifiers: {
      devastation: 1.18,
      crater: 1.12,
    },
    hazardOverrides: {
      shock: 1.15,
      seismic: 1.18,
    },
    stabilityOverride: {
      explanation: 'Massive batholithic blocks and welded tuffs generate rigid, high-standing terrain with strong coupling.',
    },
    notes: [
      'High-elevation plateau reduces atmospheric density, modestly extending blast reach.',
      'Mapped by Hartmann & Moosdorf (2012) as unit Pl (felsic plutonic).',
    ],
    priority: 12,
  },
  {
    id: 'gulf-coastal-plain',
    name: 'US Gulf Coastal Plain Sediments',
    description:
      'Thick, water-saturated clastic wedges deposited along the northern Gulf of Mexico margin.',
    surfaceType: 'sedimentary',
    bounds: {
      lat: [deg(23), deg(31)],
      lng: [deg(-98), deg(-82)],
    },
    confidence: 'High',
    terrainModifiers: {
      devastation: 0.9,
      crater: 1.22,
    },
    hazardOverrides: {
      seismic: 1.12,
    },
    stabilityOverride: {
      rating: 'Low',
      explanation: 'Soft, water-rich sediments prone to liquefaction and slumping amplify ground failure.',
    },
    notes: [
      'Mapped in GLiM as unconsolidated clastic sediments (unit Su).',
    ],
    priority: 11,
  },
  {
    id: 'andes-foreland-basins',
    name: 'Andean Foreland Basins',
    description:
      'Foreland basin system east of the Andes with thick molasse and evaporite sequences over crustal flexures.',
    surfaceType: 'sedimentary',
    bounds: {
      lat: [deg(-30), deg(5)],
      lng: [deg(-75), deg(-55)],
    },
    confidence: 'Moderate',
    terrainModifiers: {
      devastation: 0.92,
      crater: 1.18,
    },
    hazardOverrides: {
      seismic: 1.15,
    },
    stabilityOverride: {
      rating: 'Moderate',
      explanation: 'Layered basins permit deep excavation yet collapse readily, spreading ejecta blankets.',
    },
    notes: [
      'USGS GLiM units classify these basins as unconsolidated clastic and evaporitic deposits.',
    ],
    priority: 9,
  },
  {
    id: 'fennoscandian-shield',
    name: 'Fennoscandian Shield Craton',
    description:
      'Archean to Proterozoic shield terrain in Scandinavia with exposed gneiss and granulite complexes.',
    surfaceType: 'continental',
    bounds: {
      lat: [deg(55), deg(72)],
      lng: [deg(5), deg(35)],
    },
    confidence: 'High',
    terrainModifiers: {
      devastation: 1.06,
      crater: 1.04,
    },
    hazardOverrides: {
      shock: 1.08,
    },
    stabilityOverride: {
      explanation: 'Dense shield rocks sustain crater morphology and transmit shock efficiently.',
    },
    notes: [
      'Referenced in GLiM as high-grade metamorphic complexes (unit M).',
    ],
    priority: 8,
  },
  {
    id: 'western-pacific-trench',
    name: 'Western Pacific Subduction Margin',
    description:
      'Deep trench system including the Mariana and Philippine trenches with >6 km water depth.',
    surfaceType: 'oceanic',
    bounds: {
      lat: [deg(-20), deg(35)],
      lng: [deg(120), deg(155)],
    },
    confidence: 'High',
    terrainModifiers: {
      devastation: 0.62,
      crater: 0.55,
    },
    hazardOverrides: {
      thermal: 0.55,
      seismic: 1.3,
      tsunami: 2.2,
    },
    notes: [
      'USGS GMRT bathymetry indicates extreme depth and steep slopes driving tsunami amplification.',
    ],
    priority: 10,
  },
  {
    id: 'mid-atlantic-ridge',
    name: 'Mid-Atlantic Ridge Flanks',
    description:
      'Slow-spreading ridge axis with rugged basaltic topography and thin sediment cover.',
    surfaceType: 'oceanic',
    bounds: {
      lat: [deg(-40), deg(40)],
      lng: [deg(-45), deg(-10)],
    },
    confidence: 'Moderate',
    terrainModifiers: {
      devastation: 0.78,
      crater: 0.62,
    },
    hazardOverrides: {
      seismic: 1.2,
      tsunami: 1.6,
    },
    notes: [
      'USGS marine geology mapping highlights fault-scarped bathymetry increasing tsunami generation efficiency.',
    ],
    priority: 7,
  },
  {
    id: 'indian-ocean-basin',
    name: 'Central Indian Ocean Basin',
    description:
      'Abyssal plains underlain by basaltic crust with pelagic clay cover and fracture zones.',
    surfaceType: 'oceanic',
    bounds: {
      lat: [deg(-40), deg(25)],
      lng: [deg(40), deg(110)],
    },
    confidence: 'Moderate',
    terrainModifiers: {
      devastation: 0.72,
      crater: 0.6,
    },
    hazardOverrides: {
      thermal: 0.65,
      seismic: 1.18,
      tsunami: 1.7,
    },
    notes: [
      'Bathymetry from GMRT indicates broad abyssal plains conducive to tsunami propagation.',
    ],
    priority: 6,
  },
  {
    id: 'central-asia-basins',
    name: 'Central Asian Intracontinental Basins',
    description:
      'Large, arid basins (Tarim, Junggar) filled with Paleozoic–Cenozoic clastics and evaporites.',
    surfaceType: 'sedimentary',
    bounds: {
      lat: [deg(35), deg(48)],
      lng: [deg(70), deg(95)],
    },
    confidence: 'Moderate',
    terrainModifiers: {
      devastation: 0.94,
      crater: 1.16,
    },
    hazardOverrides: {
      shock: 0.92,
      seismic: 1.08,
    },
    stabilityOverride: {
      rating: 'Moderate',
      explanation: 'Interbedded evaporites and clastics create detachment horizons encouraging rim collapse.',
    },
    notes: [
      'GLiM assigns mixed sedimentary units (Ss, Se) to these basins.',
    ],
    priority: 7,
  },
  {
    id: 'australian-craton',
    name: 'Australian Pilbara/Kimbereley Craton',
    description:
      'Stable Archean craton with iron-rich formations and weathered regolith veneer.',
    surfaceType: 'continental',
    bounds: {
      lat: [deg(-35), deg(-15)],
      lng: [deg(115), deg(140)],
    },
    confidence: 'Moderate',
    terrainModifiers: {
      devastation: 1.08,
      crater: 1.05,
    },
    hazardOverrides: {
      shock: 1.05,
      thermal: 0.95,
    },
    stabilityOverride: {
      explanation: 'Competent basement overlain by thin regolith maintains crater form with minor energy dissipation.',
    },
    notes: [
      'GLiM depicts the Pilbara as metamorphic/crystalline basement (unit M).',
    ],
    priority: 6,
  },
  {
    id: 'east-african-rift',
    name: 'East African Rift Volcanic Provinces',
    description:
      'Active rift with volcano-sedimentary sequences, fault scarps, and extensive lakes.',
    surfaceType: 'sedimentary',
    bounds: {
      lat: [deg(-10), deg(10)],
      lng: [deg(30), deg(42)],
    },
    confidence: 'Moderate',
    terrainModifiers: {
      devastation: 0.96,
      crater: 1.12,
    },
    hazardOverrides: {
      seismic: 1.2,
    },
    stabilityOverride: {
      rating: 'Moderate',
      explanation: 'Rift-related fracturing and lacustrine sediments increase ground failure susceptibility.',
    },
    notes: [
      'Combines GLiM volcanic (V) and sedimentary (Su) units along rift valleys.',
    ],
    priority: 5,
  },
  {
    id: 'global-oceanic-fallback',
    name: 'Global Deep Ocean (fallback)',
    description: 'Fallback classification for open-ocean coordinates lacking specific mapping.',
    surfaceType: 'oceanic',
    bounds: {
      lat: [deg(-90), deg(90)],
      lng: [deg(-180), deg(180)],
    },
    confidence: 'Moderate',
    terrainModifiers: {
      devastation: 0.8,
      crater: 0.7,
    },
    hazardOverrides: {
      shock: 0.7,
      thermal: 0.6,
      seismic: 1.18,
      tsunami: 1.6,
    },
    notes: [
      'Represents average GMRT abyssal basin response.',
    ],
    priority: -5,
    kind: 'fallback-ocean',
  },
  {
    id: 'global-continental-fallback',
    name: 'Generic Continental Crust (fallback)',
    description: 'Fallback for land areas where detailed mapping is not embedded.',
    surfaceType: 'continental',
    bounds: {
      lat: [deg(-90), deg(90)],
      lng: [deg(-180), deg(180)],
    },
    confidence: 'Low',
    terrainModifiers: {
      devastation: 1,
      crater: 1,
    },
    hazardOverrides: {
      shock: 1,
      thermal: 1,
      seismic: 1,
    },
    notes: [
      'Applies average continental shield response when no finer regional mapping is available.',
    ],
    priority: -10,
    kind: 'fallback-land',
  },
]
