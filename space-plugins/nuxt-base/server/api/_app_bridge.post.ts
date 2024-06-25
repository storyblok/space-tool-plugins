export default defineEventHandler(async (event) => {
	const { token } = await readBody(event);
	return verifyAppBridgeToken(token);
});
