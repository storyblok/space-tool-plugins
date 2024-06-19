import { AppSessionQuery } from '../types'
import { hasKey } from '../../utils'

export const isAppSessionQuery = (obj: unknown): obj is AppSessionQuery => {
  if (!hasKey(obj, 'userId') || !hasKey(obj, 'spaceId')) {
    return false
  }
  return (
    (typeof obj.userId === 'string' || typeof obj.userId === 'number') &&
    (typeof obj.spaceId === 'string' || typeof obj.spaceId === 'number')
  )
}
