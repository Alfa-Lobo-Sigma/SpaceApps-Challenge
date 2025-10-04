export function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch (error) {
    console.warn(`localStorage.getItem failed for key "${key}":`, error)
    return null
  }
}

export function safeSetItem(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error(`localStorage quota exceeded for key "${key}"`)
    } else {
      console.warn(`localStorage.setItem failed for key "${key}":`, error)
    }
    return false
  }
}

export function safeRemoveItem(key: string): boolean {
  try {
    window.localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`localStorage.removeItem failed for key "${key}":`, error)
    return false
  }
}

export function safeClear(): boolean {
  try {
    window.localStorage.clear()
    return true
  } catch (error) {
    console.warn('localStorage.clear failed:', error)
    return false
  }
}

export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__'
    window.localStorage.setItem(testKey, 'test')
    window.localStorage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}
