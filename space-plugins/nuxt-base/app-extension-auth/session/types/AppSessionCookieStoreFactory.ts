import http from 'http'
import { AuthHandlerParams } from '../../storyblok-auth-api'
import { AppSessionStore } from './AppSessionStore'

export type AppSessionCookieStoreFactoryParams = Pick<
  AuthHandlerParams,
  'clientId' | 'cookieName' | 'clientSecret' | 'baseUrl' | 'endpointPrefix'
>
export type AppSessionCookieStoreFactory = (
  staticParams: AppSessionCookieStoreFactoryParams,
) => (requestParams: {
  req: http.IncomingMessage
  res: http.ServerResponse
}) => AppSessionStore
