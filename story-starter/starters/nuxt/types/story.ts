import { type ISbStoryData } from 'storyblok-js-client';

export type Stories = {
	stories: ISbStoryData[];
	perPage: number;
	total: number;
};
