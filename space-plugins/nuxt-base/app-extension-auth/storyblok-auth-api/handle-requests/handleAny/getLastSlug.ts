import url from 'url';
export const getLastSlug = (fullUrl: string): string | undefined => {
	const slugs = url.parse(fullUrl)?.pathname?.split('/');
	return slugs && slugs[slugs.length - 1];
};
