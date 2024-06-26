import type { SetCookie } from '../../SetCookie';
import { signData } from '../../signData';

export const setSignedCookie = async (
	secret: string,
	setCookie: SetCookie,
	name: string,
	data: unknown,
) => await setCookie(name, signData(secret)(data));
