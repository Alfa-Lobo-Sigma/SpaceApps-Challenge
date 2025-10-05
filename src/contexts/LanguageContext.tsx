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
      controls: 'Drag to rotate • Scroll to zoom'
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
      controls: 'Arrastra para rotar • Desplaza para zoom'
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
    }
  }
}
