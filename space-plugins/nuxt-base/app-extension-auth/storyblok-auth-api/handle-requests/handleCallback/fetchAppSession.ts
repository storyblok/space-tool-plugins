import { AuthHandlerParams } from '../../AuthHandlerParams'
import { AppSession } from '../../../session'
import { openidClient } from '../openidClient'
import { redirectUri } from '../redirectUri'
import { isTokenSet } from './isTokenSet'
import { isStoryblokRole, isUserInfo, Role } from '../../user-info'
import { Region } from '@storyblok/region-helper'

export const fetchAppSession = async (
  params: AuthHandlerParams,
  requestParams: {
    url: string
    region: Region
    codeVerifier: string
    state: string
  },
): Promise<AppSession | undefined> => {
  const { region, codeVerifier, state, url } = requestParams

  const client = openidClient(params, region)

  const callbackParams = client.callbackParams(url)
  const tokenSet = await client.oauthCallback(
    redirectUri(params),
    callbackParams,
    {
      code_verifier: codeVerifier,
      state: state,
    },
  )
  if (!isTokenSet(tokenSet)) {
    return undefined
  }
  // Storyblok do not conform to openid, so the userinfo object is not the same as in the openid specification:
  //  https://openid.net/specs/openid-connect-core-1_0.html#UserInfo
  const userInfo = await client.userinfo(tokenSet.access_token)
  if (!isUserInfo(userInfo)) {
    return undefined
  }
  return {
    refreshToken: tokenSet.refresh_token,
    accessToken: tokenSet.access_token,
    expiresAt: Date.now() + tokenSet.expires_in * 1000,
    appClientId: params.clientId,
    roles: userInfo.roles.map((role) => getRoleName(role)),
    spaceId: userInfo.space.id,
    spaceName: userInfo.space.name,
    userId: userInfo.user.id,
    userName: userInfo.user.friendly_name,
    region,
  }
}

const getRoleName = (role: Role): string => {
  if (isStoryblokRole(role)) {
    return role.name
  }

  return role.role
}
