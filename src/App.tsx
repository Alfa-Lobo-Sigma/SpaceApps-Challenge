import { useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import NEOBrowser from './components/NEOBrowser'
import ImpactParameters from './components/ImpactParameters'
import OrbitVisualization, { OrbitVisualizationHandle } from './components/OrbitVisualization'
import OrbitalMechanicsExplainers from './components/OrbitalMechanicsExplainers'
import ImpactMap, { ImpactMapHandle } from './components/ImpactMap'
import NEOScenarioSummary from './components/NEOScenarioSummary'
import PreparednessModal from './components/PreparednessModal'
import MitigationStrategies from './components/MitigationStrategies'
import TabbedPanel from './components/TabbedPanel'
import type { OrbitalData, ImpactParams, ImpactResults, NEO } from './types'
import { mergeImpactParams, normalizeImpactParams } from './utils/validation'
import { analyzeGeology, adjustImpactResults } from './utils/geology'
import GeologyInsights from './components/GeologyInsights'
import ImpactScenarioLibrary from './components/ImpactScenarioLibrary'
import { IMPACT_SCENARIOS, type ImpactScenario } from './data/impactScenarios'
import { getDefaultOrbit, parseOrbitalData } from './utils/orbital'
import OnboardingTutorial from './components/OnboardingTutorial'
import ExportSharePanel from './components/ExportSharePanel'
import { parseShareState, currentShareUrl } from './utils/sharing'
import { useLanguage } from './contexts/LanguageContext'

function App() {
  const { t } = useLanguage()

  const [initialShare] = useState(() => {
    if (typeof window === 'undefined') {
      return null
    }
    return parseShareState(window.location.search)
  })

  const [orbitalData, setOrbitalData] = useState<OrbitalData | null>(null)
  const [selectedNEO, setSelectedNEO] = useState<NEO | null>(null)
  const [impactParams, setImpactParams] = useState<ImpactParams>(() =>
    normalizeImpactParams(
      initialShare?.params ?? {
        diameter: 2000,
        velocity: 17,
        density: 3000,
        target: 'continental',
      }
    )
  )
  const [impactResults, setImpactResults] = useState<ImpactResults | null>(null)
  const [impactLocation, setImpactLocation] = useState<[number, number]>(() =>
    initialShare?.location ?? [28.632995, -106.0691]
  )
  const [isPreparednessOpen, setPreparednessOpen] = useState(false)
  const [isTutorialOpen, setTutorialOpen] = useState(false)

  const shareParamsRef = useRef<ImpactParams | null>(initialShare?.params ?? null)
  const shareLocationRef = useRef<[number, number] | null>(initialShare?.location ?? null)

  const orbitRef = useRef<OrbitVisualizationHandle>(null)
  const mapRef = useRef<ImpactMapHandle>(null)

  const geologyAssessment = useMemo(
    () =>
      analyzeGeology({
        location: impactLocation,
        params: impactParams,
        neo: selectedNEO,
      }),
    [impactLocation, impactParams, selectedNEO]
  )

  const adjustedImpactResults = useMemo(
    () => adjustImpactResults(impactResults, geologyAssessment),
    [impactResults, geologyAssessment]
  )

  const handleNEOSelect = (neo: NEO, orbital: OrbitalData) => {
    setSelectedNEO(neo)
    setOrbitalData(orbital)
    if (shareLocationRef.current) {
      setImpactLocation(shareLocationRef.current)
      shareLocationRef.current = null
    } else if (neo.impact_scenario?.location) {
      setImpactLocation(neo.impact_scenario.location)
    }
  }

  const applyScenarioParameters = (neo: NEO, overrides?: Partial<ImpactParams>) => {
    setImpactParams(prev => {
      let next: ImpactParams = { ...prev }
      const diameter = neo.estimated_diameter?.meters
      if (diameter) {
        const avgDiameter =
          (diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2
        if (Number.isFinite(avgDiameter)) {
          next.diameter = avgDiameter
        }
      }

      const velocity = neo.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second
      if (velocity) {
        const numericVelocity = Number(velocity)
        if (Number.isFinite(numericVelocity)) {
          next.velocity = numericVelocity
        }
      }

      if (neo.impact_scenario?.material_density) {
        next.density = neo.impact_scenario.material_density
      }

      if (neo.impact_scenario?.surface_type) {
        next.target = neo.impact_scenario.surface_type
      }

      if (overrides) {
        for (const [key, value] of Object.entries(overrides) as [keyof ImpactParams, number | undefined][]) {
          if (value !== undefined) {
            next = { ...next, [key]: value }
          }
        }
      }

      return normalizeImpactParams(next)
    })
  }

  const handleScenarioLoad = (scenario: ImpactScenario) => {
    const scenarioNeo = scenario.neo
    applyScenarioParameters(scenarioNeo, scenario.paramOverrides)

    const resolvedOrbit =
      parseOrbitalData(scenarioNeo.orbital_data) ?? getDefaultOrbit()

    handleNEOSelect(scenarioNeo, resolvedOrbit)
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

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const hasCompleted = window.localStorage.getItem('impactor.tutorialComplete') === 'true'
    if (!hasCompleted) {
      setTutorialOpen(true)
    }
  }, [])

  const dismissTutorial = (_completed: boolean) => {
    setTutorialOpen(false)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('impactor.tutorialComplete', 'true')
    }
  }

  useEffect(() => {
    if (!selectedNEO) {
      return
    }

    if (shareParamsRef.current) {
      setImpactParams(normalizeImpactParams(shareParamsRef.current))
      shareParamsRef.current = null
    }
  }, [selectedNEO])

  useEffect(() => {
    if (!selectedNEO) {
      return
    }

    const url = currentShareUrl({
      neoId: selectedNEO.id,
      params: impactParams,
      location: impactLocation,
    })

    if (url && typeof window !== 'undefined') {
      window.history.replaceState({}, '', url)
    }
  }, [selectedNEO, impactParams, impactLocation])

  // Define tabs for the right panel
  const rightPanelTabs = [
    {
      id: '3d-orbit',
      label: t('tabs.orbit3d'),
      content: (
        <div className="space-y-6">
          <OrbitVisualization
            ref={orbitRef}
            orbitalData={orbitalData}
            impactDate={selectedNEO?.impact_scenario?.impact_date ?? null}
            asteroidName={selectedNEO?.name ?? null}
          />
          <OrbitalMechanicsExplainers orbitalData={orbitalData} />
        </div>
      ),
    },
    {
      id: 'enhanced-geology',
      label: t('tabs.geology'),
      content: (
        <GeologyInsights
          assessment={geologyAssessment}
          adjustedResults={adjustedImpactResults}
        />
      ),
    },
    {
      id: 'impact-map',
      label: t('tabs.impactMap'),
      content: (
        <ImpactMap
          ref={mapRef}
          location={impactLocation}
          results={impactResults}
          adjustedResults={adjustedImpactResults}
          onLocationSelect={handleLocationSelect}
        />
      ),
    },
    {
      id: 'scenario-focus',
      label: t('tabs.scenarioFocus'),
      content: (
        <NEOScenarioSummary
          neo={selectedNEO}
          impactResults={impactResults}
          adjustedResults={adjustedImpactResults}
          geology={geologyAssessment}
          location={impactLocation}
        />
      ),
    },
    {
      id: 'impact-parameters',
      label: t('tabs.impactParameters'),
      content: (
        <ImpactParameters
          params={impactParams}
          onParamsChange={(next) => setImpactParams(normalizeImpactParams(next))}
          onCalculate={handleImpactCalculation}
        />
      ),
    },
    {
      id: 'export-sharing',
      label: t('tabs.exportSharing'),
      content: (
        <ExportSharePanel
          neo={selectedNEO}
          impactParams={impactParams}
          impactResults={impactResults}
          adjustedResults={adjustedImpactResults}
          geology={geologyAssessment}
          location={impactLocation}
          orbitalData={orbitalData}
          orbitHandle={orbitRef.current}
          mapHandle={mapRef.current}
        />
      ),
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onPreparednessClick={() => setPreparednessOpen(true)}
        onTutorialClick={() => setTutorialOpen(true)}
      />
      <main className="flex-1 w-full">
        <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-6 xl:grid xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)] 2xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)] xl:items-start">
            {/* Left Panel - Browse NEOs and Impact Scenario Library */}
            <aside className="flex flex-col gap-6 xl:sticky xl:top-28 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto xl:pr-3">
              <section className="panel rounded-2xl p-5">
                <NEOBrowser
                  onNEOSelect={handleNEOSelect}
                  onParamsUpdate={handleParamsUpdate}
                  initialNEOId={initialShare?.neoId ?? null}
                />
              </section>
              <section className="panel rounded-2xl p-5">
                <ImpactScenarioLibrary
                  scenarios={IMPACT_SCENARIOS}
                  onSelectScenario={handleScenarioLoad}
                />
              </section>
            </aside>

            {/* Right Panel - Tabbed Content */}
            <section className="flex flex-col gap-6 min-w-0">
              <TabbedPanel tabs={rightPanelTabs} />
            </section>
          </div>
          
          {/* Mitigation Strategies - Full width below */}
          <MitigationStrategies neo={selectedNEO} className="xl:p-6" />
        </div>
      </main>
      <Footer />
      <PreparednessModal open={isPreparednessOpen} onClose={() => setPreparednessOpen(false)} />
      <OnboardingTutorial open={isTutorialOpen} onDismiss={dismissTutorial} />
    </div>
  )
}

export default App
