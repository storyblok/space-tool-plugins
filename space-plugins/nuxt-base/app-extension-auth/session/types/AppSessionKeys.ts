import { AppSession } from './AppSession'

export type AppSessionKeys = Pick<AppSession, 'spaceId' | 'userId'>
export type AppSessionQuery = Record<
  keyof Pick<AppSession, 'spaceId' | 'userId'>,
  string | number
>
