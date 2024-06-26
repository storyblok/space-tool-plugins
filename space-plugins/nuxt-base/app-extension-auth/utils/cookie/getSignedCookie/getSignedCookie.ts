import type { GetCookie } from '../../GetCookie';
import { verifyData } from '../../verifyData';

export const getSignedCookie = async (
	secret: string,
	getCookie: GetCookie,
	name: string,
) => {
	const jwtToken = await getCookie(name);
	if (!jwtToken) {
		return undefined;
	}
	return verifyData(secret)(jwtToken);
};
