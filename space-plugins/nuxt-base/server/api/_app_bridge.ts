import jwt, { type VerifyCallback } from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
	const { token } = await readBody(event);
	try {
		const decoded = await verifyToken(token, env('CLIENT_SECRET'));
		console.log('💡 decoded', decoded);
	} catch (err) {
		console.log('💡 err', err);
	}
});

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
