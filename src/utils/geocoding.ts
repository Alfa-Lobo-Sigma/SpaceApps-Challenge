export interface AffectedCity {
  name: string
  type: string
  distance: number // km from impact point
  population?: number
}

/**
 * Fetches cities/municipalities within a radius using Overpass API
 * @param lat Latitude of impact point
 * @param lng Longitude of impact point
 * @param radiusKm Radius in kilometers
 * @returns Array of affected cities
 */
export async function fetchAffectedCities(
  lat: number,
  lng: number,
  radiusKm: number
): Promise<AffectedCity[]> {
  try {
    // Limit radius to avoid overloading the API
    const effectiveRadius = Math.min(radiusKm, 500) * 1000 // Convert to meters, max 500km

    // Overpass query to find cities, towns, and villages within radius
    const query = `
      [out:json][timeout:25];
      (
        node["place"~"city|town|village"](around:${effectiveRadius},${lat},${lng});
      );
      out body;
    `

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    })

    if (!response.ok) {
      throw new Error('Failed to fetch cities')
    }

    const data = await response.json()

    // Process and sort by distance
    const cities: AffectedCity[] = data.elements
      .map((element: any) => {
        const cityLat = element.lat
        const cityLng = element.lon
        const distance = calculateDistance(lat, lng, cityLat, cityLng)

        return {
          name: element.tags.name || 'Unknown',
          type: element.tags.place || 'settlement',
          distance,
          population: element.tags.population ? parseInt(element.tags.population) : undefined
        }
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20) // Limit to top 20 closest cities

    return cities
  } catch (error) {
    console.error('Error fetching affected cities:', error)
    return []
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}
