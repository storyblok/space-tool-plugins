import { verifyAppBridgeToken } from '@/utils/server';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
	}

	const { token } = JSON.parse(req.body);
	const result = await verifyAppBridgeToken(token);
	return res.status(200).json(result);
}
