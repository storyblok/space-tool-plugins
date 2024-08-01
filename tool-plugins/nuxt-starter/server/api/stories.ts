import StoryblokClient, { ISbStoriesParams } from 'storyblok-js-client';

export default defineEventHandler(
	async (
		event,
	): Promise<{
		stories: Story[];
		total: number;
	}> => {
		const { spaceId, accessToken } = event.context.appSession;

		// This is a management API instance because of the `oauthToken`.
		const storyblokClient = new StoryblokClient({
			oauthToken: `bearer ${accessToken}`,
		});

		const params: ISbStoriesParams = {
			version: 'published',
			per_page: 25,
			page: 1,
		};

		const { data, total } = await storyblokClient.get(
			`spaces/${spaceId}/stories`,
			params,
		);

		return {
			stories: data.stories as Story[],
			total,
		};
	},
);
