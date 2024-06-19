import { URL } from 'url'

export const validateAppBaseUrl = (appBaseUrl: string): boolean => {
  if (appBaseUrl.includes('?')) {
    return false
  }
  try {
    const url = new URL(appBaseUrl)
    if (url.protocol !== 'https:') {
      return false
    }
  } catch (_) {
    return false
  }
  return true
}
