import { getManagementBaseUrl, getRegion } from '@storyblok/region-helper';
import { FetchSpaceInfo, SpaceInfo } from '~/types/space';

export const fetchSpaceInfo: FetchSpaceInfo = async ({
	spaceId,
	accessToken,
}) => {
	const region = getRegion(spaceId);
	if (!region) {
		return {
			ok: false,
			error: 'region-not-identified',
		};
	}
	const apiHost = getManagementBaseUrl(region);
	const url = `${apiHost}/v1/oauth/space_info`;

	try {
		const result = await $fetch<SpaceInfo>(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		return {
			ok: true,
			result,
		};
	} catch (err: any) {
		return {
			ok: false,
			error: 'could-not-fetch-space-info',
		};
	}
};
