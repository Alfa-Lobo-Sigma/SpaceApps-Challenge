interface RateLimitConfig {
  requestsPerHour: number
  requestsPerDay: number
}

interface RateLimitState {
  hourlyRequests: number[]
  dailyRequests: number[]
  lastCleanup: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  requestsPerHour: 1000, // NASA NeoWs limit is 1000/hour
  requestsPerDay: 2000,
}

class RateLimiter {
  private state: RateLimitState
  private config: RateLimitConfig

  constructor(config: RateLimitConfig = DEFAULT_CONFIG) {
    this.config = config
    this.state = this.loadState()
    this.cleanup()
  }

  private loadState(): RateLimitState {
    try {
      if (typeof window === 'undefined') {
        return this.getDefaultState()
      }
      const stored = window.localStorage.getItem('neows.rateLimit')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to load rate limit state:', error)
    }
    return this.getDefaultState()
  }

  private getDefaultState(): RateLimitState {
    return {
      hourlyRequests: [],
      dailyRequests: [],
      lastCleanup: Date.now(),
    }
  }

  private saveState(): void {
    try {
      if (typeof window === 'undefined') {
        return
      }
      window.localStorage.setItem('neows.rateLimit', JSON.stringify(this.state))
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded while saving rate limit state')
        // Clear old requests to free up space
        const now = Date.now()
        const oneHourAgo = now - 60 * 60 * 1000
        this.state.hourlyRequests = this.state.hourlyRequests.filter((ts) => ts > oneHourAgo).slice(-100)
        this.state.dailyRequests = this.state.dailyRequests.slice(-200)
      } else {
        console.warn('Failed to save rate limit state:', error)
      }
    }
  }

  private cleanup(): void {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000
    const oneDayAgo = now - 24 * 60 * 60 * 1000

    this.state.hourlyRequests = this.state.hourlyRequests.filter((ts) => ts > oneHourAgo)
    this.state.dailyRequests = this.state.dailyRequests.filter((ts) => ts > oneDayAgo)
    this.state.lastCleanup = now
    this.saveState()
  }

  public canMakeRequest(): boolean {
    this.cleanup()
    return (
      this.state.hourlyRequests.length < this.config.requestsPerHour &&
      this.state.dailyRequests.length < this.config.requestsPerDay
    )
  }

  public recordRequest(): void {
    const now = Date.now()
    this.state.hourlyRequests.push(now)
    this.state.dailyRequests.push(now)
    this.saveState()
  }

  public getStatus(): {
    hourlyRemaining: number
    dailyRemaining: number
    canMakeRequest: boolean
  } {
    this.cleanup()
    return {
      hourlyRemaining: this.config.requestsPerHour - this.state.hourlyRequests.length,
      dailyRemaining: this.config.requestsPerDay - this.state.dailyRequests.length,
      canMakeRequest: this.canMakeRequest(),
    }
  }

  public reset(): void {
    this.state = {
      hourlyRequests: [],
      dailyRequests: [],
      lastCleanup: Date.now(),
    }
    this.saveState()
  }
}

export const neoWsRateLimiter = new RateLimiter()

export async function fetchWithRateLimit(
  url: string,
  options?: RequestInit
): Promise<Response> {
  if (!neoWsRateLimiter.canMakeRequest()) {
    const status = neoWsRateLimiter.getStatus()
    throw new Error(
      `Rate limit exceeded. Remaining: ${status.hourlyRemaining}/hour, ${status.dailyRemaining}/day`
    )
  }

  neoWsRateLimiter.recordRequest()
  return fetch(url, options)
}
