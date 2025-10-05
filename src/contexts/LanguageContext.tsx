import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'en' | 'es'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language')
    return (saved as Language) || 'en'
  })

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

const translations: Record<Language, any> = {
  en: {
    header: {
      title: 'Impactor‑2025',
      subtitle: 'NASA NeoWs + Leaflet + Three.js • real data, simplified physics'
    },
    footer: {
      developed: 'Developed by Jonatan Mendivil, Natalia Muñoz, Hiram Quintero and Enrique Mascote'
    },
    neoBrowser: {
      title: 'NEO Browser',
      loading: 'Loading...',
      page: 'Page',
      selectNeo: 'Select a NEO to visualize its orbit',
      selectedNeo: 'Selected NEO'
    },
    impactParams: {
      title: 'Impact Parameters',
      diameter: 'Diameter (m)',
      velocity: 'Velocity (km/s)',
      density: 'Density (kg/m³)',
      target: 'Target Type',
      continental: 'Continental',
      oceanic: 'Oceanic',
      sedimentary: 'Sedimentary',
      recalculate: 'Recalculate',
      results: 'Impact Results',
      mass: 'Mass',
      energy: 'Impact Energy',
      devastation: 'Devastation Radius',
      crater: 'Crater Diameter',
      population: {
        title: 'Population Impact',
        exposed: 'Population exposed',
        displaced: 'Potentially displaced',
        fatalities: 'Projected fatalities'
      },
      economic: {
        title: 'Economic Damage',
        directDamage: 'Direct damage',
        infrastructureLoss: 'Infrastructure loss',
        recovery: 'Recovery timeline'
      },
      environmental: {
        title: 'Environmental Consequences',
        severity: 'Overall severity',
        air: 'Air quality impact',
        water: 'Water impact',
        category: {
          label: 'Impact category',
          minimal: 'Minimal',
          moderate: 'Moderate',
          severe: 'Severe',
          extreme: 'Extreme'
        }
      },
      multiImpact: {
        title: 'Multi-impact Scenario',
        classification: 'Cascade classification',
        risk: 'Cascading risk score',
        response: 'Suggested coordination level',
        level: {
          localized: 'Localized',
          regional: 'Regional',
          global: 'Global'
        },
        responseLevel: {
          monitor: 'Monitor & inform',
          coordinate: 'Coordinate regional response',
          mobilize: 'Mobilize international resources'
        }
      },
      validation: {
        required: 'Please enter a value.',
        number: 'Enter a valid number.',
        diameterRange: 'Enter a diameter between 1 and 100,000 meters.',
        velocityRange: 'Enter a velocity between 0.1 and 72 km/s.',
        densityRange: 'Enter a density between 200 and 15,000 kg/m³.'
      }
    },
    orbitViz: {
      title: '3D Orbit (animated)',
      timeScale: 'Time scale (×)',
      asteroid: 'Asteroid',
      earth: 'Earth',
      forward: '⟲ forward',
      reverse: '⟳ reverse',
      controls: 'Drag to rotate • Scroll to zoom',
      timeRemaining: 'Time until impact:',
      timeRemainingUnknown: 'Impact time unavailable',
      impactNow: 'Impact occurring now',
      impactPaused: 'Impact detected — simulation paused.',
      resume: 'Resume animation',
      realTime: 'View in real time',
      exitRealTime: 'Exit real time',
      realTimeActive: 'Real-time mode'
    },
    impactMap: {
      title: 'Impact Map',
      description: 'OSM basemap; click to set impact location. Orange ring = devastation radius, Red ring = crater radius.',
      affectedAreas: 'Affected Areas',
      loadingCities: 'Loading affected cities...',
      citiesInRange: 'Cities and municipalities within devastation radius:',
      noCitiesFound: 'No cities found in the affected area.',
      estimatedDeathToll: 'Estimated Death Toll',
      deathTollNote: 'Based on city populations and proximity to impact. Actual casualties may vary.'
    },
    mitigation: {
      title: 'Mitigation Strategies',
      description: 'Deflection feasibility for selected NEO',
      methods: {
        kinetic: {
          name: 'Kinetic Impactor',
          description: 'High-speed spacecraft collides with the asteroid to nudge it onto a new trajectory. Proven feasible by the DART mission (2022).',
          strengths: 'Mature technology, scalable with multiple impactors, low political risk.',
          limitations: 'Requires several years of warning to build, launch, and deliver the impactor; less effective on very large or rubble-pile objects.'
        },
        gravity: {
          name: 'Gravity Tractor',
          description: 'A massive spacecraft hovers near the asteroid, using mutual gravity and continuous thrusters to slowly tug the object onto a safer trajectory.',
          strengths: 'Extremely precise control, works regardless of asteroid composition or rotation.',
          limitations: 'Needs a decade or more of lead time; high propellant and station-keeping demands.'
        },
        nuclear: {
          name: 'Nuclear Standoff',
          description: 'Detonates a nuclear device near the surface to ablate material and generate a rapid change in velocity.',
          strengths: 'Highest impulse delivery, effective even with short warning times.',
          limitations: 'Complex policy considerations, fallout risk if device contacts surface, requires robust modeling of debris.'
        }
      },
      risk: {
        low: 'Low',
        moderate: 'Moderate',
        high: 'High'
      },
      leadTime: 'Optimal lead time',
      years: 'years',
      maxSize: 'Max effective size',
      success: 'Success probability',
      relativeRisk: 'Relative risk',
      feasibility: 'Feasibility',
      notFeasible: 'Not feasible for this scenario',
      strengths: 'Strengths',
      limitations: 'Limitations'
    },
    geology: {
      title: 'Enhanced USGS geology',
      confidence: 'Confidence',
      terrainActive: 'Terrain modifiers active',
      surfaceOverride: 'Surface override',
      source: {
        scenario: 'Scenario override',
        regional: 'USGS regional inference',
        manual: 'Manual selection'
      },
      profile: 'Lithologic profile',
      dominantType: 'Dominant type',
      baselineDevastation: 'Baseline devastation',
      adjustedDevastation: 'Adjusted devastation',
      baselineCrater: 'Baseline crater',
      adjustedCrater: 'Adjusted crater',
      hazardMultipliers: 'Hazard multipliers',
      shock: 'Shock',
      thermal: 'Thermal',
      seismic: 'Seismic',
      tsunami: 'Tsunami',
      interpretation: 'Interpretation'
    },
    scenarios: {
      title: 'Impact scenario library',
      description: 'Curated drills and what-if cases built on NASA NeoWs objects.',
      scenario: 'Scenario',
      loadScenario: 'Load scenario',
      description2: 'Description',
      impactDate: 'Impact date',
      location: 'Location',
      orbitalElements: 'Orbital elements'
    },
    tutorial: {
      welcome: 'Welcome to P-Dd A.R.M.O.R.',
      step1: {
        title: 'Browse Near-Earth Objects',
        description: 'Explore real asteroids from NASA\'s NeoWs database. Click on any NEO to view its orbital parameters and impact potential.'
      },
      step2: {
        title: 'Visualize 3D Orbits',
        description: 'Watch asteroids orbit the Sun in real-time. The simulation will pause automatically when a collision is detected.'
      },
      step3: {
        title: 'Configure Impact Parameters',
        description: 'Adjust diameter, velocity, and density to model different impact scenarios. Results update automatically.'
      },
      step4: {
        title: 'Select Impact Location',
        description: 'Click anywhere on the map to set the impact location. See which cities fall within the devastation radius.'
      },
      step5: {
        title: 'Explore Mitigation Options',
        description: 'Review deflection strategies and their feasibility based on asteroid size and warning time.'
      },
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      skip: 'Skip tutorial'
    },
    physics: {
      mass: {
        title: 'Mass Calculation',
        description: 'Mass is calculated from volume (sphere) and density: m = (4/3)πr³ρ'
      },
      energy: {
        title: 'Kinetic Energy',
        description: 'Impact energy follows: E = ½mv². Higher velocity has exponential effect on destructive power.'
      },
      crater: {
        title: 'Crater Scaling',
        description: 'Crater diameter uses Collins et al. scaling laws based on impact energy and target material.'
      },
      devastation: {
        title: 'Devastation Radius',
        description: 'Area affected by shock waves, thermal radiation, and ejecta. Scales with energy release.'
      }
    },
    orbital: {
      semiMajor: {
        title: 'Semi-major Axis',
        description: 'Half the longest diameter of the elliptical orbit. Determines orbital period via Kepler\'s Third Law.'
      },
      eccentricity: {
        title: 'Eccentricity',
        description: 'Measures how elliptical the orbit is. 0 = circle, >0 = ellipse, 1 = parabola.'
      },
      inclination: {
        title: 'Inclination',
        description: 'Tilt of the orbit relative to Earth\'s orbital plane. High values mean the asteroid crosses Earth\'s orbit at steep angles.'
      },
      perihelion: {
        title: 'Perihelion Distance',
        description: 'Closest approach to the Sun. Critical for determining if orbit crosses Earth\'s path.'
      }
    },
    preparedness: {
      title: 'Emergency Preparedness',
      subtitle: 'What to do if an impact is imminent',
      evacuation: {
        title: 'Evacuation',
        description: 'If you are within the predicted impact zone, evacuate immediately to areas outside the devastation radius.'
      },
      shelter: {
        title: 'Shelter',
        description: 'If evacuation is not possible, seek shelter in reinforced structures away from windows. Basements provide best protection.'
      },
      supplies: {
        title: 'Emergency Supplies',
        description: 'Prepare water, non-perishable food, first aid kit, flashlight, radio, and important documents.'
      },
      communication: {
        title: 'Communication',
        description: 'Stay informed through official channels. Follow instructions from emergency management authorities.'
      },
      close: 'Close'
    },
    export: {
      title: 'Export & Share',
      description: 'Share this scenario or export data',
      copyLink: 'Copy share link',
      linkCopied: 'Link copied to clipboard!',
      exportPDF: 'Export as PDF',
      exportJSON: 'Export as JSON'
    }
  },
  es: {
    header: {
      title: 'Impactor‑2025',
      subtitle: 'NASA NeoWs + Leaflet + Three.js • datos reales, física simplificada'
    },
    footer: {
      developed: 'Desarrollado por Jonatan Mendivil, Natalia Muñoz, Hiram Quintero y Enrique Mascote'
    },
    neoBrowser: {
      title: 'Explorador de NEO',
      loading: 'Cargando...',
      page: 'Página',
      selectNeo: 'Selecciona un NEO para visualizar su órbita',
      selectedNeo: 'NEO Seleccionado'
    },
    impactParams: {
      title: 'Parámetros de Impacto',
      diameter: 'Diámetro (m)',
      velocity: 'Velocidad (km/s)',
      density: 'Densidad (kg/m³)',
      target: 'Tipo de Objetivo',
      continental: 'Continental',
      oceanic: 'Oceánico',
      sedimentary: 'Sedimentario',
      recalculate: 'Recalcular',
      results: 'Resultados del Impacto',
      mass: 'Masa',
      energy: 'Energía de Impacto',
      devastation: 'Radio de Devastación',
      crater: 'Diámetro del Cráter',
      population: {
        title: 'Impacto en la Población',
        exposed: 'Población expuesta',
        displaced: 'Potencialmente desplazados',
        fatalities: 'Fatalidades proyectadas'
      },
      economic: {
        title: 'Daño Económico',
        directDamage: 'Daño directo',
        infrastructureLoss: 'Pérdida en infraestructura',
        recovery: 'Cronograma de recuperación'
      },
      environmental: {
        title: 'Consecuencias Ambientales',
        severity: 'Severidad total',
        air: 'Impacto en la calidad del aire',
        water: 'Impacto hídrico',
        category: {
          label: 'Categoría de impacto',
          minimal: 'Mínima',
          moderate: 'Moderada',
          severe: 'Severa',
          extreme: 'Extrema'
        }
      },
      multiImpact: {
        title: 'Escenario Multimpacto',
        classification: 'Clasificación de cascada',
        risk: 'Puntaje de riesgo en cascada',
        response: 'Nivel sugerido de coordinación',
        level: {
          localized: 'Localizado',
          regional: 'Regional',
          global: 'Global'
        },
        responseLevel: {
          monitor: 'Monitorear e informar',
          coordinate: 'Coordinar respuesta regional',
          mobilize: 'Movilizar recursos internacionales'
        }
      },
      validation: {
        required: 'Ingresa un valor.',
        number: 'Ingresa un número válido.',
        diameterRange: 'Ingresa un diámetro entre 1 y 100,000 metros.',
        velocityRange: 'Ingresa una velocidad entre 0.1 y 72 km/s.',
        densityRange: 'Ingresa una densidad entre 200 y 15,000 kg/m³.'
      }
    },
    orbitViz: {
      title: 'Órbita 3D (animada)',
      timeScale: 'Escala temporal (×)',
      asteroid: 'Asteroide',
      earth: 'Tierra',
      forward: '⟲ adelante',
      reverse: '⟳ reversa',
      controls: 'Arrastra para rotar • Desplaza para zoom',
      timeRemaining: 'Tiempo restante para el impacto:',
      timeRemainingUnknown: 'Hora de impacto no disponible',
      impactNow: 'Impacto en curso',
      impactPaused: 'Impacto detectado — simulación en pausa.',
      resume: 'Reanudar animación',
      realTime: 'Ver en tiempo real',
      exitRealTime: 'Salir de tiempo real',
      realTimeActive: 'Modo en tiempo real'
    },
    impactMap: {
      title: 'Mapa de Impacto',
      description: 'Mapa base OSM; haz clic para establecer ubicación del impacto. Anillo naranja = radio de devastación, Anillo rojo = radio del cráter.',
      affectedAreas: 'Áreas Afectadas',
      loadingCities: 'Cargando ciudades afectadas...',
      citiesInRange: 'Ciudades y municipios dentro del radio de devastación:',
      noCitiesFound: 'No se encontraron ciudades en el área afectada.',
      estimatedDeathToll: 'Víctimas Mortales Estimadas',
      deathTollNote: 'Basado en poblaciones urbanas y proximidad al impacto. Las víctimas reales pueden variar.'
    },
    mitigation: {
      title: 'Estrategias de Mitigación',
      description: 'Viabilidad de deflexión para el NEO seleccionado',
      methods: {
        kinetic: {
          name: 'Impactador Cinético',
          description: 'Una nave espacial de alta velocidad colisiona con el asteroide para empujarlo hacia una nueva trayectoria. Demostrado viable por la misión DART (2022).',
          strengths: 'Tecnología madura, escalable con múltiples impactadores, bajo riesgo político.',
          limitations: 'Requiere varios años de advertencia para construir, lanzar y entregar el impactador; menos efectivo en objetos muy grandes o de escombros.'
        },
        gravity: {
          name: 'Tractor Gravitacional',
          description: 'Una nave espacial masiva se posiciona cerca del asteroide, usando gravedad mutua y propulsores continuos para remolcar lentamente el objeto a una trayectoria más segura.',
          strengths: 'Control extremadamente preciso, funciona independientemente de la composición o rotación del asteroide.',
          limitations: 'Necesita una década o más de tiempo de advertencia; altas demandas de propelente y mantenimiento de posición.'
        },
        nuclear: {
          name: 'Detonación Nuclear',
          description: 'Detona un dispositivo nuclear cerca de la superficie para ablacionar material y generar un cambio rápido de velocidad.',
          strengths: 'Máxima entrega de impulso, efectivo incluso con tiempos de advertencia cortos.',
          limitations: 'Consideraciones políticas complejas, riesgo de lluvia radiactiva si el dispositivo contacta la superficie, requiere modelado robusto de escombros.'
        }
      },
      risk: {
        low: 'Bajo',
        moderate: 'Moderado',
        high: 'Alto'
      },
      leadTime: 'Tiempo de advertencia óptimo',
      years: 'años',
      maxSize: 'Tamaño efectivo máximo',
      success: 'Probabilidad de éxito',
      relativeRisk: 'Riesgo relativo',
      feasibility: 'Viabilidad',
      notFeasible: 'No viable para este escenario',
      strengths: 'Fortalezas',
      limitations: 'Limitaciones'
    },
    geology: {
      title: 'Geología USGS mejorada',
      confidence: 'Confianza',
      terrainActive: 'Modificadores de terreno activos',
      surfaceOverride: 'Sobrescritura de superficie',
      source: {
        scenario: 'Sobrescritura de escenario',
        regional: 'Inferencia regional USGS',
        manual: 'Selección manual'
      },
      profile: 'Perfil litológico',
      dominantType: 'Tipo dominante',
      baselineDevastation: 'Devastación base',
      adjustedDevastation: 'Devastación ajustada',
      baselineCrater: 'Cráter base',
      adjustedCrater: 'Cráter ajustado',
      hazardMultipliers: 'Multiplicadores de peligro',
      shock: 'Choque',
      thermal: 'Térmico',
      seismic: 'Sísmico',
      tsunami: 'Tsunami',
      interpretation: 'Interpretación'
    },
    scenarios: {
      title: 'Biblioteca de escenarios de impacto',
      description: 'Simulacros curados y casos hipotéticos basados en objetos NASA NeoWs.',
      scenario: 'Escenario',
      loadScenario: 'Cargar escenario',
      description2: 'Descripción',
      impactDate: 'Fecha de impacto',
      location: 'Ubicación',
      orbitalElements: 'Elementos orbitales'
    },
    tutorial: {
      welcome: 'Bienvenido a P-Dd A.R.M.O.R.',
      step1: {
        title: 'Explorar Objetos Cercanos a la Tierra',
        description: 'Explora asteroides reales de la base de datos NeoWs de la NASA. Haz clic en cualquier NEO para ver sus parámetros orbitales y potencial de impacto.'
      },
      step2: {
        title: 'Visualizar Órbitas 3D',
        description: 'Observa asteroides orbitando el Sol en tiempo real. La simulación se pausará automáticamente cuando se detecte una colisión.'
      },
      step3: {
        title: 'Configurar Parámetros de Impacto',
        description: 'Ajusta diámetro, velocidad y densidad para modelar diferentes escenarios de impacto. Los resultados se actualizan automáticamente.'
      },
      step4: {
        title: 'Seleccionar Ubicación de Impacto',
        description: 'Haz clic en cualquier lugar del mapa para establecer la ubicación del impacto. Ve qué ciudades caen dentro del radio de devastación.'
      },
      step5: {
        title: 'Explorar Opciones de Mitigación',
        description: 'Revisa estrategias de deflexión y su viabilidad basadas en el tamaño del asteroide y tiempo de advertencia.'
      },
      next: 'Siguiente',
      previous: 'Anterior',
      close: 'Cerrar',
      skip: 'Saltar tutorial'
    },
    physics: {
      mass: {
        title: 'Cálculo de Masa',
        description: 'La masa se calcula a partir del volumen (esfera) y densidad: m = (4/3)πr³ρ'
      },
      energy: {
        title: 'Energía Cinética',
        description: 'La energía de impacto sigue: E = ½mv². Mayor velocidad tiene efecto exponencial en el poder destructivo.'
      },
      crater: {
        title: 'Escalamiento de Cráter',
        description: 'El diámetro del cráter usa las leyes de escalamiento de Collins et al. basadas en energía de impacto y material objetivo.'
      },
      devastation: {
        title: 'Radio de Devastación',
        description: 'Área afectada por ondas de choque, radiación térmica y eyecta. Escala con la liberación de energía.'
      }
    },
    orbital: {
      semiMajor: {
        title: 'Semieje Mayor',
        description: 'Mitad del diámetro más largo de la órbita elíptica. Determina el período orbital mediante la Tercera Ley de Kepler.'
      },
      eccentricity: {
        title: 'Excentricidad',
        description: 'Mide cuán elíptica es la órbita. 0 = círculo, >0 = elipse, 1 = parábola.'
      },
      inclination: {
        title: 'Inclinación',
        description: 'Inclinación de la órbita relativa al plano orbital de la Tierra. Valores altos significan que el asteroide cruza la órbita de la Tierra en ángulos pronunciados.'
      },
      perihelion: {
        title: 'Distancia al Perihelio',
        description: 'Aproximación más cercana al Sol. Crítico para determinar si la órbita cruza la trayectoria de la Tierra.'
      }
    },
    preparedness: {
      title: 'Preparación para Emergencias',
      subtitle: 'Qué hacer si un impacto es inminente',
      evacuation: {
        title: 'Evacuación',
        description: 'Si estás dentro de la zona de impacto prevista, evacua inmediatamente a áreas fuera del radio de devastación.'
      },
      shelter: {
        title: 'Refugio',
        description: 'Si la evacuación no es posible, busca refugio en estructuras reforzadas lejos de ventanas. Los sótanos proporcionan la mejor protección.'
      },
      supplies: {
        title: 'Suministros de Emergencia',
        description: 'Prepara agua, comida no perecedera, botiquín de primeros auxilios, linterna, radio y documentos importantes.'
      },
      communication: {
        title: 'Comunicación',
        description: 'Mantente informado a través de canales oficiales. Sigue las instrucciones de las autoridades de gestión de emergencias.'
      },
      close: 'Cerrar'
    },
    export: {
      title: 'Exportar y Compartir',
      description: 'Comparte este escenario o exporta datos',
      copyLink: 'Copiar enlace',
      linkCopied: '¡Enlace copiado al portapapeles!',
      exportPDF: 'Exportar como PDF',
      exportJSON: 'Exportar como JSON'
    }
  }
}
