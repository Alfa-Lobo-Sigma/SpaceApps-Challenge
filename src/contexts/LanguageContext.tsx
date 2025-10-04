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
      crater: 'Crater Diameter'
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
      description: 'OSM basemap; click to set impact location. Orange ring = devastation radius, Red ring = crater radius.'
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
      crater: 'Diámetro del Cráter'
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
      description: 'Mapa base OSM; haz clic para establecer ubicación del impacto. Anillo naranja = radio de devastación, Anillo rojo = radio del cráter.'
    }
  }
}
