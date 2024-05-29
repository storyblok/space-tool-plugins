import {
	US_CODE,
	EU_CODE,
	CA_CODE,
	AP_CODE,
	CN_CODE,
	getRegion,
} from '@storyblok/region-helper';

const HOSTS = {
	[EU_CODE]: 'https://mapi.storyblok.com',
	[US_CODE]: 'https://api-us.storyblok.com',
	[CA_CODE]: 'https://api-ca.storyblok.com',
	[AP_CODE]: 'https://api-ap.storyblok.com',
	[CN_CODE]: 'https://app.storyblokchina.cn',
};

export function getManagementApiHost(spaceId: number) {
	return HOSTS[getRegion(spaceId) || EU_CODE];
}
