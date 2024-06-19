/**
 * The data that is returned from https://app.storyblok.com/oauth/user_info
 */
import { User } from '../User'
import { Space } from '../Space'
import { Role } from '../Role'

export type UserInfo = {
  user: User
  space: Space
  roles: Role[]
}
