import { URL } from 'url';

const dummyOrigin = 'https://dummy.com';

/**
 * Appends query parameters to a URL. Replaces existing parameters.
 * @param url
 * @param params
 */
export const appendQueryParams = (
	url: string,
	params: Record<string, string>,
): string => {
	const hasLeadingSlash = url.startsWith('/');

	const urlObj = new URL(url, dummyOrigin);
	Object.entries(params).forEach(([key, value]) => {
		urlObj.searchParams.set(key, value);
	});

	const urlWithLeadingSlash = urlObj
		.toString()
		.replace(new RegExp(`^${dummyOrigin}`), '');

	return hasLeadingSlash
		? urlWithLeadingSlash
		: urlWithLeadingSlash.replace(/^\//, '');
};
