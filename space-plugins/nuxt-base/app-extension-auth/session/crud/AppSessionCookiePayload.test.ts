import {
  AppSessionCookiePayload,
  isAppSessionCookiePayload,
} from './AppSessionCookiePayload'

const stub: AppSessionCookiePayload = {
  sessions: [
    {
      spaceId: 123,
      userId: 12345,
      appClientId: '094uif90e',
      expiresAt: Date.now(),
      region: 'eu',
      accessToken: 'abctoken123',
      roles: ['admin'],
      userName: 'Johannes Lindgren',
      spaceName: 'My Space',
      refreshToken: '98rejf984ej89crejf98je',
    },
  ],
}

describe('isAppSessionCookiePayload', () => {
  describe('validation', () => {
    it('is an object with a property "session"', () => {
      expect(isAppSessionCookiePayload({})).toEqual(false)
      expect(isAppSessionCookiePayload(stub)).toEqual(true)
    })
    it('The property "session" is an array', () => {
      expect(
        isAppSessionCookiePayload({
          sessions: {},
        }),
      ).toEqual(false)
      expect(isAppSessionCookiePayload(stub)).toEqual(true)
    })
    it('The property "session" is an array of AppSession', () => {
      expect(
        isAppSessionCookiePayload({
          sessions: [],
        }),
      ).toEqual(true)
      expect(isAppSessionCookiePayload(stub)).toEqual(true)
      expect(
        isAppSessionCookiePayload({
          sessions: [{ not: 'aSession' }],
        }),
      ).toEqual(false)
    })
  })
})
