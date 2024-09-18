import { authParams } from '@/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
	getSessionStore,
	inferSessionQuery,
} from '@storyblok/app-extension-auth';

export const getAppSession = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	const sessionStore = getSessionStore(authParams)({
		req,
		res,
	});

	const appSessionQuery = inferSessionQuery(req);
	if (!appSessionQuery) {
		return;
	}
	return await sessionStore.get(appSessionQuery);
};
