import { hasKey } from '../../../utils'
import { User } from './User'

export const isUser = (obj: unknown): obj is User =>
  hasKey(obj, 'id') &&
  typeof obj.id === 'number' &&
  hasKey(obj, 'friendly_name') &&
  typeof obj.friendly_name === 'string'
