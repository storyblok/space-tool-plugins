import { AppSessionCookieStoreFactory, AppSessionStore } from './types'
import { getAllSessions, getSession, putSession, removeSession } from './crud'
import { refreshStoredAppSession } from './refreshStoredAppSession'
import {
  GetCookie,
  getCookie as getNodeCookie,
  SetCookie,
  setCookie as setNodeCookie,
} from '../utils'

export const sessionCookieStore: AppSessionCookieStoreFactory =
  (params) =>
  (requestParams): AppSessionStore => {
    const getCookie: GetCookie = (name) =>
      getNodeCookie(requestParams.req, name)
    const setCookie: SetCookie = (name, value) =>
      setNodeCookie(requestParams.res, name, value)
    return {
      get: async (keys) =>
        refreshStoredAppSession(
          params,
          getCookie,
          setCookie,
          getSession(params, getCookie, keys),
        ),
      getAll: async () => getAllSessions(params, getCookie),
      put: async (session) => putSession(params, getCookie, setCookie, session),
      remove: async (keys) => removeSession(params, getCookie, setCookie, keys),
    }
  }
