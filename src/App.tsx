import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import NEOBrowser from './components/NEOBrowser'
import ImpactParameters from './components/ImpactParameters'
import OrbitVisualization from './components/OrbitVisualization'
import ImpactMap from './components/ImpactMap'
import NEOScenarioSummary from './components/NEOScenarioSummary'
import PreparednessModal from './components/PreparednessModal'
import type { OrbitalData, ImpactParams, ImpactResults, NEO } from './types'
import { mergeImpactParams, normalizeImpactParams } from './utils/validation'

function App() {
  const [orbitalData, setOrbitalData] = useState<OrbitalData | null>(null)
  const [selectedNEO, setSelectedNEO] = useState<NEO | null>(null)
  const [impactParams, setImpactParams] = useState<ImpactParams>(() =>
    normalizeImpactParams({
      diameter: 2000,
      velocity: 17,
      density: 3000,
      target: 'continental'
    })
  )
  const [impactResults, setImpactResults] = useState<ImpactResults | null>(null)
  const [impactLocation, setImpactLocation] = useState<[number, number]>([28.632995, -106.0691])
  const [isPreparednessOpen, setPreparednessOpen] = useState(false)

  const handleNEOSelect = (neo: NEO, orbital: OrbitalData) => {
    setSelectedNEO(neo)
    setOrbitalData(orbital)
    if (neo.impact_scenario?.location) {
      setImpactLocation(neo.impact_scenario.location)
    }
  }

  const handleParamsUpdate = (params: Partial<ImpactParams>) => {
    setImpactParams(prev => mergeImpactParams(prev, params))
  }

  const handleImpactCalculation = (results: ImpactResults) => {
    setImpactResults(results)
  }

  const handleLocationSelect = (lat: number, lng: number) => {
    setImpactLocation([lat, lng])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onPreparednessClick={() => setPreparednessOpen(true)} />
      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        <section className="panel rounded-2xl p-4 space-y-4">
          <NEOBrowser onNEOSelect={handleNEOSelect} onParamsUpdate={handleParamsUpdate} />
          <NEOScenarioSummary neo={selectedNEO} impactResults={impactResults} location={impactLocation} />
          <ImpactParameters
            params={impactParams}
            onParamsChange={(next) => setImpactParams(normalizeImpactParams(next))}
            onCalculate={handleImpactCalculation}
          />
        </section>

        <section className="panel rounded-2xl p-4 space-y-3 lg:col-span-2">
          <OrbitVisualization orbitalData={orbitalData} />
          <ImpactMap
            location={impactLocation}
            results={impactResults}
            onLocationSelect={handleLocationSelect}
          />
        </section>
      </main>
      <Footer />
      <PreparednessModal open={isPreparednessOpen} onClose={() => setPreparednessOpen(false)} />
    </div>
  )
}

export default App
