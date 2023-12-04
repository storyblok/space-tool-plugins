import StoryblokClient, { type ISbStoryData } from 'storyblok-js-client';
import { object, coerce, optional, number } from 'valibot';
import { parseQuery } from '../utils/parse';
import { Stories } from '~/types/story';

export default defineEventHandler(async (event): Promise<Stories> => {
	const { spaceId, accessToken } = event.context.appSession;
	// We're using `coerce(number(), Number)` instead of `number()`.
	// When requesting with query parameters like:
	// /stories?perPage=10&page=4
	// the parsed result is just strings like '10' and '4'.
	// So, we need to coerce this string into a number.
	// Ref: https://valibot.dev/guides/methods/
	const query = parseQuery({
		event,
		schema: object({
			perPage: optional(coerce(number(), Number)),
			page: optional(coerce(number(), Number)),
		}),
	});

	const response = await storyblokFetch(accessToken).getStories({
		spaceId,
		page: query.page,
		perPage: query.perPage,
	});

	return response;
});

const storyblokFetch = (accessToken: string) => {
	const defaults = {
		perPage: 25,
		page: 1,
		version: 'published',
	};

	const storyblokClient = new StoryblokClient({
		oauthToken: `bearer ${accessToken}`,
	});

	//TODO: type the props
	const getStories = async ({
		spaceId,
		perPage,
		page,
		version,
	}: any): Promise<Stories> => {
		const { data, total } = await storyblokClient.get(
			`spaces/${spaceId}/stories`,
			{
				version: version ?? defaults.version,
				per_page: perPage ?? defaults.perPage,
				page: page ?? defaults.page,
			},
		);

		return {
			stories: data.stories as ISbStoryData[],
			perPage,
			total,
		};
	};

	return { getStories };
};
