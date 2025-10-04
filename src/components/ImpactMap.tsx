import { useEffect, useRef } from 'react'
import L from 'leaflet'
import type { ImpactResults } from '../types'
import 'leaflet/dist/leaflet.css'

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

interface ImpactMapProps {
  location: [number, number]
  results: ImpactResults | null
  onLocationSelect: (lat: number, lng: number) => void
}

export default function ImpactMap({ location, results, onLocationSelect }: ImpactMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const impactMarkerRef = useRef<L.Marker | null>(null)
  const devRingRef = useRef<L.Circle | null>(null)
  const craterRingRef = useRef<L.Circle | null>(null)

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, { worldCopyJump: true }).setView(location, 4)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 15,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    // Add click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    })

    // Add initial marker
    const marker = L.marker(location, { title: 'Impact' }).addTo(map)
    impactMarkerRef.current = marker

    return () => {
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
  }, [results])

  const updateRings = () => {
    if (!mapRef.current || !impactMarkerRef.current || !results) return

    const latLng = impactMarkerRef.current.getLatLng()

    // Remove old rings
    if (devRingRef.current) {
      devRingRef.current.remove()
    }
    if (craterRingRef.current) {
      craterRingRef.current.remove()
    }

    // Add new rings
    const devRadius = results.devastationRadius * 1000 // convert km to meters
    const craterRadius = (results.craterDiameter / 2) * 1000 // convert km to meters

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

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold pt-2">4) Impact map</h2>
      <div ref={containerRef} className="w-full h-80 rounded-xl border border-white/10" />
      <div className="text-xs label">
        OSM basemap; click to set impact location. Orange ring = devastation radius, Red ring = crater radius.
      </div>
    </div>
  )
}
