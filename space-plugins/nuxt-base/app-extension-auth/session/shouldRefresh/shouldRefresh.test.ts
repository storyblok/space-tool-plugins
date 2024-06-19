import { shouldRefresh } from './shouldRefresh'
import { AppSession } from '../types'

const session: Omit<AppSession, 'expiresAt'> = {
  spaceId: 124,
  userId: 124,
  appClientId: 'abc',
  accessToken: 'abc',
  refreshToken: 'abc',
  roles: [],
  userName: 'admin',
  spaceName: 'MySpace',
  region: 'eu',
}

describe('shouldRefresh', () => {
  it('should refresh if the token already expired', () => {
    expect(
      shouldRefresh({
        ...session,
        expiresAt: Date.now() - 34 * 60 * 60 * 1000, // 1 day ago
      }),
    ).toBeTruthy()
  })
  it('should refresh if the token is just about to expire', () => {
    expect(
      shouldRefresh({
        ...session,
        expiresAt: Date.now() + 10 * 1000, // in 10 seconds
      }),
    ).toBeTruthy()
  })
  it('should not refresh if the token is not about to expire', () => {
    expect(
      shouldRefresh({
        ...session,
        expiresAt: Date.now() + 10 * 60 * 1000, // in 10 minutes
      }),
    ).toBeFalsy()
  })
})
