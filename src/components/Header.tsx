import type { MouseEventHandler } from 'react'

type HeaderProps = {
  onPreparednessClick: MouseEventHandler<HTMLButtonElement>
}

export default function Header({ onPreparednessClick }: HeaderProps) {
  return (
    <header className="px-6 py-4 border-b border-white/10 sticky top-0 z-[900] panel">
      <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <img src="/logo.png" alt="Team Logo" className="h-12 w-auto" />
          <div>
            <div className="text-xl font-semibold">Impactor‑2025</div>
            <div className="text-xs sm:text-sm label">
              NASA NeoWs + Leaflet + Three.js • real data, simplified physics
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onPreparednessClick}
          className="self-start rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:border-white/40 hover:bg-white/20"
        >
          Impact preparedness guide
        </button>
      </div>
    </header>
  )
}
