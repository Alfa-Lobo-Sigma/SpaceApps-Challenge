import type { ImpactParams, ImpactResults } from '../types'

export function calculateImpactResults(params: ImpactParams): ImpactResults {
  const { diameter, velocity, density } = params

  // Calculate mass (sphere volume * density)
  const radius = diameter / 2
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3)
  const mass = volume * density

  // Calculate kinetic energy (0.5 * m * v^2)
  const velocityMs = velocity * 1000 // convert km/s to m/s
  const energy = 0.5 * mass * Math.pow(velocityMs, 2)

  // Convert to megatons TNT (1 MT = 4.184e15 J)
  const energyMT = energy / 4.184e15

  // Heuristic devastation radius (km)
  const devastationRadius = 1.2 * Math.cbrt(energyMT)

  // Heuristic crater diameter (km)
  const craterDiameter = 1.1 * Math.pow(energyMT, 0.25)

  return {
    mass,
    energy,
    energyMT,
    devastationRadius,
    craterDiameter
  }
}

export function formatMass(mass: number): string {
  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
  return `${fmt.format(mass)} kg`
}

export function formatEnergy(energy: number): string {
  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
  if (energy >= 1e15) {
    return `${fmt.format(energy / 1e15)} PJ`
  } else if (energy >= 1e12) {
    return `${fmt.format(energy / 1e12)} TJ`
  } else {
    return `${fmt.format(energy)} J`
  }
}

export function formatKm(value: number): string {
  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
  return `${fmt.format(value)} km`
}

export function formatMT(value: number): string {
  const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
  return `${fmt.format(value)} Mt TNT`
}
