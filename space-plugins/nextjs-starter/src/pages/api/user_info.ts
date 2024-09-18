import { getAppSession } from '@/utils/server';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const appSession = await getAppSession(req, res);
	if (!appSession) {
		return res.status(401).end();
	}
	return res.status(200).json(await fetchUserInfo(appSession.accessToken));
}

const fetchUserInfo = async (accessToken: string) => {
	try {
		const response = await fetch(`https://api.storyblok.com/oauth/user_info`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok) {
			throw new Error(`Request failed with status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Failed to fetch user information:', error);
	}

	return null;
};
