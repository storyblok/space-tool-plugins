import { AppSession } from '../types'
import { setSignedCookie, SetCookie } from '../../utils'
import { authCookieName } from '../authCookieName'
import { AuthHandlerParams } from '../../storyblok-auth-api'

export type SetAllSessionsParams = Pick<
  AuthHandlerParams,
  'clientSecret' | 'cookieName' | 'clientId'
>
export type SetAllSessions = (
  params: SetAllSessionsParams,
  setCookie: SetCookie,
  sessions: AppSession[],
) => void
export const setAllSessions: SetAllSessions = (params, setCookie, sessions) => {
  setSignedCookie(params.clientSecret, setCookie, authCookieName(params), {
    sessions,
  })
}
