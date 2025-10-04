import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { OrbitalData } from '../types'
import {
  generateOrbitPoints,
  trueAnomalyFromMean,
  positionOnOrbit,
  getMeanMotion,
  EARTH_MEAN_MOTION,
  getDefaultOrbit
} from '../utils/orbital'
import { useLanguage } from '../contexts/LanguageContext'
import OrbitalMechanicsExplainers from './OrbitalMechanicsExplainers'

interface OrbitVisualizationProps {
  orbitalData: OrbitalData | null
}

export default function OrbitVisualization({ orbitalData }: OrbitVisualizationProps) {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const orbitLineRef = useRef<THREE.Line | null>(null)
  const asteroidMarkerRef = useRef<THREE.Mesh | null>(null)
  const earthMarkerRef = useRef<THREE.Mesh | null>(null)
  const currentOrbitRef = useRef<OrbitalData | null>(null)
  const asteroidMRef = useRef(0)
  const earthMRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const timeScaleRef = useRef(2000000)
  const astroSpeedRef = useRef(1)
  const astroDirRef = useRef(1)
  const earthSpeedRef = useRef(1)
  const earthDirRef = useRef(1)

  const [timeScale, setTimeScale] = useState(2000000)
  const [astroSpeed, setAstroSpeed] = useState(1)
  const [astroDir, setAstroDir] = useState(1)
  const [earthSpeed, setEarthSpeed] = useState(1)
  const [earthDir, setEarthDir] = useState(1)

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b1020)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.01,
      1000
    )
    camera.position.set(3, 2, 3)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controlsRef.current = controls

    // Sun
    const sunGeometry = new THREE.SphereGeometry(0.05, 32, 16)
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc66 })
    const sun = new THREE.Mesh(sunGeometry, sunMaterial)
    scene.add(sun)

    // Earth's orbit (unit circle)
    const earthGeom = new THREE.BufferGeometry()
    const earthPts: number[] = []
    for (let t = 0; t <= 360; t++) {
      const r = (t * Math.PI) / 180
      earthPts.push(Math.cos(r), 0, Math.sin(r))
    }
    earthGeom.setAttribute('position', new THREE.Float32BufferAttribute(earthPts, 3))
    const earthOrbitMaterial = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.5 })
    const earthOrbit = new THREE.Line(earthGeom, earthOrbitMaterial)
    scene.add(earthOrbit)

    // Earth marker
    const earthGeometry = new THREE.SphereGeometry(0.03, 24, 12)
    const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x3b82f6 })
    const earthMarker = new THREE.Mesh(earthGeometry, earthMaterial)
    scene.add(earthMarker)
    earthMarkerRef.current = earthMarker

    // Asteroid marker
    const asteroidGeometry = new THREE.SphereGeometry(0.025, 18, 9)
    const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0x64d2ff })
    const asteroidMarker = new THREE.Mesh(asteroidGeometry, asteroidMaterial)
    scene.add(asteroidMarker)
    asteroidMarkerRef.current = asteroidMarker

    // Set default orbit
    updateOrbit(getDefaultOrbit())

    // Animation loop with cleanup flag
    let animationId: number
    let isRunning = true

    const animate = () => {
      if (!isRunning) return

      animationId = requestAnimationFrame(animate)

      const now = performance.now()
      const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000)
      lastTimeRef.current = now

      // Update Earth position
      earthMRef.current +=
        earthDirRef.current *
        earthSpeedRef.current *
        EARTH_MEAN_MOTION *
        dt *
        timeScaleRef.current
      earthMarker.position.set(
        Math.cos(earthMRef.current),
        0,
        Math.sin(earthMRef.current)
      )

      // Update asteroid position
      if (currentOrbitRef.current && asteroidMarkerRef.current) {
        const n = getMeanMotion(currentOrbitRef.current.a)
        asteroidMRef.current +=
          astroDirRef.current * astroSpeedRef.current * n * dt * timeScaleRef.current
        const nu = trueAnomalyFromMean(asteroidMRef.current, currentOrbitRef.current.e)
        const pos = positionOnOrbit(nu, currentOrbitRef.current)
        asteroidMarkerRef.current.position.copy(pos)
      }

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      rendererRef.current.setSize(width, height)
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      // Stop animation loop
      isRunning = false
      if (animationId) {
        cancelAnimationFrame(animationId)
      }

      // Dispose controls
      controls.dispose()

      // Dispose geometries and materials
      sunGeometry.dispose()
      sunMaterial.dispose()
      earthGeom.dispose()
      earthOrbitMaterial.dispose()
      earthGeometry.dispose()
      earthMaterial.dispose()
      asteroidGeometry.dispose()
      asteroidMaterial.dispose()

      // Dispose orbit line if exists
      if (orbitLineRef.current) {
        orbitLineRef.current.geometry.dispose()
        ;(orbitLineRef.current.material as THREE.Material).dispose()
      }

      // Dispose renderer
      renderer.dispose()

      // Remove resize listener
      window.removeEventListener('resize', handleResize)

      // Remove DOM element
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }

      // Clear refs
      sceneRef.current = null
      cameraRef.current = null
      rendererRef.current = null
      controlsRef.current = null
    }
  }, [])

  // Update animation parameters
  useEffect(() => {
    timeScaleRef.current = timeScale
  }, [timeScale])

  useEffect(() => {
    astroSpeedRef.current = astroSpeed
  }, [astroSpeed])

  useEffect(() => {
    astroDirRef.current = astroDir
  }, [astroDir])

  useEffect(() => {
    earthSpeedRef.current = earthSpeed
  }, [earthSpeed])

  useEffect(() => {
    earthDirRef.current = earthDir
  }, [earthDir])

  // Update orbit when orbitalData changes
  useEffect(() => {
    if (orbitalData) {
      updateOrbit(orbitalData)
    }
  }, [orbitalData])

  const updateOrbit = (orbit: OrbitalData) => {
    if (!sceneRef.current) return

    // Remove old orbit line
    if (orbitLineRef.current) {
      sceneRef.current.remove(orbitLineRef.current)
      orbitLineRef.current.geometry.dispose()
      ;(orbitLineRef.current.material as THREE.Material).dispose()
    }

    // Generate new orbit
    const points = generateOrbitPoints(orbit)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3))
    const orbitLine = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ color: 0x64d2ff })
    )
    sceneRef.current.add(orbitLine)
    orbitLineRef.current = orbitLine

    currentOrbitRef.current = orbit
    asteroidMRef.current = 0 // reset position
  }

  return (
    <div className="space-y-3">
      <h2 className="text-base sm:text-lg font-semibold">{t('orbitViz.title')}</h2>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 items-start sm:items-center text-xs sm:text-sm mb-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="label whitespace-nowrap">{t('orbitViz.timeScale')}</span>
          <input
            type="range"
            min="1000"
            max="50000000"
            step="1000"
            value={timeScale}
            onChange={(e) => setTimeScale(Number(e.target.value))}
            className="flex-1 sm:w-32 lg:w-56"
          />
          <span className="label text-[10px] sm:text-xs whitespace-nowrap">{timeScale.toLocaleString()}×</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="label whitespace-nowrap min-w-[60px]">{t('orbitViz.asteroid')}</span>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={astroSpeed}
            onChange={(e) => setAstroSpeed(Number(e.target.value))}
            className="flex-1 sm:w-24 lg:w-32"
          />
          <select
            value={astroDir}
            onChange={(e) => setAstroDir(Number(e.target.value))}
            className="bg-black/30 border border-white/10 rounded p-1 text-[10px] sm:text-xs"
          >
            <option value="1">{t('orbitViz.forward')}</option>
            <option value="-1">{t('orbitViz.reverse')}</option>
          </select>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="label whitespace-nowrap min-w-[60px]">{t('orbitViz.earth')}</span>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={earthSpeed}
            onChange={(e) => setEarthSpeed(Number(e.target.value))}
            className="flex-1 sm:w-24 lg:w-32"
          />
          <select
            value={earthDir}
            onChange={(e) => setEarthDir(Number(e.target.value))}
            className="bg-black/30 border border-white/10 rounded p-1 text-[10px] sm:text-xs"
          >
            <option value="1">{t('orbitViz.forward')}</option>
            <option value="-1">{t('orbitViz.reverse')}</option>
          </select>
        </div>
      </div>
      <div
        ref={containerRef}
        className="w-full h-64 md:h-80 lg:h-[28rem] rounded-xl border border-white/10"
      />
      <OrbitalMechanicsExplainers orbitalData={orbitalData} />
    </div>
  )
}
