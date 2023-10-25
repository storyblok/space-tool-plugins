import StoryblokClient, { type ISbStoryData } from 'storyblok-js-client';

export default defineEventHandler(async (event) => {
	const appSession = await getAppSession(event);
	if (!appSession) {
		throw createError({ statusCode: 401 });
	}

	const { spaceId } = getQuery(event);
	const client = new StoryblokClient({
		oauthToken: `bearer ${appSession.accessToken}`,
	});
	const { data, perPage, total } = await client.get(
		`spaces/${spaceId}/stories`,
		{
			version: 'published',
			per_page: 25,
			page: 1,
		}
	);

	return {
		stories: data.stories as ISbStoryData<unknown>[],
		perPage,
		total,
	};
});
