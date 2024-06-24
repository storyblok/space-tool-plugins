import jwt, { type VerifyCallback } from 'jsonwebtoken';
import { DecodedToken, VerifyResponse } from '~/types/appBridge';

export const verifyAppBridgeToken = async (
	token: string,
): Promise<VerifyResponse> => {
	try {
		return { ok: true, result: await verifyToken(token, env('CLIENT_SECRET')) };
	} catch (error) {
		return { ok: false, error };
	}
};

async function verifyToken(
	token: string,
	secret: string,
): Promise<DecodedToken> {
	return new Promise((resolve, reject) => {
		const verifyCallback: VerifyCallback = (err, decoded) =>
			err ? reject(err) : resolve(decoded as DecodedToken);
		jwt.verify(token, secret, verifyCallback);
	});
}
