import { ResponseElement } from '../ResponseElement'

export type HandleAuthRequest<T> = (props: T) => Promise<ResponseElement>
