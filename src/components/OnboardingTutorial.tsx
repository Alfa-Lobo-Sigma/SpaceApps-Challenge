import { useEffect, useState } from 'react'
import PhysicsTooltip from './PhysicsTooltip'

interface OnboardingTutorialProps {
  open: boolean
  onDismiss: (completed: boolean) => void
}

const STEPS = [
  {
    id: 'neo-browser',
    title: '1 — Explore real NEO data',
    description:
      'Start by selecting a near-Earth object from the NeoWs browser. Scenario tags highlight curated drills like Impactor-2025. Loading a scenario also presets physics inputs.',
    bullets: [
      'Use the search bar to filter by designation or nickname.',
      'Scenario entries inject additional metadata such as impact location and narrative context.',
      'Switch between English and Spanish via the header toggles.',
    ],
  },
  {
    id: 'impact-physics',
    title: '2 — Tune impact physics parameters',
    description:
      'Diameter, velocity, density, and surface type feed a fast estimator. Hover over the new physics tooltips to understand how each factor affects energy release and crater size.',
    bullets: [
      'Results refresh automatically as you change inputs—no need to mash recalc.',
      'Terrain intelligence from USGS geology layers adjusts devastation and crater sizing.',
      'Keep the Preparedness guide handy for checklists and public messaging.',
    ],
  },
  {
    id: 'visualize',
    title: '3 — Visualize and brief',
    description:
      'The 3D orbit view now includes explainer cards for orbital mechanics. Map rings show devastation vs. crater radius; drag to test alternate impact points or load another scenario.',
    bullets: [
      'Orbit cards break down semi-major axis, eccentricity, inclination, and node geometry.',
      'Use the Impact Scenario Library to brief teams on hazard narratives and response focus.',
      'Export findings by taking screenshots or piping outputs into downstream planning tools.',
    ],
  },
]

export default function OnboardingTutorial({ open, onDismiss }: OnboardingTutorialProps) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (open) {
      setStepIndex(0)
    }
  }, [open])

  if (!open) {
    return null
  }

  const step = STEPS[stepIndex]
  const isLast = stepIndex === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        aria-hidden
        onClick={() => onDismiss(false)}
      />
      <div className="relative z-[1201] w-full max-w-xl rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-sm shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-white/60">Quickstart tour</p>
            <h2 className="text-lg font-semibold text-white">{step.title}</h2>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(false)}
            className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70 transition hover:bg-white/10"
          >
            Skip
          </button>
        </div>
        <p className="mt-3 text-white/90">{step.description}</p>
        {step.id === 'impact-physics' ? (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-black/40 p-3 text-[11px] text-white/80">
            <span className="text-[24px] font-semibold text-white/70" aria-hidden>
              ?
            </span>
            <div>
              <div className="font-semibold text-white/90">Physics tooltips</div>
              <p>Hover or tap the icon to reveal definitions—try it here:</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="label text-[10px] uppercase tracking-wide">Energy</span>
                <PhysicsTooltip term="energy" />
                <span className="label text-[10px] uppercase tracking-wide">Crater</span>
                <PhysicsTooltip term="craterDiameter" />
              </div>
            </div>
          </div>
        ) : null}
        <ul className="mt-4 space-y-2">
          {step.bullets.map((item) => (
            <li key={item} className="flex items-start gap-2 text-white/80">
              <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between text-[11px] uppercase tracking-wide text-white/60">
          <span>
            Step {stepIndex + 1} of {STEPS.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
              className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent"
              disabled={stepIndex === 0}
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                if (isLast) {
                  onDismiss(true)
                } else {
                  setStepIndex((index) => Math.min(STEPS.length - 1, index + 1))
                }
              }}
              className="rounded-full bg-emerald-500/90 px-4 py-1.5 text-[12px] font-semibold text-emerald-50 transition hover:bg-emerald-400"
            >
              {isLast ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
