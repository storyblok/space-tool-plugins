import jwt from 'jsonwebtoken';

export const verifyData =
	(secret: string) =>
	(jwtToken: string): unknown => {
		try {
			const payload = jwt.verify(jwtToken, secret);
			if (typeof payload === 'string') {
				return undefined;
			}
			if (!('data' in payload)) {
				return undefined;
			}
			return payload.data as unknown;
		} catch (e) {
			return undefined;
		}
	};
