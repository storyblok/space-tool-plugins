import { GetCookie } from '../../GetCookie';
import { verifyData } from '../../verifyData';

export const getSignedCookie = (
	secret: string,
	getCookie: GetCookie,
	name: string,
) => {
	const jwtToken = getCookie(name);
	if (!jwtToken) {
		return undefined;
	}
	return verifyData(secret)(jwtToken);
};
