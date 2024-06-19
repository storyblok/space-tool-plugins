import { hasKey } from '../../../utils'
import { isUser } from '../User'
import { isSpace } from '../Space'
import { isRoles } from '../Role'
import { UserInfo } from './UserInfo'

export const isUserInfo = (obj: unknown): obj is UserInfo =>
  hasKey(obj, 'user') &&
  isUser(obj.user) &&
  hasKey(obj, 'space') &&
  isSpace(obj.space) &&
  hasKey(obj, 'roles') &&
  isRoles(obj.roles)
