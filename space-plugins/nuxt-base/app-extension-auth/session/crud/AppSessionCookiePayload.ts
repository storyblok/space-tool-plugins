import { hasKey } from '../../utils'
import { AppSession, isAppSession } from '../types'

export type AppSessionCookiePayload = {
  sessions: AppSession[]
}

export const isAppSessionCookiePayload = (
  data: unknown,
): data is AppSessionCookiePayload =>
  hasKey(data, 'sessions') &&
  Array.isArray(data.sessions) &&
  data.sessions.every(isAppSession)
