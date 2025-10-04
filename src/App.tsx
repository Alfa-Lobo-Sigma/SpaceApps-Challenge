import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import NEOBrowser from './components/NEOBrowser'
import ImpactParameters from './components/ImpactParameters'
import OrbitVisualization from './components/OrbitVisualization'
import ImpactMap from './components/ImpactMap'
import type { OrbitalData, ImpactParams, ImpactResults } from './types'

function App() {
  const [orbitalData, setOrbitalData] = useState<OrbitalData | null>(null)
  const [impactParams, setImpactParams] = useState<ImpactParams>({
    diameter: 120,
    velocity: 17,
    density: 3000,
    target: 'continental'
  })
  const [impactResults, setImpactResults] = useState<ImpactResults | null>(null)
  const [impactLocation, setImpactLocation] = useState<[number, number]>([29.07, -105.56])

  const handleNEOSelect = (_neo: unknown, orbital: OrbitalData) => {
    setOrbitalData(orbital)
  }

  const handleParamsUpdate = (params: Partial<ImpactParams>) => {
    setImpactParams(prev => ({ ...prev, ...params }))
  }

  const handleImpactCalculation = (results: ImpactResults) => {
    setImpactResults(results)
  }

  const handleLocationSelect = (lat: number, lng: number) => {
    setImpactLocation([lat, lng])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        <section className="panel rounded-2xl p-4 space-y-4">
          <NEOBrowser onNEOSelect={handleNEOSelect} onParamsUpdate={handleParamsUpdate} />
          <ImpactParameters
            params={impactParams}
            onParamsChange={setImpactParams}
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
    </div>
  )
}

export default App
