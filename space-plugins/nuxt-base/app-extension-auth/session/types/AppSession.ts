import { hasKey } from '../../utils'
import { isRegion, Region } from '@storyblok/region-helper'

export type AppSession = {
  spaceId: number // primary key
  userId: number // primary key
  appClientId: string // primary key
  userName: string
  spaceName: string
  roles: string[]
  expiresAt: number
  refreshToken: string
  accessToken: string
  region: Region
}

export const isAppSession = (data: unknown): data is AppSession =>
  hasKey(data, 'spaceId') &&
  typeof data.spaceId === 'number' &&
  hasKey(data, 'userId') &&
  typeof data.userId === 'number' &&
  hasKey(data, 'appClientId') &&
  typeof data.appClientId === 'string' &&
  hasKey(data, 'userName') &&
  typeof data.userName === 'string' &&
  hasKey(data, 'spaceName') &&
  typeof data.spaceName === 'string' &&
  hasKey(data, 'roles') &&
  Array.isArray(data.roles) &&
  data.roles.every((role) => typeof role === 'string') &&
  hasKey(data, 'expiresAt') &&
  typeof data.expiresAt === 'number' &&
  hasKey(data, 'refreshToken') &&
  typeof data.refreshToken === 'string' &&
  hasKey(data, 'accessToken') &&
  typeof data.accessToken === 'string' &&
  hasKey(data, 'region') &&
  isRegion(data.region)
