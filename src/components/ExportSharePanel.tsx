import { useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import type { ImpactParams, ImpactResults, NEO, OrbitalData } from '../types'
import type { GeologyAdjustedResults, GeologyAssessment } from '../utils/geology'
import { currentShareUrl } from '../utils/sharing'
import type { ImpactMapHandle } from './ImpactMap'
import type { OrbitVisualizationHandle } from './OrbitVisualization'

interface ExportSharePanelProps {
  neo: NEO | null
  impactParams: ImpactParams
  impactResults: ImpactResults | null
  adjustedResults: GeologyAdjustedResults | null
  geology: GeologyAssessment | null
  location: [number, number]
  orbitalData: OrbitalData | null
  orbitHandle: OrbitVisualizationHandle | null
  mapHandle: ImpactMapHandle | null
}

const formatNumber = (value: number | null | undefined, unit?: string) => {
  if (value == null || Number.isNaN(value)) {
    return '—'
  }
  const formatted = value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: value < 10 ? 2 : 0,
  })
  return unit ? `${formatted} ${unit}` : formatted
}

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function ExportSharePanel({
  neo,
  impactParams,
  impactResults,
  adjustedResults,
  geology,
  location,
  orbitalData,
  orbitHandle,
  mapHandle,
}: ExportSharePanelProps) {
  const [status, setStatus] = useState<string | null>(null)

  const shareUrl = useMemo(() => {
    if (!neo) {
      return null
    }
    return currentShareUrl({
      neoId: neo.id,
      params: impactParams,
      location,
    })
  }, [neo, impactParams, location])

  const resetStatusLater = () => {
    window.setTimeout(() => setStatus(null), 4000)
  }

  const handleCopyShareLink = async () => {
    if (!shareUrl) {
      setStatus('Select a NEO to generate shareable links.')
      resetStatusLater()
      return
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setStatus('Scenario link copied to clipboard!')
    } catch (error) {
      console.error('Clipboard copy failed', error)
      setStatus('Copy failed. You can manually copy the URL from your browser.')
    }
    resetStatusLater()
  }

  const handleGeneratePdf = () => {
    if (!neo) {
      setStatus('Select a NEO before exporting a report.')
      resetStatusLater()
      return
    }

    const doc = new jsPDF()
    let y = 12

    doc.setFontSize(16)
    doc.text('Impactor-2025 Scenario Report', 12, y)

    doc.setFontSize(11)
    y += 8
    doc.text(`Object: ${neo.name}`, 12, y)
    y += 6
    doc.text(`Impact site: ${location[0].toFixed(2)}°, ${location[1].toFixed(2)}°`, 12, y)

    y += 8
    doc.setFontSize(13)
    doc.text('Impact Parameters', 12, y)
    doc.setFontSize(10)
    y += 6
    doc.text(`Diameter: ${formatNumber(impactParams.diameter, 'm')}`, 14, y)
    y += 5
    doc.text(`Velocity: ${formatNumber(impactParams.velocity, 'km/s')}`, 14, y)
    y += 5
    doc.text(`Density: ${formatNumber(impactParams.density, 'kg/m³')}`, 14, y)
    y += 5
    doc.text(`Surface: ${impactParams.target}`, 14, y)

    if (impactResults) {
      y += 8
      doc.setFontSize(13)
      doc.text('Impact Results', 12, y)
      doc.setFontSize(10)
      y += 6
      doc.text(`Energy: ${formatNumber(impactResults.energy, 'J')}`, 14, y)
      y += 5
      doc.text(`Energy (MT TNT): ${formatNumber(impactResults.energyMT)}`, 14, y)
      y += 5
      const devastation = adjustedResults?.adjustedDevastationRadius ?? impactResults.devastationRadius
      doc.text(`Devastation radius: ${formatNumber(devastation, 'km')}`, 14, y)
      y += 5
      const crater = adjustedResults?.adjustedCraterDiameter ?? impactResults.craterDiameter
      doc.text(`Crater diameter: ${formatNumber(crater, 'km')}`, 14, y)
      y += 5
      doc.text(`Population exposed: ${formatNumber(impactResults.population.exposed, 'people')}`, 14, y)
      y += 5
      doc.text(`Economic loss: ${formatNumber(impactResults.economic.directDamage, 'USD')}`, 14, y)
    }

    if (geology) {
      y += 8
      doc.setFontSize(13)
      doc.text('Geology Context', 12, y)
      doc.setFontSize(10)
      y += 6
      doc.text(`Profile: ${geology.profile.label}`, 14, y)
      y += 5
      if (geology.region) {
        doc.text(`Region: ${geology.region.name}`, 14, y)
        y += 5
      }
      doc.text(`Confidence: ${geology.confidence}`, 14, y)
      y += 5
      doc.text(`Terrain modifiers applied: ${geology.appliedTerrain ? 'Yes' : 'No'}`, 14, y)
    }

    if (orbitalData) {
      y += 8
      doc.setFontSize(13)
      doc.text('Orbital Elements', 12, y)
      doc.setFontSize(10)
      y += 6
      doc.text(`a: ${formatNumber(orbitalData.a, 'AU')}`, 14, y)
      y += 5
      doc.text(`e: ${formatNumber(orbitalData.e)}`, 14, y)
      y += 5
      doc.text(`i: ${formatNumber(orbitalData.i, 'rad')}`, 14, y)
      y += 5
      doc.text(`Ω: ${formatNumber(orbitalData.omega, 'rad')}`, 14, y)
      y += 5
      doc.text(`ω: ${formatNumber(orbitalData.w, 'rad')}`, 14, y)
    }

    doc.save('impactor-2025-scenario.pdf')
    setStatus('PDF report generated.')
    resetStatusLater()
  }

  const handleDownloadJson = () => {
    if (!neo) {
      setStatus('Select a NEO before exporting data.')
      resetStatusLater()
      return
    }

    const payload = {
      generatedAt: new Date().toISOString(),
      neo: {
        id: neo.id,
        name: neo.name,
      },
      location,
      impactParams,
      impactResults,
      adjustedResults,
      geology,
      orbitalData,
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    downloadBlob(blob, 'impactor-2025-scenario.json')
    setStatus('JSON data downloaded.')
    resetStatusLater()
  }

  const handleDownloadCsv = () => {
    if (!neo) {
      setStatus('Select a NEO before exporting data.')
      resetStatusLater()
      return
    }

    const devastation = impactResults
      ? adjustedResults?.adjustedDevastationRadius ?? impactResults.devastationRadius
      : null
    const crater = impactResults
      ? adjustedResults?.adjustedCraterDiameter ?? impactResults.craterDiameter
      : null

    const rows = [
      ['Field', 'Value'],
      ['NEO', neo.name],
      ['Latitude', location[0].toString()],
      ['Longitude', location[1].toString()],
      ['Diameter (m)', impactParams.diameter.toString()],
      ['Velocity (km/s)', impactParams.velocity.toString()],
      ['Density (kg/m³)', impactParams.density.toString()],
      ['Surface', impactParams.target],
      ['Devastation radius (km)', devastation ? devastation.toString() : ''],
      ['Crater diameter (km)', crater ? crater.toString() : ''],
      ['Population exposed', impactResults ? impactResults.population.exposed.toString() : ''],
      ['Population displaced', impactResults ? impactResults.population.displaced.toString() : ''],
      ['Economic loss (USD)', impactResults ? impactResults.economic.directDamage.toString() : ''],
    ]

    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    downloadBlob(blob, 'impactor-2025-scenario.csv')
    setStatus('CSV data downloaded.')
    resetStatusLater()
  }

  const handleExportOrbitImage = async () => {
    if (!orbitHandle) {
      setStatus('Orbit visualization not ready yet.')
      resetStatusLater()
      return
    }

    const blob = await orbitHandle.exportImage()
    if (!blob) {
      setStatus('Unable to capture orbit visualization.')
      resetStatusLater()
      return
    }

    downloadBlob(blob, 'impactor-2025-orbit.png')
    setStatus('Orbit visualization exported.')
    resetStatusLater()
  }

  const handleExportMapImage = async () => {
    if (!mapHandle) {
      setStatus('Impact map not ready yet.')
      resetStatusLater()
      return
    }

    const blob = await mapHandle.exportImage()
    if (!blob) {
      setStatus('Unable to capture map visualization.')
      resetStatusLater()
      return
    }

    downloadBlob(blob, 'impactor-2025-impact-map.png')
    setStatus('Impact map exported.')
    resetStatusLater()
  }

  const handleGeneratePdfClick = () => {
    void handleGeneratePdf()
  }

  const handleCopyShareLinkClick = () => {
    void handleCopyShareLink()
  }

  const handleExportOrbitImageClick = () => {
    void handleExportOrbitImage()
  }

  const handleExportMapImageClick = () => {
    void handleExportMapImage()
  }

  const handleDownloadJsonClick = () => {
    void handleDownloadJson()
  }

  const handleDownloadCsvClick = () => {
    void handleDownloadCsv()
  }

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm">
      <div>
        <h3 className="text-base font-semibold">Export &amp; sharing</h3>
        <p className="text-[11px] label">Capture the current scenario to share with colleagues or archive planning drills.</p>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleGeneratePdfClick}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left transition-colors hover:border-white/30 hover:bg-white/10"
        >
          Generate PDF report
        </button>
        <button
          type="button"
          onClick={handleCopyShareLinkClick}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left transition-colors hover:border-white/30 hover:bg-white/10"
        >
          Copy shareable link
        </button>
        <button
          type="button"
          onClick={handleExportOrbitImageClick}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left transition-colors hover:border-white/30 hover:bg-white/10"
        >
          Export orbit visualization
        </button>
        <button
          type="button"
          onClick={handleExportMapImageClick}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left transition-colors hover:border-white/30 hover:bg-white/10"
        >
          Export impact map
        </button>
        <button
          type="button"
          onClick={handleDownloadJsonClick}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left transition-colors hover:border-white/30 hover:bg-white/10"
        >
          Download data (JSON)
        </button>
        <button
          type="button"
          onClick={handleDownloadCsvClick}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left transition-colors hover:border-white/30 hover:bg-white/10"
        >
          Download data (CSV)
        </button>
      </div>
      {status ? <div className="text-[11px] label">{status}</div> : null}
      {shareUrl ? (
        <div className="text-[10px] break-all rounded-lg border border-white/5 bg-black/40 p-2 font-mono text-white/70">
          {shareUrl}
        </div>
      ) : null}
    </div>
  )
}
