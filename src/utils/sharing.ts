import type { ImpactParams, SurfaceType } from '../types'

export interface ShareState {
  neoId?: string | null
  params: ImpactParams
  location: [number, number]
}

const surfaceTypes: SurfaceType[] = ['continental', 'oceanic', 'sedimentary']

const isValidSurfaceType = (value: string): value is SurfaceType => {
  return surfaceTypes.includes(value as SurfaceType)
}

export const encodeShareState = (baseUrl: string, state: ShareState): string => {
  const params = new URLSearchParams()

  if (state.neoId) {
    params.set('neo', state.neoId)
  }

  params.set('d', state.params.diameter.toFixed(2))
  params.set('v', state.params.velocity.toFixed(2))
  params.set('rho', state.params.density.toFixed(2))
  params.set('t', state.params.target)
  params.set('lat', state.location[0].toFixed(4))
  params.set('lng', state.location[1].toFixed(4))

  const query = params.toString()
  return query ? `${baseUrl}?${query}` : baseUrl
}

export const parseShareState = (search: string): ShareState | null => {
  if (!search || search.length <= 1) {
    return null
  }

  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)

  const diameter = Number(params.get('d'))
  const velocity = Number(params.get('v'))
  const density = Number(params.get('rho'))
  const target = params.get('t') ?? ''
  const lat = Number(params.get('lat'))
  const lng = Number(params.get('lng'))

  if (
    !Number.isFinite(diameter) ||
    !Number.isFinite(velocity) ||
    !Number.isFinite(density) ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    !isValidSurfaceType(target)
  ) {
    return null
  }

  const neoId = params.get('neo')

  return {
    neoId,
    params: {
      diameter,
      velocity,
      density,
      target,
    },
    location: [lat, lng],
  }
}

export const currentShareUrl = (state: ShareState): string | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const baseUrl = `${window.location.origin}${window.location.pathname}`
  return encodeShareState(baseUrl, state)
}
