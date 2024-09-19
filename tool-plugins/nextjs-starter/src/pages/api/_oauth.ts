import { initOauthFlowUrl } from '@/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAppSession } from '@/utils/server';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { initOAuth } = JSON.parse(req.body);
	if (initOAuth) {
		return res.status(200).json({
			ok: false,
			redirectTo: initOauthFlowUrl,
		});
	}

	const appSession = await getAppSession(req, res);
	if (appSession) {
		return res.status(200).json({
			ok: true,
		});
	}

	return res.status(200).json({
		ok: false,
		redirectTo: initOauthFlowUrl,
	});
}
