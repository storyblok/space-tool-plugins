import type { ISbStoryData } from 'storyblok-js-client';

export type StoryContext = {
	language: string;
	story: ISbStoryData;
};

export type StoryContextWithAction = StoryContext & {
	action: 'get-context';
};
