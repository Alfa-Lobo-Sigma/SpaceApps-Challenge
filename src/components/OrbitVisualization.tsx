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

interface OrbitVisualizationProps {
  orbitalData: OrbitalData | null
}

export default function OrbitVisualization({ orbitalData }: OrbitVisualizationProps) {
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
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 32, 16),
      new THREE.MeshBasicMaterial({ color: 0xffcc66 })
    )
    scene.add(sun)

    // Earth's orbit (unit circle)
    const earthGeom = new THREE.BufferGeometry()
    const earthPts: number[] = []
    for (let t = 0; t <= 360; t++) {
      const r = (t * Math.PI) / 180
      earthPts.push(Math.cos(r), 0, Math.sin(r))
    }
    earthGeom.setAttribute('position', new THREE.Float32BufferAttribute(earthPts, 3))
    const earthOrbit = new THREE.Line(
      earthGeom,
      new THREE.LineBasicMaterial({ transparent: true, opacity: 0.5 })
    )
    scene.add(earthOrbit)

    // Earth marker
    const earthMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 24, 12),
      new THREE.MeshBasicMaterial({ color: 0x3b82f6 })
    )
    scene.add(earthMarker)
    earthMarkerRef.current = earthMarker

    // Asteroid marker
    const asteroidMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 18, 9),
      new THREE.MeshBasicMaterial({ color: 0x64d2ff })
    )
    scene.add(asteroidMarker)
    asteroidMarkerRef.current = asteroidMarker

    // Set default orbit
    updateOrbit(getDefaultOrbit())

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      const now = performance.now()
      const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000)
      lastTimeRef.current = now

      // Update Earth position
      earthMRef.current += earthDir * earthSpeed * EARTH_MEAN_MOTION * dt * timeScale
      earthMarker.position.set(
        Math.cos(earthMRef.current),
        0,
        Math.sin(earthMRef.current)
      )

      // Update asteroid position
      if (currentOrbitRef.current && asteroidMarkerRef.current) {
        const n = getMeanMotion(currentOrbitRef.current.a)
        asteroidMRef.current += astroDir * astroSpeed * n * dt * timeScale
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
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  // Update animation parameters
  useEffect(() => {
    // These are reactive and will be picked up by the animation loop
  }, [timeScale, astroSpeed, astroDir, earthSpeed, earthDir])

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
      <h2 className="text-lg font-semibold">3) 3D Orbit (animated)</h2>
      <div className="flex flex-wrap gap-3 items-center text-sm mb-2">
        <div className="flex items-center gap-2">
          <span className="label">Time scale (×)</span>
          <input
            type="range"
            min="1000"
            max="50000000"
            step="1000"
            value={timeScale}
            onChange={(e) => setTimeScale(Number(e.target.value))}
            className="w-32 sm:w-56"
          />
          <span className="label">{timeScale.toLocaleString()}×</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="label">Asteroid</span>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={astroSpeed}
            onChange={(e) => setAstroSpeed(Number(e.target.value))}
            className="w-32 sm:w-40"
          />
          <select
            value={astroDir}
            onChange={(e) => setAstroDir(Number(e.target.value))}
            className="bg-black/30 border border-white/10 rounded p-1 text-xs"
          >
            <option value="1">⟲ forward</option>
            <option value="-1">⟳ reverse</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="label">Earth</span>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={earthSpeed}
            onChange={(e) => setEarthSpeed(Number(e.target.value))}
            className="w-32 sm:w-40"
          />
          <select
            value={earthDir}
            onChange={(e) => setEarthDir(Number(e.target.value))}
            className="bg-black/30 border border-white/10 rounded p-1 text-xs"
          >
            <option value="1">⟲ forward</option>
            <option value="-1">⟳ reverse</option>
          </select>
        </div>
      </div>
      <div
        ref={containerRef}
        className="w-full h-64 md:h-80 lg:h-[28rem] rounded-xl border border-white/10"
      />
    </div>
  )
}
