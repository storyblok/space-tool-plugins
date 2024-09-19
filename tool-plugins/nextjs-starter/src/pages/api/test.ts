import { verifyAppBridgeHeader } from '@/utils/server';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const verified = await verifyAppBridgeHeader(req);

	if (verified.ok) {
		// perform something with verified app bridge session
		/*
      verified.result = {
        app_id: number;
        space_id: number;
        user_id: number;
        iat: number;
        exp: number;
      }
    */
	}

	return res.status(200).json({
		verified: verified.ok,
	});
}
