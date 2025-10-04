import * as THREE from 'three'
import type { OrbitalData } from '../types'

const TWO_PI = Math.PI * 2
const YEAR_S = 365.25 * 86400 // seconds in a Julian year

export function parseOrbitalData(orbitalDataRaw: any): OrbitalData | null {
  if (!orbitalDataRaw) return null

  // Validate that required fields exist
  if (!orbitalDataRaw.semi_major_axis || !orbitalDataRaw.eccentricity) {
    console.warn('Orbital data missing required fields (semi_major_axis or eccentricity)')
    return null
  }

  const a = Number(orbitalDataRaw.semi_major_axis)
  const e = Number(orbitalDataRaw.eccentricity)
  const inc = THREE.MathUtils.degToRad(Number(orbitalDataRaw.inclination || 0))
  const omega = THREE.MathUtils.degToRad(Number(orbitalDataRaw.ascending_node_longitude || 0))
  const w = THREE.MathUtils.degToRad(Number(orbitalDataRaw.perihelion_argument || 0))

  // Validate parsed values are valid numbers
  if (isNaN(a) || isNaN(e) || isNaN(inc) || isNaN(omega) || isNaN(w)) {
    console.warn('Orbital data contains invalid numeric values')
    return null
  }

  // Validate orbital parameters are physically reasonable
  if (a <= 0 || e < 0 || e >= 1) {
    console.warn(`Invalid orbital parameters: a=${a}, e=${e}`)
    return null
  }

  return { a, e, i: inc, omega, w }
}

export function generateOrbitPoints(orbit: OrbitalData): Float32Array {
  const { a, e, i, omega, w } = orbit
  const points: number[] = []

  const cosO = Math.cos(omega)
  const sinO = Math.sin(omega)
  const cosi = Math.cos(i)
  const sini = Math.sin(i)
  const cosw = Math.cos(w)
  const sinw = Math.sin(w)

  for (let deg = 0; deg <= 360; deg++) {
    const nu = THREE.MathUtils.degToRad(deg)
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(nu))

    const X = (cosO * cosw - sinO * sinw * cosi) * r * Math.cos(nu) +
              (-cosO * sinw - sinO * cosw * cosi) * r * Math.sin(nu)
    const Y = (sinO * cosw + cosO * sinw * cosi) * r * Math.cos(nu) +
              (-sinO * sinw + cosO * cosw * cosi) * r * Math.sin(nu)
    const Z = (sinw * sini) * r * Math.cos(nu) + (cosw * sini) * r * Math.sin(nu)

    points.push(X, Z, Y)
  }

  return new Float32Array(points)
}

export function trueAnomalyFromMean(M: number, e: number): number {
  M = ((M % TWO_PI) + TWO_PI) % TWO_PI // keep in [0, 2π)

  let E = e < 0.8 ? M : Math.PI // initial guess for eccentric anomaly

  // Newton-Raphson iteration
  for (let k = 0; k < 8; k++) {
    const f = E - e * Math.sin(E) - M
    const fp = 1 - e * Math.cos(E)
    E = E - f / fp
  }

  const beta = Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2)
  const nu = 2 * Math.atan(beta)

  return (nu + TWO_PI) % TWO_PI
}

export function positionOnOrbit(nu: number, orbit: OrbitalData): THREE.Vector3 {
  const { a, e, i, omega, w } = orbit

  const cosO = Math.cos(omega)
  const sinO = Math.sin(omega)
  const cosi = Math.cos(i)
  const sini = Math.sin(i)
  const cosw = Math.cos(w)
  const sinw = Math.sin(w)

  const r = (a * (1 - e * e)) / (1 + e * Math.cos(nu))

  const X = (cosO * cosw - sinO * sinw * cosi) * r * Math.cos(nu) +
            (-cosO * sinw - sinO * cosw * cosi) * r * Math.sin(nu)
  const Y = (sinO * cosw + cosO * sinw * cosi) * r * Math.cos(nu) +
            (-sinO * sinw + cosO * cosw * cosi) * r * Math.sin(nu)
  const Z = (sinw * sini) * r * Math.cos(nu) + (cosw * sini) * r * Math.sin(nu)

  return new THREE.Vector3(X, Z, Y)
}

export function getMeanMotion(a: number): number {
  // Kepler's 3rd law: n = 2π / (a^{3/2} years)
  const nYear = TWO_PI / Math.pow(a, 1.5) // rad/year
  return nYear / YEAR_S // rad/s
}

export const EARTH_MEAN_MOTION = TWO_PI / YEAR_S // rad/s

export function getDefaultOrbit(): OrbitalData {
  return {
    a: 1.5,
    e: 0.3,
    i: THREE.MathUtils.degToRad(10),
    omega: THREE.MathUtils.degToRad(40),
    w: THREE.MathUtils.degToRad(30)
  }
}
