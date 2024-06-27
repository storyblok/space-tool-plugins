import { numberFromString } from '../../../utils';
import { URL } from 'url';
import { getRegion, type Region } from '@storyblok/region-helper';

const spaceIdFromUrl = (url: string): number | undefined => {
	const isRelativeUrl = !url.startsWith('http');

	const spaceStr = new URL(
		url,
		isRelativeUrl ? 'https://dummy.com' : undefined,
	).searchParams.get('space_id');
	if (!spaceStr) {
		return undefined;
	}
	return numberFromString(spaceStr);
};

export const regionFromUrl = (url: string): Region | undefined => {
	const spaceId = spaceIdFromUrl(url);
	if (typeof spaceId === 'undefined') {
		return undefined;
	}

	return getRegion(spaceId);
};
