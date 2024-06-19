import http from 'http'
import { ResponseElement } from './ResponseElement'
import { expireCookie, setCookie } from '../utils'

/**
 * Writes the changes described by a `ResponseElement` into a Node `http.ServerResponse`.
 * @param res
 * @param responseElement
 */
export const reconcileNodeResponse = (
  res: http.ServerResponse,
  responseElement: ResponseElement,
) => {
  if (responseElement.type === 'configuration-error') {
    console.error(
      `@stoyblok/app-extension-auth is misconfigured: ${
        responseElement.message ?? ''
      }`,
    )
  }
  if (responseElement.type === 'error' && responseElement.message) {
    console.error(responseElement.message)
  }

  responseElement.setCookies?.forEach(({ name, value }) =>
    typeof value === 'undefined'
      ? expireCookie(res, name)
      : setCookie(res, name, value),
  )

  res
    .writeHead(302, {
      Location: responseElement.redirectTo,
    })
    .end()
}
