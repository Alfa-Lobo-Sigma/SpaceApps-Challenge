import { useState, useEffect, useRef } from 'react'
import type { NEO, ImpactParams, OrbitalData } from '../types'
import { parseOrbitalData, getDefaultOrbit } from '../utils/orbital'
import { IMPACTOR_2025, FALLBACK_NEOS, FALLBACK_NEO_MAP } from '../data/scenarioNeos'

const API_KEY = 'QVQTFgjfy9QfI1tI237pylpTfp4K53a4lrtYquHL'

interface NEOBrowserProps {
  onNEOSelect: (neo: NEO, orbital: OrbitalData) => void
  onParamsUpdate: (params: Partial<ImpactParams>) => void
  initialNEOId?: string | null
}

export default function NEOBrowser({ onNEOSelect, onParamsUpdate, initialNEOId }: NEOBrowserProps) {
  const isMounted = useRef(true)
  const hasInitialised = useRef(false)
  const [neos, setNeos] = useState<NEO[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const integrateScenario = (list: NEO[] = []) => {
    const hasImpactor = list.some((neo) => neo.id === IMPACTOR_2025.id)
    return hasImpactor ? list : [IMPACTOR_2025, ...list]
  }

  const browseNEOs = async (page = 0) => {
    setLoading(true)
    setMessage(null)
    try {
      const url = `https://api.nasa.gov/neo/rest/v1/neo/browse?page=${page}&size=20&api_key=${API_KEY}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`NeoWs responded with ${response.status}`)
      }
      const data = await response.json()
      const dataset = integrateScenario(data.near_earth_objects || [])
      if (isMounted.current) {
        setNeos(dataset)
      }
      return dataset
    } catch (error) {
      console.error('Error fetching NEOs:', error)
      if (isMounted.current) {
        setMessage('NeoWs request failed; using embedded training dataset.')
        setNeos(FALLBACK_NEOS)
      }
      return FALLBACK_NEOS
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }

  const applyScenarioParams = (neo: NEO) => {
    if (neo.impact_scenario?.material_density) {
      onParamsUpdate({ density: neo.impact_scenario.material_density })
    }
    if (neo.impact_scenario?.surface_type) {
      onParamsUpdate({ target: neo.impact_scenario.surface_type })
    }
  }

  const resolveOrbitalData = (neo: NEO): OrbitalData => {
    const rawOrbitalData = neo.orbital_data ?? FALLBACK_NEO_MAP.get(neo.id)?.orbital_data
    return parseOrbitalData(rawOrbitalData) ?? getDefaultOrbit()
  }

  const handleSelection = (neo: NEO) => {
    const diameter = neo.estimated_diameter?.meters
    if (diameter) {
      const avgDiameter = Math.round(
        (diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2
      )
      onParamsUpdate({ diameter: avgDiameter })
    }

    const velocity = neo.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second
    if (velocity) {
      onParamsUpdate({ velocity: Number(velocity) })
    }

    applyScenarioParams(neo)

    const orbitalData = resolveOrbitalData(neo)
    onNEOSelect(neo, orbitalData)
  }

  const selectNEO = async (id: string) => {
    if (id === IMPACTOR_2025.id) {
      handleSelection(IMPACTOR_2025)
      return
    }

    try {
      const url = `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${API_KEY}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`NeoWs detail responded with ${response.status}`)
      }
      const neo: NEO = await response.json()
      if (isMounted.current) {
        handleSelection(neo)
      }
    } catch (error) {
      console.error('Error fetching NEO details:', error)
      if (!isMounted.current) {
        return
      }
      setMessage('Detail request failed; showing cached orbital solution.')
      const fallback = FALLBACK_NEO_MAP.get(id)
      if (fallback) {
        handleSelection(fallback)
      }
    }
  }

  useEffect(() => {
    isMounted.current = true
    browseNEOs().then((dataset) => {
      if (!isMounted.current || hasInitialised.current) {
        return
      }

      hasInitialised.current = true

      if (initialNEOId) {
        selectNEO(initialNEOId)
        return
      }

      const scenarioNeo = dataset.find((item) => item.id === IMPACTOR_2025.id)
      if (scenarioNeo) {
        handleSelection(scenarioNeo)
      }
    })
    return () => {
      isMounted.current = false
    }
  }, [initialNEOId])

  const filteredNEOs = neos.filter(neo =>
    neo.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">1) Browse NEOs (NASA NeoWs)</h2>
      <div className="flex gap-2">
        <button
          onClick={() => browseNEOs()}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Browse NEOs'}
        </button>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-lg p-2 bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
          placeholder="Filter by name (e.g., Apophis, Bennu)"
        />
      </div>
      <div className="max-h-56 overflow-auto rounded-lg border border-white/10 text-sm">
        {loading ? (
          <div className="p-2 text-sm label">Loading…</div>
        ) : filteredNEOs.length === 0 ? (
          <div className="p-2 text-sm label">No NEOs found</div>
        ) : (
          filteredNEOs.map((neo) => {
            const diameter = neo.estimated_diameter?.meters
            const diameterStr = diameter
              ? `${diameter.estimated_diameter_min.toFixed(0)}–${diameter.estimated_diameter_max.toFixed(0)} m`
              : '—'
            const a = neo.orbital_data?.semi_major_axis
            const e = neo.orbital_data?.eccentricity

            return (
              <button
                key={neo.id}
                onClick={() => selectNEO(neo.id)}
                className="w-full text-left px-3 py-2 hover:bg-white/5 border-b border-white/5 transition-colors"
              >
                <div className="text-sm font-medium flex items-center gap-2">
                  <span>{neo.name}</span>
                  {neo.id === IMPACTOR_2025.id ? (
                    <span className="rounded-full bg-red-500/20 px-2 py-[1px] text-[10px] font-semibold uppercase tracking-wide text-red-200">
                      Scenario
                    </span>
                  ) : neo.is_potentially_hazardous_asteroid ? (
                    <span className="rounded-full bg-yellow-500/10 px-2 py-[1px] text-[10px] uppercase tracking-wide text-yellow-200">
                      PHA
                    </span>
                  ) : null}
                </div>
                <div className="text-[11px] label">
                  est. diameter: {diameterStr} • a={a || '—'} AU • e={e || '—'}
                </div>
              </button>
            )
          })
        )}
      </div>
      {message ? <div className="text-[11px] label">{message}</div> : null}
    </div>
  )
}
