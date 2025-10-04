import type { OrbitalData } from '../types'
import { getDefaultOrbit } from '../utils/orbital'
import PhysicsTooltip, { type PhysicsTerm } from './PhysicsTooltip'

interface OrbitalMechanicsExplainersProps {
  orbitalData: OrbitalData | null
}

interface ExplainerCard {
  id: string
  label: string
  value: string
  insight: string
  term?: PhysicsTerm
}

const DEG_PER_RAD = 180 / Math.PI

export default function OrbitalMechanicsExplainers({ orbitalData }: OrbitalMechanicsExplainersProps) {
  const orbit = orbitalData ?? getDefaultOrbit()
  const inclinationDeg = (orbit.i * DEG_PER_RAD).toFixed(2)
  const omegaDeg = (orbit.omega * DEG_PER_RAD).toFixed(2)
  const perihelionDeg = (orbit.w * DEG_PER_RAD).toFixed(2)

  const cards: ExplainerCard[] = [
    {
      id: 'semi-major-axis',
      label: 'Semi-major axis (a)',
      term: 'semiMajorAxis' as const,
      value: `${orbit.a.toFixed(3)} AU`,
      insight:
        'Controls orbital period. Values above 1 AU spend more time outside Earth’s orbit, increasing warning time between apparitions.',
    },
    {
      id: 'eccentricity',
      label: 'Eccentricity (e)',
      term: 'eccentricity' as const,
      value: orbit.e.toFixed(3),
      insight:
        orbit.e < 0.2
          ? 'Nearly circular trajectory. Velocity changes modestly along the orbit.'
          : 'Highly elliptical path. Expect slower motion at aphelion and faster, more energetic passes near perihelion.',
    },
    {
      id: 'inclination',
      label: 'Inclination (i)',
      term: 'inclination' as const,
      value: `${inclinationDeg}°`,
      insight:
        Number(inclinationDeg) < 5
          ? 'Low tilt relative to Earth’s orbital plane—good geometry for radar and optical tracking.'
          : 'Significant tilt can complicate launch windows for mitigation missions and change entry angle.',
    },
    {
      id: 'ascending-node',
      label: 'Ascending node (Ω)',
      term: 'ascendingNode' as const,
      value: `${omegaDeg}°`,
      insight:
        'Defines where the object crosses the ecliptic heading north. Aligns evacuation drills with the hemisphere of approach.',
    },
    {
      id: 'perihelion-argument',
      label: 'Argument of perihelion (ω)',
      term: 'perihelionArgument' as const,
      value: `${perihelionDeg}°`,
      insight:
        'Describes the point of closest solar approach. Combined with eccentricity it signals seasonal lighting and thermal conditions for the object.',
    },
    {
      id: 'mission-note',
      label: 'Mission planning cue',
      value: `${estimateOrbitalPeriod(orbit.a)} year period`,
      insight:
        'Use the period to time deflection missions or future observation campaigns. Longer periods reduce revisit opportunities.',
    },
  ]

  return (
    <div className="mt-3 rounded-xl border border-white/10 bg-black/25 p-4 text-xs text-white/80">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">Orbital mechanics explainers</h3>
        <p className="label text-[10px] uppercase tracking-wide">New</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <div key={card.id} className="rounded-lg bg-black/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[11px] font-semibold text-white">
                {card.label}
              </div>
              {card.term ? <PhysicsTooltip term={card.term} /> : null}
            </div>
            <div className="mt-1 text-base font-semibold text-white">{card.value}</div>
            <p className="mt-2 text-[11px] text-white/80 leading-snug">{card.insight}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function estimateOrbitalPeriod(a: number): string {
  // Kepler's third law approximation: P = a^{3/2}
  const period = Math.pow(Math.abs(a), 1.5)
  if (!Number.isFinite(period)) {
    return '—'
  }
  if (period < 0.5) {
    return `${period.toFixed(2)}`
  }
  if (period < 5) {
    return `${period.toFixed(1)}`
  }
  return `${period.toFixed(0)}`
}
