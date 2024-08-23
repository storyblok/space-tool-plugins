import jwt, { type VerifyCallback } from 'jsonwebtoken';

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
): Promise<AppBridgeSession> {
	return new Promise((resolve, reject) => {
		const verifyCallback: VerifyCallback = (err, decoded) =>
			err ? reject(err) : resolve(decoded as AppBridgeSession);
		jwt.verify(token, secret, verifyCallback);
	});
}
