import StoryblokClient, { type ISbStoryData } from 'storyblok-js-client';
import { object, coerce, optional, number } from 'valibot';
import { parseQuery } from '../utils/parse';

export default defineEventHandler(async (event) => {
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

	const page = query.page ?? 1;
	const perPage = query.perPage ?? 25;

	const client = new StoryblokClient({
		oauthToken: `bearer ${accessToken}`,
	});
	const { data, total } = await client.get(`spaces/${spaceId}/stories`, {
		version: 'published',
		per_page: perPage,
		page,
	});

	return {
		stories: data.stories as ISbStoryData[],
		perPage,
		total,
	};
});
