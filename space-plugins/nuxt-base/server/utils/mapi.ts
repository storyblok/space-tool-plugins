import { US_CODE, getRegion } from '@storyblok/region-helper';

export function getManagementApiHost(spaceId: number) {
	return getRegion(spaceId) === US_CODE
		? 'https://api-us.storyblok.com'
		: 'https://mapi.storyblok.com';
}
