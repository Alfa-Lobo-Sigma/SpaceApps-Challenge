import { useId, useState } from 'react'

export type PhysicsTerm =
  | 'diameter'
  | 'velocity'
  | 'density'
  | 'target'
  | 'mass'
  | 'energy'
  | 'devastationRadius'
  | 'craterDiameter'
  | 'semiMajorAxis'
  | 'eccentricity'
  | 'inclination'
  | 'ascendingNode'
  | 'perihelionArgument'

const PHYSICS_TERM_CONTENT: Record<PhysicsTerm, { title: string; description: string; footnote?: string }> = {
  diameter: {
    title: 'Diameter',
    description:
      'Physical size of the impactor across its widest point. Larger diameters dramatically increase mass and impact energy.',
  },
  velocity: {
    title: 'Velocity',
    description:
      'Speed of the object when it strikes the atmosphere, measured in kilometers per second. Impact energy scales with the square of velocity.',
  },
  density: {
    title: 'Material density',
    description:
      'Average density of the impactor in kilograms per cubic meter. Metallic bodies pack more mass into the same volume.',
  },
  target: {
    title: 'Target surface',
    description:
      'Surface type at the impact point. Softer terrains absorb energy and change crater size compared with hard continental crust.',
  },
  mass: {
    title: 'Mass estimate',
    description:
      'Computed from volume and density. Mass determines how much kinetic energy the impactor delivers.',
  },
  energy: {
    title: 'Impact energy',
    description:
      'Kinetic energy released upon impact. Reported in joules and equivalent megatons of TNT for comparison.',
  },
  devastationRadius: {
    title: 'Devastation radius',
    description:
      'Approximate radius experiencing severe overpressure and thermal effects. Adjusted for terrain response when geology data is available.',
  },
  craterDiameter: {
    title: 'Crater diameter',
    description:
      'Estimated final rim-to-rim size of the crater based on scaling laws for transient crater growth and collapse.',
  },
  semiMajorAxis: {
    title: 'Semi-major axis (a)',
    description:
      'Average orbital size measured from the center of the ellipse. It sets the length of an orbital year via Kepler’s third law.',
  },
  eccentricity: {
    title: 'Eccentricity (e)',
    description:
      'Shape of the orbit. Values near 0 are circular; larger values stretch the ellipse and create long, slow aphelion passages.',
  },
  inclination: {
    title: 'Inclination (i)',
    description:
      'Tilt of the orbital plane relative to Earth’s orbital plane. Higher inclinations mean the object approaches from above or below the ecliptic.',
  },
  ascendingNode: {
    title: 'Longitude of ascending node (Ω)',
    description:
      'Points to where the object crosses the ecliptic heading north. Combined with inclination, it locates the orbital plane in space.',
  },
  perihelionArgument: {
    title: 'Argument of perihelion (ω)',
    description:
      'Angle from the ascending node to perihelion along the orbit. It tells you where the closest approach to the Sun occurs.',
  },
}

interface PhysicsTooltipProps {
  term: PhysicsTerm
  className?: string
}

export default function PhysicsTooltip({ term, className }: PhysicsTooltipProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const content = PHYSICS_TERM_CONTENT[term]

  if (!content) {
    return null
  }

  return (
    <span
      className={`relative inline-flex ${className ?? ''}`.trim()}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        aria-describedby={id}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/30 bg-white/10 text-[10px] font-semibold text-white/80 transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        onClick={() => setOpen((prev) => !prev)}
      >
        i
      </button>
      <div
        role="tooltip"
        id={id}
        className={`pointer-events-none absolute z-50 w-64 max-w-[18rem] rounded-lg border border-white/20 bg-black/90 p-3 text-left text-[11px] leading-snug text-white shadow-xl transition-opacity duration-150 ${
          open ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-1'
        }`}
        style={{ top: '125%', right: 0 }}
      >
        <div className="text-[12px] font-semibold mb-1">{content.title}</div>
        <p>{content.description}</p>
        {content.footnote ? <p className="mt-2 text-[10px] text-white/70">{content.footnote}</p> : null}
      </div>
    </span>
  )
}
