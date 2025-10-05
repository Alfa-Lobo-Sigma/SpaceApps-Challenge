import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { OrbitalData } from '../types'
import {
  generateOrbitPoints,
  trueAnomalyFromMean,
  positionOnOrbit,
  getMeanMotion,
  EARTH_MEAN_MOTION,
  getDefaultOrbit,
} from '../utils/orbital'
import { useLanguage } from '../contexts/LanguageContext'
import OrbitalMechanicsExplainers from './OrbitalMechanicsExplainers'

export interface OrbitVisualizationHandle {
  exportImage: () => Promise<Blob | null>
}

interface OrbitVisualizationProps {
  orbitalData: OrbitalData | null
  impactDate?: string | null
}

const OrbitVisualization = forwardRef<OrbitVisualizationHandle, OrbitVisualizationProps>(
  ({ orbitalData, impactDate }, ref) => {
    const { t, language } = useLanguage()
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
    const impactPauseRef = useRef(false)

    const [timeScale, setTimeScale] = useState(2000000)
    const [isRealTime, setIsRealTime] = useState(false)
    const [astroSpeed, setAstroSpeed] = useState(1)
    const [astroDir, setAstroDir] = useState(1)
    const [earthSpeed, setEarthSpeed] = useState(1)
    const [earthDir, setEarthDir] = useState(1)
    const [isImpactPaused, setImpactPaused] = useState(false)
    const [timeRemainingLabel, setTimeRemainingLabel] = useState<string | null>(null)

    const parsedImpactDate = useMemo(() => {
      if (!impactDate) {
        return null
      }
      const parsed = new Date(impactDate)
      return Number.isNaN(parsed.getTime()) ? null : parsed
    }, [impactDate])

    const formatTimeRemaining = (ms: number) => {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000))
      const days = Math.floor(totalSeconds / 86400)
      const hours = Math.floor((totalSeconds % 86400) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      const parts: string[] = []
      if (days > 0) {
        parts.push(`${days}${language === 'es' ? 'd' : 'd'}`)
      }
      if (hours > 0 || parts.length > 0) {
        parts.push(`${hours}${language === 'es' ? 'h' : 'h'}`)
      }
      if (minutes > 0 || parts.length > 0) {
        parts.push(`${minutes}${language === 'es' ? 'm' : 'm'}`)
      }
      parts.push(`${seconds}${language === 'es' ? 's' : 's'}`)

      return parts.join(' ')
    }

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

        const earthMarkerInstance = earthMarkerRef.current
        if (earthMarkerInstance) {
          if (!impactPauseRef.current) {
            earthMRef.current +=
              earthDirRef.current *
              earthSpeedRef.current *
              EARTH_MEAN_MOTION *
              dt *
              timeScaleRef.current
            earthMarkerInstance.position.set(
              Math.cos(earthMRef.current),
              0,
              Math.sin(earthMRef.current)
            )
          }
        }

        if (!impactPauseRef.current && currentOrbitRef.current && asteroidMarkerRef.current) {
          const n = getMeanMotion(currentOrbitRef.current.a)
          asteroidMRef.current +=
            astroDirRef.current * astroSpeedRef.current * n * dt * timeScaleRef.current
          const nu = trueAnomalyFromMean(asteroidMRef.current, currentOrbitRef.current.e)
          const pos = positionOnOrbit(nu, currentOrbitRef.current)
          asteroidMarkerRef.current.position.copy(pos)

          if (earthMarkerInstance) {
            const distance = asteroidMarkerRef.current.position.distanceTo(
              earthMarkerInstance.position
            )
            if (distance <= 0.05 && !impactPauseRef.current) {
              impactPauseRef.current = true
              setImpactPaused(true)
            }
          }
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

    useEffect(() => {
      const effectiveScale = isRealTime ? 1 : timeScale
      timeScaleRef.current = effectiveScale
    }, [isRealTime, timeScale])

    // Update animation parameters
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

    useEffect(() => {
      impactPauseRef.current = false
      setImpactPaused(false)
    }, [orbitalData])

    useEffect(() => {
      impactPauseRef.current = false
      setImpactPaused(false)
    }, [parsedImpactDate])

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
      impactPauseRef.current = false
      setImpactPaused(false)
    }

    useImperativeHandle(
      ref,
      () => ({
        async exportImage() {
          const canvas = rendererRef.current?.domElement
          if (!canvas) {
            return null
          }

          return await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((blob) => resolve(blob), 'image/png')
          })
        },
      }),
      []
    )

    useEffect(() => {
      if (!parsedImpactDate) {
        setTimeRemainingLabel(null)
        return
      }

      const updateCountdown = () => {
        const diff = parsedImpactDate.getTime() - Date.now()
        if (diff <= 0) {
          setTimeRemainingLabel(t('orbitViz.impactNow'))
          if (!impactPauseRef.current) {
            impactPauseRef.current = true
            setImpactPaused(true)
          }
        } else {
          setTimeRemainingLabel(formatTimeRemaining(diff))
        }
      }

      updateCountdown()
      const interval = window.setInterval(updateCountdown, 1000)
      return () => window.clearInterval(interval)
    }, [parsedImpactDate, t, language])

    const handleRealTimeToggle = () => {
      setIsRealTime((prev) => !prev)
    }

    const handleResume = () => {
      impactPauseRef.current = false
      setImpactPaused(false)
      lastTimeRef.current = performance.now()
    }

    return (
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-base sm:text-lg font-semibold">{t('orbitViz.title')}</h2>
          <div className="text-xs sm:text-sm text-white/70">
            {parsedImpactDate ? (
              <span>
                {t('orbitViz.timeRemaining')}{' '}
                <span className="font-semibold text-emerald-300">
                  {timeRemainingLabel ?? '—'}
                </span>
              </span>
            ) : (
              <span>{t('orbitViz.timeRemainingUnknown')}</span>
            )}
          </div>
        </div>
        <p className="text-[11px] sm:text-xs text-white/50">{t('orbitViz.controls')}</p>
        {isImpactPaused && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs sm:text-sm text-amber-200">
            <span>{t('orbitViz.impactPaused')}</span>
            <button
              type="button"
              onClick={handleResume}
              className="rounded-md border border-amber-300/60 bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-100 transition hover:bg-amber-400/30"
            >
              {t('orbitViz.resume')}
            </button>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 items-start sm:items-center text-xs sm:text-sm mb-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="label whitespace-nowrap">{t('orbitViz.timeScale')}</span>
            <input
              type="range"
              min="1000"
              max="50000000"
              step="1000"
              value={timeScale}
              disabled={isRealTime}
              onChange={(e) => {
                setIsRealTime(false)
                setTimeScale(Number(e.target.value))
              }}
              className="flex-1 sm:w-32 lg:w-56"
            />
            <span className="label text-[10px] sm:text-xs whitespace-nowrap">
              {isRealTime ? t('orbitViz.realTimeActive') : `${timeScale.toLocaleString()}×`}
            </span>
            <button
              type="button"
              onClick={handleRealTimeToggle}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] sm:text-xs transition hover:bg-white/10"
            >
              {isRealTime ? t('orbitViz.exitRealTime') : t('orbitViz.realTime')}
            </button>
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
)

OrbitVisualization.displayName = 'OrbitVisualization'

export default OrbitVisualization
