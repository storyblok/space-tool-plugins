import { AppSession } from '../types'
import { AuthHandlerParams } from '../../storyblok-auth-api'
import { setAllSessions } from './setAllSessions'
import { getAllSessions } from './getAllSessions'
import { keysEquals } from './utils'
import { GetCookie, SetCookie } from '../../utils'

export type PutSessionParams = Pick<
  AuthHandlerParams,
  'clientSecret' | 'cookieName' | 'clientId'
>

export type PutSession = (
  params: PutSessionParams,
  getCookie: GetCookie,
  setCookie: SetCookie,
  session: AppSession,
) => AppSession

export const putSession: PutSession = (
  params,
  getCookie,
  setCookie,
  newSession,
) => {
  const isNotEqual = (otherSession: AppSession) =>
    !keysEquals(newSession)(otherSession)
  const otherSessions = getAllSessions(params, getCookie).filter(isNotEqual)
  setAllSessions(params, setCookie, [...otherSessions, newSession])
  return newSession
}
