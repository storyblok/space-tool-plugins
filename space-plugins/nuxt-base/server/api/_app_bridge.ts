import jwt, { type VerifyCallback } from 'jsonwebtoken';

export default defineEventHandler(async (event): Promise<VerifyResponse> => {
	const { token } = await readBody(event);
	try {
		return { ok: true, result: await verifyToken(token, env('CLIENT_SECRET')) };
	} catch (error) {
		return { ok: false, error };
	}
});

type VerifyResponse =
	| { ok: true; result: DecodedToken }
	| { ok: false; error: unknown };

type DecodedToken = {
	app_id: number;
	space_id: number;
	user_id: number;
	iat: number;
	exp: number;
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
