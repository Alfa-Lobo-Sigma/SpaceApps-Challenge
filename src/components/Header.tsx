export default function Header() {
  return (
    <header className="px-6 py-4 border-b border-white/10 sticky top-0 z-50 panel">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <img src="/logo.png" alt="Team Logo" className="h-12 w-auto" />
        <div className="flex-1">
          <div className="text-xl font-semibold">Impactor‑2025</div>
          <div className="text-xs sm:text-sm label">
            NASA NeoWs + Leaflet + Three.js • real data, simplified physics
          </div>
        </div>
      </div>
    </header>
  )
}
