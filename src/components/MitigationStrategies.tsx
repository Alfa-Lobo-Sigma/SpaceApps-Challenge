import { useMemo, useState } from 'react'
import type { NEO } from '../types'

type MitigationMethod = {
  id: string
  name: string
  description: string
  strengths: string
  limitations: string
  relativeRisk: 'Low' | 'Moderate' | 'High'
  optimalLeadTime: number // years
  maxEffectiveSizeKm: number
  baseSuccess: number
}

const METHODS: MitigationMethod[] = [
  {
    id: 'kinetic',
    name: 'Kinetic Impactor',
    description:
      'High-speed spacecraft collides with the asteroid to nudge it onto a new trajectory. Proven feasible by the DART mission (2022).',
    strengths: 'Mature technology, scalable with multiple impactors, low political risk.',
    limitations: 'Requires several years of warning to build, launch, and deliver the impactor; less effective on very large or rubble-pile objects.',
    relativeRisk: 'Low',
    optimalLeadTime: 7,
    maxEffectiveSizeKm: 0.8,
    baseSuccess: 0.62,
  },
  {
    id: 'gravity',
    name: 'Gravity Tractor',
    description:
      'A massive spacecraft hovers near the asteroid, using mutual gravity and continuous thrusters to slowly tug the object onto a safer trajectory.',
    strengths: 'Extremely precise control, works regardless of asteroid composition or rotation.',
    limitations: 'Needs a decade or more of lead time; high propellant and station-keeping demands.',
    relativeRisk: 'Moderate',
    optimalLeadTime: 12,
    maxEffectiveSizeKm: 1.2,
    baseSuccess: 0.55,
  },
  {
    id: 'nuclear',
    name: 'Nuclear Standoff',
    description:
      'Detonates a nuclear device near the surface to ablate material and generate a rapid change in velocity.',
    strengths: 'Highest impulse delivery, effective even with short warning times.',
    limitations: 'Complex policy considerations, fallout risk if device contacts surface, requires robust modeling of debris.',
    relativeRisk: 'High',
    optimalLeadTime: 3,
    maxEffectiveSizeKm: 3.5,
    baseSuccess: 0.7,
  },
]

const YEAR_MS = 1000 * 60 * 60 * 24 * 365.25

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

const formatTimeRemaining = (impactDate: Date | null) => {
  if (!impactDate) {
    return null
  }

  const diffMs = impactDate.getTime() - Date.now()
  if (diffMs <= 0) {
    return {
      label: 'Impact date has passed or is occurring now.',
      totalDays: 0,
    }
  }

  const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  const years = Math.floor(totalDays / 365.25)
  const months = Math.floor((totalDays % 365.25) / 30.4375)
  const days = Math.max(totalDays - Math.round(years * 365.25) - Math.round(months * 30.4375), 0)

  const parts = []
  if (years) parts.push(`${years} year${years === 1 ? '' : 's'}`)
  if (months) parts.push(`${months} month${months === 1 ? '' : 's'}`)
  if (days || parts.length === 0) parts.push(`${days} day${days === 1 ? '' : 's'}`)

  return {
    label: parts.join(', '),
    totalDays,
  }
}

const getAverageDiameterKm = (neo: NEO | null) => {
  if (!neo?.estimated_diameter?.meters) {
    return null
  }
  const { estimated_diameter_min, estimated_diameter_max } = neo.estimated_diameter.meters
  return (estimated_diameter_min + estimated_diameter_max) / 2 / 1000
}

interface MitigationStrategiesProps {
  neo: NEO | null
  className?: string
}

const MitigationStrategies = ({ neo, className }: MitigationStrategiesProps) => {
  const [selectedMethodId, setSelectedMethodId] = useState<string>(METHODS[0].id)
  const [leadTimeYears, setLeadTimeYears] = useState<number>(6)
  const [missionReadiness, setMissionReadiness] = useState<number>(70)

  const selectedMethod = METHODS.find((method) => method.id === selectedMethodId) ?? METHODS[0]

  const impactDateString =
    neo?.impact_scenario?.impact_date ?? neo?.close_approach_data?.[0]?.close_approach_date ?? null
  const impactDate = impactDateString ? new Date(impactDateString) : null
  const timeRemaining = useMemo(() => formatTimeRemaining(impactDate), [impactDate])

  const timeline = useMemo(() => {
    if (!impactDate) {
      return []
    }

    const milestones = [
      {
        label: 'Today — mission planning status check',
        date: new Date(),
      },
      {
        label: 'Detection & characterization complete',
        date: new Date(impactDate.getTime() - leadTimeYears * YEAR_MS),
      },
      {
        label: 'Spacecraft design freeze & integration',
        date: new Date(impactDate.getTime() - Math.max(leadTimeYears - 2.5, 0) * YEAR_MS),
      },
      {
        label: 'Launch window closes',
        date: new Date(impactDate.getTime() - Math.max(leadTimeYears * 0.25, 0.3) * YEAR_MS),
      },
      {
        label: `${selectedMethod.name} execution`,
        date: new Date(impactDate.getTime() - 0.2 * YEAR_MS),
      },
      {
        label: 'Projected impact epoch',
        date: impactDate,
      },
    ]

    return milestones.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [impactDate, leadTimeYears, selectedMethod.name])

  const averageDiameterKm = useMemo(() => getAverageDiameterKm(neo), [neo])

  const successProbability = useMemo(() => {
    const leadScore = clamp(leadTimeYears / selectedMethod.optimalLeadTime, 0, 1.5)
    const readinessScore = missionReadiness / 100

    let sizeFactor = 1
    if (averageDiameterKm) {
      if (averageDiameterKm > selectedMethod.maxEffectiveSizeKm) {
        const oversize = averageDiameterKm - selectedMethod.maxEffectiveSizeKm
        sizeFactor = clamp(1 - oversize * 0.35, 0.25, 1)
      }
    }

    const probability =
      (selectedMethod.baseSuccess * 0.45 + leadScore * 0.35 + readinessScore * 0.2) * sizeFactor

    return Math.round(clamp(probability, 0.05, 0.97) * 100)
  }, [averageDiameterKm, leadTimeYears, missionReadiness, selectedMethod])

  return (
    <section className={`panel rounded-2xl p-4 space-y-5 ${className ?? ''}`}>
      <header>
        <h2 className="text-xl font-semibold">Mitigation Strategies</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Explore feasible planetary defense responses based on mission lead time, readiness, and the
          characteristics of the selected object.
        </p>
      </header>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Deflection Techniques</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethodId(method.id)}
              className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                selectedMethodId === method.id
                  ? 'border-indigo-400 bg-indigo-500/10'
                  : 'border-[var(--border-color)] hover:border-indigo-400/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{method.name}</h4>
                <span className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                  {method.relativeRisk} risk
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{method.description}</p>
            </button>
          ))}
        </div>
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--metric-bg)]/70 p-4 text-sm">
          <p className="font-medium text-indigo-200">Why choose {selectedMethod.name}?</p>
          <p className="mt-1 text-[var(--text-secondary)]">{selectedMethod.strengths}</p>
          <p className="mt-2 font-medium text-indigo-200">Mission challenges</p>
          <p className="mt-1 text-[var(--text-secondary)]">{selectedMethod.limitations}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Time-to-Impact Timeline</h3>
        {impactDate ? (
          <>
            <p className="text-sm text-[var(--text-secondary)]">
              Estimated time remaining: {timeRemaining?.label ?? 'unknown'}
            </p>
            <ol className="relative border-l border-indigo-500/40 pl-4 text-sm">
              {timeline.map((item) => (
                <li key={item.label} className="mb-4">
                  <div className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border border-indigo-400 bg-indigo-500/40" />
                  <p className="font-medium">{item.label}</p>
                  <p className="text-[var(--text-secondary)]">{formatDate(item.date)}</p>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p className="text-sm text-[var(--text-secondary)]">
            Select a scenario with an impact date to populate a mitigation timeline.
          </p>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Success Probability Estimator</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-1 text-sm md:col-span-1">
            <span className="label block text-xs uppercase tracking-wide">Lead time (years)</span>
            <input
              type="range"
              min={1}
              max={20}
              value={leadTimeYears}
              onChange={(event) => setLeadTimeYears(Number(event.target.value))}
              className="w-full"
            />
            <span className="text-[var(--text-secondary)]">{leadTimeYears.toFixed(0)} years of warning</span>
          </label>
          <label className="space-y-1 text-sm md:col-span-1">
            <span className="label block text-xs uppercase tracking-wide">Mission readiness</span>
            <input
              type="range"
              min={30}
              max={100}
              value={missionReadiness}
              onChange={(event) => setMissionReadiness(Number(event.target.value))}
              className="w-full"
            />
            <span className="text-[var(--text-secondary)]">{missionReadiness}% agency & industry readiness</span>
          </label>
          <div className="rounded-xl border border-indigo-400/40 bg-indigo-500/10 p-4 text-center md:col-span-1">
            <p className="text-xs uppercase tracking-wide text-indigo-200">Projected success</p>
            <p className="text-3xl font-semibold">{successProbability}%</p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Adjust lead time and readiness to see how {selectedMethod.name.toLowerCase()} performance shifts.
            </p>
          </div>
        </div>
        {averageDiameterKm && (
          <p className="text-xs text-[var(--text-secondary)]">
            Estimated object size: {averageDiameterKm.toFixed(2)} km diameter — method efficiency decreases beyond ~
            {selectedMethod.maxEffectiveSizeKm} km.
          </p>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Method Comparison Snapshot</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-color)] text-sm">
            <thead className="text-[var(--text-secondary)]">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Method</th>
                <th className="px-3 py-2 text-left font-medium">Ideal lead time</th>
                <th className="px-3 py-2 text-left font-medium">Strengths</th>
                <th className="px-3 py-2 text-left font-medium">Key limitations</th>
                <th className="px-3 py-2 text-left font-medium">Relative risk</th>
              </tr>
            </thead>
            <tbody>
              {METHODS.map((method) => (
                <tr
                  key={`${method.id}-row`}
                  className={
                    selectedMethodId === method.id
                      ? 'bg-indigo-500/10'
                      : 'odd:bg-[var(--metric-bg)] even:bg-transparent'
                  }
                >
                  <td className="px-3 py-2 font-medium">{method.name}</td>
                  <td className="px-3 py-2">≈ {method.optimalLeadTime} years</td>
                  <td className="px-3 py-2">{method.strengths}</td>
                  <td className="px-3 py-2">{method.limitations}</td>
                  <td className="px-3 py-2">{method.relativeRisk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default MitigationStrategies
