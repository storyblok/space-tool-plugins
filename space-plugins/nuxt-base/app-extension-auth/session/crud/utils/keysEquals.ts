import { AppSession } from '../../types'

export const keysEquals =
  (a: Pick<AppSession, 'appClientId' | 'spaceId' | 'userId'>) =>
  (b: Pick<AppSession, 'appClientId' | 'spaceId' | 'userId'>) =>
    a.appClientId === b.appClientId &&
    a.spaceId === b.spaceId &&
    a.userId === b.userId
