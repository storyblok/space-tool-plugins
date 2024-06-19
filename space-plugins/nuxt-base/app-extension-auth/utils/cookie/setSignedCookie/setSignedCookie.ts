import { SetCookie } from '../../SetCookie'
import { signData } from '../../signData'

export const setSignedCookie = (
  secret: string,
  setCookie: SetCookie,
  name: string,
  data: unknown,
) => void setCookie(name, signData(secret)(data))
