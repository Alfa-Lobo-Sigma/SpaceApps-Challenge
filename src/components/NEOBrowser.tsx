import { useState, useEffect } from 'react'
import type { NEO, ImpactParams } from '../types'
import { parseOrbitalData } from '../utils/orbital'

const API_KEY = 'QVQTFgjfy9QfI1tI237pylpTfp4K53a4lrtYquHL'

interface NEOBrowserProps {
  onNEOSelect: (neo: NEO, orbital: any) => void
  onParamsUpdate: (params: Partial<ImpactParams>) => void
}

export default function NEOBrowser({ onNEOSelect, onParamsUpdate }: NEOBrowserProps) {
  const [neos, setNeos] = useState<NEO[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const browseNEOs = async (page = 0) => {
    setLoading(true)
    try {
      const url = `https://api.nasa.gov/neo/rest/v1/neo/browse?page=${page}&size=20&api_key=${API_KEY}`
      const response = await fetch(url)
      const data = await response.json()
      setNeos(data.near_earth_objects || [])
    } catch (error) {
      console.error('Error fetching NEOs:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectNEO = async (id: string) => {
    try {
      const url = `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${API_KEY}`
      const response = await fetch(url)
      const neo: NEO = await response.json()

      // Update diameter
      const diameter = neo.estimated_diameter?.meters
      if (diameter) {
        const avgDiameter = Math.round(
          (diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2
        )
        onParamsUpdate({ diameter: avgDiameter })
      }

      // Update velocity
      const velocity = neo.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second
      if (velocity) {
        onParamsUpdate({ velocity: Number(velocity) })
      }

      // Parse orbital data
      const orbitalData = parseOrbitalData(neo.orbital_data)
      if (orbitalData) {
        onNEOSelect(neo, orbitalData)
      }
    } catch (error) {
      console.error('Error fetching NEO details:', error)
    }
  }

  useEffect(() => {
    browseNEOs()
  }, [])

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
                <div className="text-sm font-medium">{neo.name}</div>
                <div className="text-[11px] label">
                  est. diameter: {diameterStr} • a={a || '—'} AU • e={e || '—'}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
