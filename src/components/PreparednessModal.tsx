import { useMemo, useState } from 'react'

type PreparednessModalProps = {
  open: boolean
  onClose: () => void
}

type ScenarioKey = 'continental' | 'oceanic' | 'urban'

type IndustryImpact = {
  sector: string
  impact: string
  recommendations: string
}

const scenarioLabels: Record<ScenarioKey, string> = {
  continental: 'Continental impact',
  oceanic: 'Oceanic impact',
  urban: 'Urban impact'
}

const scenarioSummaries: Record<ScenarioKey, string> = {
  continental:
    'An impact on land can generate shockwaves and ejecta that affect extensive rural and agricultural areas.',
  oceanic:
    'An impact in the ocean creates tsunamis and disrupts maritime supply chains and regional ports.',
  urban:
    'Urban centers concentrate population and critical services, requiring detailed evacuation and continuity plans.'
}

const scenarioIndustries: Record<ScenarioKey, IndustryImpact[]> = {
  continental: [
    {
      sector: 'Agriculture',
      impact: 'Crop loss from blast waves and soil contamination.',
      recommendations: 'Activate food contingency plans and secure strategic reserves.'
    },
    {
      sector: 'Ground transportation',
      impact: 'Disruption to highways and railways that enable distribution.',
      recommendations: 'Identify alternate routes and coordinate with emergency management agencies.'
    },
    {
      sector: 'Energy',
      impact: 'Potential damage to transmission lines and regional substations.',
      recommendations: 'Isolate vulnerable segments and deploy mobile repair crews.'
    }
  ],
  oceanic: [
    {
      sector: 'Fishing and aquaculture',
      impact: 'Extreme waves and disruption to coastal ecosystems.',
      recommendations: 'Suspend operations and relocate vessels to safe harbors.'
    },
    {
      sector: 'Port logistics',
      impact: 'Port closures and damage to maritime infrastructure.',
      recommendations: 'Reroute cargo to alternate ports and coordinate with naval authorities.'
    },
    {
      sector: 'Coastal tourism',
      impact: 'Mass evacuations and cancellations due to tsunami risk.',
      recommendations: 'Implement visitor communication plans and secure evacuation routes.'
    }
  ],
  urban: [
    {
      sector: 'Healthcare services',
      impact: 'Hospital overload and a need for mass triage.',
      recommendations: 'Stand up field hospitals and reinforce medical supply chains.'
    },
    {
      sector: 'Telecommunications',
      impact: 'Mobile and data network disruption affecting critical services.',
      recommendations: 'Deploy mobile communication units and satellite redundancies.'
    },
    {
      sector: 'Finance',
      impact: 'Temporary market closures and vulnerable banking infrastructure.',
      recommendations: 'Activate business continuity plans and off-site backups.'
    }
  ]
}

export default function PreparednessModal({ open, onClose }: PreparednessModalProps) {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>('continental')

  const industries = useMemo(() => scenarioIndustries[selectedScenario], [selectedScenario])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8">
      <div className="panel max-w-3xl w-full max-h-full overflow-y-auto rounded-3xl border border-white/10">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            <h2 className="text-2xl font-semibold">Asteroid impact preparedness guide</h2>
            <p className="label mt-1">
              Recommended actions for emergency managers and the public, with decision-ready data points.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-3 py-1 text-sm hover:border-white/40 transition-colors"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>

        <div className="space-y-6 p-6">
          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Immediate public actions</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/80">
              <li>Follow official emergency channels and avoid sharing unverified information.</li>
              <li>Assemble a go-kit with water, non-perishable food, flashlights, and first-aid supplies.</li>
              <li>Choose family meeting points and alternate evacuation routes.</li>
              <li>Secure critical documents in resilient digital and physical formats.</li>
              <li>Monitor guidance on temporary shelters and safe travel windows.</li>
            </ul>
          </section>

          <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold">Guidance for authorities</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/80">
                <li>Activate emergency operations centers and coordinate with science agencies.</li>
                <li>Monitor trajectory models and refresh scenarios every 30 minutes.</li>
                <li>Prioritize critical infrastructure and communications network protection.</li>
                <li>Release accessible, multilingual bulletins for vulnerable communities.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Suggested resources</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/80">
                <li>NASA Sentry II dashboard for near-Earth object tracking.</li>
                <li>International Tsunami Warning Network for ocean impact alerts.</li>
                <li>Local risk mapping platforms (OpenData, regional SDIs).</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Industry impact analysis</h3>
                <p className="label">Select a scenario to reveal critical sectors and recommended actions.</p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <span className="label">Scenario</span>
                <select
                  value={selectedScenario}
                  onChange={event => setSelectedScenario(event.target.value as ScenarioKey)}
                  className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-sm focus:border-white/40 focus:outline-none"
                >
                  {Object.entries(scenarioLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className="text-sm text-white/80">{scenarioSummaries[selectedScenario]}</p>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
                  <tr>
                    <th scope="col" className="px-4 py-3">Sector</th>
                    <th scope="col" className="px-4 py-3">Expected impact</th>
                    <th scope="col" className="px-4 py-3">Key recommendations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {industries.map(industry => (
                    <tr key={industry.sector} className="bg-black/30">
                      <td className="px-4 py-3 font-medium text-white/90">{industry.sector}</td>
                      <td className="px-4 py-3 text-white/75">{industry.impact}</td>
                      <td className="px-4 py-3 text-white/75">{industry.recommendations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold">Communication and monitoring</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/80">
              <li>Schedule regular public updates and press briefings.</li>
              <li>Share risk maps and evacuation routes in accessible formats.</li>
              <li>Integrate local sensors, community reports, and satellite data to confirm damage.</li>
              <li>Document lessons learned in collaborative platforms for future improvement.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
