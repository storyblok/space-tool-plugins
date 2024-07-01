import { generators } from 'openid-client';
import { openidClient } from '../openidClient';
import { redirectUri } from '../redirectUri';
import type { AuthHandlerParams } from '../../AuthHandlerParams';
import type { HandleAuthRequest } from '../HandleAuthRequest';
import { createCallbackData } from '~/app-extension-auth/storyblok-auth-api/handle-requests/callbackData';

export const handleSignInRequest: HandleAuthRequest<{
	params: AuthHandlerParams;
}> = async ({ params }) => {
	const code_verifier = generators.codeVerifier();
	const state = generators.state();
	const code_challenge = generators.codeChallenge(code_verifier);

	try {
		const redirectTo = openidClient(params).authorizationUrl({
			// The scope is actually ignored by Storyblok's OAuth API.
			//  But we keep it here just in case something changes in the future, it does no harm.
			scope: ['read_content', 'write_content'].join(' '),
			code_challenge,
			state,
			code_challenge_method: 'S256',
			redirect_uri: redirectUri(params),
		});

		return {
			type: 'success',
			redirectTo,
			sessions: [
				createCallbackData({
					returnTo: params?.successCallback ?? '/', // TODO read from request query params, then either use the successCallback as fallback, or remove the entirely
					codeVerifier: code_verifier,
					state,
				}),
			],
		};
	} catch (e) {
		return {
			type: 'error',
			message: `Unexpected error. ${e instanceof Error ? e.message : ''}`,
		};
	}
};
