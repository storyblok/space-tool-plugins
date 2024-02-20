import StoryblokClient, { ISbStoriesParams } from 'storyblok-js-client';
import { object, coerce, optional, number, string } from 'valibot';
import { parseQuery } from '../utils/parse';
import { StoriesResponse, Story } from '~/types/story';

export default defineEventHandler(async (event): Promise<StoriesResponse> => {
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
			slug: optional(string()),
			query: optional(string()),
		}),
	});

	// This is a management API instance because of the `oauthToken`.
	const storyblokClient = new StoryblokClient({
		oauthToken: `bearer ${accessToken}`,
	});

	const params: ISbStoriesParams = {
		version: 'published',
		per_page: query.perPage ?? 25,
		page: query.page ?? 1,
	};
	if (query.slug) {
		params.by_slugs = query.slug;
	}
	if (query.query) {
		// @ts-expect-error there is a typing error from the library
		params.text_search = query.query;
	}
	const { data, total } = await storyblokClient.get(
		`spaces/${spaceId}/stories`,
		params
	);

	return {
		stories: data.stories as Story[],
		perPage: query.perPage || data.per_page,
		total,
	};
});
