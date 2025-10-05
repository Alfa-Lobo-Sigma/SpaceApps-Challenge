<<<<<<< Updated upstream
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
=======
import { useEffect, useRef, useState } from 'react'
>>>>>>> Stashed changes
import L from 'leaflet'
import type { ImpactResults } from '../types'
import type { GeologyAdjustedResults } from '../utils/geology'
import { useLanguage } from '../contexts/LanguageContext'
import { fetchAffectedCities, type AffectedCity } from '../utils/geocoding'
import 'leaflet/dist/leaflet.css'
import html2canvas from 'html2canvas'

// Fix Leaflet marker icon issue with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

export interface ImpactMapHandle {
  exportImage: () => Promise<Blob | null>
}

interface ImpactMapProps {
  location: [number, number]
  results: ImpactResults | null
  adjustedResults: GeologyAdjustedResults | null
  onLocationSelect: (lat: number, lng: number) => void
}

<<<<<<< Updated upstream
const ImpactMap = forwardRef<ImpactMapHandle, ImpactMapProps>(
  ({ location, results, adjustedResults, onLocationSelect }, ref) => {
    const { t } = useLanguage()
    const mapRef = useRef<L.Map | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const impactMarkerRef = useRef<L.Marker | null>(null)
    const devRingRef = useRef<L.Circle | null>(null)
    const craterRingRef = useRef<L.Circle | null>(null)
    const tileLayerRef = useRef<L.TileLayer | null>(null)
=======
export default function ImpactMap({ location, results, adjustedResults, onLocationSelect }: ImpactMapProps) {
  const { t } = useLanguage()
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const impactMarkerRef = useRef<L.Marker | null>(null)
  const devRingRef = useRef<L.Circle | null>(null)
  const craterRingRef = useRef<L.Circle | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const [affectedCities, setAffectedCities] = useState<AffectedCity[]>([])
  const [loadingCities, setLoadingCities] = useState(false)
>>>>>>> Stashed changes

    // Initialize map
    useEffect(() => {
      if (!containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, { worldCopyJump: true }).setView(location, 4)
      mapRef.current = map

      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: '&copy; OpenStreetMap contributors'
      })
      tileLayer.addTo(map)
      tileLayerRef.current = tileLayer

      // Add click handler
      const handleClick = (e: L.LeafletMouseEvent) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng)
      }
      map.on('click', handleClick)

      // Add initial marker
      const marker = L.marker(location, { title: 'Impact' }).addTo(map)
      impactMarkerRef.current = marker

      return () => {
        // Remove click handler
        map.off('click', handleClick)

        // Remove all layers
        if (tileLayerRef.current) {
          tileLayerRef.current.remove()
          tileLayerRef.current = null
        }

        if (impactMarkerRef.current) {
          impactMarkerRef.current.remove()
          impactMarkerRef.current = null
        }

        if (devRingRef.current) {
          devRingRef.current.remove()
          devRingRef.current = null
        }

        if (craterRingRef.current) {
          craterRingRef.current.remove()
          craterRingRef.current = null
        }

        // Remove map instance
        map.remove()
        mapRef.current = null
      }
    }, [])

    // Update location
    useEffect(() => {
      if (!mapRef.current) return

      // Update or create marker
      if (impactMarkerRef.current) {
        impactMarkerRef.current.remove()
      }
      const marker = L.marker(location, { title: 'Impact' }).addTo(mapRef.current)
      impactMarkerRef.current = marker

      // Update rings
      updateRings()
    }, [location])

    // Update rings when results change
    useEffect(() => {
      updateRings()
    }, [results, adjustedResults])

    const updateRings = () => {
      if (!mapRef.current || !impactMarkerRef.current) return

      const effectiveDevastation =
        adjustedResults?.adjustedDevastationRadius ?? results?.devastationRadius
      const effectiveCrater =
        adjustedResults?.adjustedCraterDiameter ?? results?.craterDiameter

      if (effectiveDevastation == null || effectiveCrater == null) {
        if (devRingRef.current) {
          devRingRef.current.remove()
          devRingRef.current = null
        }
        if (craterRingRef.current) {
          craterRingRef.current.remove()
          craterRingRef.current = null
        }
        return
      }

      const latLng = impactMarkerRef.current.getLatLng()

      // Remove old rings
      if (devRingRef.current) {
        devRingRef.current.remove()
<<<<<<< Updated upstream
=======
        devRingRef.current = null
      }

      if (craterRingRef.current) {
        craterRingRef.current.remove()
        craterRingRef.current = null
      }

      // Remove map instance
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update location
  useEffect(() => {
    if (!mapRef.current) return

    // Update or create marker
    if (impactMarkerRef.current) {
      impactMarkerRef.current.remove()
    }
    const marker = L.marker(location, { title: 'Impact' }).addTo(mapRef.current)
    impactMarkerRef.current = marker

    // Update rings
    updateRings()
  }, [location])

  // Update rings when results change
  useEffect(() => {
    updateRings()
  }, [results, adjustedResults])

  // Fetch affected cities when location or devastation radius changes
  useEffect(() => {
    const effectiveDevastation =
      adjustedResults?.adjustedDevastationRadius ?? results?.devastationRadius

    if (effectiveDevastation == null) {
      setAffectedCities([])
      return
    }

    const loadCities = async () => {
      setLoadingCities(true)
      try {
        const cities = await fetchAffectedCities(location[0], location[1], effectiveDevastation)
        setAffectedCities(cities)
      } catch (error) {
        console.error('Failed to load affected cities:', error)
        setAffectedCities([])
      } finally {
        setLoadingCities(false)
      }
    }

    loadCities()
  }, [location, results, adjustedResults])

  const updateRings = () => {
    if (!mapRef.current || !impactMarkerRef.current) return

    const effectiveDevastation =
      adjustedResults?.adjustedDevastationRadius ?? results?.devastationRadius
    const effectiveCrater =
      adjustedResults?.adjustedCraterDiameter ?? results?.craterDiameter

    if (effectiveDevastation == null || effectiveCrater == null) {
      if (devRingRef.current) {
        devRingRef.current.remove()
        devRingRef.current = null
>>>>>>> Stashed changes
      }
      if (craterRingRef.current) {
        craterRingRef.current.remove()
      }

      // Add new rings
      const devRadius = effectiveDevastation * 1000 // convert km to meters
      const craterRadius = (effectiveCrater / 2) * 1000 // convert km to meters

      const devRing = L.circle(latLng, {
        radius: devRadius,
        color: '#f59e0b',
        fill: false,
        weight: 2
      }).addTo(mapRef.current)
      devRingRef.current = devRing

      const craterRing = L.circle(latLng, {
        radius: craterRadius,
        color: '#ef4444',
        fill: false,
        weight: 2
      }).addTo(mapRef.current)
      craterRingRef.current = craterRing
    }

    useImperativeHandle(
      ref,
      () => ({
        async exportImage() {
          if (!containerRef.current) {
            return null
          }

          const canvas = await html2canvas(containerRef.current, {
            backgroundColor: '#040713',
            useCORS: true,
            scale: 2,
          })

          return await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((blob) => resolve(blob), 'image/png')
          })
        },
      }),
      []
    )

    return (
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-semibold pt-2">{t('impactMap.title')}</h2>
        <div ref={containerRef} className="w-full h-64 sm:h-80 rounded-xl border border-white/10" />
        <div className="text-[10px] sm:text-xs label">
          {t('impactMap.description')}
        </div>
      </div>
<<<<<<< Updated upstream
    )
  }
);

ImpactMap.displayName = 'ImpactMap'

export default ImpactMap
=======

      {/* Affected Cities List */}
      {results && (
        <div className="space-y-2">
          <h3 className="text-sm sm:text-base font-semibold">{t('impactMap.affectedAreas')}</h3>

          {loadingCities ? (
            <div className="text-xs sm:text-sm label">{t('impactMap.loadingCities')}</div>
          ) : affectedCities.length > 0 ? (
            <div className="space-y-1">
              <div className="text-[10px] sm:text-xs label">
                {t('impactMap.citiesInRange')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {affectedCities.map((city, index) => (
                  <div
                    key={`${city.name}-${index}`}
                    className="bg-white/5 rounded-lg p-2 border border-white/10"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-medium truncate">
                          {city.name}
                        </div>
                        <div className="text-[10px] sm:text-xs label capitalize">
                          {city.type}
                          {city.population && ` • ${formatPopulation(city.population)}`}
                        </div>
                      </div>
                      <div className="text-[10px] sm:text-xs label whitespace-nowrap">
                        {city.distance.toFixed(1)} km
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs sm:text-sm label">{t('impactMap.noCitiesFound')}</div>
          )}
        </div>
      )}
    </div>
  )
}

function formatPopulation(pop: number): string {
  if (pop >= 1000000) {
    return `${(pop / 1000000).toFixed(1)}M`
  } else if (pop >= 1000) {
    return `${(pop / 1000).toFixed(1)}K`
  }
  return pop.toString()
}
>>>>>>> Stashed changes
