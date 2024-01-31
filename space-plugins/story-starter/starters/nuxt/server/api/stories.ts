import StoryblokClient, { ISbStoriesParams } from 'storyblok-js-client';
import { object, coerce, optional, number, string } from 'valibot';
import { parseQuery } from '../utils/parse';
import { StoriesResponse, Story } from '~/types/story';

type Version = 'published' | 'draft';

type GetStories = (props: {
	spaceId: number;
	perPage?: number;
	page?: number;
	version?: Version;
	slug?: string;
	query?: string;
}) => Promise<StoriesResponse>;

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

	const response = await storyblokFetch(accessToken).getStories({
		spaceId,
		page: query.page,
		perPage: query.perPage,
		slug: query.slug,
		query: query.query,
	});

	return response;
});

const storyblokFetch = (accessToken: string) => {
	const defaults = {
		perPage: 25,
		page: 1,
		version: 'published',
	};

	// This is a management API instance because of the `oauthToken`.
	const storyblokClient = new StoryblokClient({
		oauthToken: `bearer ${accessToken}`,
	});

	const getStories: GetStories = async ({
		spaceId,
		perPage,
		page,
		version,
		slug,
		query,
	}) => {
		const params: ISbStoriesParams = {
			version: version ?? (defaults.version as Version),
			per_page: perPage ?? defaults.perPage,
			page: page ?? defaults.page,
		};
		if (slug) {
			params.by_slugs = slug;
		}
		if (query) {
			// @ts-expect-error there is a typing error from the library
			params.text_search = query;
		}
		const { data, total } = await storyblokClient.get(
			`spaces/${spaceId}/stories`,
			params
		);

		return {
			stories: data.stories as Story[],
			perPage: perPage || data.per_page,
			total,
		};
	};

	return { getStories };
};
